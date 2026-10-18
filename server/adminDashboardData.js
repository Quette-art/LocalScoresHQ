import { hasFinalScore } from "../src/notificationPolicy.js";

export function easternDate(today = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(today).filter((p) => p.type !== "literal").map((p) => [p.type, p.value])
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function asScore(value) {
  if (value === null || value === undefined || value === "") return null;
  const score = Number(value);
  return Number.isFinite(score) ? score : null;
}

function safeGame(game) {
  return {
    id: String(game.id || ""),
    team1: String(game.team1 || ""),
    team2: String(game.team2 || ""),
    sport: String(game.sport || "Football"),
    division: String(game.division || "Varsity"),
    date: String(game.date || ""),
    time: String(game.time || ""),
    location: String(game.location || ""),
    score1: asScore(game.score1),
    score2: asScore(game.score2),
    status: String(game.status || ""),
    verificationStatus: String(game.verificationStatus || ""),
    sourceTier: String(game.sourceTier || ""),
    sourceUrl: String(game.sourceUrl || ""),
    lastChecked: String(game.lastChecked || ""),
  };
}

export function buildScoreDashboard({
  staticGames = [], firestoreScores = [], firestoreGames = [], firestoreStatuses = [],
  reviewItems = [], pushDispatches = [], today = easternDate(),
} = {}) {
  const scores = new Map(firestoreScores.map((doc) => [doc.id, doc]));
  const overrides = new Map(firestoreGames.map((doc) => [doc.id, doc]));
  const statuses = new Map(firestoreStatuses.map((doc) => [doc.id, doc]));
  const all = new Map(staticGames.filter((game) => game.id).map((game) => [game.id, game]));
  for (const [id, game] of overrides) {
    if (!all.has(id)) all.set(id, { ...game, id });
  }

  const missing = [];
  const verified = [];
  const postedUnverified = [];
  const mismatches = [];

  for (const [id, base] of all) {
    const override = overrides.get(id);
    const scoreDoc = scores.get(id);
    const current = { ...base, ...(override || {}), id };
    const editedScore = scoreDoc && asScore(scoreDoc.score1) !== null &&
      asScore(scoreDoc.score2) !== null;
    const overrideScore = override && asScore(override.score1) !== null &&
      asScore(override.score2) !== null;
    if (overrideScore) {
      current.score1 = asScore(override.score1);
      current.score2 = asScore(override.score2);
    }
    if (editedScore) {
      current.score1 = asScore(scoreDoc.score1);
      current.score2 = asScore(scoreDoc.score2);
    }
    if (statuses.has(id)) current.status = statuses.get(id).status || current.status;

    const row = safeGame(current);
    const original = safeGame(base);
    const originalFinal = hasFinalScore(original);
    const edited = editedScore || overrideScore;
    const changedScore = edited && (
      original.score1 !== row.score1 || original.score2 !== row.score2
    );
    const documentedFinal = !changedScore && (
      String(base.verificationStatus || "").toLowerCase() === "final" ||
      String(base.scheduleStatus || "").toLowerCase() === "final"
    ) && /^https:\/\//i.test(String(base.sourceUrl || ""));

    if (originalFinal && changedScore) {
      mismatches.push({
        ...row,
        issue: "Stored score differs from the tracked result",
        trackedScore: `${original.score1}–${original.score2}`,
        currentScore: `${row.score1}–${row.score2}`,
      });
    }
    if (hasFinalScore(row)) {
      (documentedFinal ? verified : postedUnverified).push({
        ...row, sourceUrl: changedScore ? "" : row.sourceUrl,
        issue: changedScore ? "Firestore override requires source review" :
          "Score is posted but no verified source is recorded",
      });
    } else if (
      row.date && row.date < today &&
      !["cancelled", "canceled", "postponed"].includes(row.status.toLowerCase())
    ) {
      missing.push(row);
    }
  }

  const sorted = (rows) => rows.sort((a, b) =>
    b.date.localeCompare(a.date) || a.team1.localeCompare(b.team1));
  const review = reviewItems
    .filter((entry) => !["resolved", "dismissed"].includes(String(entry.status || "").toLowerCase()))
    .map((entry) => ({
      id: String(entry.id || ""),
      gameId: String(entry.gameId || ""),
      team1: String(entry.team1 || ""),
      team2: String(entry.team2 || ""),
      date: String(entry.date || ""),
      status: String(entry.status || "needs review"),
      reason: String(entry.reason || "Conflicting score reports"),
      sources: Array.isArray(entry.sources)
        ? entry.sources.slice(0, 4).map((x) => ({
          label: String(x?.label || "Source"),
          url: String(x?.url || ""),
          score: String(x?.score || ""),
        }))
        : [],
    }));

  const deliveries = pushDispatches.slice(0, 80).map((entry) => ({
    id: String(entry.id || ""),
    createdAt: String(entry.createdAt || ""),
    gameId: String(entry.gameId || ""),
    team1: String(entry.team1 || ""),
    team2: String(entry.team2 || ""),
    kind: String(entry.kind || ""),
    title: String(entry.title || ""),
    matched: Number(entry.matched || 0),
    sent: Number(entry.sent || 0),
    failed: Number(entry.failed || 0),
    webPushSent: Number(entry.webPushSent || 0),
    fcmSent: Number(entry.fcmSent || 0),
  }));

  return {
    asOf: new Date().toISOString(),
    today,
    totals: {
      tracked: all.size,
      verified: verified.length,
      postedUnverified: postedUnverified.length,
      missing: missing.length,
      conflicts: review.length + mismatches.length,
      deliveries: deliveries.length,
    },
    missing: sorted(missing).slice(0, 150),
    verified: sorted(verified).slice(0, 150),
    postedUnverified: sorted(postedUnverified).slice(0, 150),
    conflicts: sorted(mismatches).slice(0, 150),
    review: review.slice(0, 100),
    deliveries,
    metadata: {
      reviewQueueConnected: true,
      pushAuditConnected: true,
      note: "Historical push events before audit logging was introduced are not included.",
    },
  };
}
