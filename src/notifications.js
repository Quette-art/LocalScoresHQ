import { getToken, onMessage } from "firebase/messaging";
import { auth, messaging } from "./firebase";

const VAPID_KEY =
  "BNny-7eH1KX7HwtjWWaGl88kk6sk1XNfwuuAxpoLNxOFFCk1JhfIL5HMOGQ1EH-9FoCPckgDios-22-sFzH0x-A";

const PREFS_KEY = "lshq_notification_prefs";
const SNAPSHOT_KEY = "lshq_game_snapshot";
const TOKEN_KEY = "lshq_fcm_token";

let messagingRegistrationPromise = null;

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

export async function syncPushSubscription(overrides = {}) {
  if (typeof window === "undefined") return false;

  const prefs = overrides.prefs || getPrefs();
  const favorites = overrides.favorites || favoriteKeys();

  let token = overrides.token || localStorage.getItem(TOKEN_KEY);
  if (
    prefs.enabled &&
    typeof Notification !== "undefined" &&
    Notification.permission === "granted" &&
    (!token || token.length < 20)
  ) {
    token = await getFirebaseMessagingToken();
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

    const token = await getFirebaseMessagingToken();
    if (token) {
      await syncPushSubscription({
        token,
        prefs: next,
      });
      return token;
    }

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

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;

    onMessage(messaging, (payload) => {
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
      resolve(payload);
    });
  });
