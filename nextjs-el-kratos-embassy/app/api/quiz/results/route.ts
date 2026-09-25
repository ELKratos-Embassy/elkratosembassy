import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAccessor, CURRENT_BATCH } from "@/lib/quiz-config";
import { reviewAttempt } from "@/lib/quiz-session";

export async function POST(req: NextRequest) {
  try {
    const { passcode, batch } = await req.json();

    if (!passcode) {
      return NextResponse.json({ error: "Passcode required." }, { status: 401 });
    }

    const accessor = validateAccessor(passcode);
    if (!accessor) {
      return NextResponse.json({ error: "Invalid passcode." }, { status: 403 });
    }

    const targetBatch = batch ?? CURRENT_BATCH;

    const [attempts, questions] = await Promise.all([
      prisma.quizAttempt.findMany({
        where: { batch: targetBatch },
        orderBy: { submittedAt: "asc" },
      }),
      prisma.question.findMany({
        where: { batch: targetBatch },
        orderBy: { order: "asc" },
      }),
    ]);

    const seen = new Set<string>();
    const unique = attempts.filter((attempt) => {
      if (seen.has(attempt.membershipId)) return false;
      seen.add(attempt.membershipId);
      return true;
    });

    const total = unique.length;
    const passed = unique.filter((attempt) => attempt.passed).length;
    const failed = total - passed;
    const avgScore =
      total > 0
        ? Math.round(unique.reduce((sum, attempt) => sum + attempt.percentage, 0) / total)
        : 0;

    return NextResponse.json({
      accessor: { id: accessor.id, label: accessor.label },
      batch: targetBatch,
      summary: { total, passed, failed, avgScore },
      attempts: unique.map((attempt) => ({
        id: attempt.id,
        membershipId: attempt.membershipId,
        name: attempt.name,
        score: attempt.score,
        percentage: attempt.percentage,
        passed: attempt.passed,
        submittedAt: attempt.submittedAt,
        review: reviewAttempt(attempt.questionSnapshot, attempt.answers, questions),
      })),
    });
  } catch (error) {
    console.error("[quiz/results]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
