import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAccessor } from "@/lib/quiz-config";

function asOptions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { passcode, weekLabel, text, options, answerIndex, order } = await req.json();
    const { id } = await params;

    const accessor = validateAccessor(passcode);
    if (!accessor) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    }

    const questionId = parseInt(id, 10);
    if (Number.isNaN(questionId)) {
      return NextResponse.json({ error: "Invalid question ID." }, { status: 400 });
    }

    const cleanedOptions = Array.isArray(options)
      ? options.map((option) => (typeof option === "string" ? option.trim() : ""))
      : undefined;
    if (
      cleanedOptions !== undefined &&
      (cleanedOptions.length < 2 ||
        cleanedOptions.length > 8 ||
        cleanedOptions.some((option) => !option))
    ) {
      return NextResponse.json(
        { error: "Options must be 2 to 8 filled-in choices." },
        { status: 400 }
      );
    }

    if (answerIndex !== undefined) {
      const answer = Number(answerIndex);
      const limit = cleanedOptions?.length ?? 8;
      if (!Number.isInteger(answer) || answer < 0 || answer >= limit) {
        return NextResponse.json({ error: "Choose a correct answer within the options." }, { status: 400 });
      }
    }

    const updated = await prisma.question.update({
      where: { id: questionId },
      data: {
        ...(weekLabel !== undefined && { weekLabel }),
        ...(text !== undefined && { text }),
        ...(cleanedOptions !== undefined && { options: cleanedOptions }),
        ...(answerIndex !== undefined && { answerIndex: Number(answerIndex) }),
        ...(order !== undefined && { order: Number(order) }),
      },
    });

    return NextResponse.json({
      success: true,
      question: {
        id: updated.id,
        weekLabel: updated.weekLabel,
        order: updated.order,
        text: updated.text,
        options: asOptions(updated.options),
        answerIndex: updated.answerIndex,
      },
    });
  } catch (error) {
    console.error("[questions PATCH]", error);
    return NextResponse.json({ error: "Failed to update question." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { passcode } = await req.json();
    const { id } = await params;

    const accessor = validateAccessor(passcode);
    if (!accessor) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    }

    const questionId = parseInt(id, 10);
    if (Number.isNaN(questionId)) {
      return NextResponse.json({ error: "Invalid question ID." }, { status: 400 });
    }

    await prisma.question.delete({ where: { id: questionId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[questions DELETE]", error);
    return NextResponse.json({ error: "Failed to delete question." }, { status: 500 });
  }
}
