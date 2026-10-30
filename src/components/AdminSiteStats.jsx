import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import './AdminSiteStats.css';
export default function AdminSiteStats() {
  const [data, setData] = useState(null); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    setBusy(true); setError('');
    try {
      if (!auth.currentUser) throw new Error('Sign in as an admin to view stats.');
      const token = await auth.currentUser.getIdToken();
      const res = await fetch('/api/admin/site-stats', { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json(); if (!res.ok || !result.ok) throw new Error(result.error || 'Unable to load stats.'); setData(result);
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const metrics = data ? [['Active · last 5 minutes',data.active5m],['Active · last 30 minutes',data.active30m],['Seen · last 24 hours',data.active24h],['Seen · last 7 days',data.active7d],['Tracked devices',data.devices],['Page loads',data.views],['Devices with favorites',data.followers],['Current tracked favorites',data.favorites],['Favorite additions',data.adds],['Favorite removals',data.removes],['Alert subscriptions',data.subscriptions],['Teams followed by alert subscriptions',data.subscriptionFavorites]] : [];
  return <section className="siteStats">
    <Link to="/admin/scores" style={{color:"#60a5fa",display:"inline-flex",padding:"12px 0",minHeight:44}}>← Score management</Link><header><div><p className="siteStatsEyebrow">PRIVATE ADMIN</p><h1>Audience & team stats</h1></div><button type="button" disabled={busy} onClick={load}>{busy ? 'Loading…' : 'Refresh stats'}</button></header>
    <p>Anonymous browser/device counts, not verified individual people. Active means the app was visible within the selected window; updates arrive about once a minute. Your own public-site visits can count.</p>
    {error && <p role="alert">{error}</p>}
    {data && <><p className="siteStatsNotice">Tracking began {data.startedAt ? new Date(data.startedAt).toLocaleString() : 'when the first visitor opens this version'}. Existing favorites appear when that device returns. Earlier visits and favorite changes cannot be recovered. Counts cover devices observed since tracking began.</p>
    {data.truncated && <p role="alert">Device totals are limited to a 10,000-device sample. Upgrade aggregation before using these totals for reporting.</p>}
    <div className="siteStatsGrid">{metrics.map(([label,value]) => <article key={label}><strong>{value.toLocaleString()}</strong><span>{label}</span></article>)}</div>
    <h2>Most-followed teams</h2><p>Current favorites on tracked devices. Removing a favorite reduces its count after syncing.</p>
    {data.teams.length ? <ol className="siteStatsTeams">{data.teams.slice(0,50).map(item => <li key={item.team}><span>{item.team}</span><b>{item.count} {item.count === 1 ? 'device' : 'devices'}</b></li>)}</ol> : <p>No tracked favorites yet.</p>}
    <p>Alert subscriptions are browser registrations and may include old registrations or multiple devices for one person. They are separate from visitor counts.</p>
    <p>Updated {new Date(data.updatedAt).toLocaleString()}. Refresh to get the latest numbers.</p></>}
  </section>;
}
