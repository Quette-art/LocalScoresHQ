import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

let cached = null;

function readServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not configured.");
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.", {
      cause: error,
    });
  }
}

export function getFirebaseAdmin() {
  if (cached) return cached;

  const serviceAccount = readServiceAccount();
  const app =
    getApps()[0] ||
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });

  cached = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    messaging: getMessaging(app),
    FieldValue,
  };

  return cached;
}
