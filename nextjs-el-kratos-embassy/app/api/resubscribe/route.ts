import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (!existing) {
      return NextResponse.json({ error: "Email not found." }, { status: 404 });
    }

    await prisma.subscriber.update({
      where: { email },
      data: { subscribed: true, unsubscribedAt: null },
    });

    return NextResponse.json({ message: "Resubscribed successfully" });
  } catch (error) {
    console.error("[resubscribe]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
