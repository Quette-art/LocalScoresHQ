import test from "node:test";
import assert from "node:assert/strict";
import { installZoomGuard } from "../src/zoomGuard.js";

function touch(count) {
  const event = new Event("touchmove", { cancelable: true });
  Object.defineProperty(event, "touches", { value: Array(count).fill({}) });
  return event;
}

test("zoom guard blocks pinching while preserving single-finger scrolling", () => {
  const target = new EventTarget();
  const uninstall = installZoomGuard(target);
  const scroll = touch(1);
  target.dispatchEvent(scroll);
  assert.equal(scroll.defaultPrevented, false);
  const pinch = touch(2);
  target.dispatchEvent(pinch);
  assert.equal(pinch.defaultPrevented, true);
  uninstall();
  const afterRemoval = touch(2);
  target.dispatchEvent(afterRemoval);
  assert.equal(afterRemoval.defaultPrevented, false);
});

test("Safari gesture zoom is cancelled without blocking normal taps", () => {
  const target = new EventTarget();
  installZoomGuard(target);
  for (const type of ["gesturestart", "gesturechange"]) {
    const event = new Event(type, { cancelable: true });
    target.dispatchEvent(event);
    assert.equal(event.defaultPrevented, true);
  }
  const tap = new Event("click", { cancelable: true });
  target.dispatchEvent(tap);
  assert.equal(tap.defaultPrevented, false);
});
