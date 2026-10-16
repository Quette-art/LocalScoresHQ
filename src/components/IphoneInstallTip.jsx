import React, { useEffect, useState } from "react";
import "./InstallOnboarding.css";

const DISMISS_UNTIL_KEY = "lshq_ios_install_prompt_v2_dismiss_until";
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;

const isIOSDevice = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const isStandaloneApp = () =>
  window.navigator.standalone === true ||
  window.matchMedia("(display-mode: standalone)").matches;

const IphoneInstallTip = () => {
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    if (!isIOSDevice() || isStandaloneApp()) return;

    const dismissedUntil = Number(
      localStorage.getItem(DISMISS_UNTIL_KEY) || 0
    );

    if (dismissedUntil > Date.now()) return;

    const timer = window.setTimeout(() => {
      setShowTip(true);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, []);

  const dismissForNow = () => {
    localStorage.setItem(
      DISMISS_UNTIL_KEY,
      String(Date.now() + SNOOZE_MS)
    );
    setShowTip(false);
  };

  if (!showTip) return null;

  return (
    <aside
      className="install-onboarding install-onboarding-ios"
      aria-label="Install LocalScoresHQ on iPhone"
    >
      <button
        className="install-onboarding-close"
        type="button"
        aria-label="Remind me later"
        onClick={dismissForNow}
      >
        ×
      </button>

      <div className="install-onboarding-heading">
        <img
          className="install-onboarding-icon"
          src="/icon-192.png"
          alt=""
          aria-hidden="true"
        />

        <div>
          <span className="install-onboarding-eyebrow">
            Get the full LocalScoresHQ experience
          </span>
          <strong>Add LocalScoresHQ to your Home Screen</strong>
        </div>
      </div>

      <p className="install-onboarding-copy">
        Install the site like an app so favorite-team score and schedule
        alerts can reach you even when LocalScoresHQ is closed.
      </p>

      <div className="install-onboarding-benefits">
        <span>🔔 Favorite-team alerts</span>
        <span>📅 Schedule changes</span>
        <span>⚡ Faster access</span>
      </div>

      <ol className="install-onboarding-steps">
        <li>
          <span className="install-step-icon">⬆️</span>
          <div>
            <strong>Tap Share</strong>
            <small>Use the Share button in Safari.</small>
          </div>
        </li>
        <li>
          <span className="install-step-icon">＋</span>
          <div>
            <strong>Choose “Add to Home Screen”</strong>
            <small>Then tap Add.</small>
          </div>
        </li>
        <li>
          <span className="install-step-icon">🔔</span>
          <div>
            <strong>Open the new app icon</strong>
            <small>Turn on notifications for your favorite teams.</small>
          </div>
        </li>
      </ol>

      <button
        className="install-onboarding-later"
        type="button"
        onClick={dismissForNow}
      >
        Remind me later
      </button>
    </aside>
  );
};

export default IphoneInstallTip;
