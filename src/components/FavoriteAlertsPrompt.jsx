import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Bell, X } from "lucide-react";
import { getNotificationPrefs, requestNotificationPermission, saveNotificationPrefs, syncPushSubscription } from "../notifications";
import "./FavoriteAlertsPrompt.css";

export default function FavoriteAlertsPrompt({ onPreferencesChanged }) {
  const [team, setTeam] = useState(null);
  const [prefs, setPrefs] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const closeRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const open = (event) => {
      const current = getNotificationPrefs();
      setPrefs(current);
      setMessage("");
      setTeam(event.detail?.teamName || "your team");
    };
    const added = (event) => open(event);
    const manage = (event) => open(event);
    window.addEventListener("lshq:favorite-added", added);
    window.addEventListener("lshq:manage-favorite-alerts", manage);
    return () => {
      window.removeEventListener("lshq:favorite-added", added);
      window.removeEventListener("lshq:manage-favorite-alerts", manage);
    };
  }, []);

  useEffect(() => {
    if (!team) return;
    const previousFocus = document.activeElement;
    const app = document.querySelector(".appShell");
    const oldInert = app?.inert;
    const oldOverflow = document.body.style.overflow;
    if (app) app.inert = true;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const keydown = (event) => {
      if (event.key === "Escape") { setTeam(null); return; }
      if (event.key !== "Tab") return;
      const elements = [...(dialogRef.current?.querySelectorAll('button:not(:disabled), input:not(:disabled)') || [])];
      if (!elements.length) return;
      if (event.shiftKey && document.activeElement === elements[0]) { event.preventDefault(); elements[elements.length - 1].focus(); }
      if (!event.shiftKey && document.activeElement === elements[elements.length - 1]) { event.preventDefault(); elements[0].focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      if (app) app.inert = oldInert;
      document.body.style.overflow = oldOverflow;
      previousFocus?.focus?.();
    };
  }, [team]);

  if (!team || !prefs) return null;
  const isApple = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia?.("(display-mode: standalone)").matches || navigator.standalone === true;
  const needsHomeScreen = isApple && !standalone;
  const later = () => setTeam(null);
  const save = async () => {
    if (!prefs.scores && !prefs.schedule) { setMessage("Choose at least one alert type, or choose Not now."); return; }
    if (needsHomeScreen) { setMessage("Add LocalScoresHQ to your Home Screen, open it from there, then turn on alerts in Settings."); return; }
    if (!("Notification" in window)) { setMessage("Notifications aren't available in this browser. You can keep following your teams without alerts."); return; }
    if (Notification.permission === "denied") { setMessage("Notifications are blocked. Allow them in your device or browser settings, then try again."); return; }
    setBusy(true);
    setMessage("");
    const previous = getNotificationPrefs();
    const selected = { ...previous, scores: prefs.scores, schedule: prefs.schedule };
    saveNotificationPrefs(selected);
    if (previous.enabled) {
      const ok = await syncPushSubscription({ prefs: selected });
      if (!ok) { saveNotificationPrefs(previous); setMessage("We couldn't save alert settings. Please try again."); setBusy(false); return; }
    } else {
      // Permission is requested directly from the user's tap, before any await.
      const token = await requestNotificationPermission();
      if (!token) { saveNotificationPrefs({ ...selected, enabled: false }); onPreferencesChanged?.(getNotificationPrefs()); setMessage("Alerts couldn't be enabled. Check your notification permission and try again."); setBusy(false); return; }
    }
    const updated = getNotificationPrefs();
    setPrefs(updated);
    onPreferencesChanged?.(updated);
    setBusy(false);
    setTeam(null);
  };

  return createPortal(
    <div className="favorite-alert-backdrop">
      <section ref={dialogRef} className="favorite-alert-sheet" role="dialog" aria-modal="true" aria-labelledby="favorite-alert-title">
        <div className="favorite-alert-header">
          <span className="favorite-alert-icon"><Bell size={22} aria-hidden="true" /></span>
          <div><p>FAVORITE TEAMS</p><h2 id="favorite-alert-title">{prefs.enabled ? "Manage alerts" : "Turn on alerts?"}</h2></div>
          <button ref={closeRef} className="favorite-alert-close" type="button" aria-label="Close" disabled={busy} onClick={later}><X size={20} /></button>
        </div>
        <p className="favorite-alert-description">Choose updates for all your favorite teams, including {team} if followed.</p>
        <label className="favorite-alert-option"><span><strong>Final scores</strong><small>When a final score is posted</small></span><input type="checkbox" checked={!!prefs.scores} onChange={(e) => setPrefs({ ...prefs, scores: e.target.checked })} /></label>
        <label className="favorite-alert-option"><span><strong>Schedule changes</strong><small>Changes, postponements, and cancellations</small></span><input type="checkbox" checked={!!prefs.schedule} onChange={(e) => setPrefs({ ...prefs, schedule: e.target.checked })} /></label>
        {needsHomeScreen && <p className="favorite-alert-note">On iPhone, add LocalScoresHQ to your Home Screen, open it there, and follow your teams again to enable alerts.</p>}
        {message && <p className="favorite-alert-note" role="status">{message}</p>}
        <button type="button" className="favorite-alert-primary" disabled={busy} onClick={save}>{busy ? "Setting up…" : prefs.enabled ? "Save alert settings" : "Enable alerts"}</button>
        <button type="button" className="favorite-alert-later" disabled={busy} onClick={later}>{prefs.enabled ? "Done" : "Not now"}</button>
      </section>
    </div>, document.body
  );
}
