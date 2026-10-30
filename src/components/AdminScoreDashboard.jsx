import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle, ArrowRight, Bell, Check, CheckCircle2, Clock3,
  ExternalLink, FileSearch, RefreshCw, Search, ShieldCheck, Trophy, X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { calculateTeamRecords, dashboardGames, todayEastern } from "../dashboardUtils";
import "./AdminScoreDashboard.css";

const PANELS = [
  { id: "missing", label: "Missing scores" },
  { id: "finals", label: "Finals" },
  { id: "reviews", label: "Review queue" },
  { id: "records", label: "Records" },
  { id: "push", label: "Push history" },
];

function displayDate(value) {
  if (!value) return "Date TBD";
  const date = new Date(value + "T12:00:00");
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function GameCard({ game, final = false, onFlag, onOpen }) {
  return (
    <article className="scoreAdminGame">
      <div className="scoreAdminGameTop">
        <span className="scoreAdminMeta">{displayDate(game.date)} · {game.division || "Varsity"}</span>
        <span className={"scoreAdminPill " + (final ? "confirmed" : "missing")}>
          {final ? "Final recorded" : "Needs result"}
        </span>
      </div>
      <div className="scoreAdminTeams">
        <span>{game.team1} <b>{final ? game.score1 : "—"}</b></span>
        <span>{game.team2} <b>{final ? game.score2 : "—"}</b></span>
      </div>
      <div className="scoreAdminActions">
        {game.sourceUrl?.startsWith("https://") && (
          <a href={game.sourceUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={14} /> Source
          </a>
        )}
        <button type="button" onClick={() => onOpen(game)}>
          Open game <ArrowRight size={14} />
        </button>
        <button className="scoreAdminPrimaryLink" type="button" onClick={() => onFlag(game)}>
          {final ? "Review correction" : "Flag / add score"} <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
}

export default function AdminScoreDashboard({ games = [], onOpenGame, adminUser }) {
  const [panel, setPanel] = useState("missing");
  const [query, setQuery] = useState("");
  const [data, setData] = useState({ reviews: [], deliveries: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [flagGame, setFlagGame] = useState(null);
  const [note, setNote] = useState("");
  const [source, setSource] = useState("");
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");
  const [saving, setSaving] = useState(false);
  const [showResolved, setShowResolved] = useState(false);
  const status = useMemo(() => dashboardGames(games, todayEastern()), [games]);
  const records = useMemo(() => calculateTeamRecords(games), [games]);
  const pending = useMemo(() =>
    data.reviews.filter((review) => review.status === "pending"), [data.reviews]
  );

  const request = useCallback(async (payload = null) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Sign in as an administrator to continue.");
    const token = await user.getIdToken();
    const response = await fetch("/api/admin/score-dashboard", {
      method: payload ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(payload ? { "Content-Type": "application/json" } : {}),
      },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      throw new Error(result.error || "The dashboard could not load.");
    }
    return result;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await request();
      setData({ reviews: result.reviews || [], deliveries: result.deliveries || [] });
    } catch (err) {
      setError(err?.message || "Unable to load the dashboard.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => { if (adminUser) void refresh(); }, [adminUser, refresh]);

  const filtered = (array) => array.filter((item) =>
    [item.team1, item.team2, item.team, item.gameId].some((field) =>
      String(field || "").toLowerCase().includes(query.toLowerCase().trim())
    )
  );

  const openFlag = (game) => {
    setFlagGame(game);
    setNote("");
    setSource("");
    setScore1("");
    setScore2("");
    setMessage("");
  };

  const submitFlag = async (event) => {
    event.preventDefault();
    if (!flagGame || saving) return;
    setSaving(true);
    setError("");
    try {
      await request({
        action: "flag", gameId: flagGame.id,
        score1, score2, sourceUrl: source, note,
      });
      setFlagGame(null);
      setPanel("reviews");
      setMessage("Review added. Nothing has been published yet.");
      await refresh();
    } catch (err) {
      setError(err?.message || "Failed to add review.");
    } finally {
      setSaving(false);
    }
  };

  const resolve = async (review, action) => {
    const text = action === "approve"
      ? `Approve ${review.team1} ${review.proposed1}–${review.proposed2} ${review.team2}? This publishes the scores and sends a notification if they changed.`
      : `Dismiss the flagged result for ${review.team1} vs ${review.team2}?`;
    if (!window.confirm(text)) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const result = await request({ action, reviewId: review.id });
      setMessage(action === "approve"
        ? result.pushError
          ? "Score approved, but its push failed. Check the delivery history and server logs."
          : `Score approved. ${result.changed ? `${result.delivery?.sent ?? 0} push service acceptance(s).` : "No score change; no duplicate push."}`
        : "Review dismissed.");
      await refresh();
    } catch (err) {
      setError(err?.message || "Review could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  if (!adminUser) {
    return <section className="scoreAdminDashboard"><p>Sign in as an administrator in Settings.</p></section>;
  }

  return (
    <div className="scoreAdminDashboard">
      <header className="scoreAdminHero">
        <div>
          <div className="scoreAdminEyebrow"><ShieldCheck size={14} /> PRIVATE ADMIN WORKSPACE</div>
          <Link to="/admin/stats" style={{ color: "#60a5fa", display: "inline-flex", padding: "12px 0", minHeight: 44 }}>Audience &amp; team stats →</Link><h1>Score Management</h1>
          <p>Track unfinished games, verify results, manage corrections, and see push-service activity.</p>
        </div>
        <button type="button" onClick={refresh} disabled={loading} className="scoreAdminRefresh">
          <RefreshCw size={16} className={loading ? "scoreAdminSpin" : ""} /> Refresh
        </button>
      </header>

      <div className="scoreAdminStats" aria-label="Football dashboard totals">
        <div className="scoreAdminStat"><span>Games tracked</span><strong>{status.tracked}</strong><small>Varsity football</small></div>
        <div className="scoreAdminStat"><span>Finals recorded</span><strong>{status.finalCount}</strong><small>Live scoreboard</small></div>
        <div className="scoreAdminStat urgent"><span>Missing finals</span><strong>{status.missingCount}</strong><small>Games before today</small></div>
        <div className="scoreAdminStat"><span>Pending review</span><strong>{loading ? "…" : pending.length}</strong><small>Flagged results</small></div>
      </div>

      <div className="scoreAdminToolbar">
        <nav className="scoreAdminTabs" aria-label="Score management views">
          {PANELS.map((item) => (
            <button key={item.id} type="button"
              aria-current={panel === item.id ? "page" : undefined}
              className={panel === item.id ? "selected" : ""}
              onClick={() => { setPanel(item.id); setMessage(""); }}>
              {item.label}
              {item.id === "reviews" && pending.length > 0 && <span>{pending.length}</span>}
            </button>
          ))}
        </nav>
        <label className="scoreAdminSearch">
          <Search size={18} />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams or games" aria-label="Search dashboard" />
        </label>
      </div>

      {error && <div className="scoreAdminAlert" role="alert"><AlertCircle size={17} /> {error}</div>}
      {message && <div className="scoreAdminSuccess" role="status"><CheckCircle2 size={17} /> {message}</div>}

      <section className="scoreAdminPanel">
        {panel === "missing" && (
          <>
            <div className="scoreAdminSectionTitle"><div><Clock3 size={19} /><h2>Games awaiting a final</h2></div><span>{status.missingCount} tracked</span></div>
            <p className="scoreAdminHint">Only games dated before today appear here. A missing result is not automatically a forfeit or cancellation.</p>
            <div className="scoreAdminGameGrid">
              {filtered(status.missing).slice(0, 100).map(game =>
                <GameCard key={game.id} game={game} onFlag={openFlag} onOpen={onOpenGame} />
              )}
            </div>
            {!filtered(status.missing).length && <div className="scoreAdminEmpty"><CheckCircle2 /> No overdue missing finals match this search.</div>}
            {filtered(status.missing).length > 100 && <p className="scoreAdminHint">Showing the first 100 matching games.</p>}
          </>
        )}

        {panel === "finals" && (
          <>
            <div className="scoreAdminSectionTitle"><div><CheckCircle2 size={19} /><h2>Published final scores</h2></div><span>{status.finalCount} recorded</span></div>
            <p className="scoreAdminHint">Results shown on the live scoreboard. Open a source or flag a correction if something looks wrong.</p>
            <div className="scoreAdminGameGrid">
              {filtered(status.finals).slice(0, 100).map(game =>
                <GameCard key={game.id} game={game} final onFlag={openFlag} onOpen={onOpenGame} />
              )}
            </div>
            {!filtered(status.finals).length && <div className="scoreAdminEmpty">No finals match this search.</div>}
            {filtered(status.finals).length > 100 && <p className="scoreAdminHint">Showing the 100 most recent matching finals.</p>}
          </>
        )}

        {panel === "reviews" && (
          <>
            <div className="scoreAdminSectionTitle"><div><FileSearch size={19}/><h2>Score review queue</h2></div>
              <label className="scoreAdminToggle"><input type="checkbox" checked={showResolved} onChange={e => setShowResolved(e.target.checked)}/> Show resolved</label>
            </div>
            <p className="scoreAdminHint">Only flagged scores appear here. The automated checker does not populate this queue yet. Approval requires both scores and a source link.</p>
            {filtered(data.reviews.filter(r => showResolved || r.status === "pending")).map((review) => (
              <article className="scoreAdminReview" key={review.id}>
                <div className="scoreAdminGameTop">
                  <span className="scoreAdminMeta">{displayDate(review.date)}</span>
                  <span className={"scoreAdminPill " + (review.status === "pending" ? "missing" : "confirmed")}>{review.status}</span>
                </div>
                <h3>{review.team1} vs {review.team2}</h3>
                <strong>{review.proposed1 !== null && review.proposed2 !== null
                  ? `Proposed: ${review.proposed1}–${review.proposed2}`
                  : "No proposed final score"}</strong>
                {review.note && <p>{review.note}</p>}
                {review.sourceUrl && <a href={review.sourceUrl} target="_blank" rel="noreferrer"><ExternalLink size={14}/> Review source</a>}
                <div className="scoreAdminActions">
                  {review.status === "pending" && (
                    <>
                      {review.proposed1 !== null && review.proposed2 !== null && Boolean(review.sourceUrl) &&
                        <button className="scoreAdminApprove" type="button" disabled={saving} onClick={() => resolve(review, "approve")}><Check size={15}/> Approve & publish</button>}
                      <button type="button" disabled={saving} onClick={() => resolve(review, "dismiss")}><X size={15}/> Dismiss</button>
                    </>
                  )}
                  <button type="button" onClick={() => {
                    const game = games.find(g => g.id === review.gameId);
                    if (game) onOpenGame(game);
                  }}>Open game <ArrowRight size={14}/></button>
                </div>
              </article>
            ))}
            {!loading && !filtered(data.reviews.filter(r => showResolved || r.status === "pending")).length &&
              <div className="scoreAdminEmpty"><ShieldCheck /> No flagged results in this view.</div>}
          </>
        )}

        {panel === "records" && (
          <>
            <div className="scoreAdminSectionTitle"><div><Trophy size={19}/><h2>Team records</h2></div><span>{records.length} teams</span></div>
            <p className="scoreAdminHint">Calculated once per recorded football final. These are overall records for tracked games, not a complete statewide standings table.</p>
            <div className="scoreAdminTableWrap">
              <table className="scoreAdminTable"><thead><tr><th>Team</th><th>W</th><th>L</th><th>T</th><th>PF</th><th>PA</th></tr></thead>
                <tbody>{filtered(records).map(team =>
                  <tr key={team.team}><th scope="row">{team.team}</th><td>{team.wins}</td><td>{team.losses}</td><td>{team.ties}</td><td>{team.pointsFor}</td><td>{team.pointsAgainst}</td></tr>
                )}</tbody></table>
            </div>
          </>
        )}

        {panel === "push" && (
          <>
            <div className="scoreAdminSectionTitle"><div><Bell size={19}/><h2>Push delivery history</h2></div><span>Last 100 dispatches</span></div>
            <p className="scoreAdminHint">History begins with this dashboard deployment. “Sent” means accepted by Apple Web Push or Firebase, not confirmed displayed. No subscriber details are stored here.</p>
            {filtered(data.deliveries).map((log) =>
              <article className="scoreAdminDelivery" key={log.id}>
                <div><b>{log.team1 || "LocalScoresHQ"}{log.team2 ? ` vs ${log.team2}` : ""}</b>
                  <span>{log.kind || "update"} · {log.createdAt ? new Date(log.createdAt).toLocaleString() : "Time pending"}</span></div>
                <div className="scoreAdminDeliveryCounts"><strong>{log.sent || 0} sent</strong>
                  <span>{log.matched || 0} matched · {log.failed || 0} failed</span>
                  <small>Apple {log.webPushSent || 0} · FCM {log.fcmSent || 0}</small>
                </div>
              </article>
            )}
            {!loading && !filtered(data.deliveries).length &&
              <div className="scoreAdminEmpty"><Bell /> No recorded push attempts yet. Future score updates will appear here.</div>}
          </>
        )}
      </section>

      {flagGame && (
        <div className="scoreAdminModalBackdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setFlagGame(null); }}>
          <form className="scoreAdminModal" onSubmit={submitFlag} role="dialog" aria-modal="true" aria-label="Flag a score for review">
            <button className="scoreAdminClose" type="button" onClick={() => setFlagGame(null)} aria-label="Close review"><X size={19}/></button>
            <span className="scoreAdminEyebrow">REVIEW BEFORE PUBLISHING</span>
            <h2>{flagGame.team1} vs {flagGame.team2}</h2>
            <p>Report a missing or conflicting score. The score will not change until you approve it from the review queue.</p>
            <div className="scoreAdminScoreInputs">
              <label>{flagGame.team1}<input type="number" min="0" max="300" step="1" inputMode="numeric" value={score1} onChange={e => setScore1(e.target.value)} placeholder="—" /></label>
              <label>{flagGame.team2}<input type="number" min="0" max="300" step="1" inputMode="numeric" value={score2} onChange={e => setScore2(e.target.value)} placeholder="—" /></label>
            </div>
            <label>Verified source URL<input type="url" value={source} onChange={e => setSource(e.target.value)} placeholder="https://..." /></label>
            <label>Review notes<textarea rows={3} maxLength={1000} value={note} onChange={e => setNote(e.target.value)} placeholder="Describe the conflicting report or source..." /></label>
            <button className="scoreAdminSubmit" type="submit" disabled={saving}>{saving ? "Saving…" : "Add to review queue"}</button>
          </form>
        </div>
      )}
    </div>
  );
}
