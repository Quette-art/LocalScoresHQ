import test from "node:test";
import assert from "node:assert/strict";
import { favoriteSummary, teamSearchLabel } from "../src/teamSummary.js";

const team = { teamName: "Anacostia", division: "Varsity", ageGroup: "Varsity", sport: "Football" };
const game = (id, date, values = {}) => ({
  id, date, sport: "Football", division: "Varsity", team1: "Anacostia", team2: "Cardozo",
  score1: null, score2: null, time: "6:00 PM", ...values,
});

test("search labels use readable bullets and omit repeated or unknown fields", () => {
  assert.equal(teamSearchLabel(team), "Football • Varsity");
  assert.equal(teamSearchLabel({ sport: "Soccer", ageGroup: "U14", division: "Travel" }), "Soccer • U14 • Travel");
  assert.equal(teamSearchLabel({ sport: "Football", division: "Unknown" }), "Football");
  assert.equal(teamSearchLabel({ sport: "Football", ageGroup: "Varsity", division: " varsity " }), "Football • Varsity");
});

test("favorite card chooses latest final and earliest upcoming matchup for the correct sport and division", () => {
  const games = [
    game("old", "2026-10-09", { score1: 10, score2: 0 }),
    game("recent", "2026-10-16", { score1: 6, score2: 20 }),
    game("next", "2026-10-22"), game("later", "2026-10-30"),
    game("other-sport", "2026-10-18", { sport: "Soccer", score1: 2, score2: 0 }),
    game("other-division", "2026-10-21", { division: "JV" }),
  ];
  const summary = favoriteSummary(team, games, "2026-10-20");
  assert.equal(summary.lastGame.id, "recent");
  assert.equal(summary.nextGame.id, "next");
  assert.deepEqual(summary.result, { ownScore: 6, opponentScore: 20, outcome: "L", opponent: "Cardozo" });
});

test("result follows the favorite team's perspective including away wins and zero-zero ties", () => {
  const away = game("away", "2026-10-17", { team1: "Cardozo", team2: "Anacostia", score1: 6, score2: 28 });
  assert.deepEqual(favoriteSummary(team, [away], "2026-10-20").result,
    { ownScore: 28, opponentScore: 6, outcome: "W", opponent: "Cardozo" });
  const tie = game("tie", "2026-10-18", { score1: 0, score2: 0 });
  assert.equal(favoriteSummary(team, [away, tie], "2026-10-20").result.outcome, "T");
});

test("cancelled, postponed, overdue and future-dated results do not become next games or recent finals", () => {
  const games = [
    game("cancelled", "2026-10-21", { status: "Canceled" }),
    game("postponed", "2026-10-21", { scheduleStatus: "Postponed" }),
    game("overdue", "2026-10-19"),
    game("bad-future-final", "2026-10-25", { score1: 10, score2: 0 }),
  ];
  assert.deepEqual(favoriteSummary(team, games, "2026-10-20"), { lastGame: null, nextGame: null, result: null });
});

test("same-day schedule uses kickoff order and preserves unscored zero values", () => {
  const summary = favoriteSummary(team, [
    game("late", "2026-10-20", { time: "7:00 PM" }),
    game("early", "2026-10-20", { time: "10:00 AM", score1: 0 }),
    game("unknown", "2026-10-20", { time: "TBD" }),
  ], "2026-10-20");
  assert.equal(summary.nextGame.id, "early");
  assert.equal(summary.lastGame, null);
});
