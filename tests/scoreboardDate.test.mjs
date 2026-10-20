import test from "node:test";
import assert from "node:assert/strict";
import { selectScoreboardDate } from "../src/scoreboardDate.js";

const dates = ["2026-10-16", "2026-10-17", "2026-10-22", "2026-10-23"];

test("off days keep the latest game date instead of advancing to Thursday", () => {
  assert.equal(selectScoreboardDate(dates, new Date("2026-10-20T14:00:00Z")), "2026-10-17");
});

test("next game day switches at exactly 6 AM Eastern", () => {
  assert.equal(selectScoreboardDate(dates, new Date("2026-10-22T09:59:59Z")), "2026-10-17");
  assert.equal(selectScoreboardDate(dates, new Date("2026-10-22T10:00:00Z")), "2026-10-22");
  assert.equal(selectScoreboardDate(dates, new Date("2026-10-23T09:59:59Z")), "2026-10-22");
  assert.equal(selectScoreboardDate(dates, new Date("2026-10-23T10:00:00Z")), "2026-10-23");
});

test("empty, future-only and finished schedules have useful defaults", () => {
  const now = new Date("2026-10-20T14:00:00Z");
  assert.equal(selectScoreboardDate([], now), "");
  assert.equal(selectScoreboardDate(["", null], now), "");
  assert.equal(selectScoreboardDate(["2026-10-23", "2026-10-22"], now), "2026-10-22");
  assert.equal(selectScoreboardDate(dates, new Date("2026-12-01T14:00:00Z")), "2026-10-23");
});

test("Eastern cutoff follows spring and fall daylight-saving transitions", () => {
  for (const [day, before, at] of [
    ["2026-03-08", "2026-03-08T09:59:59Z", "2026-03-08T10:00:00Z"],
    ["2026-11-01", "2026-11-01T10:59:59Z", "2026-11-01T11:00:00Z"],
  ]) {
    const previous = day === "2026-03-08" ? "2026-03-07" : "2026-10-31";
    assert.equal(selectScoreboardDate([previous, day], new Date(before)), previous);
    assert.equal(selectScoreboardDate([previous, day], new Date(at)), day);
  }
});
