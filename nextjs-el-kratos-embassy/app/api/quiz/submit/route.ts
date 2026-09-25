import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { validateMember, CURRENT_BATCH } from "@/lib/quiz-config";
import { deadlineMs, describeAttempt, finalizeSitting, getQuizSetting, hasFrozenPaper } from "@/lib/quiz-session";

async function questionsForBatch() {
  return prisma.question.findMany({
    where: { batch: CURRENT_BATCH },
    orderBy: { order: "asc" },
  });
}

function resultPayload(
  attempt: { id: number; score: number; percentage: number; passed: boolean; answers: unknown; questionSnapshot: unknown },
  questions: Array<{ id: number; order: number; weekLabel: string; text: string; options: unknown; answerIndex: number }>,
  extra: { duplicate?: boolean } = {}
) {
  return {
    success: true,
    id: attempt.id,
    ...describeAttempt(attempt, questions),
    ...extra,
  };
}

export async function POST(req: NextRequest) {
  let membershipKey = "";
  try {
    const body = await req.json();
    const { membershipId, answers } = body ?? {};

    if (!membershipId || answers === undefined || typeof answers !== "object") {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const member = await validateMember(membershipId);
    if (!member) {
      return NextResponse.json({ error: "Unauthorised participant." }, { status: 403 });
    }
    membershipKey = member.membershipId;

    const questions = await questionsForBatch();

    const existing = await prisma.quizAttempt.findFirst({
      where: { membershipId: member.membershipId, batch: CURRENT_BATCH },
    });
    if (existing) {
      return NextResponse.json(resultPayload(existing, questions, { duplicate: true }));
    }

    const progress = await prisma.quizProgress.findUnique({
      where: { membershipId_batch: { membershipId: member.membershipId, batch: CURRENT_BATCH } },
    });
    if (questions.length === 0 && !hasFrozenPaper(progress?.questionSnapshot)) {
      return NextResponse.json({ error: "No questions are published for this batch." }, { status: 409 });
    }
    if (!progress) {
      return NextResponse.json({ error: "Start the assessment before submitting." }, { status: 403 });
    }

    const setting = await getQuizSetting(CURRENT_BATCH);
    const expired = Date.now() >= deadlineMs(progress.startedAt, setting.durationMinutes);
    const result = await finalizeSitting(
      member.membershipId,
      member.name,
      CURRENT_BATCH,
      expired ? progress.answers : answers
    );

    return NextResponse.json(
      { success: true, timedOut: expired, ...result },
      { status: result.duplicate ? 200 : 201 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const existing = await prisma.quizAttempt.findFirst({
        where: { membershipId: membershipKey, batch: CURRENT_BATCH },
      });
      if (existing) {
        const questions = await questionsForBatch();
        return NextResponse.json(resultPayload(existing, questions, { duplicate: true }));
      }
      return NextResponse.json({ success: true, duplicate: true });
    }
    console.error("[quiz/submit]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
