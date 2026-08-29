import { footballGames } from "./footballGamesAug22.js";
import { marylandFootballGames } from "./marylandFootballGames.js";
import { applyFootballScheduleCorrections } from "./footballScheduleCorrectionsAug28.js";
import { applyFootballResultsAug29 } from "./footballResultsAug29.js";
import { applyFootballResultCorrectionsAug29 } from "./footballResultCorrectionsAug29.js";

const correctedFootballGames = applyFootballScheduleCorrections(footballGames);
const footballGamesWithResults = applyFootballResultsAug29([
  ...correctedFootballGames,
  ...marylandFootballGames,
]);
const footballGamesWithCorrectedResults = applyFootballResultCorrectionsAug29(
  footballGamesWithResults
);

export const games = footballGamesWithCorrectedResults;

export const upcomingGames = games;

export default games;
