import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CURRENT_BATCH, validateMember } from "@/lib/quiz-config";
import {
  capturePaper,
  deadlineMs,
  finalizeSitting,
  getQuizSetting,
  publicQuestions,
  resultForAttempt,
  windowStatus,
} from "@/lib/quiz-session";

function closedMessage(status: string) {
  if (status === "upcoming") return "This assessment has not started yet. Please wait until your facilitator opens it.";
  if (status === "closed") return "This assessment has closed.";
  return "This assessment is not open yet. Your facilitator will set the start and end time.";
}

export async function POST(req: NextRequest) {
  try {
    const { membershipId } = await req.json();
    if (!membershipId) {
      return NextResponse.json(
        { allowed: false, message: "Membership ID is required." },
        { status: 400 }
      );
    }
    const member = await validateMember(membershipId);
    if (!member) {
      return NextResponse.json(
        {
          allowed: false,
          message:
            "This Membership ID is not on the participant list for this assessment. Please check your ID or contact your facilitator.",
        },
        { status: 403 }
      );
    }

    const setting = await getQuizSetting(CURRENT_BATCH);
    const now = new Date();
    const status = windowStatus(setting, now);
    const finished = await resultForAttempt(member.membershipId, CURRENT_BATCH);
    if (finished) {
      return NextResponse.json({
        allowed: false,
        status: "finished",
        membershipId: member.membershipId,
        name: member.name,
        message: "You have already completed this assessment. Your saved result is shown below.",
        ...finished,
      });
    }

    const progress = await prisma.quizProgress.findUnique({
      where: { membershipId_batch: { membershipId: member.membershipId, batch: CURRENT_BATCH } },
    });

    if (progress) {
      const ends = deadlineMs(progress.startedAt, setting.durationMinutes);
      if (now.getTime() >= ends) {
        const result = await finalizeSitting(
          member.membershipId,
          member.name,
          CURRENT_BATCH,
          progress.answers
        );
        return NextResponse.json({
          allowed: false,
          status: "finished",
          timedOut: true,
          membershipId: member.membershipId,
          name: member.name,
          message: "Your time had already run out. The answers that were saved have been submitted.",
          ...result,
        });
      }

      const frozen = publicQuestions(progress.questionSnapshot);
      return NextResponse.json({
        allowed: true,
        status: "resume",
        membershipId: member.membershipId,
        name: member.name,
        startedAt: progress.startedAt.toISOString(),
        answers: progress.answers,
        questionIndex: progress.questionIndex,
        ...(frozen ? { questions: frozen } : {}),
        durationMinutes: setting.durationMinutes,
        opensAt: setting.opensAt?.toISOString() ?? null,
        closesAt: setting.closesAt?.toISOString() ?? null,
        serverNow: now.toISOString(),
      });
    }

    if (status !== "open") {
      return NextResponse.json(
        {
          allowed: false,
          status,
          opensAt: setting.opensAt?.toISOString() ?? null,
          closesAt: setting.closesAt?.toISOString() ?? null,
          message: closedMessage(status),
        },
        { status: 403 }
      );
    }

    const paper = await capturePaper(CURRENT_BATCH);
    if (paper.length === 0) {
      return NextResponse.json(
        { allowed: false, message: "No questions have been published for this assessment yet." },
        { status: 409 }
      );
    }

    const sitting = await prisma.quizProgress.create({
      data: {
        membershipId: member.membershipId,
        name: member.name,
        batch: CURRENT_BATCH,
        answers: {},
        questionSnapshot: paper,
        questionIndex: 0,
      },
    });

    return NextResponse.json({
      allowed: true,
      status: "start",
      membershipId: member.membershipId,
      name: member.name,
      startedAt: sitting.startedAt.toISOString(),
      answers: {},
      questionIndex: 0,
      questions: publicQuestions(paper),
      durationMinutes: setting.durationMinutes,
      opensAt: setting.opensAt?.toISOString() ?? null,
      closesAt: setting.closesAt?.toISOString() ?? null,
      serverNow: now.toISOString(),
    });
  } catch (error) {
    console.error("[quiz/verify]", error);
    return NextResponse.json(
      { allowed: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
