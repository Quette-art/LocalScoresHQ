import { footballGames } from "./footballGamesAug22.js";
import { marylandFootballGames } from "./marylandFootballGames.js";
import { applyFootballScheduleCorrections } from "./footballScheduleCorrectionsAug28.js";

const correctedFootballGames = applyFootballScheduleCorrections(footballGames);

export const games = [
  ...correctedFootballGames,
  ...marylandFootballGames,
];

export const upcomingGames = games;

export default games;