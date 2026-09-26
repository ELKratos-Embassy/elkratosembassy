import { NextRequest, NextResponse } from "next/server";
import { getGameState } from "@/lib/fruit-games-server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sessionCode = req.nextUrl.searchParams.get("session") ?? "";
  if (!sessionCode) {
    return NextResponse.json({ type: "NO_SESSION" });
  }
  try {
    const state = await getGameState(sessionCode);
    return NextResponse.json(state, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[fruit-games state]", error);
    return NextResponse.json({ error: "Could not load the game." }, { status: 500 });
  }
}
