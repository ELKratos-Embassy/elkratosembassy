import { NextRequest, NextResponse } from "next/server";
import { ALLIANCES } from "@/lib/fruit-games-config";
import { resolveFruitPlayer } from "@/lib/fruit-games-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const player = await resolveFruitPlayer(body.membershipId);
    if (!player) {
      return NextResponse.json({ error: "This membership ID is not on the list." }, { status: 403 });
    }
    if (!player.alliance || !player.playName) {
      return NextResponse.json({ error: "This membership has no Fruit Games alliance yet." }, { status: 403 });
    }
    return NextResponse.json({
      membershipId: player.membershipId,
      name: player.name,
      alliance: player.alliance,
      playName: player.playName,
      allianceName: ALLIANCES[player.alliance].name,
    });
  } catch (error) {
    console.error("[fruit-games enter]", error);
    return NextResponse.json({ error: "Could not open the hall." }, { status: 500 });
  }
}
