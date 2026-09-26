"use client";

import { useEffect, useState } from "react";
import {
  ALLIANCES,
  ALL_MEMBERS,
  ALLIANCE_IDS,
  SESSION_CODE,
  SESSION_LABEL,
  stake,
  type AllianceId,
} from "@/lib/fruit-games-config";
import { useFruitGame } from "../live";

const PASSCODE_KEY = "fg_host_passcode";

interface Question {
  id: string;
  order: number;
  text: string;
  mode: string;
  points: number;
  doublePoints: boolean;
  timerSeconds: number;
  isActive: boolean;
  isDone: boolean;
  options?: string[];
  answerIndex?: number | null;
  section?: string;
}

const PAGE_NOTE = "Click a card to open it larger. Ask, edit, and delete stay on the card.";

function gridPageSize(width: number) {
  if (width >= 1080) return 9;
  if (width >= 641) return 4;
  return 3;
}

export default function HostPanel() {
  const [passcode, setPasscode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(9);
  const [zoomId, setZoomId] = useState<string | null>(null);
  const [knowOpen, setKnowOpen] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);
  const [revealAsk, setRevealAsk] = useState(false);
  const [kyMember, setKyMember] = useState(ALL_MEMBERS[0].name);
  const [qModal, setQModal] = useState<Question | "new" | null>(null);
  const [qText, setQText] = useState("");
  const [qMode, setQMode] = useState("buzzer");
  const [qPoints, setQPoints] = useState(10);
  const [qTimer, setQTimer] = useState(30);
  const [qDouble, setQDouble] = useState(false);
  const [qOptions, setQOptions] = useState(["", "", "", ""]);
  const [qAnswer, setQAnswer] = useState(0);
  const [qSection, setQSection] = useState("The foundation");
  const [defaultTimer, setDefaultTimer] = useState(60);
  const [notice, setNotice] = useState("");
  const [origin, setOrigin] = useState("");
  const state = useFruitGame(authed);

  useEffect(() => {
    setOrigin(window.location.origin);
    const saved = sessionStorage.getItem(PASSCODE_KEY);
    if (saved) setPasscode(saved);
    const applySize = () => setPageSize(gridPageSize(window.innerWidth));
    applySize();
    window.addEventListener("resize", applySize);
    return () => window.removeEventListener("resize", applySize);
  }, []);

  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    fetch(`/api/fruit-games/questions?sessionCode=${SESSION_CODE}`, {
      headers: { "x-fruit-games-passcode": passcode },
    })
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        setQuestions(data.questions ?? []);
        if (typeof data.defaultTimerSeconds === "number") setDefaultTimer(data.defaultTimerSeconds);
      })
      .catch(() => {
        if (!cancelled) setQuestions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [authed, passcode]);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2400);
  }

  async function loadQuestions() {
    const response = await fetch(`/api/fruit-games/questions?sessionCode=${SESSION_CODE}`, {
      headers: { "x-fruit-games-passcode": passcode },
    });
    const data = await response.json();
    setQuestions(data.questions ?? []);
    if (typeof data.defaultTimerSeconds === "number") setDefaultTimer(data.defaultTimerSeconds);
  }

  async function call(url: string, body: object, method = "POST") {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode, ...body }),
    });
    const data = await response.json();
    if (!response.ok) flash(data.error ?? "That did not go through.");
    return response.ok;
  }

  async function handleLogin() {
    setAuthError("");
    const response = await fetch("/api/fruit-games/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode, code: SESSION_CODE, label: SESSION_LABEL }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setAuthError(data.error ?? "That passcode was refused.");
      return;
    }
    sessionStorage.setItem(PASSCODE_KEY, passcode);
    setAuthed(true);
  }

  function signOut() {
    sessionStorage.removeItem(PASSCODE_KEY);
    setAuthed(false);
    setPasscode("");
  }

  async function award(alliance: AllianceId, delta: number) {
    const ok = await call("/api/fruit-games/scores", { sessionCode: SESSION_CODE, alliance, delta });
    if (ok) flash(`${delta > 0 ? "+" : ""}${delta} for ${ALLIANCES[alliance].short}`);
  }

  async function activateQuestion(questionId: string) {
    const ok = await call("/api/fruit-games/buzzer", { action: "activate", sessionCode: SESSION_CODE, questionId });
    if (ok) {
      flash("Question is live.");
      loadQuestions();
    }
  }

  async function resetBuzzer() {
    const ok = await call("/api/fruit-games/buzzer", { action: "reset", sessionCode: SESSION_CODE });
    if (ok) flash("Buzzer reset.");
  }

  async function markDone() {
    const ok = await call("/api/fruit-games/buzzer", { action: "done", sessionCode: SESSION_CODE });
    if (ok) {
      flash("Question closed.");
      loadQuestions();
    }
  }

  async function activateHotSeat() {
    const member = ALL_MEMBERS.find((item) => item.name === kyMember);
    if (!member) return;
    const ok = await call("/api/fruit-games/know-yourself", {
      action: "activate",
      sessionCode: SESSION_CODE,
      memberName: member.name,
      alliance: member.alliance,
    });
    if (ok) flash(`${member.name} is on the hot seat.`);
  }

  async function closeHotSeat() {
    const ok = await call("/api/fruit-games/know-yourself", { action: "deactivate", sessionCode: SESSION_CODE });
    if (ok) flash("Hot seat closed.");
  }

  async function setReveal(revealMode: boolean) {
    const ok = await call("/api/fruit-games/session", { code: SESSION_CODE, revealMode }, "PATCH");
    if (ok) flash(revealMode ? "Final reveal is on the board." : "Reveal closed.");
  }

  async function saveQuestion() {
    const payload = {
      sessionCode: SESSION_CODE,
      text: qText,
      mode: qMode,
      points: qPoints,
      timerSeconds: qTimer,
      doublePoints: qDouble,
      options: qOptions,
      answerIndex: qAnswer,
      section: qSection,
      ...(qModal && qModal !== "new" ? { questionId: qModal.id } : {}),
    };
    const ok = await call(
      "/api/fruit-games/questions",
      payload,
      qModal === "new" ? "POST" : "PATCH"
    );
    if (!ok) return;
    setQModal(null);
    loadQuestions();
    flash("Question saved.");
  }

  async function deleteQuestion(id: string) {
    if (!window.confirm("Delete this question?")) return;
    const ok = await call("/api/fruit-games/questions", { sessionCode: SESSION_CODE, questionId: id }, "DELETE");
    if (ok) {
      loadQuestions();
      flash("Question deleted.");
    }
  }

  function openEditor(question?: Question) {
    const existing = question?.options?.length ? question.options : ["", ""];
    setQText(question?.text ?? "");
    setQMode(question?.mode ?? "buzzer");
    setQPoints(question?.points ?? 10);
    setQTimer(question?.timerSeconds ?? defaultTimer);
    setQDouble(question?.doublePoints ?? false);
    setQOptions(existing);
    setQAnswer(question?.answerIndex ?? 0);
    setQSection(question?.section ?? "The foundation");
    setQModal(question ?? "new");
  }

  if (!authed) {
    return (
      <div className="host-login">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleLogin();
          }}
        >
          <p>EL KRATOS EMBASSY</p>
          <h1>Fruit Games host</h1>
          <label>
            Passcode
            <input
              type={showPass ? "text" : "password"}
              value={passcode}
              onChange={(event) => {
                setPasscode(event.target.value);
                setAuthError("");
              }}
            />
          </label>
          <button type="button" onClick={() => setShowPass((value) => !value)}>
            {showPass ? "Hide passcode" : "Show passcode"}
          </button>
          {authError && <strong>{authError}</strong>}
          <button type="submit">Open host panel</button>
        </form>
        <HostStyles />
      </div>
    );
  }

  const scores = state.scores ?? { gold: 0, crimson: 0, white: 0 };
  const live = state.activeQuestion;
  const liveStake = live ? stake(live.points, live.doublePoints) : 0;
  const pageCount = Math.max(1, Math.ceil(questions.length / pageSize));
  const safePage = Math.min(pageIndex, pageCount - 1);
  const pageItems = questions.slice(safePage * pageSize, safePage * pageSize + pageSize);
  const zoomed = zoomId ? questions.find((question) => question.id === zoomId) ?? null : null;

  return (
    <div className="host">
      <header className="host-bar">
        <div>
          <h1>Host panel</h1>
          <p>{state.label ?? SESSION_LABEL}</p>
        </div>
        <div className="host-actions">
          {state.revealMode ? (
            <button onClick={() => setReveal(false)}>Close reveal</button>
          ) : (
            <button className="host-gold" onClick={() => setRevealAsk(true)}>
              Reveal final
            </button>
          )}
          <button onClick={signOut}>Sign out</button>
        </div>
      </header>
      {notice && <p className="host-notice">{notice}</p>}
      {revealAsk && (
        <div className="host-modal" onClick={() => setRevealAsk(false)}>
          <form
            className="host-ask"
            onClick={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              setRevealAsk(false);
              void setReveal(true);
            }}
          >
            <p>Final places</p>
            <h2>Show the places from the scores so far?</h2>
            <span>Skipped questions stay off the board.</span>
            <div className="host-row">
              <button type="button" onClick={() => setRevealAsk(false)}>Cancel</button>
              <button className="host-gold" type="submit">Show places</button>
            </div>
          </form>
        </div>
      )}

      <main>
        <div className="host-scores">
          {ALLIANCE_IDS.map((id) => (
            <div key={id} className="host-score" style={{ borderColor: ALLIANCES[id].color }}>
              <span style={{ color: ALLIANCES[id].color }}>{ALLIANCES[id].short}</span>
              <strong style={{ color: ALLIANCES[id].textColor }}>{scores[id] ?? 0}</strong>
              <div className="host-row">
                <button onClick={() => award(id, 5)}>+5</button>
                <button onClick={() => award(id, 10)}>+10</button>
                <button className="host-danger" onClick={() => award(id, -5)}>−5</button>
              </div>
            </div>
          ))}
        </div>

        <div className="host-floor">
            <section className="host-card is-live">
              {live ? (
                <>
                  <p className="host-kicker">{live.section} · {live.mode} · {liveStake} pts</p>
                  <h2>{live.text}</h2>
                  {state.lockedAnswer ? (
                    <p className={state.lockedAnswer.correct ? "host-hit" : "host-danger"}>
                      {state.lockedAnswer.memberName} locked {String.fromCharCode(65 + state.lockedAnswer.selectedIndex)}.{" "}
                      {state.lockedAnswer.correct ? `+${state.lockedAnswer.points} scored.` : `−${state.lockedAnswer.points} scored.`}{" "}
                      Correct is {String.fromCharCode(65 + state.lockedAnswer.answerIndex)}.
                    </p>
                  ) : state.firstBuzz ? (
                    <p className="host-hit">{state.firstBuzz.memberName} ({state.firstBuzz.alliance}) has the floor.</p>
                  ) : state.buzzerOpen ? (
                    <p className="host-hit">Buzzer is open.</p>
                  ) : (
                    <p>Listen, then award the round.</p>
                  )}
                  <div className="host-row">
                    {ALLIANCE_IDS.map((id) => (
                      <button key={id} onClick={() => award(id, liveStake)} style={{ color: ALLIANCES[id].color }}>
                        +{liveStake} {ALLIANCES[id].short}
                      </button>
                    ))}
                    {state.firstBuzz && (
                      <button className="host-danger" onClick={() => award(state.firstBuzz!.alliance as AllianceId, -liveStake)}>
                        −{liveStake} wrong
                      </button>
                    )}
                    {state.firstBuzz && <button onClick={resetBuzzer}>Reset buzzer</button>}
                    <button onClick={markDone}>Done</button>
                  </div>
                </>
              ) : (
                <>
                  <p className="host-kicker">On the floor</p>
                  <h2>Choose a question to ask.</h2>
                  <p>{PAGE_NOTE}</p>
                </>
              )}
            </section>

            <section className="host-card">
              <button type="button" className="host-fold" onClick={() => setKnowOpen((open) => !open)}>
                <span>Know Yourself</span>
                <span>{knowOpen ? "Hide" : state.knowYourselfSubject ? state.knowYourselfSubject.memberName : "Call someone"}</span>
              </button>
              {knowOpen && (
                <div className="host-fold-body">
                  {state.knowYourselfMode && state.knowYourselfSubject ? (
                    <>
                      <p className="host-hit">{state.knowYourselfSubject.memberName} · {state.knowYourselfSubject.alliance}</p>
                      {state.attestationCounts && (
                        <p>
                          {state.attestationCounts.strongly_agree} strongly agree · {state.attestationCounts.agree} agree · {state.attestationCounts.not_sure} not sure
                        </p>
                      )}
                      <div className="host-row">
                        {ALLIANCE_IDS.map((id) => (
                          <button key={id} onClick={() => award(id, 15)}>+15 {ALLIANCES[id].short}</button>
                        ))}
                        <button className="host-danger" onClick={closeHotSeat}>Close segment</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="host-row">
                        {ALL_MEMBERS.map((member) => (
                          <button key={member.name} className={kyMember === member.name ? "is-on" : ""} onClick={() => setKyMember(member.name)}>
                            {member.name}
                          </button>
                        ))}
                      </div>
                      <button className="host-gold" onClick={activateHotSeat}>Call {kyMember} to the hot seat</button>
                    </>
                  )}
                </div>
              )}
            </section>
        </div>

        <section>
            <div className="host-qhead">
              <h2>Questions</h2>
              <div className="host-timer-inline">
                <span>Timer</span>
                {[30, 60, 90, 120].map((seconds) => (
                  <button key={seconds} type="button" className={defaultTimer === seconds ? "is-on" : ""} onClick={() => setDefaultTimer(seconds)}>
                    {seconds % 60 === 0 ? `${seconds / 60}m` : `${seconds}s`}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={async () => {
                    if (!window.confirm(`Set every question to ${defaultTimer} seconds?`)) return;
                    const ok = await call("/api/fruit-games/questions", {
                      action: "apply-timer",
                      sessionCode: SESSION_CODE,
                      timerSeconds: defaultTimer,
                    });
                    if (ok) {
                      loadQuestions();
                      flash("Timer applied to every question.");
                    }
                  }}
                >
                  Apply
                </button>
              </div>
              <button className="host-gold" onClick={() => openEditor()}>Add</button>
            </div>
            <div className="host-pager">
              <button type="button" disabled={safePage === 0} onClick={() => setPageIndex(Math.max(0, safePage - 1))}>Previous</button>
              <span>{questions.length === 0 ? "0" : safePage + 1} / {pageCount}</span>
              <button type="button" disabled={safePage >= pageCount - 1} onClick={() => setPageIndex(Math.min(pageCount - 1, safePage + 1))}>Next</button>
              {live && !pageItems.some((question) => question.id === live.id) && (
                <button
                  type="button"
                  className="host-gold"
                  onClick={() => {
                    const index = questions.findIndex((question) => question.id === live.id);
                    if (index >= 0) setPageIndex(Math.floor(index / pageSize));
                  }}
                >
                  Live question
                </button>
              )}
            </div>
            <div className="host-questions">
              {pageItems.map((question) => (
                <article
                  key={question.id}
                  className={question.isActive ? "host-card host-q is-live" : "host-card host-q"}
                  onClick={() => setZoomId(question.id)}
                >
                  <p className="host-kicker">
                    {question.section || "Round"} · Q{question.order} · {question.mode} · {stake(question.points, question.doublePoints)} pts · {question.timerSeconds}s
                    {question.isDone ? " · done" : ""}
                  </p>
                  <h2>{question.text}</h2>
                  {question.options && question.options.length > 0 && (
                    <div className="host-pills">
                      {question.options.map((option, index) => (
                        <span key={`${question.id}-${index}`} className={question.answerIndex === index ? "is-key" : ""}>
                          {String.fromCharCode(65 + index)}. {option}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="host-row" onClick={(event) => event.stopPropagation()}>
                    {!question.isDone && !question.isActive && (
                      <button type="button" onClick={() => activateQuestion(question.id)}>Ask</button>
                    )}
                    {question.isActive && <span className="host-hit">Live</span>}
                    <button type="button" onClick={() => openEditor(question)}>Edit</button>
                    <button type="button" className="host-danger" onClick={() => deleteQuestion(question.id)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
        </section>

        <section className="host-card">
          <button type="button" className="host-fold" onClick={() => setLinksOpen((open) => !open)}>
            <span>Room links</span>
            <span>{linksOpen ? "Hide" : "Show"}</span>
          </button>
          {linksOpen && (
            <div className="host-fold-body">
              {[
                ["Fruit Games", "/fruit-games"],
              ].map(([label, path]) => (
                <div key={path} className="host-link">
                  <span>{label}</span>
                  <code>{origin}{path}</code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`${origin}${path}`);
                      flash("Link copied.");
                    }}
                  >
                    Copy
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="host-danger"
                onClick={async () => {
                  if (!window.confirm("Set every alliance back to 0?")) return;
                  for (const id of ALLIANCE_IDS) {
                    await call("/api/fruit-games/scores", { sessionCode: SESSION_CODE, alliance: id, setTo: 0 });
                  }
                  flash("Scores cleared.");
                }}
              >
                Reset all scores
              </button>
            </div>
          )}
        </section>
      </main>

      {zoomed && (
        <div className="host-modal" onClick={() => setZoomId(null)}>
          <div className="host-zoom" onClick={(event) => event.stopPropagation()}>
            <div className="host-scoreline">
              <p className="host-kicker">
                {zoomed.section || "Round"} · Q{zoomed.order} · {zoomed.mode} · {stake(zoomed.points, zoomed.doublePoints)} pts · {zoomed.timerSeconds}s
                {zoomed.isDone ? " · done" : ""}
              </p>
              <button type="button" onClick={() => setZoomId(null)}>Close</button>
            </div>
            <h2>{zoomed.text}</h2>
            {zoomed.options && zoomed.options.length > 0 && (
              <div className="host-pills">
                {zoomed.options.map((option, index) => (
                  <span key={`${zoomed.id}-${index}`} className={zoomed.answerIndex === index ? "is-key" : ""}>
                    {String.fromCharCode(65 + index)}. {option}
                  </span>
                ))}
              </div>
            )}
            <div className="host-row">
              {!zoomed.isDone && !zoomed.isActive && (
                <button
                  className="host-gold"
                  onClick={() => {
                    activateQuestion(zoomed.id);
                    setZoomId(null);
                  }}
                >
                  Ask
                </button>
              )}
              {zoomed.isActive && <span className="host-hit">Live</span>}
              <button
                onClick={() => {
                  const question = zoomed;
                  setZoomId(null);
                  openEditor(question);
                }}
              >
                Edit
              </button>
              <button
                className="host-danger"
                onClick={() => {
                  const id = zoomed.id;
                  setZoomId(null);
                  deleteQuestion(id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {qModal && (
        <div className="host-modal" onClick={() => setQModal(null)}>
          <form
            onClick={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              saveQuestion();
            }}
          >
            <div className="host-scoreline">
              <h2>{qModal === "new" ? "Add question" : "Edit question"}</h2>
              <button type="button" onClick={() => setQModal(null)}>Close</button>
            </div>
            <label>
              Section
              <input value={qSection} onChange={(event) => setQSection(event.target.value)} placeholder="The foundation" />
            </label>
            <label>
              Question
              <textarea value={qText} onChange={(event) => setQText(event.target.value)} rows={3} />
            </label>
            <div className="host-split">
              <label>
                Mode
                <select value={qMode} onChange={(event) => setQMode(event.target.value)}>
                  <option value="buzzer">Buzzer</option>
                  <option value="open">Open</option>
                  <option value="food">Food</option>
                </select>
              </label>
              <label>
                Points
                <input type="number" min={1} max={100} value={qPoints} onChange={(event) => setQPoints(Number(event.target.value))} />
              </label>
              <label>
                This question, seconds
                <input type="number" min={5} max={180} value={qTimer} onChange={(event) => setQTimer(Number(event.target.value))} />
              </label>
            </div>
            <label className="host-check">
              <input type="checkbox" checked={qDouble} onChange={(event) => setQDouble(event.target.checked)} />
              Double points
            </label>
            {qMode === "buzzer" && (
              <div>
                <p className="host-kicker">Choices</p>
                {qOptions.map((option, index) => (
                  <div key={index} className="host-option">
                    <input
                      type="radio"
                      name="correct-choice"
                      checked={qAnswer === index}
                      onChange={() => setQAnswer(index)}
                    />
                    <span>{String.fromCharCode(65 + index)}</span>
                    <input
                      value={option}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      onChange={(event) => {
                        const next = [...qOptions];
                        next[index] = event.target.value;
                        setQOptions(next);
                      }}
                    />
                    <button
                      type="button"
                      disabled={qOptions.length <= 2}
                      onClick={() => {
                        const next = qOptions.filter((_, optionIndex) => optionIndex !== index);
                        setQOptions(next);
                        setQAnswer((current) => (current === index ? 0 : current > index ? current - 1 : current));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  disabled={qOptions.length >= 4}
                  onClick={() => setQOptions((current) => [...current, ""])}
                >
                  Add option
                </button>
                <p>Select the radio beside the correct answer.</p>
              </div>
            )}
            <button className="host-gold" type="submit">Save question</button>
          </form>
        </div>
      )}
      <HostStyles />
    </div>
  );
}

function HostStyles() {
  return (
    <style>{`
      .host, .host-login { min-height: 100vh; background: #0f1b2d; color: #fff; }
      .host-login { display: grid; place-items: center; padding: 24px; }
      .host-login form, .host-modal form {
        width: min(420px, 100%); background: #1a2535; border-radius: 18px; padding: 24px;
        display: flex; flex-direction: column; gap: 12px; position: relative;
      }
      .host-login p { margin: 0; color: #db154c; letter-spacing: 0.16em; font-size: 12px; font-weight: 800; }
      .host h1, .host-login h1, .host h2 { margin: 0; }
      .host-bar, .host main, .host nav { padding-left: 16px; padding-right: 16px; }
      .host-bar { display: flex; justify-content: space-between; gap: 12px; align-items: center; padding-top: 16px; }
      .host-bar p, .host-card p { color: #9fa4ab; }
      .host-actions, .host-row, .host nav { display: flex; flex-wrap: wrap; gap: 8px; }
      .host nav { margin-top: 12px; }
      .host main { max-width: 1280px; margin: 0 auto; padding-top: 16px; padding-bottom: 40px; display: flex; flex-direction: column; gap: 16px; }
      .host-scores { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
      .host-score { background: #1a2535; border: 1px solid; border-radius: 14px; padding: 12px; }
      .host-score strong { display: block; font-size: 28px; line-height: 1.1; margin: 4px 0 8px; }
      .host-floor { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr); gap: 16px; align-items: start; }
      .host-qhead { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
      .host-timer-inline { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
      .host-timer-inline span { color: #9fa4ab; font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
      .host-timer-inline button { padding: 6px 10px; }
      .host-questions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 12px; }
      .host-q { display: flex; flex-direction: column; align-items: stretch; gap: 8px; min-width: 0; height: 100%; text-align: left; cursor: pointer; }
      .host-q h2 { font-size: 16px; line-height: 1.35; font-weight: 700; }
      .host-q .host-row { margin-top: auto; }
      .host-fold { width: 100%; display: flex; justify-content: space-between; background: transparent !important; color: #fff !important; padding: 0 !important; }
      .host-fold-body { margin-top: 12px; animation: host-rise 0.28s ease; }
      .host-pager { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin: 12px 0; color: #c5cad1; }
      .host button:disabled { opacity: 0.35; cursor: not-allowed; }
      .host button, .host-login button {
        border: 0; border-radius: 8px; background: #243044; color: #fff; font: inherit; font-weight: 700;
        padding: 8px 12px; cursor: pointer;
      }
      .host button.is-on, .host nav button.is-on { background: #db154c; }
      .host-gold { background: #ffcc29 !important; color: #0f1b2d !important; }
      .host-danger { color: #ff8aa3 !important; }
      .host-card { background: #1a2535; border: 1px solid #2a3545; border-radius: 14px; padding: 14px; }
      .host-card.is-live { border-color: #4ade80; }
      .host-kicker { font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
      .host-hit { color: #4ade80 !important; font-weight: 800; }
      .host-choices { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
      .host-choices p { margin: 0; }
      .host-scoreline { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
      .host-scoreline strong { font-size: 32px; }
      .host-notice { margin: 12px 16px 0; background: #14532d; color: #bbf7d0; border-radius: 8px; padding: 8px 12px; font-weight: 700; }
      .host-link { display: grid; gap: 4px; margin: 10px 0; }
      .host-link code { color: #d6d6d6; word-break: break-all; }
      .host-section { margin: 18px 0 8px; color: #ffcc29; font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; }
      .host-card { transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; }
      @media (hover: hover) {
        .host-q:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,0.28); }
      }
      .host-pills { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0; }
      .host-pills span { border: 1px solid #2a3545; border-radius: 99px; padding: 4px 10px; color: #c5cad1; font-size: 12px; }
      .host-pills span.is-key { border-color: #4ade80; color: #4ade80; background: rgba(74,222,128,0.12); }
      .host-inline { flex-direction: row !important; align-items: center; gap: 8px; }
      .host-inline input { width: 88px; }
      .host-split { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
      .host-option { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
      .host-option input[type="radio"] { width: auto; accent-color: #4ade80; }
      .host-option span { width: 26px; text-align: center; font-weight: 800; color: #ffcc29; }
      .host-option input[type="text"], .host-option input:not([type="radio"]) { flex: 1; }
      .host-modal {
        position: fixed; inset: 0; z-index: 20; background: rgba(0,0,0,0.62);
        display: flex; justify-content: center; align-items: flex-start;
        overflow-y: auto; overscroll-behavior: contain; padding: 24px 16px;
      }
      .host-modal form, .host-zoom {
        width: min(560px, 100%); max-height: none; margin: auto;
        animation: host-rise 0.28s ease;
      }
      .host-zoom {
        width: min(680px, 100%); background: #1a2535; border-radius: 18px; padding: 24px;
        display: flex; flex-direction: column; gap: 14px;
        animation: host-zoom 0.28s ease;
      }
      .host-zoom h2 { font-size: clamp(22px, 3vw, 32px); line-height: 1.25; }
      .host-ask { width: min(440px, 100%); }
      .host-ask p { margin: 0; color: #ffcc29; letter-spacing: 0.16em; font-size: 12px; font-weight: 800; text-transform: uppercase; }
      .host-ask h2 { font-size: 26px; line-height: 1.25; }
      .host-ask span { color: #c5cad1; line-height: 1.4; }
      .host-ask .host-row { justify-content: flex-end; margin-top: 6px; }
      @keyframes host-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
      @keyframes host-zoom { from { opacity: 0; transform: translateY(18px) scale(0.96); } to { opacity: 1; transform: none; } }
      @media (max-width: 1079px) {
        .host-questions { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 860px) {
        .host-split, .host-floor, .host-scores { grid-template-columns: 1fr; }
      }
      @media (max-width: 640px) {
        .host-questions { grid-template-columns: 1fr; }
      }
      .host label, .host-login label { display: flex; flex-direction: column; gap: 6px; color: #c5cad1; font-size: 13px; font-weight: 700; }
      .host input, .host textarea, .host select, .host-login input {
        width: 100%; box-sizing: border-box; border-radius: 8px; border: 1px solid #2a3545;
        background: #0f1b2d; color: #fff; padding: 10px 12px; font: inherit;
      }
      .host-check { flex-direction: row !important; align-items: center; }
      .host-check input { width: auto; }
      .host-login strong { color: #ff8aa3; }
      .host-eye { position: absolute; right: 36px; top: 118px; background: transparent !important; }
      .host-login button[type="submit"] { background: #db154c; padding: 12px; }
    `}</style>
  );
}
