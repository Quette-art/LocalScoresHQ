importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBwmD_2i3vH-fn2vmQcHcY53Rt_j-c7ROo",
  authDomain: "localscore-27a63.firebaseapp.com",
  projectId: "localscore-27a63",
  storageBucket: "localscore-27a63.firebasestorage.app",
  messagingSenderId: "618366364635",
  appId: "1:618366364635:web:269fdc5ef956594c6715fe"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title =
    payload?.notification?.title ||
    payload?.data?.title ||
    "Local Scores HQ";
  const body =
    payload?.notification?.body ||
    payload?.data?.body ||
    "New update";

  self.registration.showNotification(title, {
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: payload?.data?.tag || "lshq-background",
    renotify: true,
    data: {
      url: payload?.data?.url || "/",
      gameId: payload?.data?.gameId || "",
      kind: payload?.data?.kind || "update",
    },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl =
    event.notification?.data?.url ||
    "https://localscoreshq.com/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate?.(targetUrl);
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }

        return null;
      })
  );
});
