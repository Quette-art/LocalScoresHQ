import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./data/customTrackedMascots.js";
import "./data/georgetownPrepExactLogo.js";
import "./data/riverdaleExactLogo.js";
import "./teamLogoRecovery.js";
import "./friendshipGameDetailsFix.js";
import "./scoreMarkRecovery.js";
import "./autoCenterScoreDate.js";
import "./scoreFeatureEnhancements.js";
import "./potomacSearchLabels.js";
import "./App.css";
import "./scoreFeatureEnhancements.css";
import "./mobileSearchFix.css";
import "./scrollPerformance.css";
import "./mobileGameDetailsFix.css";
import "./friendshipCompactFix.css";
import "./friendshipGameDetailsFix.css";
import "./bottomNavSpacing.css";
import "./espnScoresHeader.css";
import "./systemDarkMode.css";

if ("serviceWorker" in navigator) {
  // Workbox installs updates automatically, but a running Home Screen app
  // can keep its old JavaScript until the page actually reloads.
  const hadControllerAtStartup = Boolean(navigator.serviceWorker.controller);
  let pendingRefresh = false;
  let refreshing = false;

  const refreshIfSafe = () => {
    if (!pendingRefresh || refreshing || document.visibilityState !== "visible") {
      return;
    }

    // Don't wipe a partially entered score, login, or search.
    if (document.activeElement?.matches("input, textarea, select, [contenteditable]")) {
      return;
    }

    refreshing = true;
    window.location.reload();
  };

  const checkForUpdates = () => {
    navigator.serviceWorker.getRegistration("/")
      .then((registration) => registration?.update())
      .catch((error) => console.warn("App update check failed:", error));
  };

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // The first installation has no previous app version to refresh.
    if (!hadControllerAtStartup) return;
    pendingRefresh = true;
    refreshIfSafe();
  });

  window.addEventListener("load", checkForUpdates);
  window.addEventListener("pageshow", checkForUpdates);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      refreshIfSafe();
      checkForUpdates();
    }
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
