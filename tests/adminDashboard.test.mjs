import assert from "node:assert/strict";
import test from "node:test";
import { isAuthorizedDashboardAdmin, authorizeDashboardRequest } from "../server/adminAccess.js";
import { buildScoreDashboard, easternDate } from "../server/adminDashboardData.js";

const base = (id, date, score1 = null, score2 = null) => ({
  id, team1: "Bullis", team2: "Landon", sport: "Football", division: "Varsity",
  date, score1, score2, time: "12:00 PM",
});

test("deny anonymous or unrelated Firebase identities", () => {
  assert.equal(isAuthorizedDashboardAdmin(), false);
  assert.equal(isAuthorizedDashboardAdmin({ uid: "stranger", email: "user@test.com", email_verified: true }), false);
});
test("allow custom admin claim or exact UID allowlist", () => {
  assert.equal(isAuthorizedDashboardAdmin({ uid: "abc", admin: true }), true);
  assert.equal(isAuthorizedDashboardAdmin({ uid: "abc", role: "admin" }), true);
  assert.equal(isAuthorizedDashboardAdmin({ uid: "abc" }, { ADMIN_ALLOWED_UIDS: "xyz, abc" }), true);
  assert.equal(isAuthorizedDashboardAdmin({ uid: "nope" }, { ADMIN_ALLOWED_UIDS: "abc" }), false);
});
test("email allowlist requires verified email and exact match", () => {
  const env = { ADMIN_ALLOWED_EMAILS: "Admin@LocalScoresHQ.com" };
  assert.equal(isAuthorizedDashboardAdmin({ uid: "x", email: "admin@localscoreshq.com", email_verified: true }, env), true);
  assert.equal(isAuthorizedDashboardAdmin({ uid: "x", email: "admin@localscoreshq.com", email_verified: false }, env), false);
  assert.equal(isAuthorizedDashboardAdmin({ uid: "x", email: "not-admin@localscoreshq.com", email_verified: true }, env), false);
});
test("admin API rejects missing auth before accessing Firebase", async () => {
  let called = false;
  await assert.rejects(
    authorizeDashboardRequest({ headers: {} }, () => { called = true; }),
    (error) => error.statusCode === 401,
  );
  assert.equal(called, false);
});
test("admin API rejects an invalid token", async () => {
  await assert.rejects(
    authorizeDashboardRequest({ headers: { authorization: "Bearer invalid" } },
      () => ({ auth: { verifyIdToken: async () => { throw Error("invalid"); } } })),
    (error) => error.statusCode === 401,
  );
});
test("unprivileged valid Firebase user is forbidden", async () => {
  await assert.rejects(
    authorizeDashboardRequest({ headers: { authorization: "Bearer signed-in" } },
      () => ({ auth: { verifyIdToken: async () => ({ uid: "viewer" }) } })),
    (error) => error.statusCode === 403,
  );
});
test("a custom claim grants authenticated access", async () => {
  const user = await authorizeDashboardRequest(
    { headers: { authorization: "Bearer valid-token" } },
    () => ({ auth: { verifyIdToken: async () => ({ uid: "owner", admin: true }) } }),
  );
  assert.equal(user.uid, "owner");
});
test("timezone uses America/New_York day, including UTC midnight rollover", () => {
  assert.equal(easternDate(new Date("2026-10-18T01:30:00Z")), "2026-10-17");
  assert.equal(easternDate(new Date("2026-10-18T16:30:00Z")), "2026-10-18");
});
test("dashboard counts verified finals only when documented with final source", () => {
  const result = buildScoreDashboard({
    today: "2026-10-18",
    staticGames: [
      { ...base("verified", "2026-10-17", 21, 14), verificationStatus: "Final", sourceUrl: "https://example.org/game" },
      base("missing", "2026-10-16"),
      base("future", "2026-10-24"),
      base("unverified", "2026-10-17", 4, 2),
      { ...base("cancelled", "2026-10-15"), status: "Cancelled" },
    ],
  });
  assert.deepEqual(result.totals, {
    tracked: 5, verified: 1, postedUnverified: 1, missing: 1,
    conflicts: 0, deliveries: 0,
  });
  assert.equal(result.missing[0].id, "missing");
  assert.equal(result.verified[0].id, "verified");
});
test("Firestore scores override tracked values without inheriting verification", () => {
  const result = buildScoreDashboard({
    today: "2026-10-18",
    staticGames: [{ ...base("g", "2026-10-17", 21, 14), verificationStatus: "Final", sourceUrl: "https://example.org/game" }],
    firestoreScores: [{ id: "g", score1: 28, score2: 14 }],
  });
  assert.equal(result.totals.verified, 0);
  assert.equal(result.totals.postedUnverified, 1);
  assert.equal(result.totals.conflicts, 1);
  assert.deepEqual([result.conflicts[0].trackedScore, result.conflicts[0].currentScore], ["21–14", "28–14"]);
});
test("separate review queue, delivery audit and nonfinal state display as recorded", () => {
  const result = buildScoreDashboard({
    today: "2026-10-18",
    staticGames: [base("future", "2026-10-22")],
    reviewItems: [
      { id: "r1", gameId: "future", reason: "Official score discrepancy", status: "pending" },
      { id: "r2", status: "resolved" },
    ],
    pushDispatches: [
      { id: "p1", gameId: "future", kind: "score", matched: 2, sent: 1, failed: 1, webPushSent: 1 },
    ],
  });
  assert.equal(result.totals.conflicts, 1);
  assert.equal(result.totals.deliveries, 1);
  assert.equal(result.deliveries[0].failed, 1);
  assert.equal(result.review.length, 1);
});
