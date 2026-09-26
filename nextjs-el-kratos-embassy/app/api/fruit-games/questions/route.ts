import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseMode, publish, validateHost } from "@/lib/fruit-games-server";

function questionInput(body: {
  text?: unknown;
  mode?: unknown;
  points?: unknown;
  timerSeconds?: unknown;
  doublePoints?: unknown;
  options?: unknown;
  answerIndex?: unknown;
  section?: unknown;
}) {
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const mode = parseMode(body.mode);
  const points = typeof body.points === "number" ? Math.trunc(body.points) : NaN;
  const timerSeconds = typeof body.timerSeconds === "number" ? Math.trunc(body.timerSeconds) : NaN;
  if (text.length < 4 || text.length > 500) return { error: "Enter the question." };
  if (!mode) return { error: "Choose a mode." };
  if (!Number.isFinite(points) || points < 1 || points > 100) return { error: "Points must be from 1 to 100." };
  if (!Number.isFinite(timerSeconds) || timerSeconds < 5 || timerSeconds > 180) {
    return { error: "Timer must be from 5 to 180 seconds." };
  }
  const section = typeof body.section === "string" && body.section.trim() ? body.section.trim().slice(0, 40) : "Round";

  const rawOptions = Array.isArray(body.options)
    ? body.options.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean)
    : [];
  if (mode === "buzzer") {
    if (rawOptions.length < 2 || rawOptions.length > 4) {
      return { error: "A buzzer question needs 2 to 4 choices." };
    }
    const answerIndex = typeof body.answerIndex === "number" ? Math.trunc(body.answerIndex) : NaN;
    if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= rawOptions.length) {
      return { error: "Mark the correct choice." };
    }
    return {
      data: {
        text,
        mode,
        points,
        timerSeconds,
        doublePoints: body.doublePoints === true,
        options: rawOptions,
        answerIndex,
        section,
      },
    };
  }

  return {
    data: {
      text,
      mode,
      points,
      timerSeconds,
      doublePoints: body.doublePoints === true,
      options: [],
      answerIndex: null,
      section,
    },
  };
}

export async function GET(req: NextRequest) {
  try {
    const sessionCode = req.nextUrl.searchParams.get("sessionCode") ?? "";
    if (!validateHost(req.headers.get("x-fruit-games-passcode"))) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    }
    const session = await prisma.fruitGameSession.findUnique({ where: { code: sessionCode } });
    if (!session) return NextResponse.json({ error: "Session not found." }, { status: 404 });
    const questions = await prisma.fruitGameQuestion.findMany({
      where: { sessionId: session.id },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ questions, defaultTimerSeconds: session.defaultTimerSeconds });
  } catch (error) {
    console.error("[fruit-games questions GET]", error);
    return NextResponse.json({ error: "Could not load questions." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!validateHost(body.passcode)) return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    const session = await prisma.fruitGameSession.findUnique({ where: { code: body.sessionCode } });
    if (!session) return NextResponse.json({ error: "Session not found." }, { status: 404 });

    if (body.action === "apply-timer") {
      const timerSeconds = typeof body.timerSeconds === "number" ? Math.trunc(body.timerSeconds) : NaN;
      if (!Number.isInteger(timerSeconds) || timerSeconds < 5 || timerSeconds > 180) {
        return NextResponse.json({ error: "Timer must be from 5 to 180 seconds." }, { status: 400 });
      }
      await prisma.$transaction([
        prisma.fruitGameSession.update({ where: { id: session.id }, data: { defaultTimerSeconds: timerSeconds } }),
        prisma.fruitGameQuestion.updateMany({ where: { sessionId: session.id }, data: { timerSeconds } }),
      ]);
      await publish(body.sessionCode);
      return NextResponse.json({ success: true, defaultTimerSeconds: timerSeconds });
    }

    const parsed = questionInput(body);
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const last = await prisma.fruitGameQuestion.findFirst({
      where: { sessionId: session.id },
      orderBy: { order: "desc" },
    });
    const question = await prisma.fruitGameQuestion.create({
      data: { sessionId: session.id, order: (last?.order ?? 0) + 1, ...parsed.data },
    });
    await publish(body.sessionCode);
    return NextResponse.json({ success: true, question }, { status: 201 });
  } catch (error) {
    console.error("[fruit-games questions POST]", error);
    return NextResponse.json({ error: "Could not add the question." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!validateHost(body.passcode)) return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    const session = await prisma.fruitGameSession.findUnique({ where: { code: body.sessionCode } });
    if (!session) return NextResponse.json({ error: "Session not found." }, { status: 404 });
    const parsed = questionInput(body);
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const existing = await prisma.fruitGameQuestion.findFirst({
      where: { id: body.questionId, sessionId: session.id },
    });
    if (!existing) return NextResponse.json({ error: "Question not found." }, { status: 404 });

    const question = await prisma.fruitGameQuestion.update({
      where: { id: existing.id },
      data: parsed.data,
    });
    await publish(body.sessionCode);
    return NextResponse.json({ success: true, question });
  } catch (error) {
    console.error("[fruit-games questions PATCH]", error);
    return NextResponse.json({ error: "Could not update the question." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    if (!validateHost(body.passcode)) return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    const session = await prisma.fruitGameSession.findUnique({ where: { code: body.sessionCode } });
    if (!session) return NextResponse.json({ error: "Session not found." }, { status: 404 });
    const existing = await prisma.fruitGameQuestion.findFirst({
      where: { id: body.questionId, sessionId: session.id },
    });
    if (!existing) return NextResponse.json({ error: "Question not found." }, { status: 404 });
    await prisma.fruitGameQuestion.delete({ where: { id: existing.id } });
    await publish(body.sessionCode);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[fruit-games questions DELETE]", error);
    return NextResponse.json({ error: "Could not delete the question." }, { status: 500 });
  }
}
