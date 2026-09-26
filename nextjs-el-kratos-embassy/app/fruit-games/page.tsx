"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ALLIANCES, SESSION_CODE, type AllianceId, stake } from "@/lib/fruit-games-config";
import { playBuzz, playHit, playMiss, playTick, unlockSound } from "@/lib/fruit-games-sound";
import { useFruitGame, useRemaining } from "./live";

const PLAYER_KEY = "fg_player";

interface Player {
  membershipId: string;
  name: string;
  alliance: AllianceId;
  playName: string;
}

const Arena = dynamic(() => import("@/components/fruit-games/Arena"), {
  ssr: false,
  loading: () => <div className="fg-stage" />,
});

const ORDER: AllianceId[] = ["gold", "crimson", "white"];

function clockTone(remaining: number, total: number) {
  const ratio = total > 0 ? remaining / total : 0;
  if (ratio > 0.5) return "is-calm";
  if (ratio > 0.2) return "is-warn";
  return "is-hot";
}

function placeWord(place: number) {
  if (place === 1) return "1st";
  if (place === 2) return "2nd";
  if (place === 3) return "3rd";
  return `${place}th`;
}

function placeGroups(scores: Record<string, number>) {
  const ranked = ORDER.map((id) => [id, scores[id] ?? 0] as [AllianceId, number]).sort((a, b) => b[1] - a[1]);
  const groups: { place: number; rows: [AllianceId, number][] }[] = [];
  for (const row of ranked) {
    const last = groups[groups.length - 1];
    if (last && last.rows[0][1] === row[1]) last.rows.push(row);
    else groups.push({ place: groups.reduce((sum, group) => sum + group.rows.length, 0) + 1, rows: [row] });
  }
  return groups;
}

