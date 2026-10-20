import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

test("Favorites renders result and next game together; empty view offers team search", async () => {
  const originalStorage = globalThis.localStorage;
  let favorites = ["Anacostia-Varsity"];
  globalThis.localStorage = { getItem: () => JSON.stringify(favorites) };
  const server = await createServer({
    configFile: false, server: { middlewareMode: true }, appType: "custom",
    plugins: [{
      name: "mock-favorite-notifications", enforce: "pre",
      resolveId(id, importer) {
        if (importer?.endsWith("/FavoritesTab.jsx") && id === "../notifications") return "\0favorite-notifications";
      },
      load(id) {
        if (id === "\0favorite-notifications") return "export async function syncPushSubscription() {}";
      },
    }],
  });
  try {
    const { default: FavoritesTab } = await server.ssrLoadModule("/src/components/FavoritesTab.jsx");
    const now = new Date();
    const previous = new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10);
    const upcoming = new Date(now.getTime() + 7 * 86400000).toISOString().slice(0, 10);
    const base = { sport: "Football", division: "Varsity", ageGroup: "Varsity", team1: "Anacostia", team2: "Cardozo", time: "6:00 PM" };
    const props = { games: [
      { ...base, id: "played", date: previous, score1: 28, score2: 6 },
      { ...base, id: "upcoming", date: upcoming, score1: null, score2: null },
    ] };
    const html = renderToString(React.createElement(FavoritesTab, props));
    assert.match(html, /Your teams at a glance/);
    assert.match(html, /Latest result/);
    assert.match(html, /W<!-- --> <!-- -->28<!-- -->–<!-- -->6/);
    assert.match(html, /Next game/);
    assert.match(html, /6:00 PM/);
    assert.doesNotMatch(html, /Varsity • Varsity|\\u2022|\\u203A/);
    favorites = [];
    const empty = renderToString(React.createElement(FavoritesTab, props));
    assert.match(empty, /Find your team/);
    assert.doesNotMatch(empty, /favoriteSummaryCard/);
  } finally {
    await server.close();
    if (originalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = originalStorage;
  }
});
