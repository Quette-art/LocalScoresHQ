import { teamMascots } from "./teamMascots.js";
import "./customScoreMarks.css";
import "./bullisVectorScoreFix.css";

// Original LocalScoresHQ-created football badges for tracked programs that did
// not already have a usable site mark. Full crests stay on team/profile views;
// customScoreMarks.css swaps in compact, school-specific marks on score cards
// and game-detail score displays for this test branch.
Object.assign(teamMascots, {
  "Friendship Collegiate Academy": "/mascots/custom/friendship-collegiate-custom.svg",
  "Friendship Collegiate": "/mascots/custom/friendship-collegiate-custom.svg",
  "St. Albans": "/mascots/custom/st-albans-custom.svg",
  Bullis: "/mascots/custom/bullis-custom.svg",
  Landon: "/mascots/custom/landon-custom.svg",
  "National Christian Academy": "/mascots/custom/national-christian-academy-custom.svg",
  "Rock Creek Christian Academy": "/mascots/custom/rock-creek-christian-academy-custom.svg",
  "St. Mary's Ryken": "/mascots/custom/st-marys-ryken-custom.svg",
  "St. Mary’s Ryken": "/mascots/custom/st-marys-ryken-custom.svg",
  "St. Vincent Pallotti": "/mascots/custom/st-vincent-pallotti-custom.svg",
  "Our Lady of Good Counsel": "/mascots/standings/good-counsel.png",
});

// Bullis score/game views: use the exact approved picture-in-SVG file as the
// actual <img> source instead of recreating the bulldog with SVG paths/CSS.
// This keeps the approved artwork intact while avoiding the Safari background
// rendering problem we hit earlier.
const BULLIS_SCORE_SVG = "/mascots/custom/score/bullis-score.svg?v=exact-direct-1";

const applyBullisExactScoreMark = () => {
  if (typeof document === "undefined") return;

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
  queueMicrotask(applyBullisExactScoreMark);

  const bullisScoreObserver = new MutationObserver(applyBullisExactScoreMark);
  bullisScoreObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
