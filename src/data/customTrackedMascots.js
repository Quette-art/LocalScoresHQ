import { teamMascots } from "./teamMascots.js";
import "./customScoreMarks.css";
import "./bullisVectorScoreFix.css";

Object.assign(teamMascots, {
  "Friendship Collegiate Academy": "/mascots/custom/friendship-collegiate-v2.svg?v=friendship-fix-3",
  "Friendship Collegiate": "/mascots/custom/friendship-collegiate-v2.svg?v=friendship-fix-3",
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

const FRIENDSHIP_FULL_SVG = "/mascots/custom/friendship-collegiate-v2.svg?v=friendship-fix-3";
const FRIENDSHIP_SCORE_SVG = "/mascots/custom/score/friendship-collegiate-score-v2.svg?v=friendship-fix-3";
const BULLIS_SCORE_SVG = "/mascots/custom/score/bullis-score.svg?v=exact-direct-1";

const isFriendshipImage = (img) => {
  const alt = img.getAttribute("alt") || "";
  return alt === "Friendship Collegiate Academy unofficial mascot" ||
    alt === "Friendship Collegiate unofficial mascot";
};

const applyExactScoreMarks = () => {
  if (typeof document === "undefined") return;

  document.querySelectorAll('img[alt="Friendship Collegiate Academy unofficial mascot"], img[alt="Friendship Collegiate unofficial mascot"]').forEach((img) => {
    const inScoreContext = Boolean(img.closest(".score-team-mascot, .game-details-team-logo"));
    const wanted = inScoreContext ? FRIENDSHIP_SCORE_SVG : FRIENDSHIP_FULL_SVG;
    if (img.getAttribute("src") !== wanted) img.setAttribute("src", wanted);
    img.style.setProperty("opacity", "1", "important");
    img.style.setProperty("visibility", "visible", "important");
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
    attributes: true,
    attributeFilter: ["src", "class"],
  });
}
