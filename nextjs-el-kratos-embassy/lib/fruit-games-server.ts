import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { FRUIT_GAME_BANK } from "@/lib/fruit-games-bank";
import {
  ALLIANCE_IDS,
  QUESTION_MODES,
  stake,
  type AllianceId,
  type GameState,
  type QuestionMode,
  isAllianceId,
  isAllianceMember,
  playNameFor,
} from "@/lib/fruit-games-config";
import { CURRENT_BATCH, validateMember } from "@/lib/quiz-config";

const subscribers = new Map<string, Set<(data: string) => void>>();

export function notifySubscribers(sessionCode: string, data: object) {
  const subs = subscribers.get(sessionCode);
  if (!subs) return;
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  subs.forEach((send) => {
    try {
      send(payload);
    } catch {
      subs.delete(send);
    }
  });
}

export function subscribe(sessionCode: string, send: (data: string) => void) {
  if (!subscribers.has(sessionCode)) subscribers.set(sessionCode, new Set());
  subscribers.get(sessionCode)!.add(send);
  return () => {
    subscribers.get(sessionCode)?.delete(send);
  };
}

export function validateHost(passcode: unknown) {
  const expected = process.env.FRUIT_GAMES_PASSCODE?.trim();
  if (!expected || typeof passcode !== "string") return false;
  return passcode.trim() === expected;
}

