let pageId;
let pending = Promise.resolve();
function id() { return crypto.randomUUID(); }
export function reportActivity() {
  if (typeof window === 'undefined' || document.visibilityState === 'hidden' || window.location.pathname.startsWith('/admin')) return;
  try {
    let deviceId = localStorage.getItem('lshq-analytics-device-v1');
    if (!deviceId) { deviceId = id(); localStorage.setItem('lshq-analytics-device-v1', deviceId); }
    pageId ||= id();
    const body = JSON.stringify({ deviceId, pageId, favorites: JSON.parse(localStorage.getItem('favoriteTeams') || '[]') });
    // Preserve add/remove ordering without blocking the favorite action.
    pending = pending.catch(() => {}).then(() => fetch('/api/analytics/activity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true, signal: AbortSignal.timeout(8000) })).catch(() => {});
  } catch { /* Tracking must never prevent people from using the app. */ }
}
export function saveTrackedFavorites(favorites) {
  localStorage.setItem('favoriteTeams', JSON.stringify(favorites));
  reportActivity();
}
export function startActivityTracking() {
  reportActivity();
  const timer = setInterval(reportActivity, 60000);
  document.addEventListener('visibilitychange', reportActivity);
  window.addEventListener('storage', reportActivity);
  return () => { clearInterval(timer); document.removeEventListener('visibilitychange', reportActivity); window.removeEventListener('storage', reportActivity); };
}
