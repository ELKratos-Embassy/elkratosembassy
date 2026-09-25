import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeMembershipId, validateAccessor } from "@/lib/quiz-config";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { passcode, membershipId, name } = await req.json();
    const { id } = await params;
    if (!validateAccessor(passcode)) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    }

    const participantId = parseInt(id, 10);
    if (Number.isNaN(participantId)) {
      return NextResponse.json({ error: "Invalid participant." }, { status: 400 });
    }

    const existing = await prisma.quizParticipant.findUnique({ where: { id: participantId } });
    if (!existing) {
      return NextResponse.json({ error: "Participant not found." }, { status: 404 });
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

    if (key !== existing.membershipId) {
      const clash = await prisma.quizParticipant.findUnique({
        where: { membershipId_batch: { membershipId: key, batch: existing.batch } },
      });
      if (clash) {
        return NextResponse.json(
          { error: "That membership ID is already on this list." },
          { status: 409 }
        );
      }
    }

    const participant = await prisma.$transaction(async (tx) => {
      const updated = await tx.quizParticipant.update({
        where: { id: existing.id },
        data: { name: displayName, membershipId: key },
      });
      await tx.quizAttempt.updateMany({
        where: { membershipId: existing.membershipId, batch: existing.batch },
        data: { membershipId: key, name: displayName },
      });
      await tx.quizProgress.updateMany({
        where: { membershipId: existing.membershipId, batch: existing.batch },
        data: { membershipId: key, name: displayName },
      });
      return updated;
    });

    return NextResponse.json({ success: true, participant });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "That membership ID is already on this list." },
        { status: 409 }
      );
    }
    console.error("[participants PATCH]", error);
    return NextResponse.json({ error: "Failed to update participant." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { passcode } = await req.json();
    const { id } = await params;
    if (!validateAccessor(passcode)) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    }

    const participantId = parseInt(id, 10);
    if (Number.isNaN(participantId)) {
      return NextResponse.json({ error: "Invalid participant." }, { status: 400 });
    }

    await prisma.quizParticipant.delete({ where: { id: participantId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[participants DELETE]", error);
    return NextResponse.json({ error: "Failed to remove participant." }, { status: 500 });
  }
}
