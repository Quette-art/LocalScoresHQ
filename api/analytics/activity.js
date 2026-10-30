import { getFirebaseAdmin } from '../../server/firebaseAdmin.js';
import { cleanSnapshot, nextDevice } from '../../server/siteStats.js';
import { games } from '../../src/data/games.js';
const allowedTeams = new Set(games.flatMap(g => [g.team1, g.team2].map(team => `${team}-${g.division || 'Varsity'}`)));
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  if (req.headers['sec-fetch-site'] === 'cross-site') return res.status(403).json({ error: 'Same-site requests required' });
  let snapshot;
  try { const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}); if (raw.length > 20000) throw new Error(); snapshot = cleanSnapshot(JSON.parse(raw), allowedTeams); }
  catch { return res.status(400).json({ error: 'Invalid activity' }); }
  try {
    const { db } = getFirebaseAdmin();
    const ref = db.collection('siteActivity').doc(snapshot.deviceId);
    await db.runTransaction(async tx => {
      const doc = await tx.get(ref); const previous = doc.exists ? doc.data() : null; const now = Date.now();
      if (previous && now - previous.lastSeen < 30000 && previous.pageId === snapshot.pageId && JSON.stringify(previous.favorites) === JSON.stringify(snapshot.favorites)) return;
      tx.set(ref, nextDevice(previous, snapshot, now));
    });
    return res.status(200).json({ ok: true });
  } catch { return res.status(503).json({ error: 'Activity tracking unavailable' }); }
}
