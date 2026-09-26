import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  isUniqueConflict,
  knownMember,
  parseAlliance,
  publish,
  resolveFruitPlayer,
  validateHost,
} from "@/lib/fruit-games-server";
import { isAllianceMember } from "@/lib/fruit-games-config";

const REACTIONS = ["strongly_agree", "agree", "not_sure"] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, sessionCode } = body;
    if (typeof sessionCode !== "string") {
      return NextResponse.json({ error: "Session code is required." }, { status: 400 });
    }

    const session = await prisma.fruitGameSession.findUnique({ where: { code: sessionCode } });
    if (!session) return NextResponse.json({ error: "Session not found." }, { status: 404 });

    if (action === "activate") {
      if (!validateHost(body.passcode)) {
        return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
      }
      const memberName = knownMember(body.memberName);
      const alliance = parseAlliance(body.alliance);
      if (!memberName || !alliance || !isAllianceMember(alliance, memberName)) {
        return NextResponse.json({ error: "Choose a member." }, { status: 400 });
      }

      await prisma.$transaction([
        prisma.fruitGameKnowYourself.updateMany({
          where: { sessionId: session.id },
          data: { isActive: false },
        }),
        prisma.fruitGameAttestation.deleteMany({
          where: { sessionId: session.id, subjectName: memberName },
        }),
        prisma.fruitGameKnowYourself.create({
          data: { sessionId: session.id, memberName, alliance, isActive: true },
        }),
      ]);
      await publish(sessionCode);
      return NextResponse.json({ success: true });
    }

    if (action === "deactivate") {
      if (!validateHost(body.passcode)) {
        return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
      }
      await prisma.fruitGameKnowYourself.updateMany({
        where: { sessionId: session.id },
        data: { isActive: false },
      });
      await publish(sessionCode);
      return NextResponse.json({ success: true });
    }

    if (action === "attest") {
      const player = await resolveFruitPlayer(body.membershipId);
      const memberName = player?.playName ? knownMember(player.playName) : null;
      const subjectName = knownMember(body.subjectName);
      const reaction = REACTIONS.find((item) => item === body.reaction);
      if (!memberName) {
        return NextResponse.json({ error: "Enter with your membership ID." }, { status: 403 });
      }
      if (!subjectName || !reaction) {
        return NextResponse.json({ error: "Choose a reaction." }, { status: 400 });
      }

      const active = await prisma.fruitGameKnowYourself.findFirst({
        where: { sessionId: session.id, isActive: true, memberName: subjectName },
      });
      if (!active) {
        return NextResponse.json({ error: "Nobody is on the hot seat." }, { status: 400 });
      }

      try {
        await prisma.fruitGameAttestation.create({
          data: { sessionId: session.id, subjectName, memberName, reaction },
        });
      } catch (error) {
        if (isUniqueConflict(error)) {
          return NextResponse.json({ error: "You already attested." }, { status: 409 });
        }
        throw error;
      }

      await publish(sessionCode);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    console.error("[fruit-games know-yourself]", error);
    return NextResponse.json({ error: "Could not update Know Yourself." }, { status: 500 });
  }
}
