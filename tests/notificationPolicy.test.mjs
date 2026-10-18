import assert from "node:assert/strict";
import test from "node:test";
import { classifyGameNotification, hasFinalScore } from "../src/notificationPolicy.js";

const upcoming = {
  id: "test-bullis-landon",
  team1: "Bullis",
  team2: "Landon",
  division: "Varsity",
  date: "2026-10-16",
  time: "7:00 PM",
  location: "Bullis",
  score1: null,
  score2: null,
  status: "",
};
const completed = {
  ...upcoming,
  date: "2026-10-17",
  time: "12:00 PM",
  score1: 21,
  score2: 14,
};

test("a completed game with corrected date/time sends final score only", () => {
  assert.equal(classifyGameNotification(upcoming, completed), "score");
});
test("a newly added final sends final score rather than new game", () => {
  assert.equal(classifyGameNotification(null, completed), "score");
});
test("an unplayed new game sends one new-game alert", () => {
  assert.equal(classifyGameNotification(null, upcoming), "added");
});
test("schedule-only correction still sends a schedule alert", () => {
  assert.equal(
    classifyGameNotification(upcoming, { ...upcoming, date: "2026-10-17" }),
    "schedule"
  );
});
test("location-only correction still sends a schedule alert", () => {
  assert.equal(
    classifyGameNotification(upcoming, { ...upcoming, location: "Landon" }),
    "schedule"
  );
});
test("cancellation still takes precedence over a simultaneous schedule edit", () => {
  assert.equal(
    classifyGameNotification(upcoming, { ...upcoming, date: "2026-10-17", status: "Cancelled" }),
    "status"
  );
});
test("a new final takes precedence over a simultaneous status/date edit", () => {
  assert.equal(
    classifyGameNotification(upcoming, { ...completed, status: "Postponed" }),
    "score"
  );
});
test("a changed final score and date sends only the corrected score", () => {
  assert.equal(
    classifyGameNotification(completed, { ...completed, score1: 24, date: "2026-10-18" }),
    "score"
  );
});
test("unchanged games and blank score removals create no extra final alert", () => {
  assert.equal(classifyGameNotification(upcoming, { ...upcoming }), null);
  assert.equal(classifyGameNotification(completed, { ...completed, score1: null, score2: null }), null);
});
test("zero-zero is a valid final score; null and empty strings are not", () => {
  assert.equal(hasFinalScore({ score1: 0, score2: 0 }), true);
  assert.equal(hasFinalScore({ score1: null, score2: 0 }), false);
  assert.equal(hasFinalScore({ score1: "", score2: 0 }), false);
});
