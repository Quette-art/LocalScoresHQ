import { getToken, onMessage } from "firebase/messaging";
import { auth, messaging } from "./firebase";

const VAPID_KEY =
  "BNny-7eH1KX7HwtjWWaGl88kk6sk1XNfwuuAxpoLNxOFFCk1JhfIL5HMOGQ1EH-9FoCPckgDios-22-sFzH0x-A";

const PREFS_KEY = "lshq_notification_prefs";
const SNAPSHOT_KEY = "lshq_game_snapshot";
const TOKEN_KEY = "lshq_fcm_token";
const WEB_PUSH_PUBLIC_VAPID_KEY =
  "BIOvNUEUHst_fzcKQQpuhmHSOJOBk_lf_VxBJfQH8zyyhlmbmHllPViAM-iYkuBGROMUSzYTstkb8CN2tgcjLRE";
const WEB_PUSH_KEY_VERSION = "2026-10-14-v3";

let messagingRegistrationPromise = null;

function isAppleMobileDevice() {
  if (typeof navigator === "undefined") return false;

  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent || "") ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function shouldUseStandardsWebPush() {
  return (
    isAppleMobileDevice() &&
    typeof window !== "undefined" &&
    "PushManager" in window &&
    "serviceWorker" in navigator
  );
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function getPrefs() {
  try {
    return (
      JSON.parse(localStorage.getItem(PREFS_KEY)) || {
        enabled: false,
        scores: true,
        schedule: true,
      }
    );
  } catch {
    return { enabled: false, scores: true, schedule: true };
  }
}

export function saveNotificationPrefs(prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function getNotificationPrefs() {
  return getPrefs();
}

function favoriteKeys() {
  try {
    return JSON.parse(localStorage.getItem("favoriteTeams")) || [];
  } catch {
    return [];
  }
}

function getInstallationId() {
  let id = localStorage.getItem("lshq_installation_id");
  if (id) return id;

  id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `lshq-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  localStorage.setItem("lshq_installation_id", id);
  return id;
}

function getPushTestSecret() {
  const key = "lshq_web_push_test_secret";
  let value = localStorage.getItem(key);
  if (value && /^[a-zA-Z0-9_-]{43}$/.test(value)) return value;

  // Never use Math.random for a device authorization secret.
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  value = btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  localStorage.setItem(key, value);
  return value;
}

function isHomeScreenApp() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

/** Request a remote Apple Web Push test for this installation only. */
export async function sendIphonePushTest() {
  if (!isAppleMobileDevice()) {
    throw new Error("This test is for the iPhone or iPad Home Screen app.");
  }
  if (!isHomeScreenApp()) {
    throw new Error("Open LocalScoresHQ from the Home Screen icon, not a Safari tab.");
  }
  if (!shouldUseStandardsWebPush()) {
    throw new Error("This device does not support Apple Web Push. Update iOS if needed.");
  }
  if (typeof Notification === "undefined" || Notification.permission !== "granted") {
    throw new Error("Allow LocalScoresHQ notifications in your iPhone Settings first.");
  }

  const prefs = getPrefs();
  if (!prefs.enabled) {
    throw new Error("Turn on notifications in LocalScoresHQ before testing.");
  }

  const registered = await syncStandardsWebPush({
    prefs,
    favorites: favoriteKeys(),
  });
  if (!registered) {
    throw new Error("Could not register this iPhone for push. Try disabling and re-enabling alerts.");
  }

  const response = await fetch("/api/push/test-web", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      installationId: getInstallationId(),
      testSecret: getPushTestSecret(),
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Unable to send the test notification.");
  }
  return true;
}

async function getMessagingServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  if (!messagingRegistrationPromise) {
    messagingRegistrationPromise = navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      { scope: "/firebase-cloud-messaging-push-scope" }
    );
  }

  return messagingRegistrationPromise;
}

async function getFirebaseMessagingToken() {
  if (!messaging) return null;

  try {
    const registration = await getMessagingServiceWorker();
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      ...(registration ? { serviceWorkerRegistration: registration } : {}),
    });

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      return token;
    }
  } catch (error) {
    console.error("FCM token error:", error);
  }

  return null;
}

async function getStandardsWebPushSubscription({ create = true } = {}) {
  if (!shouldUseStandardsWebPush()) return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (
      subscription &&
      create &&
      localStorage.getItem("lshq_web_push_key_version") !==
        WEB_PUSH_KEY_VERSION
    ) {
      await subscription.unsubscribe();
      subscription = null;
    }

    if (!subscription && create) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          WEB_PUSH_PUBLIC_VAPID_KEY
        ),
      });

      localStorage.setItem(
        "lshq_web_push_key_version",
        WEB_PUSH_KEY_VERSION
      );
    }

    return subscription;
  } catch (error) {
    console.error("Standards Web Push subscription error:", error);
    return null;
  }
}

async function syncStandardsWebPush({ prefs, favorites }) {
  const shouldCreate =
    prefs.enabled &&
    typeof Notification !== "undefined" &&
    Notification.permission === "granted";

  const subscription = await getStandardsWebPushSubscription({
    create: shouldCreate,
  });

  if (!subscription) {
    return !shouldCreate;
  }

  try {
    const response = await fetch("/api/push/register-web", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        favorites,
        prefs,
        enabled: prefs.enabled !== false,
        fcmTokenToRemove: localStorage.getItem(TOKEN_KEY) || "",
        keyVersion: WEB_PUSH_KEY_VERSION,
        installationId: getInstallationId(),
        testSecret: getPushTestSecret(),
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Web Push registration returned ${response.status}`
      );
    }

    localStorage.removeItem(TOKEN_KEY);
    return true;
  } catch (error) {
    console.error("Standards Web Push sync failed:", error);
    return false;
  }
}

