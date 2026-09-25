import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateAccessor, CURRENT_BATCH } from "@/lib/quiz-config";

function asOptions(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function publicQuestion(question: {
  id: number;
  weekLabel: string;
  order: number;
  text: string;
  options: unknown;
  answerIndex: number;
}, includeAnswer: boolean) {
  return {
    id: question.id,
    weekLabel: question.weekLabel,
    order: question.order,
    text: question.text,
    options: asOptions(question.options),
    ...(includeAnswer ? { answerIndex: question.answerIndex } : {}),
  };
}

export async function GET(req: NextRequest) {
  const batch = req.nextUrl.searchParams.get("batch") ?? CURRENT_BATCH;
  const passcode = req.headers.get("x-facilitator-passcode") ?? "";
  const includeAnswer = Boolean(passcode) && validateAccessor(passcode) !== null;

  try {
    const questions = await prisma.question.findMany({
      where: { batch },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({
      questions: questions.map((question) => publicQuestion(question, includeAnswer)),
    });
  } catch (error) {
    console.error("[questions GET]", error);
    return NextResponse.json({ error: "Failed to load questions." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { passcode, batch, weekLabel, text, options, answerIndex } = await req.json();

    const accessor = validateAccessor(passcode);
    if (!accessor) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    }

    const answer = Number(answerIndex);
    const cleaned = Array.isArray(options)
      ? options.map((option) => (typeof option === "string" ? option.trim() : ""))
      : [];
    if (
      !text ||
      cleaned.length < 2 ||
      cleaned.length > 8 ||
      cleaned.some((option) => !option) ||
      !Number.isInteger(answer) ||
      answer < 0 ||
      answer >= cleaned.length
    ) {
      return NextResponse.json(
        { error: "A question needs text, 2 to 8 options, and a correct answer." },
        { status: 400 }
      );
    }

    const targetBatch = batch ?? CURRENT_BATCH;
    const last = await prisma.question.findFirst({
      where: { batch: targetBatch },
      orderBy: { order: "desc" },
    });

    const question = await prisma.question.create({
      data: {
        batch: targetBatch,
        weekLabel: weekLabel || "General",
        order: (last?.order ?? 0) + 1,
        text: String(text).trim(),
        options: cleaned,
        answerIndex: answer,
      },
    });

    return NextResponse.json(
      { success: true, question: publicQuestion(question, true) },
      { status: 201 }
    );
  } catch (error) {
    console.error("[questions POST]", error);
    return NextResponse.json({ error: "Failed to create question." }, { status: 500 });
  }
}
