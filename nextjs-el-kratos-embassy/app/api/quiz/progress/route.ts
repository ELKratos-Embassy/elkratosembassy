import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CURRENT_BATCH, validateMember } from "@/lib/quiz-config";
import { deadlineMs, getQuizSetting } from "@/lib/quiz-session";

export async function POST(req: NextRequest) {
  try {
    const { membershipId, answers, questionIndex } = await req.json();
    const member = await validateMember(typeof membershipId === "string" ? membershipId : "");
    if (!member) {
      return NextResponse.json({ error: "Unauthorised participant." }, { status: 403 });
    }

    const progress = await prisma.quizProgress.findUnique({
      where: { membershipId_batch: { membershipId: member.membershipId, batch: CURRENT_BATCH } },
    });
    if (!progress) {
      return NextResponse.json({ error: "No sitting in progress." }, { status: 404 });
    }

    const setting = await getQuizSetting(CURRENT_BATCH);
    const ends = deadlineMs(progress.startedAt, setting.durationMinutes);
    if (Date.now() >= ends) {
      return NextResponse.json({ expired: true }, { status: 409 });
    }

    const index = Number(questionIndex);
    await prisma.quizProgress.update({
      where: { id: progress.id },
      data: {
        answers: answers && typeof answers === "object" ? answers : progress.answers ?? {},
        ...(Number.isInteger(index) && index >= 0 ? { questionIndex: index } : {}),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[quiz/progress]", error);
    return NextResponse.json({ error: "Could not save progress." }, { status: 500 });
  }
}
