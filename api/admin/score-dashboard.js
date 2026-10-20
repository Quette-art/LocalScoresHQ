import { getFirebaseAdmin } from "../../server/firebaseAdmin.js";
import { sendFavoritePush } from "../../server/pushNotifications.js";
import { games as publishedGames } from "../../src/data/games.js";

const MAX_TEXT = 1000;
const allowedStatuses = new Set(["pending", "approved", "dismissed"]);

function clean(value, max = MAX_TEXT) {
  return String(value ?? "").trim().slice(0, max);
}

function score(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 && number <= 300
    ? number : null;
}

function sourceUrl(value) {
  const raw = clean(value, 500);
  try {
    const url = new URL(raw);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function serialize(docSnap) {
  const data = docSnap.data() || {};
  const { createdBy, ...safe } = data;
  return {
    id: docSnap.id,
    ...safe,
    createdAt: data.createdAt?.toDate?.().toISOString?.() || null,
    updatedAt: data.updatedAt?.toDate?.().toISOString?.() || null,
  };
}

async function requireAdmin(req, auth) {
  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token || token === req.headers.authorization) throw new Error("Sign in required");
  const decoded = await auth.verifyIdToken(token, true);
  const user = await auth.getUser(decoded.uid);
  // The current site provisions its editors using Firebase password accounts.
  // Do not grant access to anonymous, social, or unsigned users.
  const isPasswordEditor =
    decoded.firebase?.sign_in_provider === "password" ||
    user.providerData?.some((item) => item.providerId === "password");
  const allowEmails = clean(process.env.LSHQ_ADMIN_EMAILS || "", 5000)
    .split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  const allowUids = clean(process.env.LSHQ_ADMIN_UIDS || "", 5000)
    .split(",").map((value) => value.trim()).filter(Boolean);
  const explicitlyAllowed = allowEmails.length || allowUids.length
    ? allowEmails.includes(String(user.email || "").toLowerCase()) || allowUids.includes(user.uid)
    : Boolean(isPasswordEditor || decoded.admin === true);
  if (!user.email || user.disabled || !explicitlyAllowed) throw new Error("Access denied");
  return user;
}

async function resolveGame(db, gameId) {
  const base = publishedGames.find((game) => game.id === gameId);
  if (base) return base;
  const docSnap = await db.collection("games").doc(gameId).get();
  return docSnap.exists ? { id: docSnap.id, ...docSnap.data() } : null;
}

async function handlePost(req, res, db, user, FieldValue) {
  const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  const action = clean(body.action, 30);
  const queue = db.collection("scoreReviewQueue");

  if (action === "flag") {
    const gameId = clean(body.gameId, 160);
    const game = await resolveGame(db, gameId);
    if (!game || game.sport !== "Football") {
      return res.status(400).json({ error: "Choose a tracked football game." });
    }
    const proposed1 = score(body.score1);
    const proposed2 = score(body.score2);
    const link = sourceUrl(body.sourceUrl);
    const note = clean(body.note, 1000);
    if (!link && !note) {
      return res.status(400).json({ error: "Add a source URL or a review note." });
    }
    if ((proposed1 === null) !== (proposed2 === null)) {
      return res.status(400).json({ error: "Enter both proposed scores or leave both blank." });
    }
    const created = await queue.add({
      gameId, team1: clean(game.team1, 120), team2: clean(game.team2, 120),
      date: clean(game.date, 20), proposed1, proposed2,
      sourceUrl: link, note, status: "pending",
      createdBy: user.uid, createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return res.status(200).json({ ok: true, id: created.id });
  }

  if (action !== "approve" && action !== "dismiss") {
    return res.status(400).json({ error: "Invalid review action." });
  }
  const reviewId = clean(body.reviewId, 160);
  if (!/^[a-zA-Z0-9_-]{8,160}$/.test(reviewId)) {
    return res.status(400).json({ error: "Invalid review identifier." });
  }
  const reviewRef = queue.doc(reviewId);
  const reviewSnap = await reviewRef.get();
  if (!reviewSnap.exists || !allowedStatuses.has(reviewSnap.data()?.status)) {
    return res.status(404).json({ error: "Review not found." });
  }
  if (reviewSnap.data().status !== "pending") {
    return res.status(409).json({ error: "This review has already been resolved." });
  }

  if (action === "dismiss") {
    await db.runTransaction(async (tx) => {
      const fresh = await tx.get(reviewRef);
      if (fresh.data()?.status !== "pending") throw new Error("Already resolved");
      tx.update(reviewRef, {
        status: "dismissed", updatedAt: FieldValue.serverTimestamp(),
        reviewedBy: user.uid,
      });
    });
    return res.status(200).json({ ok: true });
  }

  const review = reviewSnap.data();
  const score1 = score(review.proposed1);
  const score2 = score(review.proposed2);
  if (score1 === null || score2 === null || !sourceUrl(review.sourceUrl)) {
    return res.status(400).json({
      error: "A sourced score for both teams is required before approval.",
    });
  }
  const game = await resolveGame(db, review.gameId);
  if (!game || game.sport !== "Football" ||
      game.team1 !== review.team1 || game.team2 !== review.team2) {
    return res.status(409).json({ error: "The tracked matchup has changed. Recheck it." });
  }
  const scoreRef = db.collection("scores").doc(game.id);
  let changed = false;
  await db.runTransaction(async (tx) => {
    const [current, fresh] = await Promise.all([tx.get(scoreRef), tx.get(reviewRef)]);
    if (fresh.data()?.status !== "pending") throw new Error("Already resolved");
    const existing = current.data();
    const prior1 = existing ? score(existing.score1) : score(game.score1);
    const prior2 = existing ? score(existing.score2) : score(game.score2);
    changed = prior1 !== score1 || prior2 !== score2;
    tx.set(scoreRef, {
      gameId: game.id, team1: game.team1, team2: game.team2, date: game.date,
      score1, score2, sourceUrl: review.sourceUrl,
      sourceTier: "Admin-approved source", verificationStatus: "Final",
      approvedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    tx.update(reviewRef, {
      status: "approved", approved1: score1, approved2: score2,
      reviewedBy: user.uid, updatedAt: FieldValue.serverTimestamp(),
    });
  });

  let delivery = null;
  let pushError = false;
  if (changed) {
    try {
      delivery = await sendFavoritePush({
        game: { ...game, score1, score2 },
        title: "Final score",
        body: `${game.team1} ${score1}–${score2} ${game.team2}`,
        kind: "score", preference: "scores",
        tag: `score-${game.id}-${score1}-${score2}`,
      });
    } catch (error) {
      pushError = true;
      console.error("Approved score push failed:", error?.message || error);
    }
  }
  return res.status(200).json({ ok: true, changed, delivery, pushError });
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Vary", "Authorization");
  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  // Reject unsigned requests before initializing any privileged services.
  if (!/^Bearer\s+\S+$/i.test(String(req.headers.authorization || ""))) {
    return res.status(403).json({ error: "Admin sign-in required." });
  }
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return res.status(503).json({
      error: "Dashboard service is not configured for this environment.",
    });
  }
  try {
    const { auth, db, FieldValue } = getFirebaseAdmin();
    const user = await requireAdmin(req, auth);
    if (req.method === "POST") {
      return await handlePost(req, res, db, user, FieldValue);
    }
    const [reviews, logs] = await Promise.all([
      db.collection("scoreReviewQueue").orderBy("createdAt", "desc").limit(100).get(),
      db.collection("pushDeliveryLog").orderBy("createdAt", "desc").limit(100).get(),
    ]);
    return res.status(200).json({
      ok: true,
      reviews: reviews.docs.map(serialize),
      deliveries: logs.docs.map(serialize),
      historyNote: "Delivery history starts when this dashboard version is deployed. Sent means accepted by push services, not displayed on a phone.",
    });
  } catch (error) {
    if (/Access denied|Sign in required|token|revoked|auth\/|credential/i.test(String(error?.message || ""))) {
      return res.status(403).json({ error: "Admin sign-in required." });
    }
    console.error("Admin score dashboard failed:", error?.message || error);
    return res.status(500).json({ error: "Dashboard data temporarily unavailable." });
  }
}
