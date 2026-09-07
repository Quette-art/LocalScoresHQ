import { teamMascots } from "./teamMascots.js";
import "./customScoreMarks.css";
import "./bullisVectorScoreFix.css";

// Original LocalScoresHQ-created football badges for tracked programs that did
// not already have a usable site mark. Full crests stay on team/profile views;
// score/game views can use separate compact marks.
Object.assign(teamMascots, {
  "Friendship Collegiate Academy": "/mascots/custom/friendship-collegiate-v2.svg",
  "Friendship Collegiate": "/mascots/custom/friendship-collegiate-v2.svg",
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

const FRIENDSHIP_SCORE_SVG = "/mascots/custom/score/friendship-collegiate-score-v2.svg";
const BULLIS_SCORE_SVG = "/mascots/custom/score/bullis-score.svg?v=exact-direct-1";

const applyExactScoreMarks = () => {
  if (typeof document === "undefined") return;

  document
    .querySelectorAll(
      '.score-team-mascot img[alt="Friendship Collegiate Academy unofficial mascot"], .score-team-mascot img[alt="Friendship Collegiate unofficial mascot"], .game-details-team-logo img[alt="Friendship Collegiate Academy unofficial mascot"], .game-details-team-logo img[alt="Friendship Collegiate unofficial mascot"]'
    )
    .forEach((img) => {
      if (img.getAttribute("src") !== FRIENDSHIP_SCORE_SVG) {
        img.setAttribute("src", FRIENDSHIP_SCORE_SVG);
      }
      img.style.setProperty("opacity", "1", "important");
      img.parentElement?.style.setProperty("background-image", "none", "important");
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
  queueMicrotask(applyExactScoreMarks);

  const exactScoreMarkObserver = new MutationObserver(applyExactScoreMarks);
  exactScoreMarkObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
