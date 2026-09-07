const SCORE_MARKS = new Map([
  ["Bullis", "/mascots/custom/score/bullis-score.svg?v=score-recovery-1"],
  ["St. Albans", "/mascots/custom/score/st-albans-score.svg?v=score-recovery-1"],
  ["Landon", "/mascots/custom/score/landon-score.svg?v=score-recovery-1"],
  ["National Christian Academy", "/mascots/custom/score/national-christian-academy-score.svg?v=score-recovery-1"],
  ["Rock Creek Christian Academy", "/mascots/custom/score/rock-creek-christian-academy-score.svg?v=score-recovery-1"],
  ["St. Mary's Ryken", "/mascots/custom/score/st-marys-ryken-score.svg?v=score-recovery-1"],
  ["St. Mary’s Ryken", "/mascots/custom/score/st-marys-ryken-score.svg?v=score-recovery-1"],
  ["St. Vincent Pallotti", "/mascots/custom/score/st-vincent-pallotti-score.svg?v=score-recovery-1"],
]);

const teamFromAlt = (alt = "") => alt.replace(/ unofficial mascot$/i, "").trim();

const installMark = (container, teamName, src) => {
  if (!container) return;

  let img = container.querySelector("img");
  if (!img) {
    container.textContent = "";
    img = document.createElement("img");
    container.appendChild(img);
  }

  if (img.getAttribute("src") !== src) img.setAttribute("src", src);
  img.setAttribute("alt", `${teamName} unofficial mascot`);
  img.setAttribute("decoding", "async");
  img.style.setProperty("display", "block", "important");
  img.style.setProperty("opacity", "1", "important");
  img.style.setProperty("visibility", "visible", "important");
  img.style.setProperty("width", "100%", "important");
  img.style.setProperty("height", "100%", "important");
  img.style.setProperty("object-fit", "contain", "important");
  container.style.setProperty("background-image", "none", "important");
};

const recoverExistingScoreMarks = () => {
  if (typeof document === "undefined") return;

  // Score cards: use the team name already attached to the mascot image.
  document.querySelectorAll(".score-team-mascot").forEach((container) => {
    const img = container.querySelector("img");
    if (!img) return;
    const teamName = teamFromAlt(img.getAttribute("alt") || "");
    const src = SCORE_MARKS.get(teamName);
    if (src) installMark(container, teamName, src);
  });

  // Game Details can lose the image completely after a fallback, so identify
  // the row from its visible team name and rebuild the logo slot if needed.
  document.querySelectorAll(".game-details-team").forEach((row) => {
    const text = row.textContent || "";
    for (const [teamName, src] of SCORE_MARKS) {
      if (!text.includes(teamName)) continue;
      installMark(row.querySelector(".game-details-team-logo"), teamName, src);
      break;
    }
  });
};

if (typeof document !== "undefined") {
  queueMicrotask(recoverExistingScoreMarks);

  const observer = new MutationObserver(() => {
    requestAnimationFrame(recoverExistingScoreMarks);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
