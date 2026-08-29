import { footballGames } from "./footballGamesAug22.js";
import { marylandFootballGames } from "./marylandFootballGames.js";
import { applyFootballScheduleCorrections } from "./footballScheduleCorrectionsAug28.js";
import { applyFootballResultsAug29 } from "./footballResultsAug29.js";

const correctedFootballGames = applyFootballScheduleCorrections(footballGames);
const footballGamesWithResults = applyFootballResultsAug29([
  ...correctedFootballGames,
  ...marylandFootballGames,
]);

export const games = footballGamesWithResults;

export const upcomingGames = games;

export default games;
