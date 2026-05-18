import { soccerGames } from "./soccerGames.js";
import { flagFootballGames } from "./flagFootballGames.js";

export const games = [...soccerGames, ...flagFootballGames];

export const upcomingGames = games;

export default games;