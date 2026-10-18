import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle, ArrowLeft, Bell, CheckCircle2, Clock3, ExternalLink,
  LayoutDashboard, LockKeyhole, RefreshCw, Search, ShieldCheck, Wifi,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const TABS = [
  { id: "missing", label: "Missing scores" },
  { id: "verified", label: "Verified finals" },
  { id: "review", label: "Needs review" },
  { id: "delivery", label: "Push delivery" },
];
const n = (value) => Number(value || 0).toLocaleString();
const dateLabel = (date) => {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return date || "Date TBD";
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
};
const timeLabel = (date) => {
  if (!date) return "Not recorded";
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? "Not recorded" :
    parsed.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
};
const safeSource = (value) => /^https:\/\/[^\s]+$/i.test(String(value || "")) ? value : null;

function EmptyPanel({ icon: Icon, title, detail }) {
  return (
    <div className="lsd-empty">
      <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{detail}</p>
    </div>
  );
}
function GameLine({ game, type }) {
  const isFinal = type === "verified" || type === "posted";
  return (
    <article className="lsd-line">
      <div className="lsd-line-main">
        <div className="lsd-line-top">
          <span className="lsd-game-date">{dateLabel(game.date)} · {game.time || "Time TBD"}</span>
          <span className={`lsd-pill ${isFinal ? "lsd-pill-final" : "lsd-pill-missing"}`}>
            {type === "verified" ? "Verified final" :
              type === "posted" ? "Source needed" : "Unreported"}
          </span>
        </div>
        <div className="lsd-teams">
          <strong>{game.team1 || "Unknown team"}</strong>
          {isFinal && <span className="lsd-score">{game.score1}</span>}
          <span className="lsd-versus">{isFinal ? "–" : "vs"}</span>
          {isFinal && <span className="lsd-score">{game.score2}</span>}
          <strong>{game.team2 || "Unknown team"}</strong>
        </div>
        <div className="lsd-subline">
          {game.sport || "Football"} · {game.division || "Varsity"}
          {game.lastChecked ? ` · Checked ${game.lastChecked}` : ""}
        </div>
        {type === "posted" && <p className="lsd-explain">{game.issue}</p>}
      </div>
      {safeSource(game.sourceUrl) && (
        <a className="lsd-source" href={game.sourceUrl} target="_blank" rel="noopener noreferrer">
          {type === "verified" ? "Result source" : "Schedule source"}
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      )}
    </article>
  );
}

