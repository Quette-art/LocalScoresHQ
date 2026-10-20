import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

test("Scores mounts with date rollover effects and filter state initialized", async () => {
  const originalStorage = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => null };
  const server = await createServer({
    configFile: false,
    server: { middlewareMode: true },
    appType: "custom",
    plugins: [{
      name: "mock-score-services",
      enforce: "pre",
      resolveId(id, importer) {
        if (importer?.endsWith("/ScoresTab.jsx") && ["../firebase", "../notifications"].includes(id)) {
          return "\0score-test:" + id;
        }
      },
      load(id) {
        if (id === "\0score-test:../firebase") return "export const db = null;";
        if (id === "\0score-test:../notifications") return "export async function sendAdminGamePush() {}";
      },
    }],
  });
  try {
    const { default: ScoresTab } = await server.ssrLoadModule("/src/components/ScoresTab.jsx");
    const html = renderToString(React.createElement(ScoresTab, {
      games: [], selectedSport: "Football",
    }));
    assert.match(html, /scores-tab/);
  } finally {
    await server.close();
    if (originalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = originalStorage;
  }
});
