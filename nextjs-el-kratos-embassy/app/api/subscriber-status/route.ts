import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const raw = req.nextUrl.searchParams.get("email");
    const email = typeof raw === "string" ? raw.trim().toLowerCase() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const subscriber = await prisma.subscriber.findUnique({ where: { email } });
    if (!subscriber) {
      return NextResponse.json({ subscribed: null });
    }

    return NextResponse.json({ subscribed: subscriber.subscribed });
  } catch (error) {
    console.error("[subscriber-status]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
