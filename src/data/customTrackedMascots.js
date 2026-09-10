import { teamMascots } from "./teamMascots.js";
import "./customScoreMarks.css";
import "./bullisVectorScoreFix.css";

const FRIENDSHIP_FULL = "/mascots/missing-teams/friendship-knights-full.webp?v=identity-sheet-1";

const FRIENDSHIP_SCORE = "/mascots/missing-teams/friendship-score-fc.webp?v=identity-sheet-1";

Object.assign(teamMascots, {
  "Friendship Collegiate Academy": FRIENDSHIP_FULL,
  "Friendship Collegiate": FRIENDSHIP_FULL,
  "St. Albans": "/mascots/missing-teams/st-albans-bulldogs-full.webp",
  "St. Albans School": "/mascots/missing-teams/st-albans-bulldogs-full.webp",
  Bullis: "/mascots/custom/bullis-custom.svg",
  Landon: "/mascots/missing-teams/landon-bears-full.webp",
  "Landon School": "/mascots/missing-teams/landon-bears-full.webp",
  "National Christian Academy": "/mascots/missing-teams/national-christian-eagles-full.webp",
  "National Christian": "/mascots/missing-teams/national-christian-eagles-full.webp",
  "Rock Creek Christian Academy": "/mascots/missing-teams/rock-creek-eagles-full.webp",
  "Rock Creek Christian": "/mascots/missing-teams/rock-creek-eagles-full.webp",
  "St. Mary's Ryken": "/mascots/missing-teams/st-marys-ryken-knights-full.webp",
  "St. Mary’s Ryken": "/mascots/missing-teams/st-marys-ryken-knights-full.webp",
  "St Marys Ryken": "/mascots/missing-teams/st-marys-ryken-knights-full.webp",
  "St. Vincent Pallotti": "/mascots/missing-teams/st-vincent-pallotti-panthers-full.webp",
  Pallotti: "/mascots/missing-teams/st-vincent-pallotti-panthers-full.webp",
  "Our Lady of Good Counsel": "/mascots/missing-teams/good-counsel-falcons-full.webp",
  "Georgetown Prep": "/mascots/missing-teams/georgetown-prep-hoyas-full.webp",
  "Georgetown Preparatory School": "/mascots/missing-teams/georgetown-prep-hoyas-full.webp",
});

const BULLIS_SCORE_SVG = "/mascots/custom/score/bullis-score.svg?v=exact-direct-1";

const friendshipText = (value = "") =>
  /Friendship Collegiate(?: Academy)?/i.test(String(value));

const forceImage = (container, src, alt) => {
  if (!container) return;
  let img = container.querySelector("img");
  if (!img) {
    container.textContent = "";
    img = document.createElement("img");
    container.appendChild(img);
  }
  if (img.getAttribute("src") !== src) img.setAttribute("src", src);
  img.setAttribute("alt", alt);
  img.setAttribute("decoding", "async");
  img.style.setProperty("opacity", "1", "important");
  img.style.setProperty("visibility", "visible", "important");
  img.style.setProperty("display", "block", "important");
  img.style.setProperty("width", "100%", "important");
  img.style.setProperty("height", "100%", "important");
  img.style.setProperty("object-fit", "contain", "important");
  container.style.setProperty("background-image", "none", "important");
};

const applyFriendshipArtwork = () => {
  if (typeof document === "undefined") return;

  document.querySelectorAll(".team-header").forEach((header) => {
    if (!friendshipText(header.textContent)) return;
    forceImage(header.querySelector(".team-logo"), FRIENDSHIP_FULL, "Friendship Collegiate Academy crest");
  });

  document.querySelectorAll(".game-details-team").forEach((row) => {
    if (!friendshipText(row.textContent)) return;
    forceImage(row.querySelector(".game-details-team-logo"), FRIENDSHIP_SCORE, "Friendship Collegiate Academy FC mark");
  });

  document.querySelectorAll('.score-team-mascot img[alt="Friendship Collegiate Academy unofficial mascot"], .score-team-mascot img[alt="Friendship Collegiate unofficial mascot"]').forEach((img) => {
    forceImage(img.closest(".score-team-mascot"), FRIENDSHIP_SCORE, "Friendship Collegiate Academy FC mark");
  });

  document.querySelectorAll('.score-team-mascot img[alt="Bullis unofficial mascot"], .game-details-team-logo img[alt="Bullis unofficial mascot"]').forEach((img) => {
    if (img.getAttribute("src") !== BULLIS_SCORE_SVG) img.setAttribute("src", BULLIS_SCORE_SVG);
  });
};

if (typeof document !== "undefined") {
  queueMicrotask(applyFriendshipArtwork);
  const observer = new MutationObserver(() => requestAnimationFrame(applyFriendshipArtwork));
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
