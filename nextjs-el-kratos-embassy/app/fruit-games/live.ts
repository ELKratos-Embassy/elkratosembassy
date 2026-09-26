"use client";

import { useEffect, useState } from "react";
import { SESSION_CODE, type GameState } from "@/lib/fruit-games-config";

export function useFruitGame(enabled = true) {
  const [state, setState] = useState<GameState>({ type: "LOADING" });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    async function pull() {
      try {
        const response = await fetch(`/api/fruit-games/state?session=${SESSION_CODE}`, { cache: "no-store" });
        const data = (await response.json()) as GameState;
        if (!cancelled && data.type) setState(data);
      } catch {
        if (!cancelled) setState((current) => (current.type === "LOADING" ? { type: "NO_SESSION" } : current));
      }
    }

    pull();
    const poll = window.setInterval(pull, 1000);
    const stream = new EventSource(`/api/fruit-games/stream?session=${SESSION_CODE}`);
    stream.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as GameState;
        if (!cancelled && data.type === "GAME_STATE") setState(data);
        if (!cancelled && data.type === "NO_SESSION") setState(data);
      } catch {
        /* ignore a partial frame */
      }
    };

    return () => {
      cancelled = true;
      window.clearInterval(poll);
      stream.close();
    };
  }, [enabled]);

  return state;
}

export function useRemaining(state: GameState) {
  const openedAt = state.activeQuestion?.openedAt ?? null;
  const timerSeconds = state.activeQuestion?.timerSeconds ?? 0;
  const serverNow = state.serverNow;
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!openedAt || !serverNow || !timerSeconds) {
      setRemaining(null);
      return;
    }
    const opened = Date.parse(openedAt);
    const server = Date.parse(serverNow);
    const leftAtServer = timerSeconds - Math.max(0, (server - opened) / 1000);
    const started = Date.now();

    function tick() {
      const left = leftAtServer - (Date.now() - started) / 1000;
      setRemaining(Math.max(0, Math.ceil(left)));
    }

    tick();
    const timer = window.setInterval(tick, 200);
    return () => window.clearInterval(timer);
  }, [openedAt, timerSeconds, serverNow]);

  return remaining;
}
