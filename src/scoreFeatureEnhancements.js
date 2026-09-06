import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

const submitCorrection = async (summary, source) => {
  const correction = window.prompt(
    "What needs to be corrected? (score, time, location, opponent, etc.)"
  );

  if (!correction?.trim()) return;

  try {
    await addDoc(collection(db, "scoreReports"), {
      correction: correction.trim(),
      gameSummary: summary.slice(0, 2000),
      source,
      pageUrl: window.location.href,
      status: "new",
      createdAt: new Date().toISOString(),
    });

    window.alert("Thanks — your correction was sent to LocalScoresHQ.");
  } catch (error) {
    console.error(error);
    window.alert("Could not send the correction. Please try again.");
  }
};

const addReportButtons = () => {
  document.querySelectorAll(".game-card").forEach((card) => {
    if (card.querySelector(".public-report-btn")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "public-report-btn";
    button.textContent = "Report correction";

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      submitCorrection(card.innerText || "Score card", "scores-tab");
    });

    card.appendChild(button);
  });

  const details = document.querySelector(".game-details-page");
  if (details && !details.querySelector(".public-report-btn.details-report-btn")) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "public-report-btn details-report-btn";
    button.textContent = "Report score or game info";
    button.addEventListener("click", () =>
      submitCorrection(details.innerText || "Game details", "game-details")
    );

    const firstSection = details.querySelector("section");
    if (firstSection) {
      firstSection.insertAdjacentElement("afterend", button);
    } else {
      details.appendChild(button);
    }
  }
};

const fixFavoritesPage = () => {
  document.querySelectorAll(".scores-tab").forEach((tab) => {
    const title = tab.querySelector(".scores-header h2");
    if (title?.textContent?.trim() !== "FAVORITES") return;

    tab.classList.add("favorites-page");

    const topStrip = title.parentElement?.nextElementSibling;
    if (!topStrip) return;

    topStrip.querySelectorAll("button > span").forEach((label) => {
      label.style.color = "#475569";
    });
  });
};

const applyEnhancements = () => {
  addReportButtons();
  fixFavoritesPage();
};

if (typeof window !== "undefined") {
  const schedule = () => requestAnimationFrame(applyEnhancements);
  window.addEventListener("DOMContentLoaded", schedule);

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