export default function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("missing");
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(user));

  const refresh = useCallback(async (signal) => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/admin/dashboard", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const err = new Error(payload.error || "Unable to load the dashboard.");
        err.status = response.status;
        throw err;
      }
      setData(payload);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Unable to load the dashboard.");
        setData(null);
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;
    const controller = new AbortController();
    void refresh(controller.signal);
    return () => controller.abort();
  }, [user, refresh]);

  const rows = useMemo(() => {
    if (!data) return [];
    let source;
    if (tab === "review") {
      source = [
        ...(data.review || []).map((item) => ({ ...item, kind: "source" })),
        ...(data.conflicts || []).map((item) => ({ ...item, kind: "mismatch" })),
        ...(data.postedUnverified || []).map((item) => ({ ...item, kind: "posted" })),
      ];
    } else if (tab === "delivery") {
      source = data.deliveries || [];
    } else {
      source = data[tab] || [];
    }
    const term = filter.trim().toLowerCase();
    if (!term) return source;
    return source.filter((item) =>
      [item.team1, item.team2, item.gameId, item.id, item.reason, item.title]
        .filter(Boolean).some((v) => String(v).toLowerCase().includes(term))
    );
  }, [data, filter, tab]);

  return (
    <main className="lsd-admin" aria-label="Score management dashboard">
      <div className="lsd-wrap">
        <button className="lsd-back" type="button" onClick={() => navigate("/")}>
          <ArrowLeft size={16} /> Back to LocalScoresHQ
        </button>
        <section className="lsd-hero">
          <div className="lsd-hero-row">
            <div className="lsd-hero-icon"><LayoutDashboard size={22} /></div>
            <span className="lsd-hero-eyebrow">LOCAL SCORES HQ / OPERATIONS</span>
            <span className="lsd-private"><LockKeyhole size={12} /> Admin only</span>
          </div>
          <h1>Score Management</h1>
          <p>One view for missing finals, verified results, source discrepancies, and notification delivery.</p>
        </section>

        {!user ? (
          <EmptyPanel icon={LockKeyhole} title="Admin sign-in required"
            detail="Use Settings to sign in with your admin account, then return to this page." />
        ) : (
          <>
            <div className="lsd-section-heading">
              <div>
                <h2>Overview</h2>
                <p>{data?.asOf ? `Last refreshed ${timeLabel(data.asOf)}` :
                  "Live data from your tracked games and Firebase"}</p>
              </div>
              <button className="lsd-refresh" type="button" onClick={() => refresh()} disabled={loading}>
                <RefreshCw size={15} className={loading ? "lsd-spinning" : ""} />
                {loading ? "Loading" : "Refresh"}
              </button>
            </div>

            {error && (
              <div className="lsd-error" role="alert">
                <LockKeyhole size={20} />
                <div><strong>Access or data unavailable</strong><p>{error}</p>
                  <small>Dashboard access requires an approved Firebase administrator identity. No data has been changed.</small>
                </div>
              </div>
            )}
            {!data && !error && <p className="lsd-loading" role="status">Loading live score management data…</p>}

            {data && (
              <>
                <div className="lsd-metrics">
                  {[
                    { label: "Games tracked", value: data.totals.tracked, icon: LayoutDashboard },
                    { label: "Verified finals", value: data.totals.verified, icon: CheckCircle2 },
                    { label: "Missing scores", value: data.totals.missing, icon: Clock3 },
                    { label: "Needs review", value: data.totals.conflicts + data.totals.postedUnverified, icon: AlertCircle },
                  ].map(({ label, value, icon: Icon }) => (
                    <div className="lsd-metric" key={label}>
                      <div className="lsd-metric-top"><span>{label}</span><Icon size={18} /></div>
                      <strong>{n(value)}</strong>
                    </div>
                  ))}
                </div>
                <div className="lsd-note">
                  <ShieldCheck size={17} aria-hidden="true" />
                  Finals count as verified only when a tracked final includes a recorded result source.
                  Firestore overrides and conflicting values are highlighted for review.
                </div>

                <div className="lsd-section-heading lsd-records-heading">
                  <div><h2>Game operations</h2><p>Review live data without changing published scores.</p></div>
                </div>
                <div className="lsd-tabs" role="tablist" aria-label="Score management category">
                  {TABS.map((item) => (
                    <button key={item.id} type="button" role="tab"
                      aria-selected={tab === item.id}
                      className={tab === item.id ? "lsd-tab lsd-tab-active" : "lsd-tab"}
                      onClick={() => { setTab(item.id); setFilter(""); }}>{item.label}</button>
                  ))}
                </div>
                <div className="lsd-results">
                  <div className="lsd-results-header">
                    <div><h3>{TABS.find((item) => item.id === tab)?.label}</h3>
                      <p>{rows.length} records shown{tab === "missing" ? " · Games from past dates with no final" : ""}</p>
                    </div>
                    <label className="lsd-search">
                      <Search size={17} aria-hidden="true" />
                      <input type="search" aria-label="Filter by team" placeholder="Search teams…" value={filter} onChange={(e) => setFilter(e.target.value)} />
                    </label>
                  </div>

                  {rows.length === 0 ? (
                    <EmptyPanel icon={tab === "delivery" ? Bell : CheckCircle2}
                      title={filter ? "No matching records" : tab === "delivery" ? "Waiting for the next alert" :
                        tab === "review" ? "No recorded review items" : tab === "verified" ?
                          "No source-backed finals recorded" : "No missing past-game scores"}
                      detail={filter ? "Try a different team name." :
                        tab === "delivery" ? "Delivery history begins with push messages sent after this dashboard's audit logging is deployed. Earlier notifications are not backfilled." :
                        tab === "review" ? "Conflicts from the score-check automation will appear here once written to the review queue. Existing score overrides are compared automatically." :
                          "This view reflects the latest tracked schedule and Firestore data."} />
                  ) : tab === "delivery" ? rows.map((item) => (
                    <article className="lsd-line lsd-delivery" key={item.id}>
                      <div className="lsd-line-top">
                        <span className="lsd-game-date">{timeLabel(item.createdAt)}</span>
                        <span className={`lsd-pill ${item.failed ? "lsd-pill-warning" : "lsd-pill-final"}`}>
                          {item.failed ? "Send errors" : item.sent ? "Accepted" : "No recipients"}
                        </span>
                      </div>
                      <strong>{item.team1 || "Game"} vs {item.team2 || "Opponent"}</strong>
                      <p className="lsd-subline">{item.title} · {item.kind}</p>
                      <div className="lsd-delivery-counts">
                        <span><b>{n(item.matched)}</b> matched</span>
                        <span><b>{n(item.sent)}</b> sent</span>
                        <span><b>{n(item.webPushSent)}</b> Apple Web Push</span>
                        <span><b>{n(item.fcmSent)}</b> FCM</span>
                        <span><b>{n(item.failed)}</b> failed</span>
                      </div>
                    </article>
                  )) : tab === "review" ? rows.map((item, index) =>
                    item.kind === "posted" ? <GameLine key={item.id || index} type="posted" game={item} /> : (
                      <article className="lsd-line lsd-review" key={item.id || index}>
                        <div className="lsd-line-top">
                          <span className="lsd-game-date">{dateLabel(item.date)}</span>
                          <span className="lsd-pill lsd-pill-warning">{item.kind === "mismatch" ? "Score mismatch" : "Source conflict"}</span>
                        </div>
                        <strong>{item.team1 || "Game"} vs {item.team2 || "Opponent"}</strong>
                        <p className="lsd-explain">{item.issue || item.reason}</p>
                        {item.kind === "mismatch" && <p className="lsd-subline">
                          Tracked: {item.trackedScore} · Firebase: {item.currentScore}
                        </p>}
                        {(item.sources || []).map((source, i) => safeSource(source.url) ? (
                          <a className="lsd-source" key={i} href={source.url} target="_blank" rel="noopener noreferrer">
                            {source.label}{source.score ? `: ${source.score}` : ""}<ExternalLink size={14}/>
                          </a>
                        ) : null)}
                      </article>
                    )) : rows.map((game) => <GameLine key={game.id} game={game} type={tab} />)}
                  <p className="lsd-footnote">Read-only overview · No score or schedule changes occur from viewing this page.</p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
