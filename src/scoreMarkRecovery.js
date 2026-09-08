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
  ["Mt. Zion", "/mascots/score-marks/mt-zion-prep-mzp.webp?v=direct-picture-2"],
  ["Mt. Zion Prep", "/mascots/score-marks/mt-zion-prep-mzp.webp?v=direct-picture-2"],
  ["Mt. Zion Prep Academy", "/mascots/score-marks/mt-zion-prep-mzp.webp?v=direct-picture-2"],
  ["Riverdale Baptist", "/mascots/score-marks/riverdale-baptist-rbs.webp?v=direct-picture-2"],
  ["Riverdale Baptist School", "/mascots/score-marks/riverdale-baptist-rbs.webp?v=direct-picture-2"],
]);

const BACKGROUND_PICTURE_TEAMS = new Set([
  "Mt. Zion",
  "Mt. Zion Prep",
  "Mt. Zion Prep Academy",
  "Riverdale Baptist",
  "Riverdale Baptist School",
]);

const EMPTY_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E";

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

const paintPicture = (target, teamName, src) => {
  if (!target) return;

  target.style.setProperty("background-image", `url("${src}")`, "important");
  target.style.setProperty("background-repeat", "no-repeat", "important");
  target.style.setProperty("background-position", "center", "important");
  target.style.setProperty("background-size", "contain", "important");
  target.style.setProperty("background-color", "transparent", "important");

  if (target.tagName === "IMG") {
    target.setAttribute("src", EMPTY_IMAGE);
    target.setAttribute("alt", `${teamName} score mark`);
    target.style.setProperty("display", "block", "important");
    target.style.setProperty("opacity", "1", "important");
    target.style.setProperty("visibility", "visible", "important");
    target.style.setProperty("object-fit", "contain", "important");
    return;
  }

  let img = target.querySelector("img");
  if (!img) {
    img = document.createElement("img");
    target.appendChild(img);
  }

  img.setAttribute("src", EMPTY_IMAGE);
  img.setAttribute("alt", `${teamName} score mark`);
  img.style.setProperty("width", "100%", "important");
  img.style.setProperty("height", "100%", "important");
  img.style.setProperty("opacity", "0", "important");
  img.style.setProperty("visibility", "hidden", "important");
};

const installMark = (target, teamName, src) => {
  if (!target) return;

  if (BACKGROUND_PICTURE_TEAMS.has(teamName)) {
    paintPicture(target, teamName, src);
    return;
  }

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
