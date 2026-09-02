import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

const getAdminApp = () => {
  if (getApps().length) return getApp();
  const raw = globalThis.process?.env?.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("notifications_not_configured");
  const serviceAccount = JSON.parse(raw);
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }
  return initializeApp({ credential: cert(serviceAccount) });
};

const json = (response, status, body) => response.status(status).json(body);
const cleanStringArray = (value, max = 200) =>
  Array.isArray(value)
    ? value.filter((item) => typeof item === "string").slice(0, max)
    : [];

const eventCopy = (event) => {
  const game = event.game || {};
  const matchup = `${game.team1 || "Team 1"} vs ${game.team2 || "Team 2"}`;
  const score = `${game.score1 ?? "-"}-${game.score2 ?? "-"}`;

  if (event.type === "gameFinished") {
    return { title: `Final: ${matchup}`, body: `${score} • ${game.sport || "Game"}` };
  }
  if (event.type === "scoreUpdate") {
    return { title: `Score update: ${matchup}`, body: score };
  }
  if (event.type === "scheduleChange") {
    return {
      title: `Schedule update: ${matchup}`,
      body: event.summary || `${game.date || "Date TBD"} at ${game.time || "TBD"}`,
    };
  }
  if (event.type === "gameStatus") {
    return {
      title: `${matchup} ${String(game.status || "updated").toUpperCase()}`,
      body: `${game.date || "Date TBD"} • ${game.location || "Location TBD"}`,
    };
  }
  return { title: matchup, body: "LocalScoresHQ game update" };
};

const matchesEvent = (subscription, event) => {
  const game = event.game || {};
  const keys = [game.team1, game.team2]
    .filter(Boolean)
    .map((team) => `${team}-${game.division || "Unknown"}`);
  const alertType =
    event.type === "gameFinished"
      ? "gameFinished"
      : event.type === "scoreUpdate"
        ? "scoreUpdates"
        : "scheduleChanges";

  return keys.some((key) => subscription.teamAlerts?.[key]?.[alertType] === true);
};

export default async function handler(request, response) {
  if (request.method !== "POST") return json(response, 405, { error: "method_not_allowed" });

  let app;
  try {
    app = getAdminApp();
  } catch (error) {
    console.error(error);
    return json(response, 503, { error: "notifications_not_configured" });
  }

  const body = request.body || {};
  const firestore = getFirestore(app);

  if (body.action === "subscribe") {
    if (typeof body.deviceId !== "string" || typeof body.token !== "string") {
      return json(response, 400, { error: "invalid_subscription" });
    }
    await firestore.collection("notificationSubscriptions").doc(body.deviceId.slice(0, 128)).set(
      {
        token: body.token.slice(0, 4096),
        favoriteTeams: cleanStringArray(body.favoriteTeams),
        teamAlerts: body.teamAlerts && typeof body.teamAlerts === "object" ? body.teamAlerts : {},
        enabled: true,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return json(response, 200, { ok: true });
  }

  if (body.action === "unsubscribe") {
    if (typeof body.deviceId === "string") {
      await firestore.collection("notificationSubscriptions").doc(body.deviceId.slice(0, 128)).delete();
    }
    return json(response, 200, { ok: true });
  }

  if (body.action !== "send" || !body.event?.type) {
    return json(response, 400, { error: "invalid_action" });
  }

  const bearer = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!bearer) return json(response, 401, { error: "admin_sign_in_required" });

  try {
    const decoded = await getAuth(app).verifyIdToken(bearer);
    const adminEmail = globalThis.process?.env?.NOTIFICATION_ADMIN_EMAIL;
    if (adminEmail && decoded.email !== adminEmail) {
      return json(response, 403, { error: "admin_required" });
    }
  } catch {
    return json(response, 401, { error: "invalid_admin_token" });
  }

  const snapshot = await firestore.collection("notificationSubscriptions").where("enabled", "==", true).get();
  const recipients = snapshot.docs.filter((item) => matchesEvent(item.data(), body.event));
  if (!recipients.length) return json(response, 200, { ok: true, sent: 0 });

  const copy = eventCopy(body.event);
  const gameId = String(body.event.game?.id || body.event.game?.gameId || "");
  const result = await getMessaging(app).sendEachForMulticast({
    tokens: recipients.map((item) => item.data().token),
    notification: copy,
    data: { gameId, type: String(body.event.type) },
    webpush: {
      fcmOptions: { link: gameId ? `https://localscoreshq.com/game?id=${encodeURIComponent(gameId)}` : "https://localscoreshq.com/" },
      notification: { icon: "/icon-192.png", badge: "/icon-192.png", tag: gameId || "localscores-update" },
    },
  });

  const invalidCodes = new Set([
    "messaging/registration-token-not-registered",
    "messaging/invalid-registration-token",
  ]);
  await Promise.all(
    result.responses.map((item, index) =>
      !item.success && invalidCodes.has(item.error?.code)
        ? recipients[index].ref.delete()
        : Promise.resolve()
    )
  );
  return json(response, 200, { ok: true, sent: result.successCount, failed: result.failureCount });
}
