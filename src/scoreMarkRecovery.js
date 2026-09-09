import { EXACT_BATCH_SPRITE_DATA } from "./generated/exactBatchSpriteData";

const EXACT_BATCH_SCORE_TILES = new Map([
  ["Woodberry Forest", { col: 0, row: 1 }],
  ["Woodberry Forest School", { col: 0, row: 1 }],
  ["Loyola Blakefield", { col: 1, row: 1 }],
  ["Haverford School", { col: 2, row: 1 }],
  ["The Haverford School", { col: 2, row: 1 }],
  ["Boys Latin", { col: 3, row: 1 }],
  ["Boys' Latin", { col: 3, row: 1 }],
  ["Boys’ Latin", { col: 3, row: 1 }],
  ["Boys Latin School", { col: 3, row: 1 }],
  ["The Boys' Latin School of Maryland", { col: 3, row: 1 }],
  ["McDonogh", { col: 4, row: 1 }],
  ["McDonogh School", { col: 4, row: 1 }],
]);

const SCORE_MARKS = new Map([
  ["Bullis", "/mascots/score-marks/bullis-b.svg?v=creative-initials-2"],
  ["St. Albans", "/mascots/score-marks/st-albans-sa.svg?v=creative-initials-2"],
  ["Landon", "/mascots/score-marks/landon-l.svg?v=creative-initials-2"],
  ["National Christian Academy", "/mascots/score-marks/national-christian-academy-nca.svg?v=creative-initials-2"],
  ["Rock Creek Christian Academy", "/mascots/score-marks/rock-creek-christian-academy-rc.svg?v=creative-initials-2"],
  ["St. Mary's Ryken", "/mascots/score-marks/st-marys-ryken-smr.svg?v=creative-initials-2"],
  ["St. Mary’s Ryken", "/mascots/score-marks/st-marys-ryken-smr.svg?v=creative-initials-2"],
  ["St. Vincent Pallotti", "/mascots/score-marks/st-vincent-pallotti-svp.svg?v=svp-exact-picture-1"],
  ["Georgetown Prep", "/mascots/score-marks/georgetown-prep-gp.svg?v=exact-generated-mobile-1"],
  ["Georgetown Preparatory School", "/mascots/score-marks/georgetown-prep-gp.svg?v=exact-generated-mobile-1"],
]);

const teamFromAlt = (alt = "") =>
  alt
    .replace(/ unofficial mascot$/i, "")
    .replace(/ score mark$/i, "")
    .trim();

const styleRegularImage = (img) => {
  img.style.setProperty("display", "block", "important");
  img.style.setProperty("width", "100%", "important");
  img.style.setProperty("height", "100%", "important");
  img.style.setProperty("object-fit", "contain", "important");
  img.style.setProperty("opacity", "1", "important");
  img.style.setProperty("visibility", "visible", "important");
};

const applyExactSpriteImage = (target, teamName, tile) => {
  if (!target || !tile || target.tagName === "IMG") return;

  const key = `${teamName}:${tile.col}:${tile.row}`;
  const existing = target.querySelector("img[data-exact-batch-score='1']");
  if (target.dataset.exactBatchScore === key && existing) return;

  target.classList.remove("team-mascot-fallback");
  target.textContent = "";
  target.style.setProperty("position", "relative", "important");
  target.style.setProperty("display", "block", "important");
  target.style.setProperty("background", "transparent", "important");
  target.style.setProperty("background-image", "none", "important");
  target.style.setProperty("border", "0", "important");
  target.style.setProperty("box-shadow", "none", "important");
  target.style.setProperty("color", "transparent", "important");
  target.style.setProperty("overflow", "hidden", "important");
  target.style.setProperty("opacity", "1", "important");
  target.style.setProperty("visibility", "visible", "important");

  const img = document.createElement("img");
  img.setAttribute("src", EXACT_BATCH_SPRITE_DATA);
  img.setAttribute("alt", "");
  img.setAttribute("aria-hidden", "true");
  img.setAttribute("loading", "eager");
  img.setAttribute("decoding", "async");
  img.dataset.exactBatchScore = "1";

  img.style.setProperty("position", "absolute", "important");
  img.style.setProperty("display", "block", "important");
  img.style.setProperty("width", "500%", "important");
  img.style.setProperty("height", "200%", "important");
  img.style.setProperty("min-width", "500%", "important");
  img.style.setProperty("max-width", "none", "important");
  img.style.setProperty("object-fit", "fill", "important");
  img.style.setProperty("left", `-${tile.col * 100}%`, "important");
  img.style.setProperty("top", `-${tile.row * 100}%`, "important");
  img.style.setProperty("margin", "0", "important");
  img.style.setProperty("padding", "0", "important");
  img.style.setProperty("border", "0", "important");
  img.style.setProperty("opacity", "1", "important");
  img.style.setProperty("visibility", "visible", "important");
  img.style.setProperty("pointer-events", "none", "important");

  target.appendChild(img);
  target.setAttribute("aria-label", `${teamName} score mark`);
  target.dataset.exactBatchScore = key;
};

const setImageSource = (img, teamName, src) => {
  if (!img || !src) return;
  if (img.getAttribute("src") !== src) img.setAttribute("src", src);
  img.setAttribute("alt", `${teamName} score mark`);
  img.setAttribute("decoding", "async");
  styleRegularImage(img);
};

const installMark = (target, teamName, src) => {
  if (!target || !src) return;

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

const exactTeamFromText = (text = "") => {
  const clean = text.trim();
  for (const [teamName] of EXACT_BATCH_SCORE_TILES) {
    if (clean === teamName || clean.includes(teamName)) return teamName;
  }
  return "";
};

const recoverExistingScoreMarks = () => {
  if (typeof document === "undefined") return;

  document.querySelectorAll(".score-team-mascot").forEach((target) => {
    const buttonText = target.closest("button")?.textContent || "";
    const exactTeam =
      exactTeamFromText(target.getAttribute("aria-label") || "") ||
      exactTeamFromText(buttonText);

    if (exactTeam) {
      applyExactSpriteImage(
        target,
        exactTeam,
        EXACT_BATCH_SCORE_TILES.get(exactTeam)
      );
      return;
    }

    const img = target.tagName === "IMG" ? target : target.querySelector("img");
    const teamName = teamFromAlt(img?.getAttribute("alt") || "");
    const src = SCORE_MARKS.get(teamName);
    if (src) installMark(target, teamName, src);
  });

  document.querySelectorAll(".game-details-team").forEach((row) => {
    const strongName = row.querySelector("strong")?.textContent?.trim() || "";
    const exactTeam = exactTeamFromText(strongName || row.textContent || "");
    const logoTarget = row.querySelector(".game-details-team-logo");

    if (exactTeam) {
      applyExactSpriteImage(
        logoTarget,
        exactTeam,
        EXACT_BATCH_SCORE_TILES.get(exactTeam)
      );
      return;
    }

    const text = row.textContent || "";
    for (const [teamName, src] of SCORE_MARKS) {
      if (!text.includes(teamName)) continue;
      installMark(logoTarget, teamName, src);
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