export async function syncPushSubscription(overrides = {}) {
  if (typeof window === "undefined") return false;

  const prefs = overrides.prefs || getPrefs();
  const favorites = overrides.favorites || favoriteKeys();

  if (shouldUseStandardsWebPush()) {
    return syncStandardsWebPush({ prefs, favorites });
  }

  let token = overrides.token || localStorage.getItem(TOKEN_KEY);

  if (
    prefs.enabled &&
    typeof Notification !== "undefined" &&
    Notification.permission === "granted"
  ) {
    const refreshedToken = await getFirebaseMessagingToken();
    if (refreshedToken) token = refreshedToken;
  }

  if (!token || token.length < 20) return false;

  try {
    const response = await fetch("/api/push/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        favorites,
        prefs,
        enabled: prefs.enabled !== false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Push registration returned ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Push subscription sync failed:", error);
    return false;
  }
}

export const requestNotificationPermission = async () => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return null;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      const next = { ...getPrefs(), enabled: false };
      saveNotificationPrefs(next);
      await syncPushSubscription({
        prefs: next,
        token: localStorage.getItem(TOKEN_KEY),
      });
      return null;
    }

    const next = { ...getPrefs(), enabled: true };
    saveNotificationPrefs(next);

    if (shouldUseStandardsWebPush()) {
      const registered = await syncStandardsWebPush({
        prefs: next,
        favorites: favoriteKeys(),
      });
      if (!registered) {
        saveNotificationPrefs({ ...next, enabled: false });
      }
      return registered ? "web-push" : null;
    }

    const token = await getFirebaseMessagingToken();
    if (token) {
      await syncPushSubscription({
        token,
        prefs: next,
      });
      return token;
    }

    saveNotificationPrefs({ ...next, enabled: false });
    return null;
  } catch (error) {
    console.error("Notification permission error:", error);
    return null;
  }
};

export function showLocalNotification(title, body, options = {}) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const prefs = getPrefs();
  if (!prefs.enabled) return;

  const notificationOptions = {
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: options.tag || `lshq-${Date.now()}`,
    renotify: true,
    data: options.data || {},
  };

  const fallbackToWindowNotification = () => {
    try {
      const notification = new Notification(title, notificationOptions);
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error("Show notification failed:", error);
    }
  };

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .getRegistration()
      .then((registration) => {
        if (registration) {
          return registration.showNotification(title, notificationOptions);
        }
        fallbackToWindowNotification();
        return null;
      })
      .catch((error) => {
        console.error("Service worker notification failed:", error);
        fallbackToWindowNotification();
      });
    return;
  }

  fallbackToWindowNotification();
}

function isFavoriteGame(game, favorites) {
  if (!favorites.length) return false;
  const d = game.division || "Unknown";
  return (
    favorites.includes(`${game.team1}-${d}`) ||
    favorites.includes(`${game.team2}-${d}`) ||
    favorites.includes(game.team1) ||
    favorites.includes(game.team2)
  );
}

