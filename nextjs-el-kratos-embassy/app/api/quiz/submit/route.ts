import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { validateMember, CURRENT_BATCH } from "@/lib/quiz-config";
import { scoreAnswers, type ScoreQuestion } from "@/lib/quiz-questions";
import { finalizeSitting, getQuizSetting, windowStatus } from "@/lib/quiz-session";

async function questionsForBatch() {
  return prisma.question.findMany({
    where: { batch: CURRENT_BATCH },
    orderBy: { order: "asc" },
  });
}

function resultPayload(
  attempt: { id: number; score: number; percentage: number; passed: boolean; answers: unknown },
  questions: ScoreQuestion[],
  extra: { duplicate?: boolean } = {}
) {
  const scored = scoreAnswers(questions, (attempt.answers ?? {}) as Record<string, number>);
  return {
    success: true,
    id: attempt.id,
    score: attempt.score,
    total: scored.total,
    percentage: attempt.percentage,
    passed: attempt.passed,
    wrongIds: scored.wrongIds,
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
    if (questions.length === 0) {
      return NextResponse.json({ error: "No questions are published for this batch." }, { status: 409 });
    }

    const existing = await prisma.quizAttempt.findFirst({
      where: { membershipId: member.membershipId, batch: CURRENT_BATCH },
    });
    if (existing) {
      return NextResponse.json(resultPayload(existing, questions, { duplicate: true }));
    }

    const setting = await getQuizSetting(CURRENT_BATCH);
    const progress = await prisma.quizProgress.findUnique({
      where: { membershipId_batch: { membershipId: member.membershipId, batch: CURRENT_BATCH } },
    });
    if (!progress && windowStatus(setting) !== "open") {
      return NextResponse.json({ error: "This assessment is not open." }, { status: 403 });
    }

    const result = await finalizeSitting(member.membershipId, member.name, CURRENT_BATCH, answers);

    return NextResponse.json(
      { success: true, ...result },
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
