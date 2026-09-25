"use client";

import { Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

const PAGE_SIZE = 8;

type Phase = "login" | "loading" | "dashboard";
type Tab = "results" | "questions" | "participants";
type ModalMode = "add" | "edit" | null;

interface DBQuestion {
  id: number;
  weekLabel: string;
  order: number;
  text: string;
  options: string[];
  answerIndex: number;
}

interface ReviewItem {
  id: number;
  order: number;
  weekLabel: string;
  text: string;
  options: string[];
  selected: number | null;
  correctIndex: number;
}

interface Attempt {
  id:           number;
  membershipId: string;
  name:         string;
  score:        number;
  percentage:   number;
  passed:       boolean;
  submittedAt:  string;
  review:       ReviewItem[];
}

interface Participant {
  id: number;
  membershipId: string;
  name: string;
}

interface DashboardData {
  accessor:  { id: string; label: string };
  batch:     string;
  summary:   { total: number; passed: number; failed: number; avgScore: number };
  attempts:  Attempt[];
}

export default function ResultsDashboard() {
  const [phase,     setPhase]     = useState<Phase>("login");
  const [passcode,  setPasscode]  = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [savedMinutes, setSavedMinutes] = useState(45);
  const [draftMinutes, setDraftMinutes] = useState("45");
  const [durationSaving, setDurationSaving] = useState(false);
  const [durationError, setDurationError] = useState("");
  const [durationNotice, setDurationNotice] = useState("");
  const durationDirty = useRef(false);
  const windowDirty = useRef(false);
  const [opensDraft, setOpensDraft] = useState("");
  const [closesDraft, setClosesDraft] = useState("");
  const [windowSaving, setWindowSaving] = useState(false);
  const [windowError, setWindowError] = useState("");
  const [windowNotice, setWindowNotice] = useState("");
  const [error,     setError]     = useState("");
  const [data,      setData]      = useState<DashboardData | null>(null);
  const [sortField, setSortField] = useState<"name" | "percentage" | "submittedAt">("percentage");
  const [sortDir,   setSortDir]   = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState<Tab>("results");
  const [qList, setQList] = useState<DBQuestion[]>([]);
  const [qLoading, setQLoading] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editTarget, setEditTarget] = useState<DBQuestion | null>(null);
  const [qSaving, setQSaving] = useState(false);
  const [qError, setQError] = useState("");
  const [fWeekLabel, setFWeekLabel] = useState("");
  const [fText, setFText] = useState("");
  const [fOptions, setFOptions] = useState(["", "", "", ""]);
  const [fAnswerIndex, setFAnswerIndex] = useState(0);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [pModal, setPModal] = useState(false);
  const [pName, setPName] = useState("");
  const [pId, setPId] = useState("");
  const [pError, setPError] = useState("");
  const [pSaving, setPSaving] = useState(false);
  const [openAttemptId, setOpenAttemptId] = useState<number | null>(null);
  const [resultPage, setResultPage] = useState(0);
  const [pendingPage, setPendingPage] = useState(0);
  const [qPage, setQPage] = useState(0);
  const [participantPage, setParticipantPage] = useState(0);
  const qListRef = useRef(qList);
  qListRef.current = qList;
  const batch = data?.batch;

  useEffect(() => {
    if (activeTab !== "questions" || !batch) return;
    let cancelled = false;
    if (qListRef.current.length === 0) setQLoading(true);
    fetch(`/api/quiz/questions?batch=${batch}`, {
      headers: { "x-facilitator-passcode": passcode },
    })
      .then((response) => response.json())
      .then((payload) => {
        if (!cancelled && Array.isArray(payload.questions)) setQList(payload.questions);
      })
      .catch(() => {
        if (!cancelled && qListRef.current.length === 0) setQList([]);
      })
      .finally(() => {
        if (!cancelled) setQLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab, batch, passcode]);

  useEffect(() => {
    if (phase !== "dashboard" || !batch) return;
    let stop = false;
    const tick = async () => {
      const [people, results, settings] = await Promise.all([
        fetch(`/api/quiz/participants?batch=${batch}`, {
          headers: { "x-facilitator-passcode": passcode },
        }).then((response) => response.json()),
        fetch("/api/quiz/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passcode }),
        }).then((response) => response.json()),
        fetch(`/api/quiz/settings?batch=${batch}`).then((response) => response.json()),
      ]);
      if (stop) return;
      if (Array.isArray(people.participants)) setParticipants(people.participants);
      if (Array.isArray(results.attempts)) setData(results);
      if (Number.isInteger(settings.durationMinutes)) {
        setSavedMinutes(settings.durationMinutes);
        if (!durationDirty.current) setDraftMinutes(String(settings.durationMinutes));
      }
      if (!windowDirty.current) {
        setOpensDraft(toLocalInput(settings.opensAt));
        setClosesDraft(toLocalInput(settings.closesAt));
      }
    };
    tick();
    const timer = setInterval(tick, 8000);
    return () => {
      stop = true;
      clearInterval(timer);
    };
  }, [phase, batch, passcode]);

  function openAdd() {
    setFWeekLabel("");
    setFText("");
    setFOptions(["", "", "", ""]);
    setFAnswerIndex(0);
    setEditTarget(null);
    setQError("");
    setModalMode("add");
  }

  function openEdit(question: DBQuestion) {
    setFWeekLabel(question.weekLabel);
    setFText(question.text);
    setFOptions([...(question.options as string[])]);
    setFAnswerIndex(question.answerIndex);
    setEditTarget(question);
    setQError("");
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setEditTarget(null);
    setQError("");
  }

  async function refreshQuestions() {
    if (!data) return;
    const fresh = await fetch(`/api/quiz/questions?batch=${data.batch}`, {
      headers: { "x-facilitator-passcode": passcode },
    }).then((response) => response.json());
    setQList(fresh.questions ?? []);
  }

  async function saveQuestion() {
    if (!fText.trim()) { setQError("Question text is required."); return; }
    const packed: string[] = [];
    let answer = -1;
    fOptions.forEach((option, idx) => {
      const value = option.trim();
      if (!value) return;
      if (idx === fAnswerIndex) answer = packed.length;
      packed.push(value);
    });
    if (packed.length < 2 || packed.length > 8) { setQError("Add between 2 and 8 options."); return; }
    if (answer < 0) { setQError("Mark one filled option as the correct answer."); return; }
    setQSaving(true);
    setQError("");
    const body = {
      passcode,
      batch: data!.batch,
      weekLabel: fWeekLabel || "General",
      text: fText.trim(),
      options: packed,
      answerIndex: answer,
    };
    try {
      const url = modalMode === "edit" && editTarget
        ? `/api/quiz/questions/${editTarget.id}`
        : "/api/quiz/questions";
      const method = modalMode === "edit" ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await response.json();
      if (!response.ok) {
        setQError(json.error ?? "Failed to save.");
        setQSaving(false);
        return;
      }
      await refreshQuestions();
      closeModal();
    } catch {
      setQError("Network error. Please try again.");
    }
    setQSaving(false);
  }

  async function deleteQuestion(question: DBQuestion) {
    if (!confirm(`Delete question ${question.order}: "${question.text.slice(0, 60)}…"?\n\nThis cannot be undone.`)) return;
    await fetch(`/api/quiz/questions/${question.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    await refreshQuestions();
  }

  async function saveDuration() {
    if (!data) return;
    const minutes = Number(draftMinutes);
    if (!Number.isInteger(minutes) || minutes < 5 || minutes > 180) {
      setDurationError("Enter a whole number of minutes from 5 to 180.");
      setDurationNotice("");
      return;
    }
    setDurationSaving(true);
    setDurationError("");
    setDurationNotice("");
    try {
      const response = await fetch("/api/quiz/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, batch: data.batch, durationMinutes: minutes }),
      });
      const json = await response.json();
      if (!response.ok) {
        setDurationError(json.error ?? "Could not update the time limit.");
        setDurationSaving(false);
        return;
      }
      durationDirty.current = false;
      setSavedMinutes(json.durationMinutes);
      setDraftMinutes(String(json.durationMinutes));
      setDurationNotice("Time limit updated. Candidates already sitting will see the new countdown.");
    } catch {
      setDurationError("Network error. Please try again.");
    }
    setDurationSaving(false);
  }

  async function saveWindow() {
    if (!data) return;
    if ((opensDraft && !closesDraft) || (!opensDraft && closesDraft)) {
      setWindowError("Set both a start and an end, or clear both to keep the quiz closed.");
      setWindowNotice("");
      return;
    }
    setWindowSaving(true);
    setWindowError("");
    setWindowNotice("");
    try {
      const response = await fetch("/api/quiz/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode,
          batch: data.batch,
          opensAt: opensDraft ? new Date(opensDraft).toISOString() : null,
          closesAt: closesDraft ? new Date(closesDraft).toISOString() : null,
        }),
      });
      const json = await response.json();
      if (!response.ok) {
        setWindowError(json.error ?? "Could not update the schedule.");
        setWindowSaving(false);
        return;
      }
      windowDirty.current = false;
      setOpensDraft(toLocalInput(json.opensAt));
      setClosesDraft(toLocalInput(json.closesAt));
      setWindowNotice(json.opensAt ? "Schedule saved. Candidates can start only inside this window, and they keep the full time limit after they begin." : "Schedule cleared. The quiz stays closed until you set a window.");
    } catch {
      setWindowError("Network error. Please try again.");
    }
    setWindowSaving(false);
  }

  function signOut() {
    setPhase("login");
    setData(null);
    setPasscode("");
    setActiveTab("results");
    setQList([]);
    setParticipants([]);
    setError("");
    closeModal();
    setPModal(false);
  }

  async function addParticipant() {
    if (!data) return;
    setPSaving(true);
    setPError("");
    try {
      const response = await fetch("/api/quiz/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, membershipId: pId, name: pName, batch: data.batch }),
      });
      const json = await response.json();
      if (!response.ok) {
        setPError(json.error ?? "Could not add this participant.");
        setPSaving(false);
        return;
      }
      const fresh = await fetch(`/api/quiz/participants?batch=${data.batch}`, {
        headers: { "x-facilitator-passcode": passcode },
      }).then((result) => result.json());
      setParticipants(fresh.participants ?? []);
      setPModal(false);
      setPName("");
      setPId("");
    } catch {
      setPError("Network error. Please try again.");
    }
    setPSaving(false);
  }

  async function removeParticipant(person: Participant) {
    if (!data) return;
    if (!confirm(`Remove ${person.name} (${person.membershipId}) from this assessment?`)) return;
    await fetch(`/api/quiz/participants/${person.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    const fresh = await fetch(`/api/quiz/participants?batch=${data.batch}`, {
      headers: { "x-facilitator-passcode": passcode },
    }).then((result) => result.json());
    setParticipants(fresh.participants ?? []);
  }

  async function handleLogin() {
    if (!passcode.trim()) { setError("Please enter your passcode."); return; }
    setError("");
    setPhase("loading");
    try {
      const res  = await fetch("/api/quiz/results", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ passcode: passcode.trim() }) });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Invalid passcode."); setPasscode(""); setPhase("login"); return; }
      setData(json);
      setPhase("dashboard");
    } catch {
      setError("Connection error. Please try again.");
      setPhase("login");
    }
  }

  function toggleSort(field: typeof sortField) {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  }

  function sortedAttempts(): Attempt[] {
    if (!data) return [];
    return [...data.attempts].sort((a, b) => {
      let av: string | number = a[sortField] as string | number;
      let bv: string | number = b[sortField] as string | number;
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  function SortIcon({ field }: { field: typeof sortField }) {
    if (sortField !== field) return <span style={{ color: C.lgray }}>↕</span>;
    return <span style={{ color: C.sunglow }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  const pending = participants.filter((person) => !data?.attempts.some((attempt) => attempt.membershipId === person.membershipId));
  const attempts = sortedAttempts();
  const resultPages = Math.max(1, Math.ceil(attempts.length / PAGE_SIZE));
  const visibleAttempts = attempts.slice(resultPage * PAGE_SIZE, (resultPage + 1) * PAGE_SIZE);
  const pendingPages = Math.max(1, Math.ceil(pending.length / PAGE_SIZE));
  const visiblePending = pending.slice(pendingPage * PAGE_SIZE, (pendingPage + 1) * PAGE_SIZE);
  const questionPages = Math.max(1, Math.ceil(qList.length / PAGE_SIZE));
  const visibleQuestions = qList.slice(qPage * PAGE_SIZE, (qPage + 1) * PAGE_SIZE);
  const participantPages = Math.max(1, Math.ceil(participants.length / PAGE_SIZE));
  const visibleParticipants = participants.slice(participantPage * PAGE_SIZE, (participantPage + 1) * PAGE_SIZE);
  const ranked = [...(data?.attempts ?? [])].sort((a, b) => b.percentage - a.percentage || a.name.localeCompare(b.name));
  const strongest = ranked.slice(0, 3);
  const weakest = [...ranked].reverse().slice(0, 3);
  const missed = new Map<number, { order: number; text: string; missed: number; sat: number }>();
  for (const attempt of data?.attempts ?? []) {
    for (const item of attempt.review ?? []) {
      const row = missed.get(item.id) ?? { order: item.order, text: item.text, missed: 0, sat: 0 };
      row.sat += 1;
      if (item.selected !== item.correctIndex) row.missed += 1;
      missed.set(item.id, row);
    }
  }
  const hardest = [...missed.values()].filter((row) => row.missed > 0).sort((a, b) => b.missed - a.missed || a.order - b.order).slice(0, 5);
  const openAttempt = openAttemptId == null ? null : (data?.attempts ?? []).find((attempt) => attempt.id === openAttemptId) ?? null;

  return (
    <div className="dash-page" style={{ minHeight: "100vh", background: "#F5F5F5", fontFamily: "Montserrat, Arial, sans-serif" }}>
      <style>{`
        .dash-page, .dash-page * { box-sizing: border-box; }
        .dash-page { overflow-x: hidden; }
        .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .dash-tabs { display: flex; width: fit-content; max-width: 100%; }
        .dash-tabs button { flex: 1; }
        .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .results-cards { display: none; }
        .q-card { display: flex; gap: 14px; align-items: flex-start; }
        .modal-card { width: 100%; max-height: 90vh; overflow-y: auto; }
        .schedule-grid { display: grid; grid-template-columns: 1fr 1fr auto; gap: 10px; align-items: end; }
        .insight-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .score-btn { display: flex; align-items: center; gap: 10px; width: 100%; background: none; border: none; padding: 4px 0; cursor: pointer; font-family: inherit; text-align: left; }
        .score-name { width: 148px; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #0F1B2D; font-weight: 650; font-size: 13px; }
        .review-card { width: 100%; max-width: 720px; }
        @media (max-width: 720px) {
          .dash-header { flex-wrap: wrap; align-items: flex-start !important; padding: 14px 12px !important; gap: 12px; }
          .dash-title { font-size: 16px !important; letter-spacing: 0.3px !important; }
          .dash-main { padding: 16px 12px !important; }
          .summary-grid { grid-template-columns: 1fr 1fr; }
          .dash-tabs { width: 100%; }
          .dash-tabs button { padding: 10px 6px !important; font-size: 12px !important; }
          .results-table { display: none; }
          .results-cards { display: flex; flex-direction: column; }
          .q-card { flex-direction: column; }
          .q-actions { width: 100%; }
          .q-actions button { flex: 1; min-height: 40px; }
          .person-row { flex-wrap: wrap; }
          .time-card { align-items: stretch !important; }
          .schedule-grid { grid-template-columns: 1fr; }
          .insight-grid { grid-template-columns: 1fr; }
          .score-name { width: 92px; font-size: 12px; }
          .modal-sheet { align-items: flex-end !important; padding: 0 !important; }
          .review-card { max-width: none; border-radius: 16px 16px 0 0 !important; max-height: 92vh; }
          .dash-user { width: 100%; justify-content: space-between; }
          .modal-card { padding: 18px !important; padding-bottom: calc(18px + env(safe-area-inset-bottom)) !important; border-radius: 16px 16px 0 0; }
          .modal-sheet { align-items: flex-end !important; padding: 0 !important; }
        }
      `}</style>
      <header className="dash-header" style={{ background: C.crimson, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 36, background: C.sunglow, borderRadius: 4 }} />
          <div>
            <div className="dash-title" style={{ color: C.white, fontWeight: 800, fontSize: 18, letterSpacing: 1 }}>EL KRATOS EMBASSY</div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>BFC Assessment · Results Dashboard{data ? ` · ${data.batch}` : ""}</div>
          </div>
        </div>
        {data && (
          <div className="dash-user" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, textAlign: "right" }}>
              <div style={{ fontWeight: 700 }}>{data.accessor.label}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>{data.accessor.id}</div>
            </div>
            <button onClick={signOut} style={{ background: "transparent", color: C.white, border: "1px solid rgba(255,255,255,0.7)", borderRadius: 8, padding: "8px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Sign out</button>
          </div>
        )}
      </header>

      <main className="dash-main" style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>

        {/* ── LOGIN ── */}
        {(phase === "login" || phase === "loading") && (
          <div style={{ maxWidth: 440, margin: "40px auto" }}>
            <div style={{ background: C.white, borderRadius: 12, padding: 32, boxShadow: "0 2px 16px rgba(0,0,0,0.09)" }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🔒</div>
                <div style={{ color: C.mirage, fontWeight: 800, fontSize: 20, marginBottom: 6 }}>Results Dashboard</div>
                <div style={{ color: C.mgray, fontSize: 13, lineHeight: 1.6 }}>Restricted to authorised facilitators.<br />Enter your passcode to continue.</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: C.mirage, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Facilitator Passcode</label>
                <div style={{ position: "relative" }}>
                  <input type={showPasscode ? "text" : "password"} value={passcode} onChange={(e) => { setPasscode(e.target.value); setError(""); }} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="Enter your passcode" disabled={phase === "loading"} autoComplete="current-password" style={{ width: "100%", padding: "12px 44px 12px 14px", fontSize: 15, border: `2px solid ${error ? C.crimson : C.lgray}`, borderRadius: 8, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                  <button type="button" onClick={() => setShowPasscode((visible) => !visible)} aria-label={showPasscode ? "Hide passcode" : "Show passcode"} disabled={phase === "loading"} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", padding: 6, cursor: phase === "loading" ? "not-allowed" : "pointer", color: C.mgray, display: "flex" }}>
                    {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {error && <div style={{ color: C.crimson, fontSize: 13, marginTop: 6 }}>⚠️ {error}</div>}
              </div>
              <button onClick={handleLogin} disabled={phase === "loading"} style={{ width: "100%", padding: "14px", background: phase === "loading" ? C.lgray : C.crimson, color: C.white, border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: phase === "loading" ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                {phase === "loading" ? "Authenticating…" : "Access Results →"}
              </button>
            </div>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {phase === "dashboard" && data && (
          <div>
            <div className="time-card" style={{ background: C.white, borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ color: C.mirage, fontWeight: 800, fontSize: 15 }}>Quiz time limit</div>
                <div style={{ color: C.mgray, fontSize: 13, marginTop: 4 }}>Currently {savedMinutes} minutes. You can change this at any time.</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <input type="number" min={5} max={180} value={draftMinutes} onChange={(e) => { durationDirty.current = true; setDraftMinutes(e.target.value); setDurationNotice(""); setDurationError(""); }} style={{ width: 88, padding: "10px 12px", border: `1.5px solid ${C.lgray}`, borderRadius: 8, fontSize: 15, fontFamily: "inherit", outline: "none" }} />
                <span style={{ color: C.mgray, fontSize: 13 }}>minutes</span>
                <button onClick={saveDuration} disabled={durationSaving} style={{ background: durationSaving ? C.lgray : C.crimson, color: C.white, border: "none", borderRadius: 8, padding: "10px 16px", fontWeight: 700, fontSize: 14, cursor: durationSaving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>{durationSaving ? "Saving…" : "Update time"}</button>
              </div>
              {durationError && <div style={{ width: "100%", color: C.crimson, fontSize: 13 }}>⚠️ {durationError}</div>}
              {durationNotice && <div style={{ width: "100%", color: C.success, fontSize: 13 }}>{durationNotice}</div>}
            </div>
            <div className="time-card" style={{ background: C.white, borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)", marginBottom: 20 }}>
              <div style={{ color: C.mirage, fontWeight: 800, fontSize: 15 }}>When the quiz is open</div>
              <div style={{ color: C.mgray, fontSize: 13, marginTop: 4, marginBottom: 14, lineHeight: 1.5 }}>Candidates can begin only between these times. After they start, they keep the full time limit even if the window closes while they are sitting. Leave both empty to keep the quiz closed.</div>
              <div className="schedule-grid">
                <label style={{ display: "block", color: C.mirage, fontWeight: 700, fontSize: 13 }}>
                  Starts
                  <input type="datetime-local" value={opensDraft} onChange={(e) => { windowDirty.current = true; setOpensDraft(e.target.value); setWindowNotice(""); setWindowError(""); }} style={{ display: "block", width: "100%", marginTop: 6, padding: "10px 12px", border: `1.5px solid ${C.lgray}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit" }} />
                </label>
                <label style={{ display: "block", color: C.mirage, fontWeight: 700, fontSize: 13 }}>
                  Ends
                  <input type="datetime-local" value={closesDraft} onChange={(e) => { windowDirty.current = true; setClosesDraft(e.target.value); setWindowNotice(""); setWindowError(""); }} style={{ display: "block", width: "100%", marginTop: 6, padding: "10px 12px", border: `1.5px solid ${C.lgray}`, borderRadius: 8, fontSize: 14, fontFamily: "inherit" }} />
                </label>
                <button onClick={saveWindow} disabled={windowSaving} style={{ background: windowSaving ? C.lgray : C.crimson, color: C.white, border: "none", borderRadius: 8, padding: "10px 16px", minHeight: 44, fontWeight: 700, fontSize: 14, cursor: windowSaving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>{windowSaving ? "Saving…" : "Save schedule"}</button>
              </div>
              {windowError && <div style={{ color: C.crimson, fontSize: 13, marginTop: 10 }}>⚠️ {windowError}</div>}
              {windowNotice && <div style={{ color: C.success, fontSize: 13, marginTop: 10 }}>{windowNotice}</div>}
            </div>
            <div className="dash-tabs" style={{ gap: 0, marginBottom: 24, background: C.white, borderRadius: 10, padding: 4, boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
              {(["results", "participants", "questions"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "10px 24px", border: "none", borderRadius: 8, cursor: "pointer",
                    fontFamily: "inherit", fontSize: 14, fontWeight: 700,
                    background: activeTab === tab ? C.crimson : "transparent",
                    color: activeTab === tab ? C.white : C.mgray,
                  }}
                >
                  {tab === "results" ? "Results" : tab === "participants" ? "Participants" : "Questions"}
                </button>
              ))}
            </div>

            {activeTab === "results" && (
            <>
            {/* Summary cards */}
            <div className="summary-grid">
              {[
                { val: data.summary.total,              label: "Total Sat",       color: C.mirage  },
                { val: data.summary.passed,             label: "Passed",          color: C.success },
                { val: data.summary.failed,             label: "Not Yet Passed",  color: C.crimson },
                { val: `${data.summary.avgScore}%`,    label: "Avg Score",       color: C.crimsonD },
              ].map(({ val, label, color }) => (
                <div key={label} style={{ background: C.white, borderRadius: 10, padding: "16px 12px", textAlign: "center", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
                  <div style={{ color, fontWeight: 800, fontSize: 28 }}>{val}</div>
                  <div style={{ color: C.mgray, fontSize: 12, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Pass rate bar */}
            {data.summary.total > 0 && (
              <div style={{ background: C.white, borderRadius: 10, padding: "16px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: C.mirage, fontWeight: 700, fontSize: 14 }}>Pass Rate</span>
                  <span style={{ color: C.success, fontWeight: 700, fontSize: 14 }}>{Math.round((data.summary.passed / data.summary.total) * 100)}%</span>
                </div>
                <div style={{ height: 8, background: "#E5E5E5", borderRadius: 99 }}>
                  <div style={{ height: "100%", width: `${Math.round((data.summary.passed / data.summary.total) * 100)}%`, background: C.success, borderRadius: 99 }} />
                </div>
              </div>
            )}

            {ranked.length > 0 && (
              <div style={{ background: C.white, borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)", marginBottom: 24 }}>
                <div style={{ color: C.mirage, fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Scores</div>
                <div style={{ color: C.mgray, fontSize: 13, marginBottom: 14 }}>Click a person to see every choice. Green is correct. Red is the answer they chose when it was wrong.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {ranked.map((attempt) => (
                    <button key={attempt.id} className="score-btn" onClick={() => setOpenAttemptId(attempt.id)}>
                      <span className="score-name">{attempt.name}</span>
                      <span style={{ flex: 1, height: 12, background: "#E5E5E5", borderRadius: 99, overflow: "hidden" }}>
                        <span style={{ display: "block", height: "100%", width: `${attempt.percentage}%`, background: attempt.passed ? C.success : C.crimson, borderRadius: 99 }} />
                      </span>
                      <span style={{ width: 46, textAlign: "right", fontWeight: 800, color: attempt.passed ? C.success : C.crimson }}>{attempt.percentage}%</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {ranked.length > 0 && (
              <div className="insight-grid">
                <div style={{ background: C.white, borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
                  <div style={{ color: C.success, fontWeight: 800, fontSize: 14, marginBottom: 10 }}>Highest scores</div>
                  {strongest.map((attempt) => (
                    <button key={attempt.id} className="score-btn" onClick={() => setOpenAttemptId(attempt.id)}>
                      <span style={{ flex: 1, color: C.mirage, fontWeight: 700, fontSize: 14, overflowWrap: "anywhere", textAlign: "left" }}>{attempt.name}</span>
                      <span style={{ color: C.success, fontWeight: 800 }}>{attempt.percentage}%</span>
                    </button>
                  ))}
                </div>
                <div style={{ background: C.white, borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
                  <div style={{ color: C.crimson, fontWeight: 800, fontSize: 14, marginBottom: 10 }}>Lowest scores</div>
                  {weakest.map((attempt) => (
                    <button key={`low-${attempt.id}`} className="score-btn" onClick={() => setOpenAttemptId(attempt.id)}>
                      <span style={{ flex: 1, color: C.mirage, fontWeight: 700, fontSize: 14, overflowWrap: "anywhere", textAlign: "left" }}>{attempt.name}</span>
                      <span style={{ color: attempt.passed ? C.success : C.crimson, fontWeight: 800 }}>{attempt.percentage}%</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hardest.length > 0 && (
              <div style={{ background: C.white, borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)", marginBottom: 24 }}>
                <div style={{ color: C.mirage, fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Questions missed most</div>
                <div style={{ color: C.mgray, fontSize: 13, marginBottom: 14 }}>How many people missed each question.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {hardest.map((row) => (
                    <div key={row.order}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
                        <span style={{ color: C.mirage, fontSize: 13, fontWeight: 600, overflowWrap: "anywhere" }}>{row.order}. {row.text}</span>
                        <span style={{ color: C.crimson, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{row.missed}/{row.sat}</span>
                      </div>
                      <div style={{ height: 8, background: "#E5E5E5", borderRadius: 99 }}>
                        <div style={{ height: "100%", width: `${Math.round((row.missed / row.sat) * 100)}%`, background: C.crimson, borderRadius: 99 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results table */}
            <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden", marginBottom: 20 }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #F0F0F0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <div style={{ color: C.mirage, fontWeight: 700, fontSize: 16 }}>Individual Results — {data.batch}</div>
                <div style={{ color: C.mgray, fontSize: 12 }}>{data.attempts.length} submission{data.attempts.length !== 1 ? "s" : ""}</div>
              </div>
              {data.attempts.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: C.mgray }}>No submissions yet for batch {data.batch}.</div>
              ) : (
                <div>
                  <div className="table-scroll results-table">
                  <table style={{ width: "100%", minWidth: 680, borderCollapse: "collapse", fontSize: 14 }}>
                    <thead>
                      <tr style={{ background: C.mirage }}>
                        <th style={{ padding: "12px 16px", textAlign: "left", color: C.white, fontWeight: 700, width: 36 }}>#</th>
                        <th style={{ padding: "12px 16px", textAlign: "left", color: C.white, fontWeight: 700, cursor: "pointer", userSelect: "none" }} onClick={() => toggleSort("name")}>Name <SortIcon field="name" /></th>
                        <th style={{ padding: "12px 16px", textAlign: "left", color: C.lgray, fontWeight: 600, fontSize: 12 }}>Membership ID</th>
                        <th style={{ padding: "12px 16px", textAlign: "center", color: C.white, fontWeight: 700, cursor: "pointer", userSelect: "none" }} onClick={() => toggleSort("percentage")}>Score <SortIcon field="percentage" /></th>
                        <th style={{ padding: "12px 16px", textAlign: "center", color: C.white, fontWeight: 700 }}>Status</th>
                        <th style={{ padding: "12px 16px", textAlign: "left", color: C.white, fontWeight: 700, cursor: "pointer", userSelect: "none" }} onClick={() => toggleSort("submittedAt")}>Submitted <SortIcon field="submittedAt" /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleAttempts.map((a, idx) => (
                        <tr key={a.id} onClick={() => setOpenAttemptId(a.id)} style={{ background: idx % 2 === 0 ? C.bleach : C.white, borderBottom: "1px solid #F0F0F0", cursor: "pointer" }}>
                          <td style={{ padding: "12px 16px", color: C.lgray, fontSize: 13 }}>{resultPage * PAGE_SIZE + idx + 1}</td>
                          <td style={{ padding: "12px 16px", color: C.mirage, fontWeight: 600 }}>{a.name}</td>
                          <td style={{ padding: "12px 16px", color: C.mgray, fontSize: 12, fontFamily: "monospace" }}>{a.membershipId}</td>
                          <td style={{ padding: "12px 16px", textAlign: "center" }}>
                            <span style={{ fontWeight: 800, fontSize: 15, color: a.passed ? C.success : C.crimson }}>{a.percentage}%</span>
                            <div style={{ color: C.lgray, fontSize: 11 }}>{a.score}/100</div>
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "center" }}>
                            <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700, background: a.passed ? C.successL : C.crimsonL, color: a.passed ? C.success : C.crimson }}>{a.passed ? "PASSED" : "NOT YET"}</span>
                          </td>
                          <td style={{ padding: "12px 16px", color: C.mgray, fontSize: 12 }}>{fmtDate(a.submittedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                  <div className="results-cards">
                    {visibleAttempts.map((a) => (
                      <div key={a.id} onClick={() => setOpenAttemptId(a.id)} style={{ padding: "14px 16px", borderBottom: "1px solid #F0F0F0", cursor: "pointer" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ color: C.mirage, fontWeight: 700, overflowWrap: "anywhere" }}>{a.name}</div>
                            <div style={{ color: C.lgray, fontSize: 12, fontFamily: "monospace", marginTop: 2, overflowWrap: "anywhere" }}>{a.membershipId}</div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontWeight: 800, color: a.passed ? C.success : C.crimson }}>{a.percentage}%</div>
                            <div style={{ color: C.lgray, fontSize: 11 }}>{a.score} marks</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                          <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700, background: a.passed ? C.successL : C.crimsonL, color: a.passed ? C.success : C.crimson }}>{a.passed ? "PASSED" : "NOT YET"}</span>
                          <span style={{ color: C.mgray, fontSize: 12 }}>{fmtDate(a.submittedAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ padding: "0 20px 16px" }}>
                <Pager page={Math.min(resultPage, resultPages - 1)} pageCount={resultPages} onChange={setResultPage} />
              </div>
            </div>

            {/* Pending */}
            {pending.length > 0 && (
              <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden", marginBottom: 20 }}>
                <div style={{ padding: "14px 20px", background: C.sunglowL, borderBottom: `2px solid ${C.sunglow}` }}>
                  <div style={{ color: C.mirage, fontWeight: 700, fontSize: 14 }}>⏳ Not Yet Submitted ({pending.length})</div>
                </div>
                <div style={{ padding: "12px 20px" }}>
                  {visiblePending.map((person) => (
                    <div key={person.id} className="person-row" style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "8px 0", borderBottom: "1px solid #F5F5F5" }}>
                      <span style={{ color: C.mirage, fontSize: 14, overflowWrap: "anywhere" }}>{person.name}</span>
                      <span style={{ color: C.lgray, fontSize: 12, fontFamily: "monospace", flexShrink: 0 }}>{person.membershipId}</span>
                    </div>
                  ))}
                  <Pager page={Math.min(pendingPage, pendingPages - 1)} pageCount={pendingPages} onChange={setPendingPage} />
                </div>
              </div>
            )}
            </>
            )}

            {activeTab === "questions" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
                  <div style={{ color: C.mirage, fontWeight: 700, fontSize: 16 }}>
                    Questions — {data.batch} ({qList.length} total)
                  </div>
                  <button onClick={openAdd} style={{ background: C.crimson, color: C.white, border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                    + Add Question
                  </button>
                </div>
                {qLoading ? (
                  <div style={{ textAlign: "center", padding: 40, color: C.mgray }}>Loading questions…</div>
                ) : qList.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 40, color: C.mgray }}>No questions yet for this batch. Click &quot;Add Question&quot; to start.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {visibleQuestions.map((question) => (
                      <div key={question.id} className="q-card" style={{ background: C.white, borderRadius: 10, padding: "14px 18px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
                        <div style={{ background: C.crimsonL, color: C.crimson, fontWeight: 800, fontSize: 13, borderRadius: 6, padding: "4px 10px", flexShrink: 0, minWidth: 32, textAlign: "center" }}>{question.order}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: C.lgray, fontSize: 11, marginBottom: 3 }}>{question.weekLabel}</div>
                          <div style={{ color: C.mirage, fontWeight: 600, fontSize: 14, lineHeight: 1.5, marginBottom: 8, overflowWrap: "anywhere" }}>{question.text}</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {question.options.map((opt, idx) => (
                              <span key={idx} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 99, maxWidth: "100%", overflowWrap: "anywhere", background: idx === question.answerIndex ? C.successL : "#F5F5F5", color: idx === question.answerIndex ? C.success : C.mgray, fontWeight: idx === question.answerIndex ? 700 : 400, border: idx === question.answerIndex ? `1px solid ${C.success}` : "1px solid #E5E5E5" }}>
                                {String.fromCharCode(65 + idx)}. {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="q-actions" style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                          <button onClick={() => openEdit(question)} style={{ background: C.bleach, color: C.mirage, border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                          <button onClick={() => deleteQuestion(question)} style={{ background: C.crimsonL, color: C.crimson, border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                        </div>
                      </div>
                    ))}
                    <Pager page={Math.min(qPage, questionPages - 1)} pageCount={questionPages} onChange={setQPage} />
                  </div>
                )}
                {modalMode && (
                  <div className="modal-sheet" style={{ position: "fixed", inset: 0, background: "rgba(15,27,45,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
                    <div className="modal-card" style={{ background: C.white, borderRadius: 14, padding: 28, maxWidth: 580, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <div style={{ color: C.mirage, fontWeight: 800, fontSize: 18 }}>{modalMode === "add" ? "Add New Question" : "Edit Question"}</div>
                        <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.lgray, lineHeight: 1 }}>×</button>
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", color: C.mirage, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Week Label</label>
                        <input value={fWeekLabel} onChange={(e) => setFWeekLabel(e.target.value)} placeholder="e.g. Weeks 1–2 or Week 3" style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${C.lgray}`, borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", color: C.mirage, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Question *</label>
                        <textarea value={fText} onChange={(e) => setFText(e.target.value)} rows={3} placeholder="Enter the question text…" style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${C.lgray}`, borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "vertical" }} />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", color: C.mirage, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Options *</label>
                        {fOptions.map((opt, idx) => (
                          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <input type="radio" name="correctAnswer" checked={fAnswerIndex === idx} onChange={() => setFAnswerIndex(idx)} style={{ accentColor: C.success, width: 16, height: 16, flexShrink: 0 }} title="Mark as correct answer" />
                            <span style={{ background: fAnswerIndex === idx ? C.successL : "#F5F5F5", color: fAnswerIndex === idx ? C.success : C.mgray, fontWeight: 700, fontSize: 12, padding: "2px 8px", borderRadius: 4, flexShrink: 0 }}>{String.fromCharCode(65 + idx)}</span>
                            <input value={opt} onChange={(e) => { const next = [...fOptions]; next[idx] = e.target.value; setFOptions(next); }} placeholder={`Option ${String.fromCharCode(65 + idx)}`} style={{ flex: 1, minWidth: 0, padding: "8px 12px", border: `1.5px solid ${fAnswerIndex === idx ? C.success : C.lgray}`, borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
                            <button type="button" disabled={fOptions.length <= 2} onClick={() => {
                              const next = fOptions.filter((_, optionIndex) => optionIndex !== idx);
                              setFOptions(next);
                              setFAnswerIndex((current) => current === idx ? 0 : current > idx ? current - 1 : current);
                            }} style={{ background: "none", border: "none", color: fOptions.length <= 2 ? C.lgray : C.crimson, cursor: fOptions.length <= 2 ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 18, lineHeight: 1 }}>×</button>
                          </div>
                        ))}
                        <button type="button" disabled={fOptions.length >= 8} onClick={() => setFOptions((current) => [...current, ""])} style={{ marginTop: 4, background: C.bleach, color: C.mirage, border: "none", borderRadius: 7, padding: "8px 12px", fontWeight: 700, fontSize: 13, cursor: fOptions.length >= 8 ? "not-allowed" : "pointer", fontFamily: "inherit" }}>+ Add option</button>
                        <div style={{ color: C.mgray, fontSize: 12, marginTop: 8 }}>Select the radio button next to the correct answer. Use 2 to 8 options.</div>
                      </div>
                      {qError && <div style={{ color: C.crimson, fontSize: 13, marginBottom: 12 }}>⚠️ {qError}</div>}
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={closeModal} style={{ flex: 1, padding: "12px", background: "#F5F5F5", color: C.mgray, border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                        <button onClick={saveQuestion} disabled={qSaving} style={{ flex: 2, padding: "12px", background: qSaving ? C.lgray : C.crimson, color: C.white, border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: qSaving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                          {qSaving ? "Saving…" : modalMode === "add" ? "Add Question" : "Save Changes"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "participants" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
                  <div style={{ color: C.mirage, fontWeight: 700, fontSize: 16 }}>
                    Participants — {data.batch} ({participants.length})
                  </div>
                  <button onClick={() => { setPName(""); setPId(""); setPError(""); setPModal(true); }} style={{ background: C.crimson, color: C.white, border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                    + Add participant
                  </button>
                </div>
                <div style={{ background: C.white, borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden" }}>
                  {participants.length === 0 ? (
                    <div style={{ padding: 40, textAlign: "center", color: C.mgray }}>No one is on this list yet.</div>
                  ) : (
                    visibleParticipants.map((person) => (
                      <div key={person.id} className="person-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid #F5F5F5" }}>
                        <div>
                          <div style={{ color: C.mirage, fontWeight: 700, fontSize: 14 }}>{person.name}</div>
                          <div style={{ color: C.lgray, fontSize: 12, fontFamily: "monospace", marginTop: 2 }}>{person.membershipId}</div>
                        </div>
                        <button onClick={() => removeParticipant(person)} style={{ background: C.crimsonL, color: C.crimson, border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Remove</button>
                      </div>
                    ))
                  )}
                  <div style={{ padding: "0 20px 16px" }}>
                    <Pager page={Math.min(participantPage, participantPages - 1)} pageCount={participantPages} onChange={setParticipantPage} />
                  </div>
                </div>
                {pModal && (
                  <div className="modal-sheet" style={{ position: "fixed", inset: 0, background: "rgba(15,27,45,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
                    <div className="modal-card" style={{ background: C.white, borderRadius: 14, padding: 28, maxWidth: 480, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <div style={{ color: C.mirage, fontWeight: 800, fontSize: 18 }}>Add participant</div>
                        <button onClick={() => setPModal(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.lgray, lineHeight: 1 }}>×</button>
                      </div>
                      <label style={{ display: "block", color: C.mirage, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Full name *</label>
                      <input value={pName} onChange={(e) => setPName(e.target.value)} placeholder="Participant name" style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${C.lgray}`, borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 14 }} />
                      <label style={{ display: "block", color: C.mirage, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Membership ID *</label>
                      <input value={pId} onChange={(e) => setPId(e.target.value.toUpperCase())} placeholder="ELKE-YYYY-XXXX" style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${C.lgray}`, borderRadius: 7, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", letterSpacing: 1, textTransform: "uppercase" }} />
                      {pError && <div style={{ color: C.crimson, fontSize: 13, marginTop: 10 }}>⚠️ {pError}</div>}
                      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                        <button onClick={() => setPModal(false)} style={{ flex: 1, padding: "12px", background: "#F5F5F5", color: C.mgray, border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                        <button onClick={addParticipant} disabled={pSaving} style={{ flex: 2, padding: "12px", background: pSaving ? C.lgray : C.crimson, color: C.white, border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: pSaving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>{pSaving ? "Saving…" : "Add to list"}</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
      {openAttempt && (
        <div className="modal-sheet" style={{ position: "fixed", inset: 0, background: "rgba(15,27,45,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={() => setOpenAttemptId(null)}>
          <div className="modal-card review-card" onClick={(event) => event.stopPropagation()} style={{ background: C.white, borderRadius: 14, padding: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: C.mirage, fontWeight: 800, fontSize: 18, overflowWrap: "anywhere" }}>{openAttempt.name}</div>
                <div style={{ color: C.lgray, fontSize: 12, fontFamily: "monospace", marginTop: 2 }}>{openAttempt.membershipId}</div>
                <div style={{ marginTop: 8, fontWeight: 800, color: openAttempt.passed ? C.success : C.crimson }}>{openAttempt.percentage}% · {openAttempt.passed ? "Passed" : "Not yet passed"}</div>
              </div>
              <button onClick={() => setOpenAttemptId(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.lgray, lineHeight: 1 }}>×</button>
            </div>
            {openAttempt.review.length === 0 ? (
              <div style={{ color: C.mgray, fontSize: 14, lineHeight: 1.6 }}>This result has no saved question paper to review.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {openAttempt.review.map((item) => (
                  <div key={item.id}>
                    <div style={{ color: C.lgray, fontSize: 12, marginBottom: 4 }}>{item.order}. {item.weekLabel}</div>
                    <div style={{ color: C.mirage, fontWeight: 700, fontSize: 14, lineHeight: 1.5, marginBottom: 8, overflowWrap: "anywhere" }}>{item.text}</div>
                    {item.selected === null && <div style={{ color: C.crimson, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Not answered</div>}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {item.options.map((option, index) => {
                        const chosen = index === item.selected;
                        const correct = index === item.correctIndex;
                        const wrong = chosen && !correct;
                        const tone = wrong ? C.crimson : correct ? C.success : C.mgray;
                        const fill = wrong ? C.crimsonL : correct ? C.successL : "#F7F7F7";
                        const label = wrong ? "Their answer" : chosen && correct ? "Their answer · correct" : correct ? "Correct answer" : "";
                        return (
                          <div key={index} style={{ padding: "8px 12px", borderRadius: 8, fontSize: 13, lineHeight: 1.5, overflowWrap: "anywhere", background: fill, border: `1.5px solid ${wrong || correct ? tone : "#E5E5E5"}`, color: tone }}>
                            {label && <span style={{ fontWeight: 800, marginRight: 6 }}>{label}</span>}
                            {option}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function toLocalInput(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function Pager({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (page: number) => void }) {
  if (pageCount <= 1) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 16 }}>
      <button disabled={page <= 0} onClick={() => onChange(page - 1)} style={{ background: page <= 0 ? "#F5F5F5" : C.mirage, color: page <= 0 ? C.lgray : C.white, border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 700, fontSize: 13, cursor: page <= 0 ? "not-allowed" : "pointer", fontFamily: "inherit" }}>Previous</button>
      <span style={{ color: C.mgray, fontSize: 13 }}>Page {page + 1} of {pageCount}</span>
      <button disabled={page >= pageCount - 1} onClick={() => onChange(page + 1)} style={{ background: page >= pageCount - 1 ? "#F5F5F5" : C.mirage, color: page >= pageCount - 1 ? C.lgray : C.white, border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 700, fontSize: 13, cursor: page >= pageCount - 1 ? "not-allowed" : "pointer", fontFamily: "inherit" }}>Next</button>
    </div>
  );
}
