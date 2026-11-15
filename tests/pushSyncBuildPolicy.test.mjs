import assert from "node:assert/strict";
import test from "node:test";
import { runPushScheduleSync } from "../scripts/pushSyncBuildPolicy.mjs";

test("Firestore quota exhaustion does not reject a website build", async () => {
  for (const code of [8, "resource-exhausted", "RESOURCE_EXHAUSTED"]) {
    const warnings = [];
    await runPushScheduleSync(async () => { throw Object.assign(new Error("Quota exceeded"), { code }); }, message => warnings.push(message));
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /notification delivery is not confirmed/);
  }
});

test("unexpected sync failures still fail the build and successful sync runs once", async () => {
  const failure = Object.assign(new Error("Invalid credentials"), { code: 16 });
  await assert.rejects(runPushScheduleSync(async () => { throw failure; }), error => error === failure);
  let runs = 0;
  await runPushScheduleSync(async () => { runs++; }, () => assert.fail("unexpected warning"));
  assert.equal(runs, 1);
});
