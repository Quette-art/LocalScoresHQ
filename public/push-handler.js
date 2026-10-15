self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    return;
  }

  if (payload?.provider !== "webpush") return;

  const title = payload.title || "Local Scores HQ";
  const options = {
    body: payload.body || "New update",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: payload.tag || "lshq-webpush",
    renotify: true,
    data: {
      url: payload.url || "https://localscoreshq.com/",
      gameId: payload.gameId || "",
      kind: payload.kind || "update",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl =
    event.notification?.data?.url ||
    "https://localscoreshq.com/";

  event.waitUntil(
    self.clients
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

        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }

        return null;
      })
  );
});
