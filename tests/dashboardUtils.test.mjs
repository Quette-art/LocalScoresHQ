import assert from "node:assert/strict";
import test from "node:test";
import { hasFinal, todayEastern, dashboardGames, calculateTeamRecords } from "../src/dashboardUtils.js";

const fixture = [
  { id: "one", sport: "Football", date: "2026-10-17", team1: "Bullis", team2: "Landon",
    score1: 21, score2: 14 },
  { id: "two", sport: "Football", date: "2026-10-17", team1: "Phelps", team2: "Cardozo",
    score1: null, score2: null },
  { id: "three", sport: "Football", date: "2026-10-20", team1: "Suitland", team2: "Wise",
    score1: null, score2: null },
  { id: "four", sport: "Football", date: "2026-10-17", team1: "Phelps", team2: "Wise",
    score1: 0, score2: 0 },
  { id: "five", sport: "Football", date: "2026-10-17", team1: "Bullis", team2: "Suitland",
    score1: null, score2: null, status: "postponed" },
  { id: "six", sport: "Soccer", date: "2026-10-17", team1: "Bullis", team2: "Landon",
    score1: 1, score2: 0 },
];
test("uses Eastern date even when timestamp UTC date differs", () => {
  assert.equal(todayEastern(new Date("2026-10-18T02:15:00Z")), "2026-10-17");
});
test("does not treat zero-zero as missing", () => {
  assert.equal(hasFinal(fixture[3]), true);
  assert.equal(hasFinal({ score1: null, score2: 0 }), false);
  assert.equal(hasFinal({ score1: "", score2: 0 }), false);
});
test("overdue missing finals excludes future, postponed and other sports", () => {
  const result = dashboardGames(fixture, "2026-10-18");
  assert.equal(result.tracked, 5);
  assert.equal(result.finalCount, 2);
  assert.equal(result.missingCount, 1);
  assert.deepEqual(result.missing.map(g => g.id), ["two"]);
});
test("records count each game only once for each team including ties", () => {
  const rows = Object.fromEntries(calculateTeamRecords(fixture).map(row => [row.team, row]));
  assert.deepEqual(
    [rows.Bullis.wins, rows.Bullis.losses, rows.Bullis.pointsFor, rows.Bullis.pointsAgainst],
    [1, 0, 21, 14]
  );
  assert.deepEqual([rows.Phelps.ties, rows.Wise.ties], [1, 1]);
  assert.equal(rows.Landon.losses, 1);
  assert.equal(rows.Cardozo, undefined);
});
test("cancelled scores do not count as final", () => {
  assert.equal(hasFinal({score1: 2, score2: 1, status: "cancelled"}), false);
});
