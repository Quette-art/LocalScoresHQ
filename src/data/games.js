import { soccerGames } from "./soccerGames.js";
import { flagFootballGames, flagFootballPlayoffGames } from "./flagFootballGames.js";

export const games = [...soccerGames, ...flagFootballGames, ...flagFootballPlayoffGames];

export const upcomingGames = games;

export default games;