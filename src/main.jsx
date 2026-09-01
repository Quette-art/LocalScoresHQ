import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./data/customTrackedMascots.js";
import "./App.css";
import "./mobileSearchFix.css";
import "./scrollPerformance.css";
import "./mobileGameDetailsFix.css";

// vite-plugin-pwa activates new service workers immediately, but an already
// open iOS tab keeps running the old JavaScript until the document reloads.
// Reload once when the active worker changes so new logos and score data are
// visible without asking users to clear Safari's cache.
if ("serviceWorker" in navigator) {
  let refreshing = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

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
