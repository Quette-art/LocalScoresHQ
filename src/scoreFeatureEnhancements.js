import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

const mascotBlobCache = new Map();

const dataUrlToBlobUrl = (dataUrl) => {
  if (!dataUrl?.startsWith("data:image/")) return dataUrl;
  if (mascotBlobCache.has(dataUrl)) return mascotBlobCache.get(dataUrl);

  try {
    const [header, encoded] = dataUrl.split(",", 2);
    if (!encoded) return dataUrl;

    const mimeMatch = header.match(/^data:([^;]+);base64$/);
    if (!mimeMatch) return dataUrl;

    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    const objectUrl = URL.createObjectURL(
      new Blob([bytes], { type: mimeMatch[1] })
    );

    mascotBlobCache.set(dataUrl, objectUrl);
    return objectUrl;
  } catch (error) {
    console.warn("Mascot image optimization skipped", error);
    return dataUrl;
  }
};

const optimizeMascotImage = (image) => {
  if (!(image instanceof HTMLImageElement)) return;
  if (image.dataset.mascotOptimized === "1") return;

  image.dataset.mascotOptimized = "1";
  image.decoding = "async";
  image.loading = "eager";

  const rect = image.getBoundingClientRect();
  const nearViewport = rect.top < window.innerHeight * 1.5;

  if (nearViewport) {
    image.setAttribute("fetchpriority", "high");
  }

  const src = image.currentSrc || image.src || image.getAttribute("src") || "";

  if (src.startsWith("data:image/") && src.length > 12000) {
    const run = () => {
      const optimizedSrc = dataUrlToBlobUrl(src);
      if (optimizedSrc !== src) image.src = optimizedSrc;
      image.decode?.().catch(() => {});
    };

    if (nearViewport) {
      run();
    } else if ("requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 1200 });
    } else {
      setTimeout(run, 120);
    }
  } else {
    image.decode?.().catch(() => {});
  }
};

const optimizeMascots = (root = document) => {
  root.querySelectorAll?.(
    "img.score-team-mascot, img.favorite-team-mascot, img.favorite-region-team-mascot, img.team-logo, img[src^='data:image/']"
  ).forEach(optimizeMascotImage);
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
  optimizeMascots();
};

if (typeof window !== "undefined") {
  const schedule = () => requestAnimationFrame(applyEnhancements);
  window.addEventListener("DOMContentLoaded", schedule);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) optimizeMascots(node);
      });
    });

    schedule();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener("pagehide", () => {
    mascotBlobCache.forEach((url) => URL.revokeObjectURL(url));
    mascotBlobCache.clear();
  });
}
