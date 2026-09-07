import { teamMascots } from "./teamMascots.js";
import "./customScoreMarks.css";
import "./bullisVectorScoreFix.css";

Object.assign(teamMascots, {
  "Friendship Collegiate Academy": "/mascots/custom/friendship-collegiate-v2.svg?v=friendship-fix-4",
  "Friendship Collegiate": "/mascots/custom/friendship-collegiate-v2.svg?v=friendship-fix-4",
  "St. Albans": "/mascots/custom/st-albans-custom.svg",
  Bullis: "/mascots/custom/bullis-custom.svg",
  Landon: "/mascots/custom/landon-custom.svg",
  "National Christian Academy": "/mascots/custom/national-christian-academy-custom.svg",
  "Rock Creek Christian Academy": "/mascots/custom/rock-creek-christian-academy-custom.svg",
  "St. Mary's Ryken": "/mascots/custom/st-marys-ryken-custom.svg",
  "St. Mary’s Ryken": "/mascots/custom/st-marys-ryken-custom.svg",
  "St. Vincent Pallotti": "/mascots/custom/st-vincent-pallotti-custom.svg",
  "Our Lady of Good Counsel": "/mascots/missing-teams/good-counsel-falcons-full.webp",
});

const FRIENDSHIP_FULL_SVG = "/mascots/custom/friendship-collegiate-v2.svg?v=friendship-fix-4";
const FRIENDSHIP_SCORE_SVG = "/mascots/custom/score/friendship-collegiate-score-v2.svg?v=friendship-fix-4";
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

const applyFriendshipFallbackBypass = () => {
  if (typeof document === "undefined") return;

  // Team profile: do not depend on TeamMascot's failed/fallback state. If the
  // page title says Friendship, put the crest directly in the logo container.
  document.querySelectorAll(".team-header").forEach((header) => {
    if (!friendshipText(header.textContent)) return;
    forceImage(
      header.querySelector(".team-logo"),
      FRIENDSHIP_FULL_SVG,
      "Friendship Collegiate Academy crest"
    );
  });

  // Game Details: identify the Friendship row by its visible team name, then
  // put the compact FC artwork directly into that row's logo slot.
  document.querySelectorAll(".game-details-team").forEach((row) => {
    if (!friendshipText(row.textContent)) return;
    forceImage(
      row.querySelector(".game-details-team-logo"),
      FRIENDSHIP_SCORE_SVG,
      "Friendship Collegiate Academy score mark"
    );
  });

  // Normal score cards still have an img before a fallback occurs, so force
  // the score mark there by alt text as well.
  document
    .querySelectorAll(
      '.score-team-mascot img[alt="Friendship Collegiate Academy unofficial mascot"], .score-team-mascot img[alt="Friendship Collegiate unofficial mascot"]'
    )
    .forEach((img) => {
      const container = img.closest(".score-team-mascot");
      forceImage(container, FRIENDSHIP_SCORE_SVG, "Friendship Collegiate Academy score mark");
    });

  document
    .querySelectorAll(
      '.score-team-mascot img[alt="Bullis unofficial mascot"], .game-details-team-logo img[alt="Bullis unofficial mascot"]'
    )
    .forEach((img) => {
      if (img.getAttribute("src") !== BULLIS_SCORE_SVG) {
        img.setAttribute("src", BULLIS_SCORE_SVG);
      }
    });
};

if (typeof document !== "undefined") {
  queueMicrotask(applyFriendshipFallbackBypass);

  const friendshipMascotObserver = new MutationObserver(() => {
    requestAnimationFrame(applyFriendshipFallbackBypass);
  });

  friendshipMascotObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
