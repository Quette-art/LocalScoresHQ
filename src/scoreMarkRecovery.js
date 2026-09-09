const SCORE_MARKS = new Map([
  ["Bullis", "/mascots/score-marks/bullis-b.svg?v=creative-initials-2"],
  ["St. Albans", "/mascots/score-marks/st-albans-sa.svg?v=creative-initials-2"],
  ["Landon", "/mascots/score-marks/landon-l.svg?v=creative-initials-2"],
  ["National Christian Academy", "/mascots/score-marks/national-christian-academy-nca.svg?v=creative-initials-2"],
  ["Rock Creek Christian Academy", "/mascots/score-marks/rock-creek-christian-academy-rc.svg?v=creative-initials-2"],
  ["Mt. Zion", "/mascots/score-marks/mt-zion-prep-mzp.svg?v=compact-system-1"],
  ["Mt. Zion Prep", "/mascots/score-marks/mt-zion-prep-mzp.svg?v=compact-system-1"],
  ["Mt. Zion Prep Academy", "/mascots/score-marks/mt-zion-prep-mzp.svg?v=compact-system-1"],
  ["St. John's", "/mascots/score-marks/st-johns-sjc.svg?v=compact-system-1"],
  ["St. John’s", "/mascots/score-marks/st-johns-sjc.svg?v=compact-system-1"],
  ["St Johns", "/mascots/score-marks/st-johns-sjc.svg?v=compact-system-1"],
  ["St. John's College High School", "/mascots/score-marks/st-johns-sjc.svg?v=compact-system-1"],
  ["St. Mary's Ryken", "/mascots/score-marks/st-marys-ryken-smr.svg?v=compact-system-1"],
  ["St. Mary’s Ryken", "/mascots/score-marks/st-marys-ryken-smr.svg?v=compact-system-1"],
  ["St. Michael the Archangel (VA)", "/mascots/st-michael-warriors-score-sma.svg?v=compact-system-1"],
  ["St. Michael the Archangel", "/mascots/st-michael-warriors-score-sma.svg?v=compact-system-1"],
  ["St. Vincent Pallotti", "/mascots/score-marks/st-vincent-pallotti-svp.svg?v=svp-exact-picture-1"],
  ["Georgetown Prep", "/mascots/score-marks/georgetown-prep-gp.svg?v=exact-generated-mobile-1"],
  ["Georgetown Preparatory School", "/mascots/score-marks/georgetown-prep-gp.svg?v=exact-generated-mobile-1"],
]);

const EXACT_PICTURE_TEAMS = new Set([]);

const teamFromAlt = (alt = "") =>
  alt
    .replace(/ unofficial mascot$/i, "")
    .replace(/ score mark$/i, "")
    .trim();

const styleImage = (img) => {
  img.style.setProperty("display", "block", "important");
  img.style.setProperty("width", "100%", "important");
  img.style.setProperty("height", "100%", "important");
  img.style.setProperty("object-fit", "contain", "important");
  img.style.setProperty("opacity", "1", "important");
  img.style.setProperty("visibility", "visible", "important");
};

const installExactPicture = (target, teamName, src) => {
  if (!target) return;

  const current = target.querySelector("img[data-exact-score-picture='1']");
  if (
    target.dataset.exactScorePicture === src &&
    current?.getAttribute("src") === src
  ) {
    styleImage(current);
    return;
  }

  target.classList.remove("team-mascot-fallback");
  target.style.setProperty("background", "transparent", "important");
  target.style.setProperty("background-image", "none", "important");
  target.style.setProperty("border", "0", "important");
  target.style.setProperty("box-shadow", "none", "important");
  target.style.setProperty("color", "transparent", "important");
  target.style.setProperty("overflow", "visible", "important");

  target.textContent = "";
  const img = document.createElement("img");
  img.setAttribute("src", src);
  img.setAttribute("alt", `${teamName} score mark`);
  img.setAttribute("decoding", "async");
  img.setAttribute("loading", "eager");
  img.dataset.exactScorePicture = "1";
  styleImage(img);
  target.appendChild(img);
  target.dataset.exactScorePicture = src;
};

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
  if (!target || !src) return;

  if (EXACT_PICTURE_TEAMS.has(teamName)) {
    installExactPicture(target, teamName, src);
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
    const exactTeam = target.getAttribute("aria-label") || "";
    if (EXACT_PICTURE_TEAMS.has(exactTeam)) {
      installMark(target, exactTeam, SCORE_MARKS.get(exactTeam));
      return;
    }

    const img = target.tagName === "IMG" ? target : target.querySelector("img");
    const teamName = teamFromAlt(img?.getAttribute("alt") || "");
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
