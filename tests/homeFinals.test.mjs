import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

test("Recent Finals pairs each team with its score and highlights only winners", async () => {
  const originalStorage = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => null };
  const server = await createServer({
    configFile: false, server: { middlewareMode: true, hmr: false }, appType: "custom",
    plugins: [{
      name: "stub-home-profile", enforce: "pre",
      resolveId(id, importer) {
        if (importer?.endsWith("/Home.jsx") && id === "./TeamProfile") return "\0home-profile";
      },
      load(id) {
        if (id === "\0home-profile") return "export default function TeamProfile() { return null; }";
      },
    }],
  });
  try {
    const { default: Home } = await server.ssrLoadModule("/src/pages/Home.jsx");
    const base = { sport: "Football", division: "Varsity", time: "7:00 PM" };
    const html = renderToString(React.createElement(Home, { games: [
      { ...base, id: "forfeit", date: "2026-10-25", team1: "Gwynn Park", team2: "Friendly", score1: "W", score2: "L", forfeit: true },
      { ...base, id: "away-win", date: "2026-10-24", team1: "Paul VI", team2: "Archbishop Carroll", score1: 0, score2: 43 },
      { ...base, id: "home-win", date: "2026-10-23", team1: "Wise", team2: "Suitland", score1: 14, score2: 7 },
      { ...base, id: "tie", date: "2026-10-22", team1: "Bowie", team2: "Parkdale", score1: 0, score2: 0 },
    ] }));
    const finals = html.slice(html.indexOf("Recent Finals"));
    const rows = [...finals.matchAll(/<div class="home-final-team (is-[a-z]+)">([\s\S]*?)<\/div>/g)];
    const expected = [
      ["Gwynn Park", "W", "is-winner"], ["Friendly", "L", "is-loser"],
      ["Paul VI", 0, "is-loser"], ["Archbishop Carroll", 43, "is-winner"],
      ["Wise", 14, "is-winner"], ["Suitland", 7, "is-loser"],
      ["Bowie", 0, "is-tied"], ["Parkdale", 0, "is-tied"],
    ];
    assert.equal(rows.length, expected.length);
    expected.forEach(([name, score, result], index) => {
      assert.equal(rows[index][1], result);
      assert.ok(rows[index][2].includes(`<span class="home-final-team-name">${name}</span>`));
      assert.ok(rows[index][2].includes(`<b class="home-final-score">${score}</b>`));
    });
    assert.doesNotMatch(finals, /class="score-display"|>VS</);
  } finally {
    await server.close();
    if (originalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = originalStorage;
  }
});
