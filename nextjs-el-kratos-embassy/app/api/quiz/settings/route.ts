import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CURRENT_BATCH, validateAccessor } from "@/lib/quiz-config";
import { getQuizSetting, publicSchedule } from "@/lib/quiz-session";

const MIN_MINUTES = 5;
const MAX_MINUTES = 180;

function cleanMinutes(value: unknown): number | null {
  const minutes = Number(value);
  if (!Number.isInteger(minutes) || minutes < MIN_MINUTES || minutes > MAX_MINUTES) return null;
  return minutes;
}

export async function GET() {
  try {
    const setting = await getQuizSetting(CURRENT_BATCH);
    return NextResponse.json(publicSchedule(setting));
  } catch (error) {
    console.error("[settings GET]", error);
    return NextResponse.json({ error: "Failed to load the time limit." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode, durationMinutes, opensAt, closesAt } = body ?? {};
    if (!validateAccessor(passcode)) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    }

    const data: { durationMinutes?: number; opensAt?: Date | null; closesAt?: Date | null } = {};

    if (durationMinutes !== undefined) {
      const minutes = cleanMinutes(durationMinutes);
      if (minutes === null) {
        return NextResponse.json(
          { error: `Set the time between ${MIN_MINUTES} and ${MAX_MINUTES} minutes.` },
          { status: 400 }
        );
      }
      data.durationMinutes = minutes;
    }

    if (opensAt !== undefined || closesAt !== undefined) {
      if (!opensAt && !closesAt) {
        data.opensAt = null;
        data.closesAt = null;
      } else {
        const open = new Date(opensAt);
        const close = new Date(closesAt);
        if (Number.isNaN(open.getTime()) || Number.isNaN(close.getTime()) || close <= open) {
          return NextResponse.json({ error: "The end must be after the start." }, { status: 400 });
        }
        data.opensAt = open;
        data.closesAt = close;
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    const setting = await prisma.quizSetting.upsert({
      where: { batch: CURRENT_BATCH },
      update: data,
      create: {
        batch: CURRENT_BATCH,
        durationMinutes: data.durationMinutes ?? 45,
        opensAt: data.opensAt ?? null,
        closesAt: data.closesAt ?? null,
      },
    });

    return NextResponse.json({ success: true, ...publicSchedule(setting) });
  } catch (error) {
    console.error("[settings PATCH]", error);
    return NextResponse.json({ error: "Failed to update the quiz schedule." }, { status: 500 });
  }
}
