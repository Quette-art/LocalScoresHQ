import { footballGames } from "./footballGamesAug22.js";
import { marylandFootballGames } from "./marylandFootballGames.js";
import { applyFootballScheduleCorrections } from "./footballScheduleCorrectionsAug28.js";
import { applyFootballScheduleAuditAug29 } from "./footballScheduleAuditAug29.js";
import { applyFootballScheduleCorrectionsAug30 } from "./footballScheduleCorrectionsAug30.js";
import { applyFootballScheduleCorrectionsSep6 } from "./footballScheduleCorrectionsSep6.js";
import { applyBullisFootballScheduleSep5 } from "./bullisFootballScheduleSep5.js";
import { applyTrackedPrivateFootballSchedulesSep5 } from "./trackedPrivateFootballSchedulesSep5.js";
import { applyWcacMetroFootballSchedulesSep13 } from "./wcacMetroFootballSchedulesSep13.js";
import { applyIacFootballSchedulesSep13 } from "./iacFootballSchedulesSep13.js";
import { applyMacFootballSchedulesSep13 } from "./macFootballSchedulesSep13.js";
import { applyFootballRecordCorrectionsSep13 } from "./footballRecordCorrectionsSep13.js";
import { applyFootballResultsAug28Ryken } from "./footballResultsAug28Ryken.js";
import { applyFootballResultsAug29 } from "./footballResultsAug29.js";
import { applyFootballResultCorrectionsAug29 } from "./footballResultCorrectionsAug29.js";
import { applyFootballResultCorrectionsAug30 } from "./footballResultCorrectionsAug30.js";
import { applyFootballResultsSep3 } from "./footballResultsSep3.js";
import { applyFootballResultsSep4 } from "./footballResultsSep4.js";
import { applyFootballUpdatesSep5 } from "./footballUpdatesSep5.js";
import { applyFootballResultsSep5Finals } from "./footballResultsSep5Finals.js";
import { applyFootballResultsSep10Finals } from "./footballResultsSep10Finals.js";
import { applyFootballResultsSep11Finals } from "./footballResultsSep11Finals.js";
import { applyFootballResultsSep12Finals } from "./footballResultsSep12Finals.js";
import { applyFootballResultsSep17Finals } from "./footballResultsSep17Finals.js";
import { applyFootballResultsSep18Finals } from "./footballResultsSep18Finals.js";
import { applyFootballResultsSep19Finals } from "./footballResultsSep19Finals.js";
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
const footballGamesWithAug28RykenFinal = applyFootballResultsAug28Ryken(
  footballGamesWithSep6ScheduleCorrections
);
const footballGamesWithResults = applyFootballResultsAug29(
  footballGamesWithAug28RykenFinal
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
const footballGamesWithSep12Finals = applyFootballResultsSep12Finals(
  footballGamesWithSep11Finals
);
const footballGamesWithWcacMetroSchedules = applyWcacMetroFootballSchedulesSep13(
  footballGamesWithSep12Finals
);
const footballGamesWithIacSchedules = applyIacFootballSchedulesSep13(
  footballGamesWithWcacMetroSchedules
);
const footballGamesWithMacSchedules = applyMacFootballSchedulesSep13(
  footballGamesWithIacSchedules
);
const footballGamesWithRecordCorrections = applyFootballRecordCorrectionsSep13(
  footballGamesWithMacSchedules
);
const footballGamesWithSep17Finals = applyFootballResultsSep17Finals(
  footballGamesWithRecordCorrections
);
const footballGamesWithSep18Finals = applyFootballResultsSep18Finals(
  footballGamesWithSep17Finals
);
const footballGamesWithSep19Finals = applyFootballResultsSep19Finals(
  footballGamesWithSep18Finals
);

const TEAM_NAME_ALIASES = new Map([
  ["Mt. Zion", "Mt. Zion Prep Academy"],
  ["Mt. Zion Prep", "Mt. Zion Prep Academy"],
  ["Georgetown Preparatory School", "Georgetown Prep"],
  ["C.H. Flowers", "Flowers"],
  ["Charles H. Flowers", "Flowers"],
  ["Charles H. Flowers High School", "Flowers"],
  ["Dunbar (Balt)", "Dunbar (Baltimore)"],
  ["Baltimore Dunbar", "Dunbar (Baltimore)"],
  ["Dunbar Baltimore", "Dunbar (Baltimore)"],
  ["Mervo", "Mervo (Baltimore)"],
  ["Mergenthaler Vocational-Technical", "Mervo (Baltimore)"],
  ["Independence High School", "Independence"],
  ["Bishop Ireton High School", "Bishop Ireton"],
  ["Bishop Denis J. O'Connell High School", "Bishop O'Connell"],
  ["Bishop O'Connell High School", "Bishop O'Connell"],
  ["Paul VI Catholic", "Paul VI"],
  ["St. Paul VI Catholic", "Paul VI"],
  ["St. Paul VI Catholic High School", "Paul VI"],
  ["Episcopal High School", "Episcopal"],
  ["St. Stephen's and St. Agnes", "St. Stephen's & St. Agnes"],
  ["St. Stephen's and St. Agnes School", "St. Stephen's & St. Agnes"],
  ["St. Stephens & St. Agnes School", "St. Stephen's & St. Agnes"],
  ["Flint Hill School", "Flint Hill"],
  ["Saint James School", "Saint James"],
  ["St. James School", "Saint James"],
  ["The Potomac School", "Potomac School"],
  ["Saint John Paul the Great Catholic", "St. John Paul the Great"],
  ["Saint John Paul the Great Catholic High School", "St. John Paul the Great"],
  ["St. John Paul the Great Catholic", "St. John Paul the Great"],
  ["St. John Paul the Great Catholic High School", "St. John Paul the Great"],
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

export const games = footballGamesWithSep19Finals.map(canonicalizeTeamNames);

export const upcomingGames = games;

export default games;
