"use client";

import { useEffect, useRef, useState } from "react";
import { PASS_MARK, CURRENT_BATCH, QUIZ_MINUTES } from "@/lib/quiz-public";

// ── Brand tokens ─────────────────────────────────────────────────────
const C = {
  crimson:  "#DB154C",
  crimsonD: "#AF113D",
  crimsonL: "#FFF0F3",
  sunglow:  "#FFCC29",
  sunglowL: "#FFEBA9",
  mirage:   "#0F1B2D",
  bleach:   "#FFF4D6",
  mgray:    "#4B4B4D",
  lgray:    "#9FA4AB",
  white:    "#FFFFFF",
  success:  "#16A34A",
  successL: "#F0FDF4",
};

type Phase = "loading" | "intro" | "verifying" | "quiz" | "submitting" | "result";

interface DBQuestion {
  id: number;
  weekLabel: string;
  order: number;
  text: string;
  options: string[];
}

interface MemberInfo { membershipId: string; name: string; }
interface WeekSection { label: string; total: number; correct: number; }
interface ResultData  { score: number; total: number; percentage: number; passed: boolean; wrongIds: number[]; sections?: WeekSection[]; }

function formatWhen(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatBadge({ val, label }: { val: string; label: string }) {
  return (
    <div style={{ background: C.bleach, borderRadius: 8, padding: "12px 16px", textAlign: "center" }}>
      <div style={{ color: C.crimson, fontWeight: 800, fontSize: 22 }}>{val}</div>
      <div style={{ color: C.mgray, fontSize: 12 }}>{label}</div>
    </div>
  );
}

export default function BFCQuizPage() {
  const [phase,        setPhase]        = useState<Phase>("loading");
  const [questions,    setQuestions]    = useState<DBQuestion[]>([]);
  const [loadError,    setLoadError]    = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [idError,      setIdError]      = useState("");
  const [member,       setMember]       = useState<MemberInfo | null>(null);
  const [current,      setCurrent]      = useState(0);
  const [answers,      setAnswers]      = useState<Record<number, number>>({});
  const [selected,     setSelected]     = useState<number | null>(null);
  const [result,       setResult]       = useState<ResultData | null>(null);
  const [saveError,    setSaveError]    = useState("");
  const [quizMinutes,  setQuizMinutes]  = useState(QUIZ_MINUTES);
  const [startedAt,    setStartedAt]    = useState<number | null>(null);
  const [opensAt,      setOpensAt]      = useState<string | null>(null);
  const [closesAt,     setClosesAt]     = useState<string | null>(null);
  const [serverOffset, setServerOffset] = useState(0);
  const [resumeNote,   setResumeNote]   = useState("");
  const [now,          setNow]          = useState(() => Date.now());
  const [timedOut,     setTimedOut]     = useState(false);
  const [confirmOpen, setConfirmOpen]  = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const autoTried = useRef(false);
  const sessionGen = useRef(0);
  const submitting = useRef(false);
  const answersRef = useRef(answers);
  const selectedRef = useRef(selected);
  const currentRef = useRef(current);
  answersRef.current = answers;
  selectedRef.current = selected;
  currentRef.current = current;

  useEffect(() => {
    fetch(`/api/quiz/questions?batch=${CURRENT_BATCH}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.questions) && data.questions.length > 0) {
          setQuestions(data.questions);
          setPhase("intro");
          return;
        }
        setLoadError(data.error ?? "No questions have been published for this assessment yet.");
        setPhase("intro");
      })
      .catch(() => {
        setLoadError("Could not load the assessment. Please refresh and try again.");
        setPhase("intro");
      });
  }, []);

  useEffect(() => {
    let stop = false;
    const load = () => {
      fetch(`/api/quiz/settings?batch=${CURRENT_BATCH}`)
        .then((response) => response.json())
        .then((data) => {
          if (stop) return;
          if (Number.isInteger(data.durationMinutes)) setQuizMinutes(data.durationMinutes);
          if ("opensAt" in data) setOpensAt(data.opensAt ?? null);
          if ("closesAt" in data) setClosesAt(data.closesAt ?? null);
          if (data.serverNow) setServerOffset(Date.now() - new Date(data.serverNow).getTime());
        })
        .catch(() => undefined);
    };
    load();
    const timer = setInterval(load, 8000);
    return () => {
      stop = true;
      clearInterval(timer);
    };
  }, []);

  const q = questions[current];
  const totalMarks = questions.length * 2;
  const progress = questions.length ? Math.round(((current + 1) / questions.length) * 100) : 0;
  const serverNow = now - serverOffset;
  const endsAt = startedAt === null ? null : startedAt + quizMinutes * 60 * 1000;
  const remainingMs = endsAt ? Math.max(0, endsAt - serverNow) : quizMinutes * 60 * 1000;
  const clock = `${String(Math.floor(remainingMs / 60000)).padStart(2, "0")}:${String(Math.floor((remainingMs % 60000) / 1000)).padStart(2, "0")}`;
  const questionIndexes = [0, current - 2, current - 1, current, current + 1, current + 2, questions.length - 1]
    .filter((index, position, all) => index >= 0 && index < questions.length && all.indexOf(index) === position)
    .sort((a, b) => a - b);
  const weekSections = Array.from(new Set(questions.map((question) => question.weekLabel))).map((weekLabel) => ({
    label: weekLabel,
    ids: questions.filter((question) => question.weekLabel === weekLabel).map((question) => question.id),
  }));

  function asAnswers(raw: unknown): Record<number, number> {
    const parsed: Record<number, number> = {};
    if (!raw || typeof raw !== "object") return parsed;
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      const id = Number(key);
      const selected = Number(value);
      if (Number.isInteger(id) && Number.isInteger(selected)) parsed[id] = selected;
    }
    return parsed;
  }

  function showFinished(data: { membershipId: string; name: string; score: number; total: number; percentage: number; passed: boolean; wrongIds: number[]; sections?: WeekSection[]; message?: string; timedOut?: boolean }) {
    setMember({ membershipId: data.membershipId, name: data.name });
    setResult({ score: data.score, total: data.total, percentage: data.percentage, passed: data.passed, wrongIds: data.wrongIds ?? [], sections: data.sections });
    setSaveError(data.message ?? "You have already completed this assessment. Your saved result is shown below.");
    setTimedOut(Boolean(data.timedOut));
    setPhase("result");
  }

  function beginSitting(data: { membershipId: string; name: string; startedAt: string; answers?: unknown; questionIndex?: number; durationMinutes?: number; opensAt?: string | null; closesAt?: string | null; serverNow?: string; status?: string }) {
    const restored = asAnswers(data.answers);
    const index = Math.min(Math.max(data.questionIndex ?? 0, 0), Math.max(questions.length - 1, 0));
    setMember({ membershipId: data.membershipId, name: data.name });
    setStartedAt(new Date(data.startedAt).getTime());
    setAnswers(restored);
    setCurrent(index);
    setSelected(restored[questions[index]?.id] ?? null);
    if (Number.isInteger(data.durationMinutes)) setQuizMinutes(data.durationMinutes as number);
    if (data.opensAt !== undefined) setOpensAt(data.opensAt);
    if (data.closesAt !== undefined) setClosesAt(data.closesAt);
    if (data.serverNow) setServerOffset(Date.now() - new Date(data.serverNow).getTime());
    const serverNowMs = data.serverNow ? new Date(data.serverNow).getTime() : Date.now();
    const windowClosed = Boolean(data.closesAt) && serverNowMs >= new Date(data.closesAt as string).getTime();
    setResumeNote(
      data.status !== "resume"
        ? ""
        : windowClosed
          ? "Welcome back. New attempts are closed, but your sitting is still open. Your answers were restored and your timer kept running."
          : "Welcome back. Your answers were restored, and the timer kept running."
    );
    submitting.current = false;
    setPhase("quiz");
  }

  async function handleVerify(rawId?: string) {
    const id = (rawId ?? membershipId).trim();
    if (questions.length === 0) { setIdError(loadError || "Questions are not available yet."); return; }
    if (!id) { setIdError("Please enter your Membership ID to continue."); return; }
    setIdError("");
    setPhase("verifying");
    const gen = sessionGen.current;
    try {
      const res  = await fetch("/api/quiz/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ membershipId: id }) });
      const data = await res.json();
      if (gen !== sessionGen.current) return;
      if (data.membershipId) sessionStorage.setItem("bfc-quiz-member", data.membershipId);
      if (data.status === "finished") { showFinished(data); return; }
      if (!res.ok || !data.allowed) { setIdError(data.message ?? "This Membership ID is not on the participant list."); setPhase("intro"); return; }
      beginSitting(data);
    } catch {
      if (gen !== sessionGen.current) return;
      setIdError("Could not verify your ID. Please check your connection and try again.");
      setPhase("intro");
    }
  }

  function selectOption(idx: number) { setSelected(idx); }

  function leaveDevice() {
    sessionGen.current += 1;
    sessionStorage.removeItem("bfc-quiz-member");
    autoTried.current = true;
    setLeaveOpen(false);
    setConfirmOpen(false);
    setMember(null);
    setMembershipId("");
    setAnswers({});
    setSelected(null);
    setCurrent(0);
    setResult(null);
    setStartedAt(null);
    setResumeNote("");
    setSaveError("");
    setTimedOut(false);
    setIdError("");
    submitting.current = false;
    setPhase("intro");
  }

  function savedAnswers(): Record<number, number> {
    const next = { ...answersRef.current };
    const question = questions[currentRef.current];
    if (question && selectedRef.current !== null) next[question.id] = selectedRef.current;
    return next;
  }

  function goTo(index: number) {
    if (index < 0 || index >= questions.length || index === current) return;
    const next = savedAnswers();
    setAnswers(next);
    setCurrent(index);
    setSelected(next[questions[index].id] ?? null);
  }

  async function submitQuiz(finalAnswers: Record<number, number>, expired = false) {
    if (submitting.current) return;
    submitting.current = true;
    setConfirmOpen(false);
    setTimedOut(expired);
    setPhase("submitting");
    setSaveError("");
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membershipId: member!.membershipId,
          answers: finalAnswers,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setResult({
        score: data.score,
        total: data.total,
        percentage: data.percentage,
        passed: data.passed,
        wrongIds: data.wrongIds,
        sections: data.sections,
      });
      if (data.duplicate) {
        setSaveError("This assessment was already submitted. The saved result is shown below.");
      }
      setPhase("result");
    } catch {
      submitting.current = false;
      setSaveError("Your result could not be saved. Please check your connection and try again, or contact your facilitator.");
      setPhase("result");
    }
  }

  const handleVerifyRef = useRef(handleVerify);
  const savedAnswersRef = useRef(savedAnswers);
  const submitQuizRef = useRef(submitQuiz);
  handleVerifyRef.current = handleVerify;
  savedAnswersRef.current = savedAnswers;
  submitQuizRef.current = submitQuiz;

  useEffect(() => {
    if (phase !== "intro" || questions.length === 0 || autoTried.current) return;
    const stored = sessionStorage.getItem("bfc-quiz-member");
    if (!stored) return;
    autoTried.current = true;
    setMembershipId(stored);
    void handleVerifyRef.current(stored);
  }, [phase, questions.length]);

  useEffect(() => {
    if (phase !== "quiz" || !member) return;
    const save = () => {
      const body = JSON.stringify({
        membershipId: member.membershipId,
        answers: savedAnswersRef.current(),
        questionIndex: currentRef.current,
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/quiz/progress", new Blob([body], { type: "application/json" }));
      }
    };
    window.addEventListener("pagehide", save);
    return () => window.removeEventListener("pagehide", save);
  }, [phase, member]);

  useEffect(() => {
    if (phase !== "quiz" || !member) return;
    const timer = setTimeout(() => {
      fetch("/api/quiz/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membershipId: member.membershipId,
          answers: savedAnswersRef.current(),
          questionIndex: current,
        }),
      }).then((response) => {
        if (response.status === 409) submitQuizRef.current(savedAnswersRef.current(), true);
      }).catch(() => undefined);
    }, 500);
    return () => clearTimeout(timer);
  }, [phase, member, answers, selected, current]);

  useEffect(() => {
    if (phase !== "quiz") return;
    const blockEvent = (event: Event) => event.preventDefault();
    const blockKeys = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && ["a", "c", "x", "p", "s"].includes(key)) {
        event.preventDefault();
      }
    };
    document.addEventListener("copy", blockEvent);
    document.addEventListener("cut", blockEvent);
    document.addEventListener("contextmenu", blockEvent);
    document.addEventListener("selectstart", blockEvent);
    document.addEventListener("dragstart", blockEvent);
    document.addEventListener("keydown", blockKeys);
    return () => {
      document.removeEventListener("copy", blockEvent);
      document.removeEventListener("cut", blockEvent);
      document.removeEventListener("contextmenu", blockEvent);
      document.removeEventListener("selectstart", blockEvent);
      document.removeEventListener("dragstart", blockEvent);
      document.removeEventListener("keydown", blockKeys);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "quiz" || !endsAt) return;
    const tick = () => {
      const time = Date.now();
      setNow(time);
      if (time - serverOffset >= endsAt) submitQuizRef.current(savedAnswersRef.current(), true);
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [phase, endsAt, serverOffset]);

  const scheduleStatus = !opensAt || !closesAt
    ? "unscheduled"
    : serverNow < new Date(opensAt).getTime()
      ? "upcoming"
      : serverNow >= new Date(closesAt).getTime()
        ? "closed"
        : "open";
  const draftAnswers = confirmOpen ? savedAnswers() : answers;
  const unanswered = questions.filter((question) => draftAnswers[question.id] === undefined).length;

  return (
    <div className="quiz-page" style={{ minHeight: "100vh", background: "#F5F5F5", fontFamily: "Montserrat, Arial, sans-serif" }}>
      <style>{`
        .quiz-page, .quiz-page * { box-sizing: border-box; }
        .quiz-page { overflow-x: hidden; }
        .quiz-header, .quiz-main { padding-left: 16px; padding-right: 16px; }
        .quiz-kicker { overflow-wrap: anywhere; }
        .option-btn { display: flex; align-items: flex-start; width: 100%; gap: 10px; }
        .quiz-nav { min-height: 48px; }
        .quiz-secure, .quiz-secure * {
          -webkit-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }
        @media (max-width: 640px) {
          .quiz-title { font-size: 16px !important; letter-spacing: 0.3px !important; }
          .quiz-kicker { font-size: 11px !important; }
          .card-pad { padding: 16px !important; }
          .quiz-main { padding: 16px 12px !important; }
          .quiz-header { padding: 14px 12px !important; }
          .member-line { flex-wrap: wrap; }
          .confirm-sheet { align-items: flex-end !important; padding: 0 0 env(safe-area-inset-bottom) !important; }
        }
      `}</style>
      <header className="quiz-header" style={{ background: C.crimson, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
          <div style={{ width: 8, height: 36, background: C.sunglow, borderRadius: 4, flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div className="quiz-title" style={{ color: C.white, fontWeight: 800, fontSize: 18, letterSpacing: 1 }}>EL KRATOS EMBASSY</div>
            <div className="quiz-kicker" style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Believers&apos; Foundation Class · Assessment · {CURRENT_BATCH}</div>
          </div>
        </div>
        {(phase === "quiz" || phase === "result") && (
          <button onClick={() => phase === "quiz" ? setLeaveOpen(true) : leaveDevice()} style={{ background: "transparent", color: C.white, border: "1px solid rgba(255,255,255,0.75)", borderRadius: 8, padding: "8px 14px", minHeight: 40, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>Sign out</button>
        )}
      </header>

      <main className="quiz-main" style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>

        {phase === "loading" && (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
            <div style={{ color: C.mirage, fontWeight: 700, fontSize: 16 }}>Loading assessment…</div>
            <div style={{ color: C.mgray, fontSize: 13, marginTop: 6 }}>Please wait</div>
          </div>
        )}

        {/* ── INTRO ── */}
        {(phase === "intro" || phase === "verifying") && (
          <div>
            <div className="card-pad" style={{ background: C.white, borderRadius: 12, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: 24 }}>
              <div style={{ background: C.crimsonL, borderLeft: `4px solid ${C.crimson}`, borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: 24 }}>
                <div style={{ color: C.crimson, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>📋 Assessment Overview</div>
                <div style={{ color: C.mgray, fontSize: 14, lineHeight: 1.6 }}>{questions.length || "—"} questions · 2 marks each · {totalMarks || "—"} marks · Pass mark: {PASS_MARK}%</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                <StatBadge val={String(questions.length || "—")} label="Questions" />
                <StatBadge val={String(totalMarks || "—")} label="Total Marks" />
                <StatBadge val="70%" label="Pass Mark" />
                <StatBadge val={`${quizMinutes} mins`} label="Time Limit" />
              </div>
              <div style={{ color: C.mgray, fontSize: 13, lineHeight: 1.7, marginBottom: 16, background: scheduleStatus === "open" ? C.sunglowL : C.crimsonL, borderRadius: 8, padding: "12px 16px" }}>
                {scheduleStatus === "open" && <>You can start until <strong>{formatWhen(closesAt)}</strong>. Once you begin you have the full {quizMinutes} minutes, even if that runs past the end time.</>}
                {scheduleStatus === "upcoming" && <>This assessment opens <strong>{formatWhen(opensAt)}</strong>. New attempts can start until <strong>{formatWhen(closesAt)}</strong>.</>}
                {scheduleStatus === "closed" && <>New attempts closed <strong>{formatWhen(closesAt)}</strong>. If you already started, enter your Membership ID to continue with the time you have left.</>}
                {scheduleStatus === "unscheduled" && <>This assessment is not open yet. Your facilitator will set the start and end time.</>}
              </div>
              <div style={{ color: C.mgray, fontSize: 13, lineHeight: 1.7, marginBottom: 24, background: C.sunglowL, borderRadius: 8, padding: "12px 16px" }}>
                ⚡ <strong>Instructions:</strong> You have {quizMinutes} minutes. Move freely between questions. Unanswered questions are marked wrong. Refreshing or leaving the page does not reset your time, and your answers are kept. When time runs out the assessment submits itself.
              </div>
              <div>
                <label style={{ display: "block", color: C.mirage, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Membership ID *</label>
                <div style={{ color: C.mgray, fontSize: 12, marginBottom: 8 }}>Enter your EL Kratos Embassy Membership ID (e.g. ELKE-2026-XXXX)</div>
                <input type="text" value={membershipId} onChange={(e) => { setMembershipId(e.target.value.toUpperCase()); setIdError(""); }} onKeyDown={(e) => e.key === "Enter" && handleVerify()} placeholder="ELKE-YYYY-XXXX" disabled={phase === "verifying"} style={{ width: "100%", padding: "12px 14px", fontSize: 15, border: `2px solid ${idError ? C.crimson : C.lgray}`, borderRadius: 8, outline: "none", boxSizing: "border-box", fontFamily: "inherit", letterSpacing: 1, textTransform: "uppercase" }} />
                {loadError && <div style={{ color: C.crimson, fontSize: 13, marginTop: 12 }}>⚠️ {loadError}</div>}
                {idError && <div style={{ color: C.crimson, fontSize: 13, marginTop: 6 }}>⚠️ {idError}</div>}
              </div>
            </div>
            <button onClick={() => handleVerify()} disabled={phase === "verifying" || questions.length === 0} style={{ width: "100%", padding: "16px", background: phase === "verifying" || questions.length === 0 ? C.lgray : C.crimson, color: C.white, border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: phase === "verifying" || questions.length === 0 ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
              {phase === "verifying" ? "Verifying ID…" : "Verify & Begin Assessment →"}
            </button>
          </div>
        )}

        {/* ── QUIZ ── */}
        {phase === "quiz" && member && q && (
          <div
            className="quiz-secure"
            onCopy={(event) => event.preventDefault()}
            onCut={(event) => event.preventDefault()}
            onContextMenu={(event) => event.preventDefault()}
            onDragStart={(event) => event.preventDefault()}
          >
            <div style={{ background: C.white, borderRadius: 8, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.success, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: C.mirage, fontWeight: 700, fontSize: 14, overflowWrap: "anywhere" }}>{member.name}</div>
                  <div style={{ color: C.lgray, fontSize: 11, overflowWrap: "anywhere" }}>{member.membershipId}</div>
                </div>
              </div>
              <div style={{ color: remainingMs < 5 * 60 * 1000 ? C.crimson : C.mirage, fontWeight: 800, fontSize: 16, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{clock}</div>
            </div>
            {resumeNote && <div style={{ background: C.sunglowL, borderRadius: 8, padding: "10px 14px", color: C.mirage, fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>{resumeNote}</div>}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: C.mgray, fontSize: 13 }}>Question {current + 1} of {questions.length}</span>
                <span style={{ color: C.crimson, fontWeight: 700, fontSize: 13 }}>{progress}%</span>
              </div>
              <div style={{ height: 6, background: "#E5E5E5", borderRadius: 99 }}>
                <div style={{ height: "100%", width: `${progress}%`, background: C.crimson, borderRadius: 99, transition: "width 0.3s" }} />
              </div>
              <div style={{ marginTop: 6 }}>
                <span style={{ background: C.crimsonL, color: C.crimson, fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 99 }}>{q.weekLabel}</span>
              </div>
            </div>
            <div className="card-pad" style={{ background: C.white, borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: 16 }}>
              <div style={{ color: C.mirage, fontWeight: 700, fontSize: 16, lineHeight: 1.6, marginBottom: 24, overflowWrap: "anywhere" }}>{current + 1}. {q.text}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {q.options.map((opt, idx) => {
                  const isSel = selected === idx;
                  return (
                    <button key={idx} onClick={() => selectOption(idx)} className="option-btn" style={{ textAlign: "left", padding: "14px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 14, lineHeight: 1.5, transition: "all 0.15s", border: `2px solid ${isSel ? C.crimson : "#E5E5E5"}`, background: isSel ? C.crimsonL : C.white, color: isSel ? C.crimson : C.mgray, fontWeight: isSel ? 700 : 400 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", fontSize: 12, fontWeight: 700, flexShrink: 0, background: isSel ? C.crimson : "#E5E5E5", color: isSel ? C.white : C.mgray }}>{String.fromCharCode(65 + idx)}</span>
                      <span style={{ flex: 1, minWidth: 0, overflowWrap: "anywhere" }}>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14, alignItems: "center" }}>
              {questionIndexes.map((mark, position) => (
                <span key={mark} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  {position > 0 && mark - questionIndexes[position - 1] > 1 && <span style={{ color: C.lgray }}>…</span>}
                  <button onClick={() => goTo(mark)} style={{ width: 40, height: 40, borderRadius: 8, border: `1px solid ${mark === current ? C.crimson : "#E5E5E5"}`, background: answers[questions[mark].id] !== undefined || (mark === current && selected !== null) ? C.crimsonL : C.white, color: mark === current ? C.crimson : C.mgray, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{mark + 1}</button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="quiz-nav" onClick={() => goTo(current - 1)} disabled={current === 0} style={{ flex: 1, padding: "15px 8px", background: current === 0 ? "#E5E5E5" : C.white, color: current === 0 ? C.lgray : C.mirage, border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: current === 0 ? "not-allowed" : "pointer", fontFamily: "inherit" }}>← Previous</button>
              <button className="quiz-nav" onClick={() => goTo(current + 1)} disabled={current >= questions.length - 1} style={{ flex: 1, padding: "15px 8px", background: current >= questions.length - 1 ? "#E5E5E5" : C.mirage, color: current >= questions.length - 1 ? C.lgray : C.white, border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: current >= questions.length - 1 ? "not-allowed" : "pointer", fontFamily: "inherit" }}>Next →</button>
            </div>
            <button onClick={() => setConfirmOpen(true)} style={{ width: "100%", marginTop: 10, padding: "15px", minHeight: 48, background: C.crimson, color: C.white, border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Submit Assessment ✓</button>
          </div>
        )}

        {/* ── SUBMITTING ── */}
        {phase === "submitting" && (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <div style={{ color: C.mirage, fontWeight: 700, fontSize: 18 }}>Calculating your result…</div>
            <div style={{ color: C.mgray, fontSize: 14, marginTop: 8 }}>Please wait</div>
          </div>
        )}

        {phase === "result" && !result && (
          <div style={{ background: C.white, borderRadius: 12, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <div style={{ color: C.mirage, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Result not saved</div>
            <div style={{ color: C.mgray, fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{saveError}</div>
            <button onClick={() => setConfirmOpen(true)} style={{ width: "100%", padding: "15px", minHeight: 48, background: C.crimson, color: C.white, border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              Try again
            </button>
          </div>
        )}

        {/* ── RESULT ── */}
        {phase === "result" && result && member && (
          <div>
            <div style={{ background: result.passed ? C.successL : C.crimsonL, border: `3px solid ${result.passed ? C.success : C.crimson}`, borderRadius: 16, padding: 28, textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 56, marginBottom: 8 }}>{result.passed ? "🎉" : "📖"}</div>
              <div style={{ color: result.passed ? C.success : C.crimson, fontWeight: 800, fontSize: 32, marginBottom: 4 }}>{result.percentage}%</div>
              <div style={{ color: C.mirage, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{result.score} / {result.total} marks</div>
              <div style={{ display: "inline-block", padding: "6px 20px", background: result.passed ? C.success : C.crimson, color: C.white, borderRadius: 99, fontWeight: 700, fontSize: 14 }}>{result.passed ? "PASSED ✓" : "NOT YET PASSED"}</div>
              {timedOut && <div style={{ color: C.mgray, fontSize: 13, marginTop: 12 }}>Time ran out, so this attempt was submitted automatically.</div>}
            </div>
            <div style={{ background: C.white, borderRadius: 12, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: 16 }}>
              <div style={{ color: C.lgray, fontSize: 12, marginBottom: 2 }}>Submitted by</div>
              <div style={{ color: C.mirage, fontWeight: 700, fontSize: 18 }}>{member.name}</div>
              <div className="member-line" style={{ display: "flex", gap: 16, marginTop: 4, flexWrap: "wrap" }}>
                <span style={{ color: C.mgray, fontSize: 13 }}>🪪 {member.membershipId}</span>
                <span style={{ color: C.mgray, fontSize: 13 }}>📋 {CURRENT_BATCH}</span>
              </div>
            </div>
            <div style={{ background: C.white, borderRadius: 12, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: 16 }}>
              <div style={{ color: C.mirage, fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Score Breakdown by Week</div>
              {(result.sections?.length ? result.sections : weekSections.map(({ label, ids }) => ({
                label,
                total: ids.length,
                correct: ids.filter((id) => !result.wrongIds.includes(id)).length,
              }))).map(({ label, total, correct }) => {
                const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
                return (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ color: C.mgray, fontSize: 13 }}>{label}</span>
                      <span style={{ color: pct >= 70 ? C.success : C.crimson, fontWeight: 700, fontSize: 13 }}>{correct}/{total}</span>
                    </div>
                    <div style={{ height: 5, background: "#E5E5E5", borderRadius: 99 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: pct >= 70 ? C.success : C.crimson, borderRadius: 99 }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ background: C.white, borderRadius: 12, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: 16, borderLeft: `4px solid ${result.passed ? C.success : C.sunglow}` }}>
              {result.passed ? (
                <><div style={{ color: C.success, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Well done, {member.name.split(" ")[0]}! 🙌</div><div style={{ color: C.mgray, fontSize: 14, lineHeight: 1.7 }}>You have successfully completed the Believers&apos; Foundation Class assessment. Your certificate will be presented next Friday. Keep growing through every Flame Tongue.</div></>
              ) : (
                <><div style={{ color: C.crimson, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Keep going, {member.name.split(" ")[0]}.</div><div style={{ color: C.mgray, fontSize: 14, lineHeight: 1.7 }}>You scored {result.percentage}% — the pass mark is {PASS_MARK}%. Your facilitator will schedule a review session before the certificate ceremony. Review the sections highlighted in red above.</div></>
              )}
            </div>
            {saveError && <div style={{ background: C.sunglowL, borderRadius: 8, padding: 14, color: C.mirage, fontSize: 13, lineHeight: 1.6 }}>⚠️ {saveError}</div>}
            <button onClick={leaveDevice} style={{ width: "100%", marginTop: 16, padding: "15px", minHeight: 48, background: C.white, color: C.mirage, border: `2px solid ${C.lgray}`, borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Sign out of this device</button>
          </div>
        )}
      </main>

      {leaveOpen && (
        <div className="confirm-sheet" style={{ position: "fixed", inset: 0, background: "rgba(15,27,45,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000, padding: 12 }} onClick={() => setLeaveOpen(false)}>
          <div className="card-pad" onClick={(event) => event.stopPropagation()} style={{ background: C.white, borderRadius: 16, padding: 24, width: "100%", maxWidth: 440, marginBottom: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <div style={{ color: C.mirage, fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Sign out of this device?</div>
            <div style={{ color: C.mgray, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>Your answers stay saved and your timer keeps running. The next person can enter their own Membership ID.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setLeaveOpen(false)} style={{ flex: 1, minHeight: 48, padding: "12px 8px", background: "#F5F5F5", color: C.mirage, border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Stay</button>
              <button onClick={leaveDevice} style={{ flex: 1, minHeight: 48, padding: "12px 8px", background: C.crimson, color: C.white, border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Sign out</button>
            </div>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div className="confirm-sheet" style={{ position: "fixed", inset: 0, background: "rgba(15,27,45,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000, padding: 12 }} onClick={() => setConfirmOpen(false)}>
          <div className="card-pad" onClick={(event) => event.stopPropagation()} style={{ background: C.white, borderRadius: 16, padding: 24, width: "100%", maxWidth: 440, marginBottom: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <div style={{ color: C.mirage, fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Submit this assessment?</div>
            <div style={{ color: C.mgray, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              {unanswered === 0
                ? "Every question has an answer. You will not be able to change it after this."
                : `${unanswered} question${unanswered === 1 ? " is" : "s are"} still unanswered and will be marked wrong. You will not be able to change this after submitting.`}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmOpen(false)} style={{ flex: 1, minHeight: 48, padding: "12px 8px", background: "#F5F5F5", color: C.mirage, border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Keep working</button>
              <button onClick={() => submitQuiz(savedAnswers())} style={{ flex: 1, minHeight: 48, padding: "12px 8px", background: C.crimson, color: C.white, border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Submit now</button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ textAlign: "center", padding: "24px 16px", color: C.lgray, fontSize: 12 }}>
        © 2026 EL Kratos Embassy · Believers&apos; Foundation Class · {CURRENT_BATCH}
      </footer>
    </div>
  );
}
