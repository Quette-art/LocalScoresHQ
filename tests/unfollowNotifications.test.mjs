import test from "node:test";
import assert from "node:assert/strict";
import { subscriptionMatchesGame } from "../server/pushNotifications.js";

test("unfollowing stops that team's alerts without disabling remaining favorites", () => {
  const subscription = { prefs: { enabled: true, scores: true, schedule: true }, favorites: ["Dunbar-Varsity", "Wise-Varsity"] };
  const dunbarGame = { team1: "Dunbar", team2: "Ballou", division: "Varsity" };
  const wiseGame = { team1: "Wise", team2: "Suitland", division: "Varsity" };
  for (const category of ["scores", "schedule"]) {
    assert.equal(subscriptionMatchesGame(subscription, dunbarGame, category), true);
    const afterRemoval = { ...subscription, favorites: ["Wise-Varsity"] };
    assert.equal(subscriptionMatchesGame(afterRemoval, dunbarGame, category), false);
    assert.equal(subscriptionMatchesGame(afterRemoval, wiseGame, category), true);
    assert.equal(subscriptionMatchesGame({ ...subscription, favorites: [] }, wiseGame, category), false);
    assert.equal(subscriptionMatchesGame({ ...subscription, prefs: { enabled: false } }, dunbarGame, category), false);
  }
});
