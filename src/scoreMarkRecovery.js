const SCORE_MARKS = new Map([
  ["Bullis", "/mascots/custom/score/bullis-score.svg?v=creative-initials-1"],
  ["St. Albans", "/mascots/custom/score/st-albans-score.svg?v=creative-initials-1"],
  ["Landon", "/mascots/custom/score/landon-score.svg?v=creative-initials-1"],
  ["National Christian Academy", "/mascots/custom/score/national-christian-academy-score.svg?v=creative-initials-1"],
  ["Rock Creek Christian Academy", "/mascots/custom/score/rock-creek-christian-academy-score.svg?v=creative-initials-1"],
  ["St. Mary's Ryken", "/mascots/custom/score/st-marys-ryken-score.svg?v=creative-initials-1"],
  ["St. Mary’s Ryken", "/mascots/custom/score/st-marys-ryken-score.svg?v=creative-initials-1"],
  ["St. Vincent Pallotti", "/mascots/custom/score/st-vincent-pallotti-score.svg?v=creative-initials-1"],
]);

const teamFromAlt = (alt = "") =>
  alt
    .replace(/ unofficial mascot$/i, "")
    .replace(/ score mark$/i, "")
    .trim();

const setImageSource = (img, teamName, src) => {
  if (!img) return;

  if (img.getAttribute("src") !== src) img.setAttribute("src", src);
  img.setAttribute("alt", `${teamName} score mark`);
  img.setAttribute("decoding", "async");
  img.style.setProperty("display", "block", "important");
  img.style.setProperty("opacity", "1", "important");
  img.style.setProperty("visibility", "visible", "important");
  img.style.setProperty("object-fit", "contain", "important");
};

const installMark = (target, teamName, src) => {
  if (!target) return;

  if (target.tagName === "IMG") {
    setImageSource(target, teamName, src);
    return;
  }

  let img = target.querySelector("img");
  if (!img) {
    target.textContent = "";
    img = document.createElement("img");
    target.appendChild(img);
  }

  setImageSource(img, teamName, src);
  img.style.setProperty("width", "100%", "important");
  img.style.setProperty("height", "100%", "important");
  target.style.setProperty("background-image", "none", "important");
  target.style.setProperty("background-color", "transparent", "important");
};

const recoverExistingScoreMarks = () => {
  if (typeof document === "undefined") return;

  document.querySelectorAll(".score-team-mascot").forEach((target) => {
    const img = target.tagName === "IMG" ? target : target.querySelector("img");
    if (!img) return;

    const teamName = teamFromAlt(img.getAttribute("alt") || "");
    const src = SCORE_MARKS.get(teamName);
    if (src) installMark(target, teamName, src);
  });

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
