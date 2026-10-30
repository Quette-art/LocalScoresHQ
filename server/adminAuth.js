function clean(value, max) { return String(value ?? "").trim().slice(0, max); }
export async function requireAdmin(req, auth) {
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

