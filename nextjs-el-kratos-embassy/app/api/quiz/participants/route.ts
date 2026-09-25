import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  CURRENT_BATCH,
  normalizeMembershipId,
  validateAccessor,
} from "@/lib/quiz-config";

export async function GET(req: NextRequest) {
  const passcode = req.headers.get("x-facilitator-passcode") ?? "";
  if (!validateAccessor(passcode)) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
  }

  const batch = req.nextUrl.searchParams.get("batch") ?? CURRENT_BATCH;
  try {
    const participants = await prisma.quizParticipant.findMany({
      where: { batch },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ participants });
  } catch (error) {
    console.error("[participants GET]", error);
    return NextResponse.json({ error: "Failed to load participants." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { passcode, membershipId, name, batch } = await req.json();
    if (!validateAccessor(passcode)) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    }

    const key = normalizeMembershipId(typeof membershipId === "string" ? membershipId : "");
    const displayName = typeof name === "string" ? name.trim() : "";
    if (!/^ELKE-\d{4}-[A-Z0-9]{4}$/.test(key)) {
      return NextResponse.json(
        { error: "Membership ID must look like ELKE-2026-XXXX." },
        { status: 400 }
      );
    }
    if (displayName.length < 2) {
      return NextResponse.json({ error: "Enter the participant's name." }, { status: 400 });
    }

    const targetBatch = batch || CURRENT_BATCH;
    const participant = await prisma.quizParticipant.upsert({
      where: { membershipId_batch: { membershipId: key, batch: targetBatch } },
      update: { name: displayName },
      create: { membershipId: key, name: displayName, batch: targetBatch },
    });

    return NextResponse.json({ success: true, participant }, { status: 201 });
  } catch (error) {
    console.error("[participants POST]", error);
    return NextResponse.json({ error: "Failed to save participant." }, { status: 500 });
  }
}