function AnimatedScore({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    if (previous.current === value) return;
    const from = previous.current;
    const started = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const progress = Math.min(1, (now - started) / 800);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    previous.current = value;
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{display}</>;
}

export default function FruitGamesScoreboard() {
  const state = useFruitGame();
  const remaining = useRemaining(state);
  const [revealed, setRevealed] = useState(0);
  const [player, setPlayer] = useState<Player | null>(null);
  const [gateOpen, setGateOpen] = useState(false);
  const [membershipId, setMembershipId] = useState("");
  const [gateError, setGateError] = useState("");
  const [entering, setEntering] = useState(false);
  const [buzzing, setBuzzing] = useState(false);
  const [locking, setLocking] = useState(false);
  const [buzzNote, setBuzzNote] = useState<"first" | "late" | null>(null);
  const [attested, setAttested] = useState<string | null>(null);
  const [burst, setBurst] = useState(0);
  const heardBuzz = useRef("");
  const heardLock = useRef("");
  const heardTick = useRef<number | null>(null);

  const scoreKey = ORDER.map((id) => state.scores?.[id] ?? 0).join(",");

  useEffect(() => {
    if (!state.revealMode) {
      setRevealed(0);
      return;
    }
    const steps = new Set(scoreKey.split(",")).size;
    const timer = window.setTimeout(() => {
      setRevealed((count) => (count < steps ? count + 1 : count));
    }, revealed === 0 ? 900 : 2600);
    return () => window.clearTimeout(timer);
  }, [state.revealMode, scoreKey, revealed]);

  useEffect(() => {
    const saved = sessionStorage.getItem(PLAYER_KEY);
    if (!saved) return;
    let parsed: Player | null = null;
    try {
      parsed = JSON.parse(saved) as Player;
    } catch {
      sessionStorage.removeItem(PLAYER_KEY);
      return;
    }
    if (!parsed?.membershipId) return;
    fetch("/api/fruit-games/enter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ membershipId: parsed.membershipId }),
    })
      .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          sessionStorage.removeItem(PLAYER_KEY);
          return;
        }
        const next: Player = {
          membershipId: data.membershipId,
          name: data.name,
          alliance: data.alliance,
          playName: data.playName,
        };
        sessionStorage.setItem(PLAYER_KEY, JSON.stringify(next));
        setPlayer(next);
      })
      .catch(() => {
        setPlayer(parsed);
      });
  }, []);

  useEffect(() => {
    if (!state.firstBuzz && state.buzzerOpen) setBuzzNote(null);
  }, [state.firstBuzz, state.buzzerOpen]);

  useEffect(() => {
    const arm = () => unlockSound();
    window.addEventListener("pointerdown", arm);
    return () => window.removeEventListener("pointerdown", arm);
  }, []);

  useEffect(() => {
    const key = state.firstBuzz ? `${state.firstBuzz.alliance}:${state.firstBuzz.memberName}` : "";
    if (!key || key === heardBuzz.current) return;
    heardBuzz.current = key;
    playBuzz();
    setBurst((value) => value + 1);
  }, [state.firstBuzz]);

  useEffect(() => {
    if (!state.lockedAnswer) {
      heardLock.current = "";
      return;
    }
    const key = `${state.lockedAnswer.memberName}:${state.lockedAnswer.selectedIndex}:${state.lockedAnswer.correct}`;
    if (key === heardLock.current) return;
    heardLock.current = key;
    if (state.lockedAnswer.correct) playHit();
    else playMiss();
    setBurst((value) => value + 1);
  }, [state.lockedAnswer]);

  useEffect(() => {
    if (remaining == null) {
      heardTick.current = null;
      return;
    }
    if (heardTick.current === remaining) return;
    heardTick.current = remaining;
    playTick(remaining, state.activeQuestion?.timerSeconds ?? 60);
  }, [remaining, state.activeQuestion?.timerSeconds]);

  function leave() {
    sessionStorage.removeItem(PLAYER_KEY);
    setPlayer(null);
  }

  async function enterHall(event: FormEvent) {
    event.preventDefault();
    setEntering(true);
    setGateError("");
    try {
      const response = await fetch("/api/fruit-games/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setGateError(data.error ?? "That membership ID was refused.");
        return;
      }
      const next: Player = {
        membershipId: data.membershipId,
        name: data.name,
        alliance: data.alliance,
        playName: data.playName,
      };
      sessionStorage.setItem(PLAYER_KEY, JSON.stringify(next));
      setPlayer(next);
      setGateOpen(false);
    } catch {
      setGateError("Could not reach the hall.");
    } finally {
      setEntering(false);
    }
  }

  async function handleBuzz() {
    if (!player || buzzing) return;
    setBuzzing(true);
    try {
      const response = await fetch("/api/fruit-games/buzzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "buzz", sessionCode: SESSION_CODE, membershipId: player.membershipId }),
      });
      setBuzzNote(response.ok ? "first" : "late");
    } catch {
      setBuzzNote("late");
    }
    setBuzzing(false);
  }

  async function handleAnswer(selectedIndex: number) {
    if (!player || locking || state.lockedAnswer) return;
    setLocking(true);
    await fetch("/api/fruit-games/buzzer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "answer",
        sessionCode: SESSION_CODE,
        membershipId: player.membershipId,
        selectedIndex,
      }),
    });
    setLocking(false);
  }

  async function handleAttest(reaction: string) {
    if (!player || !state.knowYourselfSubject) return;
    setAttested(state.knowYourselfSubject.memberName);
    await fetch("/api/fruit-games/know-yourself", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "attest",
        sessionCode: SESSION_CODE,
        membershipId: player.membershipId,
        reaction,
        subjectName: state.knowYourselfSubject.memberName,
      }),
    });
  }

  const identity = (
    <>
      {player ? (
        <>
          <span style={{ color: ALLIANCES[player.alliance].textColor }}>
            {player.playName} · {ALLIANCES[player.alliance].short}
          </span>
          <button type="button" className="fg-textbtn" onClick={leave}>Leave</button>
        </>
      ) : (
        <button type="button" className="fg-enter" onClick={() => { setGateError(""); setGateOpen(true); }}>Enter</button>
      )}
    </>
  );

  const gate = gateOpen ? (
    <div className="fg-gate" onClick={() => setGateOpen(false)}>
      <form onClick={(event) => event.stopPropagation()} onSubmit={enterHall}>
        <p className="fg-kicker">El Kratos Embassy</p>
        <h2>Enter the hall</h2>
        <label>
          Membership ID
          <input
            value={membershipId}
            onChange={(event) => {
              setMembershipId(event.target.value.toUpperCase());
              setGateError("");
            }}
            autoComplete="off"
            placeholder="ELKE-YYYY-XXXX"
          />
        </label>
        {gateError && <strong>{gateError}</strong>}
        <button className="fg-enter" type="submit" disabled={entering}>{entering ? "Checking…" : "Enter"}</button>
      </form>
    </div>
  ) : null;

  if (state.type !== "GAME_STATE") {
    return (
      <div className="fg-shell">
        <header className="fg-top">
          <div>
            <p className="fg-kicker">El Kratos Embassy</p>
            <h1>Fruit Games</h1>
          </div>
          <div className="fg-who">{identity}</div>
        </header>
        {gate}
        {state.type === "NO_SESSION" && (
          <p className="fg-muted" style={{ padding: "0 4vw" }}>The hall stays dark until the host opens the session.</p>
        )}
        <div className="fg-stage" />
        <BoardStyles />
      </div>
    );
  }

  const scores = state.scores ?? { gold: 0, crimson: 0, white: 0 };
  const ranked = (Object.entries(scores) as [AllianceId, number][]).sort((a, b) => b[1] - a[1]);
  const question = state.activeQuestion;
  const locked = state.lockedAnswer ?? null;
  const hot = (locked?.alliance ?? state.firstBuzz?.alliance ?? null) as AllianceId | null;
  const award = question ? stake(question.points, question.doublePoints) : 0;

  if (state.revealMode) {
    const groups = placeGroups(scores);
    const prizes: Record<number, string | undefined> = { 1: state.prize1, 2: state.prize2, 3: state.prize3 };
    return (
      <div className="fg-shell fg-final">
        <header className="fg-top">
          <div>
            <p className="fg-kicker">Final places</p>
            <h1>Fruit Games</h1>
          </div>
        </header>
        <div className="fg-final-stage">
          <div className="fg-stage">
            <Arena scores={scores} hot={groups[0]?.rows[0]?.[0] ?? null} burst={burst} />
          </div>
        </div>
        <ol className="fg-reveal">
          {groups.map((group, index) => {
            const visible = revealed >= groups.length - index;
            const tied = group.rows.length > 1;
            const prize = prizes[group.place];
            return group.rows.map(([alliance, points]) => {
              const meta = ALLIANCES[alliance];
              return (
                <li key={alliance} className={visible ? "fg-place is-in" : "fg-place"}>
                  <span>{tied ? `Tied ${placeWord(group.place)}` : placeWord(group.place)}</span>
                  <div>
                    <h2 style={{ color: meta.textColor }}>{meta.name}</h2>
                    {prize ? <p>{prize}</p> : null}
                  </div>
                  <strong style={{ color: meta.textColor }}>{points}</strong>
                </li>
              );
            });
          })}
        </ol>
        <BoardStyles />
      </div>
    );
  }

  const showBuzz = !!player && !!state.buzzerOpen && remaining !== 0 && question?.mode === "buzzer";
  const clock = remaining !== null && question ? clockTone(remaining, question.timerSeconds) : "";

  return (
    <div className={showBuzz ? "fg-shell has-buzz" : "fg-shell"}>
      <header className="fg-top">
        <div>
          <p className="fg-kicker">El Kratos Embassy</p>
          <h1>Fruit Games</h1>
        </div>
        <div className="fg-who">{identity}</div>
      </header>
      {gate}

      <div className="fg-board">
      <section className="fg-question" key={question?.id ?? "waiting"}>
        {state.knowYourselfMode && state.knowYourselfSubject ? (
          <>
            <p className="fg-kicker">Know Yourself More</p>
            <h2>{state.knowYourselfSubject.memberName}</h2>
            {state.attestationCounts && (
              <p className="fg-muted">
                {state.attestationCounts.strongly_agree} strongly agree · {state.attestationCounts.agree} agree · {state.attestationCounts.not_sure} not sure
              </p>
            )}
            {player && player.playName !== state.knowYourselfSubject.memberName && (
              attested === state.knowYourselfSubject.memberName ? (
                <p className="fg-live">Your reaction is in.</p>
              ) : (
                <div className="fg-reactions">
                  <button type="button" onClick={() => handleAttest("strongly_agree")}>Strongly agree</button>
                  <button type="button" onClick={() => handleAttest("agree")}>Agree</button>
                  <button type="button" onClick={() => handleAttest("not_sure")}>Not sure</button>
                </div>
              )
            )}
          </>
        ) : question ? (
          <>
            <div className="fg-qhead">
              <p className="fg-kicker">
                {question.section}
                {question.doublePoints ? " · double" : ""} · {award} pts
              </p>
              {clock && (
                <div className={`fg-clock ${clock}`} style={{ ["--remain" as string]: `${Math.max(0, Math.min(1, remaining! / Math.max(question.timerSeconds, 1)))}` }}>
                  <strong>{remaining}</strong>
                </div>
              )}
            </div>
            <h2>{question.text}</h2>
            {question.options.length > 0 && (
              <div className="fg-options">
                {question.options.map((option, index) => {
                  const letter = String.fromCharCode(65 + index);
                  const isPick = locked?.selectedIndex === index;
                  const isKey = locked != null && locked.answerIndex === index;
                  const tone = isKey ? "is-right" : isPick ? "is-wrong" : "";
                  const canAnswer = player?.alliance === state.firstBuzz?.alliance && !locked;
                  return (
                    <button
                      key={`${question.id}-${index}`}
                      type="button"
                      className={`fg-option ${tone}`}
                      disabled={!canAnswer || locking}
                      onClick={() => handleAnswer(index)}
                    >
                      <span>{letter}</span>
                      <p>{option}</p>
                    </button>
                  );
                })}
              </div>
            )}
            {state.buzzerOpen && <p className="fg-live">The floor is open.</p>}
            {state.firstBuzz && !locked && (
              <p className="fg-live">
                {ALLIANCES[state.firstBuzz.alliance as AllianceId]?.name} has the floor — {state.firstBuzz.memberName}
              </p>
            )}
            {locked && (
              <p className={locked.correct ? "fg-live" : "fg-miss"}>
                {locked.memberName} {locked.correct ? `takes +${locked.points}` : `misses. −${locked.points}`}
              </p>
            )}
            {player && buzzNote === "late" && !state.firstBuzz && <p className="fg-miss">The buzzer was already closed.</p>}
            {player && question.mode !== "buzzer" && !state.firstBuzz && (
              <p className="fg-muted">Answer aloud. The host will award the points.</p>
            )}
          </>
        ) : (
          <>
            <p className="fg-kicker">{state.label}</p>
            <h2>Waiting for the next question.</h2>
          </>
        )}
      </section>

          <div className="fg-buzz-slot">
            {showBuzz && player && (
              <button
                type="button"
                className={buzzing ? "fg-buzz is-down" : "fg-buzz"}
                disabled={buzzing}
                onClick={handleBuzz}
                style={{
                  background: `radial-gradient(circle at 32% 28%, #fff6, ${ALLIANCES[player.alliance].color} 46%, ${ALLIANCES[player.alliance].colorD})`,
                  boxShadow: `0 8px 0 ${ALLIANCES[player.alliance].colorD}, 0 16px 28px ${ALLIANCES[player.alliance].glow}`,
                }}
              >
                {buzzing ? "…" : "Buzz"}
              </button>
            )}
          </div>
        <aside className="fg-rail">
          <p className="fg-floor-label" style={{ color: hot ? ALLIANCES[hot].textColor : "#9a9aa3" }}>
            {hot ? `${ALLIANCES[hot].short} has the floor` : "The floor"}
          </p>
          <div className="fg-stage">
            <Arena scores={scores} hot={hot} burst={burst} />
          </div>
        </aside>
      </div>
      <div className="fg-scores">
          {ORDER.map((id) => {
            const meta = ALLIANCES[id];
            const leading = ranked[0]?.[0] === id && (scores[id] ?? 0) > 0;
            const mine = player?.alliance === id;
            return (
              <div key={id} className={leading ? "fg-score is-lead" : mine ? "fg-score is-mine" : "fg-score"}>
                <em style={{ color: meta.color }}>{mine ? "You" : meta.short}</em>
                <strong style={{ color: meta.textColor }}>
                  <AnimatedScore value={scores[id] ?? 0} />
                </strong>
              </div>
            );
          })}
      </div>
      <BoardStyles />
    </div>
  );
}

