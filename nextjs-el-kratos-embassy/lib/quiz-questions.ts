import "server-only";
import { MARKS_PER_Q, PASS_MARK } from "./quiz-public";

export type ScoreQuestion = {
  id: number;
  options: unknown;
  answerIndex: number;
};

export type ScoreResult = {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  wrongIds: number[];
  answers: Record<string, number>;
};

function optionCount(options: unknown): number {
  return Array.isArray(options) ? options.length : 0;
}

export function scoreAnswers(
  questions: ScoreQuestion[],
  raw: Record<string, unknown> | Record<number, number>
): ScoreResult {
  const wrongIds: number[] = [];
  const answers: Record<string, number> = {};
  let correct = 0;
  const total = questions.length * MARKS_PER_Q;

  for (const question of questions) {
    const value =
      (raw as Record<string, unknown>)[question.id] ??
      (raw as Record<string, unknown>)[String(question.id)];
    const selected = typeof value === "number" ? value : Number.NaN;
    const valid =
      Number.isInteger(selected) &&
      selected >= 0 &&
      selected < optionCount(question.options);

    if (!valid || selected !== question.answerIndex) {
      wrongIds.push(question.id);
    }
    if (!valid) continue;

    answers[String(question.id)] = selected;
    if (selected === question.answerIndex) correct += 1;
  }

  const score = correct * MARKS_PER_Q;
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100);
  return {
    score,
    total,
    percentage,
    passed: percentage >= PASS_MARK,
    wrongIds,
    answers,
  };
}