export function isUniqueConflict(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export const DEFAULT_QUESTIONS = FRUIT_GAME_BANK;

export function readOptions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export async function getGameState(sessionCode: string): Promise<GameState> {
  const session = await prisma.fruitGameSession.findUnique({
    where: { code: sessionCode },
    include: {
      scores: true,
      questions: { orderBy: { order: "asc" } },
      buzzEvents: { orderBy: { buzzedAt: "asc" } },
      knowYourself: { where: { isActive: true }, take: 1 },
      attestations: true,
    },
  });

  if (!session) return { type: "NO_SESSION" };

  const activeQuestion = session.questions.find((question) => question.isActive) ?? null;
  const firstBuzz = activeQuestion
    ? session.buzzEvents.find((buzz) => buzz.questionId === activeQuestion.id) ?? null
    : null;
  const options = activeQuestion ? readOptions(activeQuestion.options) : [];
  const revealed = firstBuzz?.selectedIndex != null && activeQuestion?.answerIndex != null;
  const knowYourselfSubject = session.knowYourself[0] ?? null;
  const attestationCounts = knowYourselfSubject
    ? {
        strongly_agree: session.attestations.filter(
          (item) => item.subjectName === knowYourselfSubject.memberName && item.reaction === "strongly_agree"
        ).length,
        agree: session.attestations.filter(
          (item) => item.subjectName === knowYourselfSubject.memberName && item.reaction === "agree"
        ).length,
        not_sure: session.attestations.filter(
          (item) => item.subjectName === knowYourselfSubject.memberName && item.reaction === "not_sure"
        ).length,
      }
    : null;

  const scores: Record<string, number> = { gold: 0, crimson: 0, white: 0 };
  session.scores.forEach((score) => {
    scores[score.alliance] = score.points;
  });

  return {
    type: "GAME_STATE",
    sessionCode,
    label: session.label,
    isLocked: session.isLocked,
    revealMode: session.revealMode,
    prize1: session.prize1,
    prize2: session.prize2,
    prize3: session.prize3,
    scores,
    activeQuestion: activeQuestion
      ? {
          id: activeQuestion.id,
          text: activeQuestion.text,
          section: activeQuestion.section,
          mode: activeQuestion.mode,
          points: activeQuestion.points,
          doublePoints: activeQuestion.doublePoints,
          timerSeconds: activeQuestion.timerSeconds,
          openedAt: activeQuestion.openedAt?.toISOString() ?? null,
          options,
          answerIndex: revealed ? activeQuestion.answerIndex : null,
        }
      : null,
    serverNow: new Date().toISOString(),
    firstBuzz: firstBuzz ? { alliance: firstBuzz.alliance, memberName: firstBuzz.memberName } : null,
    lockedAnswer:
      revealed && firstBuzz && activeQuestion
        ? {
            alliance: firstBuzz.alliance,
            memberName: firstBuzz.memberName,
            selectedIndex: firstBuzz.selectedIndex as number,
            answerIndex: activeQuestion.answerIndex as number,
            correct: firstBuzz.selectedIndex === activeQuestion.answerIndex,
            points: stake(activeQuestion.points, activeQuestion.doublePoints),
          }
        : null,
    buzzerOpen: !!activeQuestion && activeQuestion.mode === "buzzer" && !firstBuzz && !session.isLocked,
    knowYourselfMode: !!knowYourselfSubject,
    knowYourselfSubject: knowYourselfSubject
      ? { memberName: knowYourselfSubject.memberName, alliance: knowYourselfSubject.alliance }
      : null,
    attestationCounts,
  };
}

export async function adjustScore(sessionId: string, alliance: AllianceId, delta: number) {
  await prisma.$transaction(async (tx) => {
    const current = await tx.fruitGameScore.findUnique({
      where: { sessionId_alliance: { sessionId, alliance } },
    });
    const next = Math.max(0, (current?.points ?? 0) + delta);
    await tx.fruitGameScore.upsert({
      where: { sessionId_alliance: { sessionId, alliance } },
      update: { points: next },
      create: { sessionId, alliance, points: next },
    });
  });
}

export async function publish(sessionCode: string) {
  const state = await getGameState(sessionCode);
  notifySubscribers(sessionCode, state);
  return state;
}

export async function ensureSession(code: string, label: string) {
  const existing = await prisma.fruitGameSession.findUnique({ where: { code } });
  if (existing) return existing;

  try {
    return await prisma.$transaction(async (tx) => {
      const session = await tx.fruitGameSession.create({
        data: { code, label, isActive: true },
      });
      await tx.fruitGameScore.createMany({
        data: ALLIANCE_IDS.map((alliance) => ({ sessionId: session.id, alliance, points: 0 })),
      });
      await tx.fruitGameQuestion.createMany({
        data: DEFAULT_QUESTIONS.map((question) => ({ ...question, sessionId: session.id })),
      });
      return session;
    });
  } catch (error) {
    if (isUniqueConflict(error)) {
      const raced = await prisma.fruitGameSession.findUnique({ where: { code } });
      if (raced) return raced;
    }
    throw error;
  }
}

export function parseAlliance(value: unknown): AllianceId | null {
  return typeof value === "string" && isAllianceId(value) ? value : null;
}

export function parseMode(value: unknown): QuestionMode | null {
  return typeof value === "string" && QUESTION_MODES.includes(value as QuestionMode)
    ? (value as QuestionMode)
    : null;
}

export function parseMember(alliance: string, name: unknown) {
  if (typeof name !== "string") return null;
  const trimmed = name.trim();
  if (!isAllianceMember(alliance, trimmed)) return null;
  return trimmed;
}

export function knownMember(name: unknown) {
  if (typeof name !== "string") return null;
  const trimmed = name.trim();
  return ALLIANCE_IDS.some((alliance) => isAllianceMember(alliance, trimmed)) ? trimmed : null;
}

export async function resolveFruitPlayer(raw: unknown) {
  if (typeof raw !== "string") return null;
  const member = await validateMember(raw);
  if (!member) return null;
  const participant = await prisma.quizParticipant.findUnique({
    where: { membershipId_batch: { membershipId: member.membershipId, batch: CURRENT_BATCH } },
  });
  const stored = participant?.fruitAlliance ?? "";
  if (!isAllianceId(stored)) return { ...member, alliance: null, playName: null };
  return { ...member, alliance: stored, playName: playNameFor(member.name, stored) };
}
