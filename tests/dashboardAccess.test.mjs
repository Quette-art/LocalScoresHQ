import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import handler from "../api/admin/score-dashboard.js";

async function request(method, authorization) {
  const result = { headers: {} };
  const res = {
    setHeader(key, value) { result.headers[key] = value; },
    status(value) { result.status = value; return this; },
    json(value) { result.body = value; return this; },
  };
  await handler({ method, headers: { authorization } }, res);
  return result;
}

test("unsigned dashboard reads and writes are denied even without backend configuration", async () => {
  for (const method of ["GET", "POST"]) {
    for (const authorization of [undefined, "", "Bearer ", "Basic example"]) {
      const response = await request(method, authorization);
      assert.equal(response.status, 403);
      assert.deepEqual(response.body, { error: "Admin sign-in required." });
      assert.equal(response.headers["Cache-Control"], "private, no-store");
    }
  }
});

test("missing backend configuration returns a controlled service-unavailable response", async () => {
  const original = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  delete process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  try {
    const response = await request("GET", "Bearer test-token");
    assert.equal(response.status, 503);
    assert.equal(response.body.error, "Dashboard service is not configured for this environment.");
  } finally {
    if (original !== undefined) process.env.FIREBASE_SERVICE_ACCOUNT_JSON = original;
  }
});

test("preview builds skip live push sync even when a server credential is present", () => {
  const result = spawnSync(process.execPath, ["scripts/syncPushSchedule.mjs"], {
    cwd: new URL("..", import.meta.url),
    env: { ...process.env, VERCEL_ENV: "preview", FIREBASE_SERVICE_ACCOUNT_JSON: "invalid-test-value" },
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Push schedule sync skipped: preview deployment/);
});
