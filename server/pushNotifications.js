import crypto from "node:crypto";
import webpush from "web-push";
import { getFirebaseAdmin } from "./firebaseAdmin.js";

const FCM_SUBSCRIPTIONS_COLLECTION = "pushSubscriptions";
const WEB_PUSH_SUBSCRIPTIONS_COLLECTION = "webPushSubscriptions";
const WEB_PUSH_PUBLIC_VAPID_KEY =
  "BIOvNUEUHst_fzcKQQpuhmHSOJOBk_lf_VxBJfQH8zyyhlmbmHllPViAM-iYkuBGROMUSzYTstkb8CN2tgcjLRE";

function cleanFavorites(favorites) {
  if (!Array.isArray(favorites)) return [];
  return [
    ...new Set(
      favorites
        .filter((value) => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean)
        .slice(0, 100)
    ),
  ];
}

function normalizePrefs(prefs = {}) {
  return {
    enabled: prefs.enabled !== false,
    scores: prefs.scores !== false,
    schedule: prefs.schedule !== false,
  };
}

function hashId(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function tokenSubscriptionId(token) {
  return hashId(token);
}

function webSubscriptionId(subscription) {
  return hashId(String(subscription?.endpoint || ""));
}

function normalizeWebSubscription(subscription) {
  const endpoint = String(subscription?.endpoint || "");
  const p256dh = String(subscription?.keys?.p256dh || "");
  const auth = String(subscription?.keys?.auth || "");

  if (
    !endpoint.startsWith("https://") ||
    endpoint.length > 4096 ||
    !p256dh ||
    !auth
  ) {
    throw new Error("Invalid Web Push subscription.");
  }

  return {
    endpoint,
    expirationTime: subscription?.expirationTime ?? null,
    keys: { p256dh, auth },
  };
}

export async function upsertPushSubscription({
  token,
  favorites,
  prefs,
  userAgent = "",
}) {
  if (typeof token !== "string" || token.length < 20 || token.length > 4096) {
    throw new Error("Invalid push token.");
  }

  const { db, FieldValue } = getFirebaseAdmin();
  const id = tokenSubscriptionId(token);
  const normalizedPrefs = normalizePrefs(prefs);

  if (!normalizedPrefs.enabled) {
    await db.collection(FCM_SUBSCRIPTIONS_COLLECTION).doc(id).delete();
    return { id, removed: true };
  }

  await db.collection(FCM_SUBSCRIPTIONS_COLLECTION).doc(id).set(
    {
      token,
      favorites: cleanFavorites(favorites),
      prefs: normalizedPrefs,
      userAgent: String(userAgent || "").slice(0, 500),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return { id, removed: false };
}

export async function upsertWebPushSubscription({
  subscription,
  favorites,
  prefs,
  userAgent = "",
  fcmTokenToRemove = "",
  keyVersion = "",
  installationId = "",
  testSecret = "",
}) {
  const normalizedSubscription = normalizeWebSubscription(subscription);
  const normalizedPrefs = normalizePrefs(prefs);
  const { db, FieldValue } = getFirebaseAdmin();
  const cleanInstallationId =
    typeof installationId === "string"
      ? installationId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 128)
      : "";
  const id = cleanInstallationId
    ? `install-${cleanInstallationId}`
    : webSubscriptionId(normalizedSubscription);
  const testSecretHash =
    typeof testSecret === "string" && /^[a-zA-Z0-9_-]{43}$/.test(testSecret)
      ? hashId(testSecret)
      : null;

  if (fcmTokenToRemove && typeof fcmTokenToRemove === "string") {
    await db
      .collection(FCM_SUBSCRIPTIONS_COLLECTION)
      .doc(tokenSubscriptionId(fcmTokenToRemove))
      .delete();
  }

  if (!normalizedPrefs.enabled) {
    await db.collection(WEB_PUSH_SUBSCRIPTIONS_COLLECTION).doc(id).delete();
    return { id, removed: true };
  }

  await db.collection(WEB_PUSH_SUBSCRIPTIONS_COLLECTION).doc(id).set(
    {
      subscription: normalizedSubscription,
      favorites: cleanFavorites(favorites),
      prefs: normalizedPrefs,
      userAgent: String(userAgent || "").slice(0, 500),
      provider: "web-push",
      ...(testSecretHash ? { testSecretHash } : {}),
      vapidKeyVersion:
        typeof keyVersion === "string"
          ? keyVersion.slice(0, 64)
          : "",
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return { id, removed: false };
}

export async function removePushSubscription(token) {
  if (typeof token !== "string" || !token) return;
  const { db } = getFirebaseAdmin();
  await db
    .collection(FCM_SUBSCRIPTIONS_COLLECTION)
    .doc(tokenSubscriptionId(token))
    .delete();
}

function favoriteCandidates(game = {}) {
  const team1 = String(game.team1 || "").trim();
  const team2 = String(game.team2 || "").trim();
  const division = String(game.division || "Unknown").trim() || "Unknown";

  return new Set(
    [
      team1,
      team2,
      team1 && `${team1}-${division}`,
      team2 && `${team2}-${division}`,
    ].filter(Boolean)
  );
}

function subscriptionMatchesGame(subscription, game, preference) {
  const prefs = normalizePrefs(subscription.prefs);
  if (!prefs.enabled || !prefs[preference]) return false;

  const favorites = cleanFavorites(subscription.favorites);
  if (!favorites.length) return false;

  const candidates = favoriteCandidates(game);
  return favorites.some((favorite) => candidates.has(favorite));
}

function chunks(items, size) {
  const output = [];
  for (let index = 0; index < items.length; index += size) {
    output.push(items.slice(index, index + size));
  }
  return output;
}

const INVALID_TOKEN_CODES = new Set([
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
]);

async function sendFcmPush({
  recipients,
  messaging,
  game,
  title,
  body,
  kind,
  tag,
  url,
}) {
  let sent = 0;
  let failed = 0;
  let removed = 0;

  for (const group of chunks(recipients, 500)) {
    const response = await messaging.sendEachForMulticast({
      tokens: group.map((entry) => entry.token),
      data: {
        title: String(title || "Local Scores HQ"),
        body: String(body || "New update"),
        tag: String(tag || `lshq-${Date.now()}`),
        kind: String(kind || "update"),
        gameId: String(game?.id || ""),
        url: String(url || "https://localscoreshq.com/"),
      },
      webpush: {
        headers: {
          Urgency: "high",
        },
        fcmOptions: {
          link: String(url || "https://localscoreshq.com/"),
        },
      },
    });

    sent += response.successCount;
    failed += response.failureCount;

    const staleRefs = [];
    response.responses.forEach((result, index) => {
      const code = result.error?.code;
      if (code && INVALID_TOKEN_CODES.has(code)) {
        staleRefs.push(group[index].ref);
      }
    });

    if (staleRefs.length) {
      await Promise.all(staleRefs.map((ref) => ref.delete()));
      removed += staleRefs.length;
    }
  }

  return { sent, failed, removed };
}

function configureStandardsWebPush(privateKey) {
  const key = privateKey || process.env.WEB_PUSH_VAPID_PRIVATE_KEY;
  if (!key) {
    throw new Error("WEB_PUSH_VAPID_PRIVATE_KEY is not configured.");
  }

  // Reject a mismatched secret without exposing either key in logs or responses.
  const ecdh = crypto.createECDH("prime256v1");
  ecdh.setPrivateKey(Buffer.from(key, "base64url"));
  if (
    ecdh.getPublicKey(undefined, "uncompressed").toString("base64url") !==
    WEB_PUSH_PUBLIC_VAPID_KEY
  ) {
    throw new Error("Web Push VAPID key pair does not match.");
  }

  webpush.setVapidDetails(
    "mailto:notifications@localscoreshq.com",
    WEB_PUSH_PUBLIC_VAPID_KEY,
    key
  );
}

function pushTestError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

/**
 * Send only to the requesting installed app. The test secret is generated by
 * that device and stored hashed; the one-minute limit prevents push spam.
 */
export async function sendWebPushDiagnostic({ installationId, testSecret }) {
  if (
    typeof installationId !== "string" ||
    !/^[a-zA-Z0-9_-]{12,128}$/.test(installationId) ||
    typeof testSecret !== "string" ||
    !/^[a-zA-Z0-9_-]{43}$/.test(testSecret)
  ) {
    throw pushTestError("Open the home-screen app and enable notifications first.");
  }

  const { db, FieldValue } = getFirebaseAdmin();
  const ref = db
    .collection(WEB_PUSH_SUBSCRIPTIONS_COLLECTION)
    .doc(`install-${installationId}`);

  const subscription = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const saved = snapshot.exists ? snapshot.data() : null;

    if (
      !saved ||
      saved.testSecretHash !== hashId(testSecret) ||
      !saved.prefs?.enabled ||
      !saved.subscription?.endpoint
    ) {
      throw pushTestError("This iPhone is not registered for Web Push yet.", 403);
    }

    const lastTestTime = saved.lastTestAt?.toMillis?.() || 0;
    if (Date.now() - lastTestTime < 60_000) {
      throw pushTestError("Please wait one minute before testing again.", 429);
    }

    transaction.update(ref, { lastTestAt: FieldValue.serverTimestamp() });
    return saved.subscription;
  });

  configureStandardsWebPush();

  // Give the user time to close the app and lock the iPhone.
  await new Promise((resolve) => setTimeout(resolve, 5000));

  await webpush.sendNotification(
    subscription,
    JSON.stringify({
      provider: "webpush",
      title: "LocalScoresHQ push test",
      body: "Your iPhone received a background push test.",
      tag: "lshq-iphone-push-test",
      kind: "test",
      url: "https://localscoreshq.com/",
    }),
    {
      TTL: 120,
      urgency: "high",
    }
  );

  return { sent: true };
}

async function sendStandardsWebPush({
  recipients,
  game,
  title,
  body,
  kind,
  tag,
  url,
}) {
  if (!recipients.length) {
    return { sent: 0, failed: 0, removed: 0 };
  }

  const privateKey = process.env.WEB_PUSH_VAPID_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("WEB_PUSH_VAPID_PRIVATE_KEY is not configured.");
  }

  configureStandardsWebPush(privateKey);

  const payload = JSON.stringify({
    provider: "webpush",
    title: String(title || "Local Scores HQ"),
    body: String(body || "New update"),
    tag: String(tag || `lshq-${Date.now()}`),
    kind: String(kind || "update"),
    gameId: String(game?.id || ""),
    url: String(url || "https://localscoreshq.com/"),
  });

  let sent = 0;
  let failed = 0;
  let removed = 0;

  for (const recipient of recipients) {
    try {
      await webpush.sendNotification(recipient.subscription, payload, {
        TTL: 60,
        headers: {
          Urgency: "high",
        },
      });
      sent += 1;
    } catch (error) {
      failed += 1;
      const statusCode = Number(error?.statusCode || 0);

      const errorBody =
        typeof error?.body === "string"
          ? error.body
          : "";
      const staleVapidSubscription =
        statusCode === 400 &&
        errorBody.includes("VapidPkHashMismatch");

      if (
        statusCode === 404 ||
        statusCode === 410 ||
        staleVapidSubscription
      ) {
        await recipient.ref.delete();
        removed += 1;
      } else {
        console.error("Standards Web Push delivery failed:", {
          statusCode,
          message: error?.message || "Unknown error",
          body: errorBody.slice(0, 500),
        });
      }
    }
  }

  return { sent, failed, removed };
}

export async function sendFavoritePush({
  game,
  title,
  body,
  kind,
  tag,
  preference = "schedule",
  url = "https://localscoreshq.com/",
}) {
  const { db, messaging } = getFirebaseAdmin();

  const [fcmSnapshot, webPushSnapshot] = await Promise.all([
    db.collection(FCM_SUBSCRIPTIONS_COLLECTION).get(),
    db.collection(WEB_PUSH_SUBSCRIPTIONS_COLLECTION).get(),
  ]);

  const fcmRecipients = fcmSnapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ref: docSnap.ref,
      ...docSnap.data(),
    }))
    .filter(
      (subscription) =>
        typeof subscription.token === "string" &&
        subscriptionMatchesGame(subscription, game, preference)
    );

  const webPushRecipients = webPushSnapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ref: docSnap.ref,
      ...docSnap.data(),
    }))
    .filter(
      (subscription) =>
        subscription?.subscription?.endpoint &&
        subscriptionMatchesGame(subscription, game, preference)
    );

  if (!fcmRecipients.length && !webPushRecipients.length) {
    return {
      matched: 0,
      sent: 0,
      failed: 0,
      removed: 0,
      fcmMatched: 0,
      webPushMatched: 0,
    };
  }

  const [fcmResult, webPushResult] = await Promise.all([
    sendFcmPush({
      recipients: fcmRecipients,
      messaging,
      game,
      title,
      body,
      kind,
      tag,
      url,
    }),
    sendStandardsWebPush({
      recipients: webPushRecipients,
      game,
      title,
      body,
      kind,
      tag,
      url,
    }),
  ]);

  return {
    matched: fcmRecipients.length + webPushRecipients.length,
    sent: fcmResult.sent + webPushResult.sent,
    failed: fcmResult.failed + webPushResult.failed,
    removed: fcmResult.removed + webPushResult.removed,
    fcmMatched: fcmRecipients.length,
    webPushMatched: webPushRecipients.length,
    fcmSent: fcmResult.sent,
    webPushSent: webPushResult.sent,
  };
}
