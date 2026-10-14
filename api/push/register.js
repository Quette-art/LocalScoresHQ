import { upsertPushSubscription } from "../../server/pushNotifications.js";

function readBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }
  return req.body;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = readBody(req);
    const token = body.token;
    const favorites = Array.isArray(body.favorites) ? body.favorites : [];
    const prefs = body.prefs || {};
    const enabled = body.enabled !== false && prefs.enabled !== false;

    const result = await upsertPushSubscription({
      token,
      favorites,
      prefs: {
        ...prefs,
        enabled,
      },
      userAgent: req.headers["user-agent"] || "",
    });

    return res.status(200).json({
      ok: true,
      removed: result.removed,
    });
  } catch (error) {
    console.error("Push registration failed:", error);
    return res.status(400).json({
      ok: false,
      error: "Push registration failed",
    });
  }
}
