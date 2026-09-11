const SCORE_MARKS = new Map([
  ["Bullis", "/mascots/missing-teams/bullis-score-b.webp?v=identity-sheet-1"],
  ["Bullis School", "/mascots/missing-teams/bullis-score-b.webp?v=identity-sheet-1"],
  ["Ballou", "/mascots/missing-teams/ballou-score-bk.webp?v=identity-sheet-1"],
  ["Ballou High School", "/mascots/missing-teams/ballou-score-bk.webp?v=identity-sheet-1"],
  ["Dunbar", "/mascots/missing-teams/dunbar-score-d.webp?v=identity-sheet-2"],
  ["Dunbar High School", "/mascots/missing-teams/dunbar-score-d.webp?v=identity-sheet-2"],
  ["Mt. Zion", "/mascots/missing-teams/mt-zion-score-mzp.webp?v=identity-sheet-1"],
  ["Mt. Zion Prep", "/mascots/missing-teams/mt-zion-score-mzp.webp?v=identity-sheet-1"],
  ["Mt. Zion Prep Academy", "/mascots/missing-teams/mt-zion-score-mzp.webp?v=identity-sheet-1"],
  ["Mount Zion Prep Academy", "/mascots/missing-teams/mt-zion-score-mzp.webp?v=identity-sheet-1"],
  ["St. Albans", "/mascots/missing-teams/st-albans-score-sa.webp?v=identity-sheet-1"],
  ["St. Albans School", "/mascots/missing-teams/st-albans-score-sa.webp?v=identity-sheet-1"],
  ["Landon", "/mascots/missing-teams/landon-score-l.webp?v=identity-sheet-1"],
  ["Landon School", "/mascots/missing-teams/landon-score-l.webp?v=identity-sheet-1"],
  ["National Christian Academy", "/mascots/missing-teams/national-christian-score-nca.webp?v=identity-sheet-1"],
  ["National Christian", "/mascots/missing-teams/national-christian-score-nca.webp?v=identity-sheet-1"],
  ["Rock Creek Christian Academy", "/mascots/missing-teams/rock-creek-score-rc.webp?v=identity-sheet-1"],
  ["Rock Creek Christian", "/mascots/missing-teams/rock-creek-score-rc.webp?v=identity-sheet-1"],
  ["St. Mary's Ryken", "/mascots/missing-teams/st-marys-ryken-score-smr.webp?v=identity-sheet-1"],
  ["St. Mary’s Ryken", "/mascots/missing-teams/st-marys-ryken-score-smr.webp?v=identity-sheet-1"],
  ["St Marys Ryken", "/mascots/missing-teams/st-marys-ryken-score-smr.webp?v=identity-sheet-1"],
  ["St. Vincent Pallotti", "/mascots/missing-teams/st-vincent-pallotti-score-svp.webp?v=identity-sheet-1"],
  ["Pallotti", "/mascots/missing-teams/st-vincent-pallotti-score-svp.webp?v=identity-sheet-1"],
  ["Georgetown Prep", "/mascots/missing-teams/georgetown-prep-score-gp.webp?v=identity-sheet-1"],
  ["Georgetown Preparatory School", "/mascots/missing-teams/georgetown-prep-score-gp.webp?v=identity-sheet-1"],
  ["Friendship Collegiate", "/mascots/missing-teams/friendship-score-fc.webp?v=identity-sheet-1"],
  ["Friendship Collegiate Academy", "/mascots/missing-teams/friendship-score-fc.webp?v=identity-sheet-1"],
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
  if (!target) return;

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
