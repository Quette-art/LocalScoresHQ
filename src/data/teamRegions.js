import {
  dcTrackedFootballSchools,
  marylandTrackedFootballSchools,
  getTrackedFootballRegion,
} from "./trackedFootballSchools.js";

// Backward-compatible exports used by the football UI.
export const dcFootballTeams = new Set(dcTrackedFootballSchools);
export const marylandFootballTeams = new Set(marylandTrackedFootballSchools);

export const gameMatchesRegion = (game, region) => {
  if (region === "ALL") return true;

  const teams = [game.team1, game.team2];

  if (region === "DC" || region === "MD") {
    return teams.some((team) => getTrackedFootballRegion(team) === region);
  }

  return true;
};
