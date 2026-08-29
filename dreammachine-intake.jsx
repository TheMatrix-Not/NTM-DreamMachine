import React, { useState, useMemo } from "react";

/* ============ NTM DREAMMACHINE — CONTRIBUTOR INTAKE v1.1 ============ */
const T = {
  bg: "#EEF1F1", ink: "#101D26", sub: "#4C5B64", line: "#C9D2D4",
  blue: "#1E5C97", blueDeep: "#123A61", orange: "#E8570F",
  red: "#B3261E", green: "#1F7A4D", card: "#FFFFFF",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap');
* { box-sizing: border-box; } body { margin: 0; }
.ci-root { background: ${T.bg}; min-height: 100vh; color: ${T.ink}; font-family: 'Archivo', system-ui, sans-serif; }
.ci-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
.ci-opt { display: block; width: 100%; text-align: left; background: #fff; border: 1.5px solid ${T.line};
  border-radius: 6px; padding: 11px 14px; font-size: 14px; font-family: inherit; cursor: pointer; margin-bottom: 8px; color: ${T.ink}; }
.ci-opt:hover { border-color: ${T.blue}; }
.ci-opt.sel { border-color: ${T.orange}; border-width: 2px; background: #FFF3EC; font-weight: 700; }
.ci-opt:focus-visible { outline: 3px solid ${T.orange}; outline-offset: 2px; }
.ci-btn { cursor: pointer; border: none; border-radius: 6px; font-family: 'Archivo', sans-serif; font-weight: 700; }
.ci-btn:disabled { cursor: not-allowed; }
.stamp { display: inline-block; transform: rotate(-1.5deg); border: 2px solid currentColor; border-radius: 4px;
  padding: 2px 8px; font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 11px;
  letter-spacing: 0.08em; text-transform: uppercase; }
.ci-input { width: 100%; border: 1.5px solid ${T.line}; border-radius: 6px; padding: 10px 12px; font-size: 15px; font-family: inherit; }
.ci-input:focus { outline: 2px solid ${T.blue}; border-color: ${T.blue}; }
.ci-tab { background: transparent; border: none; padding: 10px 4px; margin-right: 18px; font-family: inherit;
  font-weight: 700; font-size: 14px; color: ${T.sub}; cursor: pointer; border-bottom: 3px solid transparent; }
.ci-tab.on { color: ${T.ink}; border-bottom-color: ${T.orange}; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;

const ROLES = {
  proposer: { name: "Proposer", desc: "Initiates ideas and turns problems into pitches" },
  architect: { name: "Architect", desc: "Structures work — sequencing, milestones, dependencies" },
  builder: { name: "Builder", desc: "Hands-on execution; makes and ships the thing" },
  operator: { name: "Operator", desc: "Keeps things running — routines, upkeep, systems" },
  maintainer: { name: "Maintainer", desc: "Diagnoses and fixes what breaks" },
  steward: { name: "Steward", desc: "Coordinates people, unblocks work, brokers alignment" },
  evangelist: { name: "Evangelist", desc: "Outreach, storytelling, the public voice" },
  delegate: { name: "Delegate", desc: "Reviews quality, reads the fine print, governs standards" },
  treasurer: { name: "Treasurer", desc: "Budgets, records, and resource-raising" },
};

const AGREE = ["Strongly disagree", "Disagree", "Agree", "Strongly agree"];
const FREQ = ["Never", "Rarely", "Sometimes", "Often"];

const Q = [
  { d: "proposer", t: "A blank whiteboard energizes me more than a checklist.", o: AGREE },
  { d: "proposer", t: "In the last year, how often did you pitch a new idea to a group?", o: ["Never", "Once or twice", "A few times", "Constantly"] },
  { d: "proposer", t: "When a community problem comes up, my first instinct is to…", o: ["Wait for someone to take charge", "Talk it over with others", "Sketch a possible fix", "Pitch a full proposal"] },
  { d: "proposer", t: "I can turn a vague complaint into a concrete proposal.", o: AGREE },
  { d: "proposer", t: "At a kickoff meeting, I'm usually the one…", o: ["Listening quietly", "Asking clarifying questions", "Refining others' ideas", "Presenting my own idea"] },
  { d: "architect", t: "Before starting anything big, I naturally break it into ordered steps.", o: AGREE },
  { d: "architect", t: "People come to me to figure out what needs to happen first.", o: FREQ },
  { d: "architect", t: "Handed a 6-month project, the first thing I'd build is…", o: ["I'd just start doing tasks", "A rough to-do list", "A timeline with milestones", "A full plan with owners and dependencies"] },
  { d: "architect", t: "I'm comfortable estimating how long work will actually take.", o: AGREE },
  { d: "architect", t: "When a plan changes mid-project, I…", o: ["Get thrown off", "Wait for new instructions", "Adjust my own part", "Re-sequence the whole plan"] },
  { d: "builder", t: "I'd rather make the thing than talk about the thing.", o: AGREE },
  { d: "builder", t: "How often do you personally finish hands-on tasks (build, write, make, install)?", o: FREQ },
  { d: "builder", t: "My favorite kind of workday is…", o: ["Meetings and alignment", "Reviewing others' work", "Responding to whatever comes up", "Deep solo work producing something"] },
  { d: "builder", t: "I ship work even when it's not perfect yet.", o: AGREE },
  { d: "builder", t: "When I'm assigned a task with a clear deliverable, I…", o: ["Often stall out", "Need reminders to finish", "Deliver on time", "Deliver early, sometimes with extras"] },
  { d: "operator", t: "I enjoy recurring routines more than one-off sprints.", o: AGREE },
  { d: "operator", t: "Systems I'm responsible for (schedules, finances, tools) stay tidy over time.", o: AGREE },
  { d: "operator", t: "A weekly checklist for a community program sounds…", o: ["Draining", "Tolerable", "Fine", "Genuinely satisfying"] },
  { d: "operator", t: "How reliable are you at repetitive upkeep — reports, inventory, maintenance?", o: ["It slips constantly", "Hit or miss", "Mostly consistent", "Clockwork"] },
  { d: "operator", t: "After launch day, I'm the person who…", o: ["Moves on to the next idea", "Helps if asked", "Keeps it running", "Writes the run-book so anyone can run it"] },
  { d: "maintainer", t: "When something breaks, I get curious instead of stressed.", o: AGREE },
  { d: "maintainer", t: "People call me when a process, tool, or machine stops working.", o: FREQ },
  { d: "maintainer", t: "Facing an unfamiliar breakdown, I…", o: ["Escalate it immediately", "Find whoever knows more", "Tinker until something works", "Diagnose systematically, then fix"] },
  { d: "maintainer", t: "I stay calm and useful during a live failure — event chaos, an outage, a no-show.", o: AGREE },
  { d: "maintainer", t: "Root causes matter more to me than quick patches.", o: AGREE },
  { d: "steward", t: "I notice when someone is blocked before they say it.", o: AGREE },
  { d: "steward", t: "Running a productive meeting is a skill I actually have.", o: AGREE },
  { d: "steward", t: "Two teammates disagree and work stalls. I…", o: ["Stay out of it", "Flag it to whoever's in charge", "Talk to each one privately", "Get them together and broker a resolution"] },
  { d: "steward", t: "How often do people ask you to organize the group thing?", o: FREQ },
  { d: "steward", t: "Keeping many people moving on one schedule sounds…", o: ["Exhausting", "Hard but doable", "Comfortable", "Like my natural role"] },
  { d: "evangelist", t: "Writing an update people actually read is easy for me.", o: AGREE },
  { d: "evangelist", t: "I'm comfortable being the public voice — posts, emails, the microphone.", o: AGREE },
  { d: "evangelist", t: "A project needs 200 people to hear about it. I…", o: ["Hope someone shares it", "Tell my close circle", "Draft the announcement", "Build and run the whole outreach push"] },
  { d: "evangelist", t: "How often do others reuse or forward things you've written?", o: FREQ },
  { d: "evangelist", t: "Explaining complex things simply is one of my strengths.", o: AGREE },
  { d: "delegate", t: "I give feedback that's honest and still lands well.", o: AGREE },
  { d: "delegate", t: "I read the details others skim — contracts, budgets, fine print.", o: AGREE },
  { d: "delegate", t: "A proposal comes up for a community vote. I…", o: ["Vote with the crowd", "Skim it and vote", "Read it fully, then vote", "Read it fully and share my reasoning"] },
  { d: "delegate", t: "Spotting errors in other people's work comes naturally to me.", o: AGREE },
  { d: "delegate", t: "Standards and checklists exist to be…", o: ["Ignored when inconvenient", "Loosely followed", "Followed", "Improved and enforced"] },
  { d: "treasurer", t: "I'm comfortable making and tracking a budget.", o: AGREE },
  { d: "treasurer", t: "Asking people for money or resources — sponsors, dues, donations — is…", o: ["Off the table for me", "Uncomfortable", "Doable", "A genuine strength"] },
  { d: "treasurer", t: "My record-keeping (receipts, logs, spreadsheets) is…", o: ["Nonexistent", "Scattered", "Decent", "Audit-ready"] },
  { d: "treasurer", t: "Finding the cheapest good option is a game I enjoy.", o: AGREE },
  { d: "treasurer", t: "If the project suddenly needed $5,000, my first move would be…", o: ["Not my area", "Suggest cutting scope", "List the funding options", "Build the sponsor pitch and go ask"] },
  { d: "reliability", t: "When I say I'll do something, it gets done without follow-up.", o: AGREE },
  { d: "reliability", t: "In the past 6 months, how many commitments have you dropped?", o: ["Several", "A couple", "One", "None"] },
  { d: "reliability", t: "Being named the single accountable owner of a task makes me feel…", o: ["Trapped", "Nervous", "Fine", "Motivated"] },
  { d: "reliability", t: "If I'm going to miss a deadline, I…", o: ["Tend to go quiet", "Explain afterward", "Say so at the deadline", "Flag it early with a new plan"] },
  { d: "reliability", t: "My calendar and commitments are…", o: ["Chaotic", "Often overbooked", "Mostly managed", "Tightly managed"] },
];

function interleavedOrder() {
  const byDim = {};
  Q.forEach((q, i) => { (byDim[q.d] = byDim[q.d] || []).push(i); });
  const dims = Object.keys(byDim);
  const order = [];
  for (let round = 0; round < 5; round++) dims.forEach((d) => order.push(byDim[d][round]));
  return order;
}

const PAGE_SIZE = 10;
const slug = (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function DreamMachineIntake() {
  const order = useMemo(interleavedOrder, []);
  const [tab, setTab] = useState("intake"); // intake | roster
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [page, setPage] = useState(0);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | failed
  const [roster, setRoster] = useState(null);
  const [rosterErr, setRosterErr] = useState("");

  const totalPages = Math.ceil(order.length / PAGE_SIZE);
  const pageQs = order.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const answeredOnPage = pageQs.every((qi) => answers[qi] !== undefined);
  const answeredTotal = Object.keys(answers).length;

  const scores = useMemo(() => {
    const s = {};
    Q.forEach((q, i) => { s[q.d] = s[q.d] || 0; if (answers[i] !== undefined) s[q.d] += answers[i]; });
    return s;
  }, [answers]);

  const ranked = useMemo(
    () => Object.keys(ROLES).map((d) => ({ d, pct: Math.round((scores[d] / 15) * 100) })).sort((a, b) => b.pct - a.pct),
    [scores]
  );
  const reliability = Math.round(((scores.reliability || 0) / 15) * 100);
  const top3 = ranked.slice(0, 3);
  const bottom2 = ranked.slice(-2);

  const saveProfile = async () => {
    setSaveState("saving");
    const profile = {
      name: name.trim(),
      ts: new Date().toISOString(),
      reliability,
      roles: Object.fromEntries(ranked.map((r) => [r.d, r.pct])),
      top: top3.map((r) => r.d),
      away: bottom2.map((r) => r.d),
    };
    try {
      const res = await window.storage.set(`profiles:${slug(name)}`, JSON.stringify(profile), true);
      setSaveState(res ? "saved" : "failed");
    } catch {
      setSaveState("failed");
    }
  };

  const finish = async () => { setDone(true); await saveProfile(); };

  const loadRoster = async () => {
    setRoster(null); setRosterErr("");
    try {
      const listed = await window.storage.list("profiles:", true);
      const keys = (listed && listed.keys) || [];
      const out = [];
      for (const k of keys) {
        try {
          const r = await window.storage.get(k, true);
          if (r && r.value) out.push(JSON.parse(r.value));
        } catch { /* skip unreadable entry */ }
      }
      out.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      setRoster(out);
    } catch {
      setRosterErr("Couldn't load the group roster. Try again in a moment.");
      setRoster([]);
    }
  };

  const rosterEntry = () => {
    const lines = ranked.map((r) => `${ROLES[r.d].name}: ${r.pct}%`).join(" | ");
    return `## Contributor Profile — ${name || "Unnamed"}\n- **Core roles:** ${top3.map((r) => ROLES[r.d].name).join(", ")}\n- **Assign away from:** ${bottom2.map((r) => ROLES[r.d].name).join(", ")}\n- **Reliability index:** ${reliability}%\n- **Full scores:** ${lines}`;
  };

  const rosterMarkdown = () => {
    if (!roster || !roster.length) return "";
    let md = `# NTM DreamMachine — Group Roster\n\n| Name | Core roles | Assign away | Reliability |\n|---|---|---|---|\n`;
    roster.forEach((p) => {
      md += `| ${p.name} | ${(p.top || []).map((d) => ROLES[d]?.name).join(", ")} | ${(p.away || []).map((d) => ROLES[d]?.name).join(", ")} | ${p.reliability}% |\n`;
    });
    return md;
  };

  const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* manual select */ }
  };

  const relColor = reliability >= 75 ? T.green : reliability >= 50 ? T.orange : T.red;

  return (
    <div className="ci-root">
      <style>{css}</style>

      <header style={{ background: T.blueDeep, color: "#fff", padding: "26px 24px 14px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div className="ci-mono" style={{ fontSize: 11, letterSpacing: "0.16em", color: "#9FC1E0", textTransform: "uppercase" }}>
            NTM DreamMachine · Contributor Intake v1.1
          </div>
          <h1 style={{ margin: "8px 0 6px", fontSize: 28, fontWeight: 800 }}>Find your role. Build the dream.</h1>
          <p style={{ margin: 0, color: "#C6D6E4", fontSize: 14, maxWidth: 540 }}>
            50 questions, ~8 minutes. Your finished profile joins the group roster — visible to everyone in this pilot — so the machine can assign real roles from real signal.
          </p>
          <nav style={{ marginTop: 16 }}>
            <button className={`ci-tab${tab === "intake" ? " on" : ""}`} style={{ color: tab === "intake" ? "#fff" : "#9FC1E0" }} onClick={() => setTab("intake")}>Take the intake</button>
            <button className={`ci-tab${tab === "roster" ? " on" : ""}`} style={{ color: tab === "roster" ? "#fff" : "#9FC1E0" }} onClick={() => { setTab("roster"); loadRoster(); }}>Group roster</button>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 24px 64px" }}>
        {/* ================= ROSTER TAB ================= */}
        {tab === "roster" && (
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
              <div className="ci-mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: T.blue }}>
                Everyone in this pilot
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="ci-btn" onClick={loadRoster} style={{ background: "transparent", color: T.blue, border: `1.5px solid ${T.blue}`, padding: "8px 14px", fontSize: 13 }}>Refresh</button>
                {roster && roster.length > 0 && (
                  <button className="ci-btn" onClick={() => copyText(rosterMarkdown())} style={{ background: T.blueDeep, color: "#fff", padding: "8px 14px", fontSize: 13 }}>
                    {copied ? "Copied ✓" : "Copy roster"}
                  </button>
                )}
              </div>
            </div>

            {rosterErr && <div role="alert" style={{ background: "#FBEAE9", border: `1.5px solid ${T.red}`, borderRadius: 8, padding: 14, color: T.red, fontSize: 14, marginBottom: 14 }}>{rosterErr}</div>}
            {roster === null && !rosterErr && <div style={{ color: T.sub, fontSize: 14 }}>Loading roster…</div>}
            {roster && roster.length === 0 && !rosterErr && (
              <div style={{ background: T.card, border: `1.5px dashed ${T.line}`, borderRadius: 10, padding: 24, textAlign: "center", color: T.sub, fontSize: 14 }}>
                No profiles yet. Be the first — take the intake.
              </div>
            )}

            {roster && roster.map((p, i) => (
              <div key={i} style={{ background: T.card, border: `1.5px solid ${T.line}`, borderLeft: `4px solid ${T.orange}`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <strong style={{ fontSize: 16 }}>{p.name}</strong>
                  <span className="stamp" style={{ color: p.reliability >= 75 ? T.green : p.reliability >= 50 ? T.orange : T.red }}>
                    Reliability {p.reliability}%
                  </span>
                </div>
                <div style={{ fontSize: 14, marginTop: 8 }}>
                  <strong>Core:</strong> {(p.top || []).map((d) => ROLES[d]?.name).join(", ")}
                </div>
                <div style={{ fontSize: 13, color: T.sub, marginTop: 4 }}>
                  Assign away: {(p.away || []).map((d) => ROLES[d]?.name).join(", ")}
                </div>
                <div className="ci-mono" style={{ fontSize: 11, color: T.sub, marginTop: 8 }}>
                  {Object.entries(p.roles || {}).sort((a, b) => b[1] - a[1]).map(([d, v]) => `${ROLES[d]?.name} ${v}%`).join(" · ")}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ================= INTAKE TAB ================= */}
        {tab === "intake" && !started && (
          <section style={{ background: T.card, border: `1.5px solid ${T.line}`, borderRadius: 10, padding: 22 }}>
            <label htmlFor="ci-name" style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Your name</label>
            <input id="ci-name" className="ci-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="First and last" />
            <div style={{ fontSize: 13, color: T.sub, margin: "14px 0 6px", lineHeight: 1.6 }}>
              This maps you to nine contributor roles every community-run project needs, plus a Reliability Index. Same trait, different angles — answer each question fresh.
            </div>
            <div style={{ fontSize: 13, background: "#FFF3EC", border: `1.5px solid ${T.orange}`, borderRadius: 8, padding: "10px 12px", margin: "10px 0 18px", lineHeight: 1.6 }}>
              <strong>Heads up:</strong> your finished profile is saved to the shared group roster, visible to everyone using this pilot. Retaking it under the same name replaces your old profile.
            </div>
            <button className="ci-btn" disabled={!name.trim()} onClick={() => setStarted(true)}
              style={{ background: name.trim() ? T.orange : T.line, color: name.trim() ? "#fff" : T.sub, padding: "12px 24px", fontSize: 15 }}>
              Start the intake
            </button>
          </section>
        )}

        {tab === "intake" && started && !done && (
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span className="ci-mono" style={{ fontSize: 12, color: T.sub }}>Page {page + 1} of {totalPages}</span>
              <span className="ci-mono" style={{ fontSize: 12, color: T.sub }}>{answeredTotal}/50 answered</span>
            </div>
            <div aria-hidden style={{ height: 6, background: T.line, borderRadius: 3, marginBottom: 20 }}>
              <div style={{ height: 6, width: `${(answeredTotal / 50) * 100}%`, background: T.orange, borderRadius: 3, transition: "width 0.2s" }} />
            </div>

            {pageQs.map((qi, n) => {
              const q = Q[qi];
              return (
                <fieldset key={qi} style={{ border: `1.5px solid ${T.line}`, borderRadius: 10, background: T.card, padding: 18, marginBottom: 14 }}>
                  <legend className="ci-mono" style={{ fontSize: 11, color: T.blue, fontWeight: 600, padding: "0 6px" }}>Q{page * PAGE_SIZE + n + 1}</legend>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>{q.t}</div>
                  {q.o.map((opt, oi) => (
                    <button key={oi} className={`ci-opt${answers[qi] === oi ? " sel" : ""}`}
                      onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))} aria-pressed={answers[qi] === oi}>
                      {opt}
                    </button>
                  ))}
                </fieldset>
              );
            })}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <button className="ci-btn" onClick={() => { setPage((p) => p - 1); window.scrollTo(0, 0); }} disabled={page === 0}
                style={{ background: "transparent", color: page === 0 ? T.line : T.blue, border: `1.5px solid ${page === 0 ? T.line : T.blue}`, padding: "11px 20px", fontSize: 14 }}>
                Back
              </button>
              {page < totalPages - 1 ? (
                <button className="ci-btn" onClick={() => { setPage((p) => p + 1); window.scrollTo(0, 0); }} disabled={!answeredOnPage}
                  style={{ background: answeredOnPage ? T.blueDeep : T.line, color: answeredOnPage ? "#fff" : T.sub, padding: "11px 24px", fontSize: 14 }}>
                  Next page
                </button>
              ) : (
                <button className="ci-btn" onClick={finish} disabled={answeredTotal < 50}
                  style={{ background: answeredTotal === 50 ? T.orange : T.line, color: answeredTotal === 50 ? "#fff" : T.sub, padding: "11px 24px", fontSize: 14 }}>
                  Finish & join the roster
                </button>
              )}
            </div>
          </section>
        )}

        {tab === "intake" && done && (
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
              <div>
                <div className="ci-mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: T.green, marginBottom: 6 }}>Contributor profile</div>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{name}</h2>
              </div>
              <button className="ci-btn" onClick={() => copyText(rosterEntry())} style={{ background: T.blueDeep, color: "#fff", padding: "10px 16px", fontSize: 13 }}>
                {copied ? "Copied ✓" : "Copy profile"}
              </button>
            </div>

            {/* Save status */}
            <div style={{ marginBottom: 16, fontSize: 13 }} role="status">
              {saveState === "saving" && <span style={{ color: T.sub }}>Saving to group roster…</span>}
              {saveState === "saved" && <span style={{ color: T.green, fontWeight: 700 }}>✓ Saved to the group roster</span>}
              {saveState === "failed" && (
                <span style={{ color: T.red }}>
                  Couldn't save to the roster.{" "}
                  <button className="ci-btn" onClick={saveProfile} style={{ background: "transparent", color: T.red, textDecoration: "underline", padding: 0, fontSize: 13 }}>Retry</button>
                </span>
              )}
            </div>

            <div style={{ background: T.card, border: `1.5px solid ${T.line}`, borderLeft: `4px solid ${T.orange}`, borderRadius: 10, padding: 18, marginBottom: 14 }}>
              <span className="stamp" style={{ color: T.orange }}>Core roles</span>
              {top3.map((r) => (
                <div key={r.d} style={{ marginTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
                    <strong>{ROLES[r.d].name}</strong>
                    <span className="ci-mono" style={{ fontSize: 13 }}>{r.pct}%</span>
                  </div>
                  <div style={{ fontSize: 13, color: T.sub }}>{ROLES[r.d].desc}</div>
                </div>
              ))}
            </div>

            <div style={{ background: T.card, border: `1.5px solid ${T.line}`, borderRadius: 10, padding: 18, marginBottom: 14 }}>
              <div className="ci-mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: T.blue, marginBottom: 12 }}>All nine roles</div>
              {ranked.map((r) => (
                <div key={r.d} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
                    <span style={{ fontWeight: 600 }}>{ROLES[r.d].name}</span>
                    <span className="ci-mono">{r.pct}%</span>
                  </div>
                  <div style={{ height: 8, background: T.bg, borderRadius: 4 }}>
                    <div style={{ height: 8, width: `${r.pct}%`, background: top3.some((x) => x.d === r.d) ? T.orange : T.blue, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 260px", background: "#FBEAE9", border: `1.5px solid ${T.red}`, borderRadius: 10, padding: 18 }}>
                <span className="stamp" style={{ color: T.red }}>Assign away</span>
                <div style={{ fontSize: 14, marginTop: 10 }}>{bottom2.map((r) => ROLES[r.d].name).join(" · ")}</div>
                <div style={{ fontSize: 12, color: T.sub, marginTop: 6 }}>Tasks needing these roles should go to someone else — that's the system working.</div>
              </div>
              <div style={{ flex: "1 1 260px", background: T.card, border: `1.5px solid ${T.line}`, borderRadius: 10, padding: 18 }}>
                <span className="stamp" style={{ color: relColor }}>Reliability index</span>
                <div style={{ fontSize: 34, fontWeight: 800, color: relColor, marginTop: 8 }}>{reliability}%</div>
                <div style={{ fontSize: 12, color: T.sub, marginTop: 4 }}>How much single-owner accountability this contributor can carry right now.</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button className="ci-btn" onClick={() => { setTab("roster"); loadRoster(); }}
                style={{ background: T.orange, color: "#fff", padding: "10px 18px", fontSize: 13 }}>
                See the group roster
              </button>
              <button className="ci-btn" onClick={() => { setDone(false); setPage(0); setAnswers({}); setStarted(false); setName(""); setSaveState("idle"); }}
                style={{ background: "transparent", color: T.blue, border: `1.5px solid ${T.blue}`, padding: "10px 18px", fontSize: 13 }}>
                New intake
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
