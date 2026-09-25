import "server-only";
import { prisma } from "./prisma";
import { CURRENT_BATCH } from "./quiz-public";
import { scoreAnswers } from "./quiz-questions";

export type WindowStatus = "unscheduled" | "upcoming" | "open" | "closed";

export async function getQuizSetting(batch = CURRENT_BATCH) {
  return prisma.quizSetting.upsert({
    where: { batch },
    update: {},
    create: { batch, durationMinutes: 45 },
  });
}

export function windowStatus(
  setting: { opensAt: Date | null; closesAt: Date | null },
  now = new Date()
): WindowStatus {
  if (!setting.opensAt || !setting.closesAt) return "unscheduled";
  if (now < setting.opensAt) return "upcoming";
  if (now >= setting.closesAt) return "closed";
  return "open";
}

export function deadlineMs(startedAt: Date, durationMinutes: number) {
  return startedAt.getTime() + durationMinutes * 60_000;
}

export function publicSchedule(setting: {
  batch: string;
  durationMinutes: number;
  opensAt: Date | null;
  closesAt: Date | null;
}) {
  return {
    batch: setting.batch,
    durationMinutes: setting.durationMinutes,
    opensAt: setting.opensAt?.toISOString() ?? null,
    closesAt: setting.closesAt?.toISOString() ?? null,
    serverNow: new Date().toISOString(),
    status: windowStatus(setting),
  };
}

async function questionsFor(batch: string) {
  return prisma.question.findMany({
    where: { batch },
    orderBy: { order: "asc" },
  });
}

export async function resultForAttempt(membershipId: string, batch: string) {
  const attempt = await prisma.quizAttempt.findFirst({
    where: { membershipId, batch },
  });
  if (!attempt) return null;
  const questions = await questionsFor(batch);
  const scored = scoreAnswers(questions, (attempt.answers ?? {}) as Record<string, number>);
  return {
    score: attempt.score,
    total: scored.total,
    percentage: attempt.percentage,
    passed: attempt.passed,
    wrongIds: scored.wrongIds,
  };
}

export async function finalizeSitting(
  membershipId: string,
  name: string,
  batch: string,
  rawAnswers: unknown
) {
  const questions = await questionsFor(batch);
  const existing = await prisma.quizAttempt.findFirst({
    where: { membershipId, batch },
  });
  if (existing) {
    await prisma.quizProgress.deleteMany({ where: { membershipId, batch } });
    const scored = scoreAnswers(questions, (existing.answers ?? {}) as Record<string, number>);
    return {
      duplicate: true,
      score: existing.score,
      total: scored.total,
      percentage: existing.percentage,
      passed: existing.passed,
      wrongIds: scored.wrongIds,
    };
  }

  const scored = scoreAnswers(
    questions,
    (rawAnswers ?? {}) as Record<string, number>
  );
  await prisma.quizAttempt.create({
    data: {
      membershipId,
      name,
      batch,
      answers: scored.answers,
      score: scored.score,
      percentage: scored.percentage,
      passed: scored.passed,
    },
  });
  await prisma.quizProgress.deleteMany({ where: { membershipId, batch } });
  return {
    duplicate: false,
    score: scored.score,
    total: scored.total,
    percentage: scored.percentage,
    passed: scored.passed,
    wrongIds: scored.wrongIds,
  };
}
