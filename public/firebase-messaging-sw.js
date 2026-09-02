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
  const notification = payload.notification || {};
  self.registration.showNotification(notification.title || "LocalScoresHQ", {
    body: notification.body || "New game update",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: payload.data?.gameId || "localscores-update",
    data: { url: payload.fcmOptions?.link || "/" }
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data?.url || "/"));
});
