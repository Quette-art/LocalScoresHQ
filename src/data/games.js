import { footballGames } from "./footballGamesAug22.js";
import { marylandFootballGames } from "./marylandFootballGames.js";
import { applyFootballScheduleCorrections } from "./footballScheduleCorrectionsAug28.js";
import { applyFootballScheduleAuditAug29 } from "./footballScheduleAuditAug29.js";
import { applyFootballScheduleCorrectionsAug30 } from "./footballScheduleCorrectionsAug30.js";
import { applyFootballScheduleCorrectionsSep6 } from "./footballScheduleCorrectionsSep6.js";
import { applyBullisFootballScheduleSep5 } from "./bullisFootballScheduleSep5.js";
import { applyTrackedPrivateFootballSchedulesSep5 } from "./trackedPrivateFootballSchedulesSep5.js";
import { applyFootballResultsAug29 } from "./footballResultsAug29.js";
import { applyFootballResultCorrectionsAug29 } from "./footballResultCorrectionsAug29.js";
import { applyFootballResultCorrectionsAug30 } from "./footballResultCorrectionsAug30.js";
import { applyFootballResultsSep3 } from "./footballResultsSep3.js";
import { applyFootballResultsSep4 } from "./footballResultsSep4.js";
import { applyFootballUpdatesSep5 } from "./footballUpdatesSep5.js";
import { applyFootballResultsSep5Finals } from "./footballResultsSep5Finals.js";
import { applyFootballResultsSep10Finals } from "./footballResultsSep10Finals.js";
import { applyFootballResultsSep11Finals } from "./footballResultsSep11Finals.js";
import { applyDunbarFootballScheduleSep10 } from "./dunbarFootballScheduleSep10.js";

const correctedFootballGames = applyFootballScheduleCorrections(footballGames);
const auditedFootballGames = applyFootballScheduleAuditAug29(correctedFootballGames);
const cleanedFootballGames = applyFootballScheduleCorrectionsAug30(auditedFootballGames);
const footballGamesWithBullisSchedule = applyBullisFootballScheduleSep5([
  ...cleanedFootballGames,
  ...marylandFootballGames,
]);
const footballGamesWithTrackedPrivateSchedules = applyTrackedPrivateFootballSchedulesSep5(
  footballGamesWithBullisSchedule
);
const footballGamesWithSep6ScheduleCorrections = applyFootballScheduleCorrectionsSep6(
  footballGamesWithTrackedPrivateSchedules
);
const footballGamesWithResults = applyFootballResultsAug29(
  footballGamesWithSep6ScheduleCorrections
);
const footballGamesWithCorrectedResults = applyFootballResultCorrectionsAug29(
  footballGamesWithResults
);
const footballGamesWithAug30Results = applyFootballResultCorrectionsAug30(
  footballGamesWithCorrectedResults
);
const footballGamesWithSep3Results = applyFootballResultsSep3(
  footballGamesWithAug30Results
);
const footballGamesWithSep4Results = applyFootballResultsSep4(
  footballGamesWithSep3Results
);
const footballGamesWithSep5Updates = applyFootballUpdatesSep5(
  footballGamesWithSep4Results
);
const footballGamesWithSep5Finals = applyFootballResultsSep5Finals(
  footballGamesWithSep5Updates
);
const footballGamesWithDunbarSchedule = applyDunbarFootballScheduleSep10(
  footballGamesWithSep5Finals
);
const footballGamesWithSep10Finals = applyFootballResultsSep10Finals(
  footballGamesWithDunbarSchedule
);
const footballGamesWithSep11Finals = applyFootballResultsSep11Finals(
  footballGamesWithSep10Finals
);

const TEAM_NAME_ALIASES = new Map([
  ["Mt. Zion", "Mt. Zion Prep Academy"],
  ["Mt. Zion Prep", "Mt. Zion Prep Academy"],
  ["Georgetown Preparatory School", "Georgetown Prep"],
  ["Dunbar (Balt)", "Dunbar (Baltimore)"],
  ["Baltimore Dunbar", "Dunbar (Baltimore)"],
  ["Dunbar Baltimore", "Dunbar (Baltimore)"],
]);

const canonicalTeamName = (teamName = "") => {
  const normalizedApostrophe = String(teamName).replace(/[’‘]/g, "'").trim();
  return TEAM_NAME_ALIASES.get(normalizedApostrophe) || normalizedApostrophe;
};

const canonicalizeTeamNames = (game) => ({
  ...game,
  team1: canonicalTeamName(game.team1),
  team2: canonicalTeamName(game.team2),
});

export const games = footballGamesWithSep11Finals.map(canonicalizeTeamNames);

export const upcomingGames = games;

export default games;
