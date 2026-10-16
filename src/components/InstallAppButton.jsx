import React, { useEffect, useState } from "react";
import "./InstallOnboarding.css";

const DISMISS_UNTIL_KEY = "lshq_install_prompt_v2_dismiss_until";
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;

const InstallAppButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const dismissedUntil = Number(
      localStorage.getItem(DISMISS_UNTIL_KEY) || 0
    );

    const handlePrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);

      if (dismissedUntil <= Date.now()) {
        setShowInstall(true);
      }
    };

    const handleInstalled = () => {
      setDeferredPrompt(null);
      setShowInstall(false);
      localStorage.removeItem(DISMISS_UNTIL_KEY);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      localStorage.removeItem(DISMISS_UNTIL_KEY);
    } else {
      localStorage.setItem(
        DISMISS_UNTIL_KEY,
        String(Date.now() + SNOOZE_MS)
      );
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const dismissForNow = () => {
    localStorage.setItem(
      DISMISS_UNTIL_KEY,
      String(Date.now() + SNOOZE_MS)
    );
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <aside
      className="install-onboarding install-onboarding-generic"
      aria-label="Install LocalScoresHQ"
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
          <span className="install-onboarding-eyebrow">Install the app</span>
          <strong>Get LocalScoresHQ alerts faster</strong>
        </div>
      </div>

      <p className="install-onboarding-copy">
        Add LocalScoresHQ to your device for quick access and favorite-team
        score and schedule notifications.
      </p>

      <div className="install-onboarding-actions">
        <button
          className="install-onboarding-primary"
          type="button"
          onClick={installApp}
        >
          Install LocalScoresHQ
        </button>
        <button
          className="install-onboarding-secondary"
          type="button"
          onClick={dismissForNow}
        >
          Later
        </button>
      </div>
    </aside>
  );
};

export default InstallAppButton;
