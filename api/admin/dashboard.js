import { getFirebaseAdmin } from "../../server/firebaseAdmin.js";
import { authorizeDashboardRequest } from "../../server/adminAccess.js";
import { buildScoreDashboard } from "../../server/adminDashboardData.js";
import { games } from "../../src/data/games.js";

const asDocs = (snapshot) =>
  snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("Vary", "Authorization");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    // Authenticate before reading any dashboard data or querying Firestore.
    await authorizeDashboardRequest(req, getFirebaseAdmin);
    const { db } = getFirebaseAdmin();
    const [scoreDocs, gameDocs, statusDocs, reviewDocs, dispatchDocs] =
      await Promise.all([
        db.collection("scores").get(),
        db.collection("games").get(),
        db.collection("gameStatus").get(),
        db.collection("scoreReviewQueue").limit(150).get(),
        db.collection("pushDispatches").orderBy("createdAt", "desc").limit(80).get(),
      ]);
    const pushDispatches = asDocs(dispatchDocs).map(({ createdAt, ...entry }) => ({
      ...entry,
      createdAt: createdAt?.toDate?.()?.toISOString() || "",
    }));
    return res.status(200).json(buildScoreDashboard({
      staticGames: games,
      firestoreScores: asDocs(scoreDocs),
      firestoreGames: asDocs(gameDocs),
      firestoreStatuses: asDocs(statusDocs),
      reviewItems: asDocs(reviewDocs),
      pushDispatches,
    }));
  } catch (error) {
    const status = error?.statusCode || 500;
    if (status >= 500) console.error("Admin dashboard load failed:", error?.message);
    return res.status(status).json({
      error: status === 401 || status === 403
        ? error.message : "The admin dashboard could not load right now.",
    });
  }
}
