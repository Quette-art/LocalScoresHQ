import React, { useEffect, useState } from "react";

const InstallAppButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();

      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handler
    );

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handler
      );
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const choiceResult =
      await deferredPrompt.userChoice;

    if (
      choiceResult.outcome === "accepted"
    ) {
      console.log("User installed app");
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <div className="install-app-banner">
      <div className="install-app-content">
        <div>
          <strong>
            Install LocalScoresHQ
          </strong>

          <p>
            Add the app to your home screen
            for faster access.
          </p>
        </div>

        <button
          className="install-app-btn"
          onClick={installApp}
        >
          Install
        </button>
      </div>
    </div>
  );
};

export default InstallAppButton;