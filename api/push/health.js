import { getFirebaseAdmin } from "../../server/firebaseAdmin.js";
import { isStandardsWebPushReady } from "../../server/pushNotifications.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { db } = getFirebaseAdmin();
    await db.collection("pushMeta").doc("staticGameSnapshotV1").get();

    return res.status(200).json({
      ok: true,
      pushBackend: "ready",
      webPushBackend: isStandardsWebPushReady() ? "ready" : "unavailable",
    });
  } catch (error) {
    console.error("Push backend health check failed:", error);
    return res.status(503).json({
      ok: false,
      pushBackend: "unavailable",
    });
  }
}
