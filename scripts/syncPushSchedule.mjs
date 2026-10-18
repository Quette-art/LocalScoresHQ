const secret = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!secret) {
  console.log("Push schedule sync skipped: Firebase Admin secret is unavailable.");
  process.exit(0);
}

const [{ games }, { getFirebaseAdmin }, { sendFavoritePush }] = await Promise.all([
  import("../src/data/games.js"),
  import("../server/firebaseAdmin.js"),
  import("../server/pushNotifications.js"),
]);

const { db, FieldValue } = getFirebaseAdmin();
const snapshotRef = db.collection("pushMeta").doc("staticGameSnapshotV1");

const pickGame = (game) => ({
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
});

const current = Object.fromEntries(
  games
    .filter((game) => game?.id)
    .map((game) => [String(game.id), pickGame(game)])
);

const previousDoc = await snapshotRef.get();

if (!previousDoc.exists) {
  await snapshotRef.set({
    snapshotJson: JSON.stringify(current),
    initializedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(
    `Push snapshot initialized with ${Object.keys(current).length} games; no alerts sent.`
  );
  process.exit(0);
}

let previous = {};
try {
  previous = JSON.parse(previousDoc.data()?.snapshotJson || "{}");
} catch {
  previous = {};
}

const scheduleFields = [
  "team1",
  "team2",
  "division",
  "date",
  "time",
  "location",
];

const scheduleChanged = (before, after) =>
  scheduleFields.some((field) => before?.[field] !== after?.[field]);

const scoreChanged = (before, after) =>
  before?.score1 !== after?.score1 || before?.score2 !== after?.score2;

const statusNeedsAlert = (before, after) => {
  const next = String(after?.status || "").toLowerCase();
  const prior = String(before?.status || "").toLowerCase();
  return (
    next !== prior &&
    (next === "cancelled" || next === "postponed")
  );
};

const sendScheduleChange = async (before, after) => {
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
};

let sentTotal = 0;
let alertCount = 0;

for (const [id, after] of Object.entries(current)) {
  const before = previous[id];

  if (!before) {
    const result = await sendFavoritePush({
      game: after,
      title: "New game added",
      body: `${after.team1} vs ${after.team2} — ${after.date || "TBD"} ${after.time || ""}`.trim(),
      kind: "schedule",
      tag: `new-game-${id}`,
      preference: "schedule",
    });
    sentTotal += Number(result.sent || 0);
    alertCount += 1;
    continue;
  }

  if (
    scoreChanged(before, after) &&
    after.score1 !== null &&
    after.score2 !== null
  ) {
    const result = await sendFavoritePush({
      game: after,
      title: "Final score",
      body: `${after.team1} ${after.score1}–${after.score2} ${after.team2}`,
      kind: "score",
      tag: `score-${id}-${after.score1}-${after.score2}`,
      preference: "scores",
    });
    sentTotal += Number(result.sent || 0);
    alertCount += 1;
  }

  if (statusNeedsAlert(before, after)) {
    const status = String(after.status || "").toLowerCase();
    const result = await sendFavoritePush({
      game: after,
      title: status === "cancelled" ? "Game cancelled" : "Game postponed",
      body: `${after.team1} vs ${after.team2}`,
      kind: "schedule",
      tag: `status-${id}-${String(after.status || "").toLowerCase()}`,
      preference: "schedule",
    });
    sentTotal += Number(result.sent || 0);
    alertCount += 1;
  } else if (scheduleChanged(before, after)) {
    const result = await sendScheduleChange(before, after);
    sentTotal += Number(result.sent || 0);
    alertCount += 1;
  }
}

for (const [id, before] of Object.entries(previous)) {
  if (current[id]) continue;

  // One-time cleanup: remove the temporary Suitland notification test
  // from the snapshot without sending followers a fake "Game removed" alert.
  if (id === "fb-test-2026-10-12-suitland-notification") continue;

  const result = await sendFavoritePush({
    game: before,
    title: "Game removed",
    body: `${before.team1} vs ${before.team2}`,
    kind: "schedule",
    tag: `removed-${id}`,
    preference: "schedule",
  });
  sentTotal += Number(result.sent || 0);
  alertCount += 1;
}

await snapshotRef.set(
  {
    snapshotJson: JSON.stringify(current),
    updatedAt: FieldValue.serverTimestamp(),
  },
  { merge: true }
);

console.log(
  `Push schedule sync complete: ${alertCount} change(s), ${sentTotal} notification(s) sent.`
);

/*
 * Temporary single-run favorite-team push test (October 18, 2026).
 * This changes no real games and is removed after confirming the delivery log.
 * The Firestore claim prevents repeated sends across concurrent production builds.
 */
const suitlandTestRef = db.collection("pushMeta").doc("suitlandFavoriteTest20261018V1");
const shouldSendSuitlandTest = await db.runTransaction(async (transaction) => {
  const priorTest = await transaction.get(suitlandTestRef);
  if (priorTest.exists) return false;
  transaction.create(suitlandTestRef, {
    initiatedAt: FieldValue.serverTimestamp(),
    label: "TEST ONLY — Suitland favorite notification",
  });
  return true;
});

if (shouldSendSuitlandTest) {
  try {
    const suitlandTest = await sendFavoritePush({
      game: {
        id: "lshq-push-test-suitland-2026-10-18",
        team1: "Suitland",
        team2: "LocalScoresHQ Test",
        division: "Varsity",
      },
      title: "TEST ONLY — Suitland",
      body: "Suitland favorite-team alert test from LocalScoresHQ. No real game or score was changed.",
      kind: "test",
      tag: "test-only-suitland-2026-10-18",
      preference: "schedule",
      url: "https://localscoreshq.com/",
    });
    await suitlandTestRef.set(
      { completedAt: FieldValue.serverTimestamp(), result: suitlandTest },
      { merge: true }
    );
    console.log("Suitland favorite push TEST ONLY:", JSON.stringify(suitlandTest));
  } catch (error) {
    console.error("Suitland favorite push TEST ONLY failed:", error?.message || error);
    throw error;
  }
}
