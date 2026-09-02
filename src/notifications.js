import { getToken, isSupported, onMessage } from "firebase/messaging";
import { auth, messaging } from "./firebase";

const VAPID_KEY =
  "BNny-7eH1KX7HwtjWWaGl88kk6sk1XNfwuuAxpoLNxOFFCk1JhfIL5HMOGQ1EH-9FoCPckgDios-22-sFzH0x-A";
const DEVICE_ID_KEY = "notificationDeviceId";
const TOKEN_KEY = "notificationToken";

const getStoredJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

const getDeviceId = () => {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
};

const postSubscription = async (action, token) => {
  const response = await fetch("/api/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action,
      deviceId: getDeviceId(),
      token,
      favoriteTeams: getStoredJson("favoriteTeams", []),
      teamAlerts: getStoredJson("teamAlerts", {}),
    }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || "Unable to save notification settings.");
  }
};

export const getNotificationState = () => {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "denied") return "blocked";
  if (Notification.permission === "granted") return "enabled";
  return "off";
};

export const enableNotifications = async () => {
  if (!("Notification" in window) || !("serviceWorker" in navigator) || !messaging) {
    throw new Error("Notifications are not supported in this browser.");
  }

  // Keep the permission prompt directly inside the user's click. This is
  // required by iOS when the PWA is opened from the Home Screen.
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error(
      permission === "denied"
        ? "Notifications are blocked. Enable them in your browser settings."
        : "Notification permission was not granted."
    );
  }

  if (!(await isSupported())) {
    throw new Error("Notifications are not supported in this browser.");
  }

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
    { scope: "/firebase-cloud-messaging-push-scope" }
  );
  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (!token) throw new Error("This device could not be registered.");
  localStorage.setItem(TOKEN_KEY, token);
  await postSubscription("subscribe", token);
  return token;
};

export const syncNotificationSubscription = async () => {
  let token = localStorage.getItem(TOKEN_KEY);
  if (!token || getNotificationState() !== "enabled") return false;

  const registration = await navigator.serviceWorker.getRegistration(
    "/firebase-cloud-messaging-push-scope"
  );
  if (registration && messaging) {
    token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    if (token) localStorage.setItem(TOKEN_KEY, token);
  }

  await postSubscription("subscribe", token);
  return true;
};

export const disableNotifications = async () => {
  const token = localStorage.getItem(TOKEN_KEY);
  await postSubscription("unsubscribe", token).catch(() => {});
  localStorage.removeItem(TOKEN_KEY);
};

export const listenForForegroundNotifications = (callback) => {
  if (!messaging) return () => {};
  try {
    return onMessage(messaging, callback);
  } catch {
    return () => {};
  }
};

export const sendNotificationEvent = async (event) => {
  const user = auth.currentUser;
  if (!user) return { skipped: true };

  try {
    const idToken = await user.getIdToken();
    const response = await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ action: "send", event }),
    });
    return await response.json().catch(() => ({ ok: response.ok }));
  } catch (error) {
    console.warn("Score saved, but the alert could not be sent.", error);
    return { error: error.message };
  }
};
