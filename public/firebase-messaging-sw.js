/* global importScripts, firebase */
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
  const data = payload.data || {};
  self.registration.showNotification(data.title || "LocalScoresHQ", {
    body: data.body || "New game update",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: data.gameId || "localscores-update",
    data: { url: data.link || "/" }
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => "focus" in client);
      if (existing) {
        existing.navigate(url);
        return existing.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
