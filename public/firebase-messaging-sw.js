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
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon-192.png"
  });
});