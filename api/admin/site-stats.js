import { getFirebaseAdmin } from '../../server/firebaseAdmin.js';
import { requireAdmin } from '../../server/adminAuth.js';
import { summarizeDevices } from '../../server/siteStats.js';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store'); res.setHeader('Vary', 'Authorization');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed' }); }
  if (!/^Bearer\s+\S+$/i.test(String(req.headers.authorization || ''))) return res.status(403).json({ error: 'Admin sign-in required.' });
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) return res.status(503).json({ error: 'Stats service is not configured.' });
  try {
    const { auth, db } = getFirebaseAdmin();
    try { await requireAdmin(req, auth); } catch { return res.status(403).json({ error: 'Admin sign-in required.' }); }
    const [activity, fcm, web] = await Promise.all([
      db.collection('siteActivity').limit(10001).get(),
      db.collection('pushSubscriptions').get(), db.collection('webPushSubscriptions').get(),
    ]);
    const summary = summarizeDevices(activity.docs.slice(0,10000).map(doc => doc.data()));
    const subscriptions = [...fcm.docs, ...web.docs].filter(doc => doc.data().prefs?.enabled !== false);
    return res.status(200).json({ ok: true, ...summary, subscriptions: subscriptions.length, subscriptionFavorites: subscriptions.reduce((n,doc) => n + new Set(doc.data().favorites || []).size, 0), truncated: activity.size > 10000, updatedAt: Date.now() });
  } catch { return res.status(503).json({ error: 'Stats temporarily unavailable. Try again.' }); }
}
