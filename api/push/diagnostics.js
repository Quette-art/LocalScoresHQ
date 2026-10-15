import { getFirebaseAdmin } from "../../server/firebaseAdmin.js";

function normalizeFavorites(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string")
    : [];
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { db } = getFirebaseAdmin();
    const [fcmSnapshot, webSnapshot] = await Promise.all([
      db.collection("pushSubscriptions").get(),
      db.collection("webPushSubscriptions").get(),
    ]);

    const summarize = (snapshot, keyVersion = "") => {
      let suitland = 0;
      let enabled = 0;
      let currentKey = 0;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() || {};
        const prefs = data.prefs || {};
        const favorites = normalizeFavorites(data.favorites);

        if (prefs.enabled !== false) enabled += 1;
        if (
          keyVersion &&
          data.vapidKeyVersion === keyVersion
        ) {
          currentKey += 1;
        }
        if (
          favorites.some(
            (favorite) =>
              favorite === "Suitland" ||
              favorite.startsWith("Suitland-")
          )
        ) {
          suitland += 1;
        }
      });

      return {
        total: snapshot.size,
        enabled,
        suitland,
        currentKey,
      };
    };

    return res.status(200).json({
      ok: true,
      fcm: summarize(fcmSnapshot),
      webPush: summarize(
        webSnapshot,
        "2026-10-14-v2"
      ),
    });
  } catch (error) {
    console.error("Push diagnostics failed:", error);
    return res.status(500).json({
      ok: false,
      error: "Diagnostics unavailable",
    });
  }
}
