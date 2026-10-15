import { getFirebaseAdmin } from "../../server/firebaseAdmin.js";
import { sendFavoritePush } from "../../server/pushNotifications.js";

function readBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }
  return req.body;
}

function cleanGame(game = {}) {
  return {
    id: String(game.id || ""),
    team1: String(game.team1 || ""),
    team2: String(game.team2 || ""),
    division: String(game.division || "Unknown"),
    date: String(game.date || ""),
    time: String(game.time || ""),
    location: String(game.location || ""),
    status: String(game.status || ""),
    score1:
      game.score1 === null || game.score1 === undefined
        ? null
        : Number(game.score1),
    score2:
      game.score2 === null || game.score2 === undefined
        ? null
        : Number(game.score2),
  };
}

function hasScheduleChange(before, after) {
  if (!before) return false;
  return (
    before.team1 !== after.team1 ||
    before.team2 !== after.team2 ||
    before.date !== after.date ||
    before.time !== after.time ||
    before.location !== after.location ||
    before.division !== after.division
  );
}

function hasScoreChange(before, after) {
  if (!before) return false;
  return before.score1 !== after.score1 || before.score2 !== after.score2;
}

async function verifyAdmin(req) {
  const authHeader = String(req.headers.authorization || "");
  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Missing authorization token.");
  }

  const idToken = authHeader.slice("Bearer ".length).trim();
  const { auth } = getFirebaseAdmin();
  return auth.verifyIdToken(idToken);
}

async function sendScore(game) {
  if (game.score1 === null || game.score2 === null) return null;

  return sendFavoritePush({
    game,
    title: "Final score",
    body: `${game.team1} ${game.score1}–${game.score2} ${game.team2}`,
    kind: "score",
    tag: `score-${game.id}-${game.score1}-${game.score2}`,
    preference: "scores",
  });
}

async function sendAdded(game) {
  const when = `${game.date || "TBD"} ${game.time || ""}`.trim();
  return sendFavoritePush({
    game,
    title: "New game added",
    body: `${game.team1} vs ${game.team2} — ${when}`,
    kind: "schedule",
    tag: `new-game-${game.id}`,
    preference: "schedule",
  });
}

async function sendRemoved(game) {
  return sendFavoritePush({
    game,
    title: "Game removed",
    body: `${game.team1} vs ${game.team2}`,
    kind: "schedule",
    tag: `removed-${game.id}`,
    preference: "schedule",
  });
}

async function sendStatus(game) {
  const status = String(game.status || "").toLowerCase();
  const title =
    status === "cancelled"
      ? "Game cancelled"
      : status === "postponed"
        ? "Game postponed"
        : "Game status update";

  return sendFavoritePush({
    game,
    title,
    body: `${game.team1} vs ${game.team2}`,
    kind: "schedule",
    tag: `status-${game.id}-${String(game.status || "").toLowerCase()}`,
    preference: "schedule",
  });
}

async function sendSchedule(before, after) {
  const locationChanged = before?.location !== after.location && after.location;
  const title = locationChanged ? "Location change" : "Schedule change";
  const body = locationChanged
    ? `${after.team1} vs ${after.team2} @ ${after.location}`
    : `${after.team1} vs ${after.team2} — ${after.date || "TBD"} ${after.time || ""}`.trim();

  return sendFavoritePush({
    game: after,
    title,
    body,
    kind: "schedule",
    tag: `schedule-${after.id}-${after.date}-${after.time}-${after.location}`,
    preference: "schedule",
  });
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await verifyAdmin(req);

    const body = readBody(req);
    const action = String(body.action || "");
    const game = cleanGame(body.game);
    const before = body.before ? cleanGame(body.before) : null;

    if (!game.id || !game.team1 || !game.team2) {
      return res.status(400).json({ error: "Game details are required." });
    }

    const results = [];

    if (action === "score") {
      results.push(await sendScore(game));
    } else if (action === "added") {
      results.push(await sendAdded(game));
    } else if (action === "removed") {
      results.push(await sendRemoved(game));
    } else if (action === "status") {
      results.push(await sendStatus(game));
    } else if (action === "edited") {
      if (hasScheduleChange(before, game)) {
        results.push(await sendSchedule(before, game));
      }
      if (
        hasScoreChange(before, game) &&
        game.score1 !== null &&
        game.score2 !== null
      ) {
        results.push(await sendScore(game));
      }
    } else {
      return res.status(400).json({ error: "Unsupported push action." });
    }

    const delivered = results
      .filter(Boolean)
      .reduce((sum, result) => sum + Number(result.sent || 0), 0);

    return res.status(200).json({
      ok: true,
      delivered,
      results: results.filter(Boolean),
    });
  } catch (error) {
    console.error("Push game update failed:", error);
    return res.status(401).json({
      ok: false,
      error: "Push update was not authorized or could not be sent.",
    });
  }
}