function BoardStyles() {
  return (
    <style>{`
      .fg-shell { min-height: 100vh; background: #070709; color: #f4f1ea; display: flex; flex-direction: column; }
      .fg-center { align-items: center; justify-content: center; text-align: center; gap: 8px; }
      .fg-kicker { margin: 0 0 8px; color: #db154c; font-size: 12px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; }
      .fg-shell h1 { margin: 0; font-size: clamp(32px, 4vw, 56px); font-weight: 800; letter-spacing: -0.04em; }
      .fg-shell h2 { margin: 0; font-size: clamp(22px, 3vw, 40px); font-weight: 700; letter-spacing: -0.03em; line-height: 1.2; }
      .fg-muted { color: #9a9aa3; }
      .fg-top { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; padding: 22px 4vw 0; }
      .fg-who { display: flex; align-items: center; justify-content: flex-end; gap: 12px; flex-wrap: wrap; }
      .fg-who span { font-weight: 800; }
      .fg-enter, .fg-textbtn, .fg-reactions button {
        border: 0; border-radius: 999px; font: inherit; font-weight: 800; cursor: pointer;
      }
      .fg-enter { background: #db154c; color: #fff; padding: 8px 16px; }
      .fg-textbtn { background: transparent; color: #f4f1ea; padding: 8px 0; }
      .fg-gate {
        position: fixed; inset: 0; z-index: 5; background: rgba(0,0,0,0.62);
        display: flex; justify-content: center; align-items: flex-start; overflow-y: auto; padding: 24px 16px;
      }
      .fg-gate form {
        width: min(420px, 100%); margin: auto; background: #14141a; color: #f4f1ea;
        border-radius: 18px; padding: 24px; display: flex; flex-direction: column; gap: 12px;
        animation: fg-rise 0.28s ease;
      }
      .fg-gate h2 { font-size: 28px; }
      .fg-gate label { display: flex; flex-direction: column; gap: 6px; color: #c5cad1; font-size: 13px; font-weight: 700; }
      .fg-gate input {
        width: 100%; box-sizing: border-box; border-radius: 8px; border: 1px solid rgba(244,241,234,0.2);
        background: #070709; color: #f4f1ea; font: inherit; letter-spacing: 0.06em; padding: 12px 14px;
      }
      .fg-gate strong { color: #ff8aa3; }
      .fg-reactions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
      .fg-reactions button { background: rgba(12,12,16,0.72); color: #f4f1ea; border: 1px solid rgba(244,241,234,0.16); padding: 10px 14px; }
      .fg-qhead { display: flex; align-items: center; justify-content: flex-start; gap: 14px; }
      .fg-qhead .fg-kicker { margin: 0; }
      .fg-clock {
        width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; flex: none;
        background: conic-gradient(currentColor calc(var(--remain) * 1turn), rgba(244,241,234,0.12) 0);
        color: #3dd68c;
        box-shadow: inset 0 0 0 6px #070709;
      }
      .fg-clock strong { font-size: 20px; line-height: 1; color: #f4f1ea; }
      .fg-clock.is-warn { color: #f5c451; }
      .fg-clock.is-hot { color: #ff4d6d; animation: fg-pulse 0.8s ease-in-out infinite; }
      @keyframes fg-pulse { 50% { transform: scale(1.06); } }
      .fg-board {
        flex: 1; min-height: 0; align-content: start;
        display: grid;
        grid-template-columns: minmax(0, 1fr) clamp(280px, 28vw, 360px);
        grid-template-rows: auto minmax(0, 1fr);
        column-gap: clamp(32px, 4vw, 72px);
        padding: 4px clamp(24px, 4vw, 72px) 16px;
      }
      .fg-question { grid-column: 1; grid-row: 1; }
      .fg-buzz-slot { grid-column: 1; grid-row: 2; display: flex; align-items: center; justify-content: center; }
      .fg-rail {
        grid-column: 2; grid-row: 1; align-self: end;
        width: 100%; display: flex; flex-direction: column; gap: 8px;
      }
      .fg-floor-label { margin: 0; text-align: right; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; }
      .fg-buzz {
        width: 128px; height: 128px; border: 0; border-radius: 50%;
        color: #fff; font: inherit; font-size: 22px; font-weight: 800; letter-spacing: 0.06em; cursor: pointer;
        transform: translateY(0);
        transition: transform 0.08s ease;
      }
      .fg-buzz.is-down { transform: translateY(8px); }
      button.fg-option { width: 100%; color: inherit; font: inherit; text-align: left; cursor: pointer; }
      button.fg-option:disabled { cursor: default; opacity: 1; }
      .fg-score.is-mine em { color: #fff; }
      .fg-question { padding: 12px 0 0; max-width: 760px; animation: fg-rise 0.45s cubic-bezier(0.22, 1, 0.36, 1); }
      @keyframes fg-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
      .fg-options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
      .fg-option { display: flex; gap: 12px; align-items: flex-start; padding: 12px 14px; border: 1px solid rgba(244,241,234,0.14); border-radius: 12px; background: rgba(12,12,16,0.72); }
      .fg-option span { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; border: 1px solid rgba(244,241,234,0.3); font-size: 13px; font-weight: 800; flex: none; }
      .fg-option p { margin: 4px 0 0; font-size: clamp(14px, 1.5vw, 18px); line-height: 1.35; }
      .fg-option.is-right { border-color: #1f8a4c; background: rgba(31,138,76,0.16); }
      .fg-option.is-wrong { border-color: #db154c; background: rgba(219,21,76,0.14); }
      .fg-live { color: #d7b56d; font-weight: 700; }
      .fg-miss { color: #ff8aa3; font-weight: 700; }
      .fg-stage { position: relative; width: 100%; aspect-ratio: 5 / 4; height: auto; max-height: 280px; overflow: hidden; background: transparent; }
      .fg-stage canvas { position: absolute; inset: 0; display: block; width: 100% !important; height: 100% !important; background: transparent !important; }
      .fg-scores {
        position: sticky; bottom: 0; z-index: 3;
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
        padding: 10px 6vw calc(14px + env(safe-area-inset-bottom));
        background: linear-gradient(180deg, rgba(7,7,9,0), #070709 32%);
      }
      .fg-score { text-align: center; }
      .fg-score em { display: block; font-style: normal; letter-spacing: 0.16em; text-transform: uppercase; font-size: 12px; font-weight: 800; }
      .fg-score strong { display: block; font-size: clamp(36px, 5vw, 64px); font-weight: 800; line-height: 1; }
      .fg-score.is-lead strong { text-shadow: 0 10px 30px rgba(0,0,0,0.45); }
      .fg-final-stage { width: min(440px, 72vw); margin: 0 auto; align-self: center; }
      .fg-final .fg-stage { max-height: 240px; }
      .fg-reveal { width: min(820px, calc(100% - 64px)); margin: 4px auto 0; padding: 0 0 28px; list-style: none; display: flex; flex-direction: column; }
      .fg-place { display: grid; grid-template-columns: 112px minmax(0, 1fr) auto; gap: 18px; align-items: center; padding: 16px 0; border-top: 1px solid rgba(244,241,234,0.14); opacity: 0; transform: translateY(16px); }
      .fg-place.is-in { opacity: 1; transform: none; transition: 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
      .fg-place span { font-size: 13px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }
      .fg-place h2 { margin: 0; font-size: clamp(26px, 3vw, 40px); }
      .fg-place p { margin: 4px 0 0; color: #b7b7c0; font-size: 15px; line-height: 1.35; }
      .fg-place strong { font-size: clamp(32px, 4vw, 52px); font-weight: 800; line-height: 1; }
      @media (max-width: 720px) {
        .fg-top { align-items: flex-end; padding: 14px 16px 0; }
        .fg-shell h1 { font-size: 26px; }
        .fg-shell h2 { font-size: 20px; }
        .fg-board {
          grid-template-columns: 1fr;
          grid-template-rows: auto auto auto;
          column-gap: 0;
          padding: 0 16px 8px;
        }
        .fg-question { grid-row: 1; max-width: none; padding-top: 12px; }
        .fg-options { grid-template-columns: 1fr; }
        .fg-buzz-slot { grid-row: 2; min-height: 0; }
        .fg-buzz-slot:not(:empty) { display: flex; min-height: 132px; }
        .fg-rail { grid-column: 1; grid-row: 3; width: min(240px, 68vw); justify-self: end; align-self: start; margin-top: 18px; }
        .fg-stage { max-height: 168px; }
        .fg-scores { position: sticky; bottom: 0; }
        .fg-scores { padding: 8px 16px calc(12px + env(safe-area-inset-bottom)); }
        .fg-score strong { font-size: 32px; }
        .fg-clock { width: 52px; height: 52px; }
        .fg-clock strong { font-size: 16px; }
        .fg-buzz { width: 112px; height: 112px; font-size: 18px; }
        .fg-final .fg-stage { max-height: 148px; }
        .fg-final-stage { width: min(250px, 72vw); }
        .fg-reveal { width: calc(100% - 32px); }
        .fg-place { grid-template-columns: 76px minmax(0, 1fr) auto; gap: 10px; padding: 12px 0; }
        .fg-place h2 { font-size: 18px; }
        .fg-place p { font-size: 12px; }
        .fg-place strong { font-size: 24px; }
        .fg-place span { font-size: 11px; letter-spacing: 0.08em; }
      }
      @media (hover: hover) {
        button.fg-option:not(:disabled):hover { transform: translateY(-2px); }
      }
    `}</style>
  );
}
