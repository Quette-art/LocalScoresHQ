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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.getRegistration().then((registration) => {
      registration?.update();
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
