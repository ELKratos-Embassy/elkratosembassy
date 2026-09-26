import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseAlliance, publish, validateHost } from "@/lib/fruit-games-server";

export async function POST(req: NextRequest) {
  try {
    const { passcode, sessionCode, alliance, delta, setTo } = await req.json();
    if (!validateHost(passcode)) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    }
    const allianceId = parseAlliance(alliance);
    if (!allianceId || typeof sessionCode !== "string") {
      return NextResponse.json({ error: "Choose an alliance." }, { status: 400 });
    }

    const useSet = typeof setTo === "number" && Number.isFinite(setTo);
    const change = typeof delta === "number" && Number.isFinite(delta) ? Math.trunc(delta) : null;
    if (!useSet && (change === null || change < -500 || change > 500)) {
      return NextResponse.json({ error: "That point change is not allowed." }, { status: 400 });
    }

    const session = await prisma.fruitGameSession.findUnique({ where: { code: sessionCode } });
    if (!session) return NextResponse.json({ error: "Session not found." }, { status: 404 });

    await prisma.$transaction(async (tx) => {
      const current = await tx.fruitGameScore.findUnique({
        where: { sessionId_alliance: { sessionId: session.id, alliance: allianceId } },
      });
      const base = current?.points ?? 0;
      const next = useSet ? Math.max(0, Math.trunc(setTo)) : Math.max(0, base + (change ?? 0));
      await tx.fruitGameScore.upsert({
        where: { sessionId_alliance: { sessionId: session.id, alliance: allianceId } },
        update: { points: next },
        create: { sessionId: session.id, alliance: allianceId, points: next },
      });
    });

    await publish(sessionCode);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[fruit-games scores]", error);
    return NextResponse.json({ error: "Could not update the score." }, { status: 500 });
  }
}
