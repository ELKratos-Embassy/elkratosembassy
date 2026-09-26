import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureSession, publish, validateHost } from "@/lib/fruit-games-server";

export async function POST(req: NextRequest) {
  try {
    const { passcode, code, label } = await req.json();
    if (!validateHost(passcode)) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    }
    if (typeof code !== "string" || !/^[A-Z0-9-]{3,40}$/.test(code)) {
      return NextResponse.json({ error: "Session code is not valid." }, { status: 400 });
    }
    const sessionLabel = typeof label === "string" && label.trim().length >= 2 ? label.trim() : code;
    const session = await ensureSession(code, sessionLabel);
    await publish(code);
    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error("[fruit-games session POST]", error);
    return NextResponse.json({ error: "Could not open the session." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!validateHost(body.passcode)) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    }
    if (typeof body.code !== "string") {
      return NextResponse.json({ error: "Session code is required." }, { status: 400 });
    }

    const data: {
      label?: string;
      isLocked?: boolean;
      revealMode?: boolean;
      prize1?: string;
      prize2?: string;
      prize3?: string;
    } = {};
    if (typeof body.label === "string" && body.label.trim()) data.label = body.label.trim();
    if (typeof body.isLocked === "boolean") data.isLocked = body.isLocked;
    if (typeof body.revealMode === "boolean") data.revealMode = body.revealMode;
    if (typeof body.prize1 === "string") data.prize1 = body.prize1;
    if (typeof body.prize2 === "string") data.prize2 = body.prize2;
    if (typeof body.prize3 === "string") data.prize3 = body.prize3;

    const existing = await prisma.fruitGameSession.findUnique({ where: { code: body.code } });
    if (!existing) return NextResponse.json({ error: "Session not found." }, { status: 404 });

    if (data.revealMode === true) {
      await prisma.$transaction([
        prisma.fruitGameQuestion.updateMany({
          where: { sessionId: existing.id, isActive: true },
          data: { isActive: false },
        }),
        prisma.fruitGameKnowYourself.updateMany({
          where: { sessionId: existing.id, isActive: true },
          data: { isActive: false },
        }),
      ]);
    }

    const session = await prisma.fruitGameSession.update({ where: { code: body.code }, data });
    await publish(body.code);
    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error("[fruit-games session PATCH]", error);
    return NextResponse.json({ error: "Could not update the session." }, { status: 500 });
  }
}
