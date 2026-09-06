import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

const monthDay = (date = new Date()) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

const addTodayButton = () => {
  const dateScroll = document.querySelector(".date-scroll");
  if (!dateScroll || document.querySelector(".today-jump-wrap")) return;

  const wrap = document.createElement("div");
  wrap.className = "today-jump-wrap";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "today-jump-btn";
  button.textContent = "Today";
  button.setAttribute("aria-label", "Jump to today's scores");

  button.addEventListener("click", () => {
    const todayLabel = monthDay();
    const target = [...dateScroll.querySelectorAll(".date-btn")].find((item) =>
      item.textContent.replace(/\s+/g, " ").includes(todayLabel)
    );

    if (target) {
      target.click();
      target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    } else {
      button.textContent = "No games today";
      setTimeout(() => {
        button.textContent = "Today";
      }, 1600);
    }
  });

  wrap.appendChild(button);
  dateScroll.parentNode?.insertBefore(wrap, dateScroll);
};

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

const applyEnhancements = () => {
  addTodayButton();
  addReportButtons();
};

if (typeof window !== "undefined") {
  const schedule = () => requestAnimationFrame(applyEnhancements);
  window.addEventListener("DOMContentLoaded", schedule);

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
