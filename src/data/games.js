import { footballGames } from "./footballGamesAug22.js";
import { marylandFootballGames } from "./marylandFootballGames.js";
import { applyFootballScheduleCorrections } from "./footballScheduleCorrectionsAug28.js";
import { applyFootballScheduleAuditAug29 } from "./footballScheduleAuditAug29.js";
import { applyFootballScheduleCorrectionsAug30 } from "./footballScheduleCorrectionsAug30.js";
import { applyFootballResultsAug29 } from "./footballResultsAug29.js";
import { applyFootballResultCorrectionsAug29 } from "./footballResultCorrectionsAug29.js";
import { applyFootballResultCorrectionsAug30 } from "./footballResultCorrectionsAug30.js";
import { applyFootballResultsSep3 } from "./footballResultsSep3.js";

const correctedFootballGames = applyFootballScheduleCorrections(footballGames);
const auditedFootballGames = applyFootballScheduleAuditAug29(correctedFootballGames);
const cleanedFootballGames = applyFootballScheduleCorrectionsAug30(auditedFootballGames);
const footballGamesWithResults = applyFootballResultsAug29([
  ...cleanedFootballGames,
  ...marylandFootballGames,
]);
const footballGamesWithCorrectedResults = applyFootballResultCorrectionsAug29(
  footballGamesWithResults
);
const footballGamesWithAug30Results = applyFootballResultCorrectionsAug30(
  footballGamesWithCorrectedResults
);
const footballGamesWithSep3Results = applyFootballResultsSep3(
  footballGamesWithAug30Results
);

export const games = footballGamesWithSep3Results;

export const upcomingGames = games;

export default games;
