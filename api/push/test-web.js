import { sendWebPushDiagnostic } from "../../server/pushNotifications.js";

export const config = { maxDuration: 20 };

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const result = await sendWebPushDiagnostic({
      installationId: body.installationId,
      testSecret: body.testSecret,
    });

    return res.status(200).json({ ok: true, ...result });
  } catch (error) {
    const statusCode = Number(error?.statusCode);
    if (statusCode >= 400 && statusCode < 500) {
      return res.status(statusCode).json({
        ok: false,
        error: error.message,
      });
    }

    console.error("iPhone push diagnostic delivery failed:", {
      statusCode: error?.statusCode || 0,
      message: error?.message || "unknown",
    });

    return res.status(502).json({
      ok: false,
      error: "The push service could not deliver the test. Try again shortly.",
    });
  }
}
