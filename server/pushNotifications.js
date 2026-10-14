import crypto from "node:crypto";
import { getFirebaseAdmin } from "./firebaseAdmin.js";

const SUBSCRIPTIONS_COLLECTION = "pushSubscriptions";

function cleanFavorites(favorites) {
  if (!Array.isArray(favorites)) return [];
  return [...new Set(
    favorites
      .filter((value) => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean)
      .slice(0, 100)
  )];
}

function normalizePrefs(prefs = {}) {
  return {
    enabled: prefs.enabled !== false,
    scores: prefs.scores !== false,
    schedule: prefs.schedule !== false,
  };
}

function subscriptionId(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
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
  const id = subscriptionId(token);
  const normalizedPrefs = normalizePrefs(prefs);

  if (!normalizedPrefs.enabled) {
    await db.collection(SUBSCRIPTIONS_COLLECTION).doc(id).delete();
    return { id, removed: true };
  }

  await db.collection(SUBSCRIPTIONS_COLLECTION).doc(id).set(
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

export async function removePushSubscription(token) {
  if (typeof token !== "string" || !token) return;
  const { db } = getFirebaseAdmin();
  await db.collection(SUBSCRIPTIONS_COLLECTION).doc(subscriptionId(token)).delete();
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
  const snapshot = await db.collection(SUBSCRIPTIONS_COLLECTION).get();

  const recipients = snapshot.docs
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

  if (!recipients.length) {
    return { matched: 0, sent: 0, failed: 0, removed: 0 };
  }

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

  return {
    matched: recipients.length,
    sent,
    failed,
    removed,
  };
}
