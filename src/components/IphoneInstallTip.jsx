import React, { useEffect, useState } from "react";

const IphoneInstallTip = () => {
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    const isStandalone =
      window.navigator.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;

    const dismissed = localStorage.getItem("iphoneInstallTipDismissed");

    if (isIOS && !isStandalone && dismissed !== "true") {
      setShowTip(true);
    }
  }, []);

  if (!showTip) return null;

  return (
    <div className="iphone-install-tip">
      <div>
        <strong>Add LocalScoresHQ to your Home Screen</strong>
        <p>
          Tap Share <span>⬆️</span>, then choose <b>Add to Home Screen</b>.
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          localStorage.setItem("iphoneInstallTipDismissed", "true");
          setShowTip(false);
        }}
      >
        ×
      </button>
    </div>
  );
};

export default IphoneInstallTip;