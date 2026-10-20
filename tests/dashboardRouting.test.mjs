import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
const app = readFileSync(new URL("../src/AppContent.jsx", import.meta.url), "utf8");

test("dashboard, game, and team deep links load the single-page app", () => {
  const redirects = new Map((config.rewrites || []).map(({ source, destination }) => [source, destination]));
  for (const route of ["/admin/scores", "/game", "/team"]) {
    assert.equal(redirects.get(route), "/index.html", route);
  }
});

test("API endpoints are not rewritten to the public app", () => {
  for (const { source, destination } of config.rewrites || []) {
    assert.ok(!source.startsWith("/api"), "API routes must not be rewritten");
    assert.ok(source !== "/(.*)" && source !== "/:path*", "Do not capture API requests in a catch-all");
    assert.equal(destination, "/index.html");
  }
});

test("dashboard direct URL has a React route and an admin-only view", () => {
  assert.match(app, /path="\/admin\/scores"/);
  assert.match(app, /\{isAdmin \? \(/);
  assert.match(app, /<AdminScoreDashboard games=\{games\}/);
  assert.match(app, /Open admin sign in/);
});

test("opening dashboard from app navigation points to its shareable route", () => {
  assert.match(app, /tab === "admin" \? "\/admin\/scores" : "\/"/);
  assert.match(app, /if \(location.pathname === "\/admin\/scores"\)/);
});
