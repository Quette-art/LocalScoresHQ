/**
 * The dashboard is intentionally not available to every Firebase user.
 * Grant a Firebase Auth custom claim { admin: true }, or configure
 * ADMIN_ALLOWED_UIDS (preferred) / ADMIN_ALLOWED_EMAILS on the server.
 */
export function isAuthorizedDashboardAdmin(decoded = {}, env = {}) {
  if (!decoded?.uid) return false;
  if (decoded.admin === true || decoded.role === "admin") return true;
  const uids = String(env.ADMIN_ALLOWED_UIDS || "")
    .split(",").map((value) => value.trim()).filter(Boolean);
  if (uids.includes(decoded.uid)) return true;
  const emails = String(env.ADMIN_ALLOWED_EMAILS || "")
    .split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  return (
    decoded.email_verified === true &&
    !!decoded.email &&
    emails.includes(String(decoded.email).trim().toLowerCase())
  );
}

export async function authorizeDashboardRequest(req, getAdmin) {
  const header = String(req?.headers?.authorization || "");
  if (!/^Bearer\\s+[^\\s]+$/i.test(header)) {
    const error = new Error("Admin sign-in required.");
    error.statusCode = 401;
    throw error;
  }
  const token = header.replace(/^Bearer\\s+/i, "");
  let decoded;
  try {
    decoded = await getAdmin().auth.verifyIdToken(token, true);
  } catch {
    const error = new Error("Admin session expired. Please sign in again.");
    error.statusCode = 401;
    throw error;
  }
  if (!isAuthorizedDashboardAdmin(decoded, process.env)) {
    const error = new Error("This account has not been granted dashboard access.");
    error.statusCode = 403;
    throw error;
  }
  return decoded;
}
