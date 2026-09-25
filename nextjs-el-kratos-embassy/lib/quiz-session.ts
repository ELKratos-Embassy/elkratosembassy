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

type PaperQuestion = {
  id: number;
  order: number;
  weekLabel: string;
  text: string;
  options: string[];
  answerIndex: number;
};

export type WeekSection = { label: string; total: number; correct: number };

function toPaper(questions: Array<{ id: number; order: number; weekLabel: string; text: string; options: unknown; answerIndex: number }>): PaperQuestion[] {
  return questions.map((question) => ({
    id: question.id,
    order: question.order,
    weekLabel: question.weekLabel,
    text: question.text,
    options: Array.isArray(question.options)
      ? question.options.filter((option): option is string => typeof option === "string")
      : [],
    answerIndex: question.answerIndex,
  }));
}

function parsePaper(value: unknown): PaperQuestion[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const paper: PaperQuestion[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const row = item as Record<string, unknown>;
    if (typeof row.id !== "number" || typeof row.answerIndex !== "number") return null;
    paper.push({
      id: row.id,
      order: typeof row.order === "number" ? row.order : 0,
      weekLabel: typeof row.weekLabel === "string" ? row.weekLabel : "General",
      text: typeof row.text === "string" ? row.text : "",
      options: Array.isArray(row.options)
        ? row.options.filter((option): option is string => typeof option === "string")
        : [],
      answerIndex: row.answerIndex,
    });
  }
  return paper;
}

export function weekSections(questions: Array<{ id: number; weekLabel: string }>, wrongIds: number[]): WeekSection[] {
  const labels: string[] = [];
  for (const question of questions) {
    if (!labels.includes(question.weekLabel)) labels.push(question.weekLabel);
  }
  return labels.map((label) => {
    const ids = questions.filter((question) => question.weekLabel === label).map((question) => question.id);
    const correct = ids.filter((id) => !wrongIds.includes(id)).length;
    return { label, total: ids.length, correct };
  });
}

export function describeAttempt(
  attempt: { score: number; percentage: number; passed: boolean; answers: unknown; questionSnapshot: unknown },
  liveQuestions: Array<{ id: number; order: number; weekLabel: string; text: string; options: unknown; answerIndex: number }>
) {
  const paper = parsePaper(attempt.questionSnapshot) ?? toPaper(liveQuestions);
  const scored = scoreAnswers(paper, (attempt.answers ?? {}) as Record<string, number>);
  return {
    score: attempt.score,
    total: scored.total,
    percentage: attempt.percentage,
    passed: attempt.passed,
    wrongIds: scored.wrongIds,
    sections: weekSections(paper, scored.wrongIds),
  };
}

export async function resultForAttempt(membershipId: string, batch: string) {
  const attempt = await prisma.quizAttempt.findFirst({
    where: { membershipId, batch },
  });
  if (!attempt) return null;
  const questions = await questionsFor(batch);
  return describeAttempt(attempt, questions);
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
    return { duplicate: true, ...describeAttempt(existing, questions) };
  }

  const paper = toPaper(questions);
  const scored = scoreAnswers(paper, (rawAnswers ?? {}) as Record<string, number>);
  await prisma.quizAttempt.create({
    data: {
      membershipId,
      name,
      batch,
      answers: scored.answers,
      questionSnapshot: paper,
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
    sections: weekSections(paper, scored.wrongIds),
  };
}
