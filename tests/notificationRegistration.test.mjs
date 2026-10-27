import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

test("notification opt-in only succeeds when registration succeeds", async () => {
  const names = ["window", "navigator", "Notification", "localStorage", "fetch"];
  const originals = Object.fromEntries(names.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const storage = new Map();
  const set = (key, value) => Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  const notification = { permission: "granted", requestPermission: async () => "granted" };
  set("Notification", notification);
  set("window", { Notification: notification });
  set("navigator", { userAgent: "test browser" });
  set("localStorage", { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) });
  let registrationOk = false;
  set("fetch", async () => ({ ok: registrationOk, status: 503 }));
  const server = await createServer({
    configFile: false, ssr: { noExternal: ["firebase"] }, server: { middlewareMode: true, hmr: false }, appType: "custom",
    plugins: [{ name: "stub-push-services", enforce: "pre",
      resolveId(id, importer) {
        if (id === "firebase/messaging") return "\0mock-messaging";
        if (id === "./firebase" && importer?.endsWith("/notifications.js")) return "\0mock-firebase";
      },
      load(id) {
        if (id === "\0mock-messaging") return 'export async function getToken() { return "a-valid-token-longer-than-twenty-characters"; } export function onMessage() {}';
        if (id === "\0mock-firebase") return 'export const auth = {}; export const messaging = {};';
      },
    }],
  });
  try {
    const { requestNotificationPermission, getNotificationPrefs } = await server.ssrLoadModule("/src/notifications.js");
    assert.equal(await requestNotificationPermission(), null);
    assert.equal(getNotificationPrefs().enabled, false);
    registrationOk = true;
    assert.ok(await requestNotificationPermission());
    assert.equal(getNotificationPrefs().enabled, true);
    notification.requestPermission = async () => "denied";
    assert.equal(await requestNotificationPermission(), null);
    assert.equal(getNotificationPrefs().enabled, false);
  } finally {
    await server.close();
    for (const key of names) {
      if (originals[key]) Object.defineProperty(globalThis, key, originals[key]);
      else delete globalThis[key];
    }
  }
});
