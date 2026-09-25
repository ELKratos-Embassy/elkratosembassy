import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAccessor } from "@/lib/quiz-config";

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
