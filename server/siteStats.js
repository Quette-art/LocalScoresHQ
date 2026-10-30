export const DEVICE_PATTERN = /^[a-f0-9-]{36}$/i;
export function cleanSnapshot(body, allowedTeams) {
  if (!DEVICE_PATTERN.test(body?.deviceId || '') || !DEVICE_PATTERN.test(body?.pageId || '')) throw new Error('Invalid identifier');
  if (!Array.isArray(body.favorites) || body.favorites.length > 150) throw new Error('Invalid favorites');
  return { deviceId: body.deviceId, pageId: body.pageId, favorites: [...new Set(body.favorites.filter(key => typeof key === 'string' && allowedTeams.has(key)))].sort() };
}
export function nextDevice(previous, snapshot, now) {
  const before = new Set(previous?.favorites || []);
  const after = new Set(snapshot.favorites);
  return {
    firstSeen: previous?.firstSeen || now, lastSeen: now,
    pageId: snapshot.pageId, favorites: snapshot.favorites,
    views: (previous?.views || 0) + (previous?.pageId !== snapshot.pageId ? 1 : 0),
    // Existing favorites on first contact are a baseline, not new follow actions.
    adds: (previous?.adds || 0) + (previous ? [...after].filter(key => !before.has(key)).length : 0),
    removes: (previous?.removes || 0) + (previous ? [...before].filter(key => !after.has(key)).length : 0),
  };
}
export function summarizeDevices(devices, now = Date.now()) {
  const teams = new Map();
  const result = { devices: devices.length, active5m: 0, active30m: 0, active24h: 0, active7d: 0, views: 0, adds: 0, removes: 0, followers: 0, favorites: 0, startedAt: null };
  for (const device of devices) {
    const age = now - device.lastSeen;
    if (age <= 300000) result.active5m++;
    if (age <= 1800000) result.active30m++;
    if (age <= 86400000) result.active24h++;
    if (age <= 604800000) result.active7d++;
    result.views += device.views || 0; result.adds += device.adds || 0; result.removes += device.removes || 0;
    result.startedAt = result.startedAt === null ? device.firstSeen : Math.min(result.startedAt, device.firstSeen);
    const favorites = [...new Set(device.favorites || [])];
    if (favorites.length) result.followers++;
    result.favorites += favorites.length;
    for (const team of favorites) teams.set(team, (teams.get(team) || 0) + 1);
  }
  return { ...result, teams: [...teams].map(([team, count]) => ({ team, count })).sort((a,b) => b.count-a.count || a.team.localeCompare(b.team)) };
}
