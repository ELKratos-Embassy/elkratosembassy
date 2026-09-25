import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

async function handleUnsubscribe(email: string) {
  const result = await prisma.subscriber.updateMany({
    where: { email, subscribed: true },
    data: { subscribed: false, unsubscribedAt: new Date() },
  });

  if (result.count === 0) {
    return NextResponse.json(
      { error: "Email not found or already unsubscribed" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Unsubscribed successfully" });
}

export async function GET(req: NextRequest) {
  const email = normalizeEmail(req.nextUrl.searchParams.get("email"));
  if (!email) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    return await handleUnsubscribe(email);
  } catch (error) {
    console.error("[unsubscribe GET]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body?.email);
    if (!email) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    return await handleUnsubscribe(email);
  } catch (error) {
    console.error("[unsubscribe POST]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
