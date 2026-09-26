import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stake } from "@/lib/fruit-games-config";
import {
  adjustScore,
  isUniqueConflict,
  parseAlliance,
  parseMember,
  publish,
  readOptions,
  resolveFruitPlayer,
  validateHost,
} from "@/lib/fruit-games-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, sessionCode } = body;
    if (typeof sessionCode !== "string") {
      return NextResponse.json({ error: "Session code is required." }, { status: 400 });
    }

    const session = await prisma.fruitGameSession.findUnique({ where: { code: sessionCode } });
    if (!session) return NextResponse.json({ error: "Session not found." }, { status: 404 });

    if (action === "activate" || action === "done" || action === "reset") {
      if (!validateHost(body.passcode)) {
        return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
      }
    }

    if (action === "activate") {
      const question = await prisma.fruitGameQuestion.findFirst({
        where: { id: body.questionId, sessionId: session.id },
      });
      if (!question) return NextResponse.json({ error: "Question not found." }, { status: 404 });

      await prisma.$transaction([
        prisma.fruitGameQuestion.updateMany({
          where: { sessionId: session.id },
          data: { isActive: false },
        }),
        prisma.fruitGameBuzz.deleteMany({ where: { questionId: question.id } }),
        prisma.fruitGameQuestion.update({
          where: { id: question.id },
          data: { isActive: true, isDone: false, openedAt: new Date() },
        }),
      ]);
      await publish(sessionCode);
      return NextResponse.json({ success: true });
    }

    if (action === "done") {
      await prisma.fruitGameQuestion.updateMany({
        where: { sessionId: session.id, isActive: true },
        data: { isActive: false, isDone: true },
      });
      await publish(sessionCode);
      return NextResponse.json({ success: true });
    }

    if (action === "reset") {
      const active = await prisma.fruitGameQuestion.findFirst({
        where: { sessionId: session.id, isActive: true },
      });
      if (!active) return NextResponse.json({ error: "No active question." }, { status: 400 });
      const buzz = await prisma.fruitGameBuzz.findUnique({ where: { questionId: active.id } });
      if (buzz?.selectedIndex != null && active.answerIndex != null) {
        const alliance = parseAlliance(buzz.alliance);
        if (alliance) {
          const awarded = stake(active.points, active.doublePoints);
          const delta = buzz.selectedIndex === active.answerIndex ? -awarded : awarded;
          await adjustScore(session.id, alliance, delta);
        }
      }
      await prisma.$transaction([
        prisma.fruitGameBuzz.deleteMany({ where: { questionId: active.id } }),
        prisma.fruitGameQuestion.update({
          where: { id: active.id },
          data: { openedAt: new Date() },
        }),
      ]);
      await publish(sessionCode);
      return NextResponse.json({ success: true });
    }

    if (action === "buzz") {
      if (session.isLocked) {
        return NextResponse.json({ error: "The board is locked." }, { status: 403 });
      }
      const player = await resolveFruitPlayer(body.membershipId);
      const alliance = player?.alliance ?? null;
      const memberName = alliance && player?.playName ? parseMember(alliance, player.playName) : null;
      if (!alliance || !memberName) {
        return NextResponse.json({ error: "Enter with your membership ID." }, { status: 403 });
      }

      const active = await prisma.fruitGameQuestion.findFirst({
        where: { sessionId: session.id, isActive: true },
      });
      if (!active || active.mode !== "buzzer") {
        return NextResponse.json({ error: "The buzzer is not open." }, { status: 400 });
      }

      try {
        const buzz = await prisma.$transaction(async (tx) => {
          const existing = await tx.fruitGameBuzz.findUnique({ where: { questionId: active.id } });
          if (existing) return { existing };
          const created = await tx.fruitGameBuzz.create({
            data: {
              sessionId: session.id,
              questionId: active.id,
              alliance,
              memberName,
            },
          });
          return { created };
        });

        if ("existing" in buzz && buzz.existing) {
          return NextResponse.json(
            { error: "Already buzzed.", firstBuzz: buzz.existing },
            { status: 409 }
          );
        }
      } catch (error) {
        if (isUniqueConflict(error)) {
          const existing = await prisma.fruitGameBuzz.findUnique({ where: { questionId: active.id } });
          return NextResponse.json({ error: "Already buzzed.", firstBuzz: existing }, { status: 409 });
        }
        throw error;
      }

      await publish(sessionCode);
      return NextResponse.json({ success: true });
    }

    if (action === "answer") {
      const player = await resolveFruitPlayer(body.membershipId);
      const alliance = player?.alliance ?? null;
      const memberName = alliance && player?.playName ? parseMember(alliance, player.playName) : null;
      const selectedIndex = typeof body.selectedIndex === "number" ? Math.trunc(body.selectedIndex) : NaN;
      if (!alliance || !memberName || !Number.isInteger(selectedIndex)) {
        return NextResponse.json({ error: "Enter with your membership ID." }, { status: 403 });
      }

      const active = await prisma.fruitGameQuestion.findFirst({
        where: { sessionId: session.id, isActive: true },
      });
      const options = readOptions(active?.options);
      if (!active || active.answerIndex == null || selectedIndex < 0 || selectedIndex >= options.length) {
        return NextResponse.json({ error: "This question has no choices." }, { status: 400 });
      }

      const buzz = await prisma.fruitGameBuzz.findUnique({ where: { questionId: active.id } });
      if (!buzz || buzz.alliance !== alliance) {
        return NextResponse.json({ error: "Your alliance does not have the floor." }, { status: 403 });
      }
      if (buzz.selectedIndex != null) {
        return NextResponse.json({ error: "An answer is already locked." }, { status: 409 });
      }

      const awarded = stake(active.points, active.doublePoints);
      const correct = selectedIndex === active.answerIndex;
      const locked = await prisma.fruitGameBuzz.updateMany({
        where: { id: buzz.id, selectedIndex: null },
        data: { selectedIndex },
      });
      if (locked.count === 0) {
        return NextResponse.json({ error: "An answer is already locked." }, { status: 409 });
      }
      await adjustScore(session.id, alliance, correct ? awarded : -awarded);
      await publish(sessionCode);
      return NextResponse.json({ success: true, correct });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    console.error("[fruit-games buzzer]", error);
    return NextResponse.json({ error: "Could not update the buzzer." }, { status: 500 });
  }
}