function snapshotFromGames(games) {
  const map = {};
  games.forEach((game) => {
    if (!game?.id) return;
    map[game.id] = {
      score1: game.score1 ?? null,
      score2: game.score2 ?? null,
      status: game.status || null,
      date: game.date || "",
      time: game.time || "",
      team1: game.team1 || "",
      team2: game.team2 || "",
      location: game.location || "",
      division: game.division || "Unknown",
    };
  });
  return map;
}

function loadSnapshot() {
  try {
    const saved =
      localStorage.getItem(SNAPSHOT_KEY) ||
      sessionStorage.getItem(SNAPSHOT_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveSnapshot(map) {
  localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(map));
}

/** Compare live games to the last snapshot and notify while the app is open. */
export function notifyGameChanges(games) {
  if (!Array.isArray(games) || games.length === 0) return;

  const prefs = getPrefs();
  const next = snapshotFromGames(games);

  if (
    !prefs.enabled ||
    typeof Notification === "undefined" ||
    Notification.permission !== "granted"
  ) {
    saveSnapshot(next);
    return;
  }

  const favorites = favoriteKeys();
  const prev = loadSnapshot();

  if (!prev) {
    if (prefs.schedule && favorites.length) {
      games
        .filter((game) => game?.notificationTest && isFavoriteGame(game, favorites))
        .forEach((game) => {
          const when = `${game.date || "TBD"} ${game.time || ""}`.trim();
          showLocalNotification(
            "New game added",
            `${game.team1} vs ${game.team2} — ${when}`,
            { tag: `new-game-${game.id}` }
          );
        });
    }
    saveSnapshot(next);
    return;
  }

  if (!favorites.length) {
    saveSnapshot(next);
    return;
  }

  Object.keys(next).forEach((id) => {
    const before = prev[id];
    const after = next[id];
    if (!after) return;

    const matched = games.find((game) => game.id === id);
    if (matched) {
      if (!isFavoriteGame(matched, favorites)) return;
    } else if (!isFavoriteGame(after, favorites)) {
      return;
    }

    const label = `${after.team1} vs ${after.team2}`;

    if (prefs.schedule && !before) {
      showLocalNotification(
        "New game added",
        `${label} — ${after.date || "TBD"} ${after.time || ""}`.trim(),
        { tag: `new-game-${id}` }
      );
      return;
    }

    if (prefs.scores && before) {
      const scoreChanged =
        before.score1 !== after.score1 || before.score2 !== after.score2;

      if (
        scoreChanged &&
        after.score1 != null &&
        after.score2 != null
      ) {
        showLocalNotification(
          "Final score",
          `${after.team1} ${after.score1}–${after.score2} ${after.team2}`,
          { tag: `score-${id}` }
        );
      }
    }

    if (prefs.schedule && before) {
      const status = String(after.status || "").toLowerCase();
      const prevStatus = String(before.status || "").toLowerCase();

      if (
        status !== prevStatus &&
        (status === "cancelled" || status === "postponed")
      ) {
        showLocalNotification(
          status === "cancelled" ? "Game cancelled" : "Game postponed",
          label,
          { tag: `status-${id}` }
        );
      } else if (before.date !== after.date || before.time !== after.time) {
        showLocalNotification(
          "Schedule change",
          `${label} — ${after.date || "TBD"} ${after.time || ""}`.trim(),
          { tag: `schedule-${id}` }
        );
      } else if (before.location !== after.location && after.location) {
        showLocalNotification(
          "Location change",
          `${label} @ ${after.location}`,
          { tag: `location-${id}` }
        );
      }
    }
  });

  saveSnapshot(next);
}

export async function sendAdminGamePush(action, game, before = null) {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    const idToken = await user.getIdToken();
    const response = await fetch("/api/push/game-update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        action,
        game,
        before,
      }),
    });

    if (!response.ok) {
      throw new Error(`Push update returned ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Background push send failed:", error);
    return false;
  }
}

function handleForegroundPayload(payload) {
  const title =
    payload?.notification?.title ||
    payload?.data?.title ||
    "Local Scores HQ";
  const body =
    payload?.notification?.body ||
    payload?.data?.body ||
    "New update";

  showLocalNotification(title, body, {
    tag: payload?.data?.tag || "fcm-foreground",
    data: {
      url: payload?.data?.url || "/",
    },
  });
}

export function listenForForegroundPush() {
  if (!messaging) return () => {};
  return onMessage(messaging, handleForegroundPayload);
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      handleForegroundPayload(payload);
      resolve(payload);
    });
  });
