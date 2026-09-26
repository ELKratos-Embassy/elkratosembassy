import { NextRequest } from "next/server";
import { getGameState, subscribe } from "@/lib/fruit-games-server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const sessionCode = req.nextUrl.searchParams.get("session") ?? "";
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: string) => {
        controller.enqueue(encoder.encode(data));
      };

      getGameState(sessionCode)
        .then((state) => send(`data: ${JSON.stringify(state)}\n\n`))
        .catch(() => send(`data: ${JSON.stringify({ type: "NO_SESSION" })}\n\n`));

      const unsubscribe = subscribe(sessionCode, send);
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          cleanup();
        }
      }, 25000);

      function cleanup() {
        clearInterval(heartbeat);
        unsubscribe();
      }

      req.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
