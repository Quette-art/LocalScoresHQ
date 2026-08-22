import { soccerGames } from "./soccerGames.js";
import { flagFootballGames, flagFootballPlayoffGames } from "./flagFootballGames.js";
import { footballGames } from "./footballGames.js";

export const games = [
  ...soccerGames,
  ...flagFootballGames,
  ...flagFootballPlayoffGames,
  ...footballGames,
];

export const upcomingGames = games;

export default games;
