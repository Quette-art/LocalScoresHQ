import { footballGames } from "./footballGames.js";
import { marylandFootballGames } from "./marylandFootballGames.js";

export const games = [
  ...footballGames,
  ...marylandFootballGames,
];

export const upcomingGames = games;

export default games;