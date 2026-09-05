import { footballGames } from "./footballGamesAug22.js";
import { marylandFootballGames } from "./marylandFootballGames.js";
import { applyFootballScheduleCorrections } from "./footballScheduleCorrectionsAug28.js";
import { applyFootballScheduleAuditAug29 } from "./footballScheduleAuditAug29.js";
import { applyFootballScheduleCorrectionsAug30 } from "./footballScheduleCorrectionsAug30.js";
import { applyBullisFootballScheduleSep5 } from "./bullisFootballScheduleSep5.js";
import { applyTrackedPrivateFootballSchedulesSep5 } from "./trackedPrivateFootballSchedulesSep5.js";
import { applyFootballResultsAug29 } from "./footballResultsAug29.js";
import { applyFootballResultCorrectionsAug29 } from "./footballResultCorrectionsAug29.js";
import { applyFootballResultCorrectionsAug30 } from "./footballResultCorrectionsAug30.js";
import { applyFootballResultsSep3 } from "./footballResultsSep3.js";
import { applyFootballResultsSep4 } from "./footballResultsSep4.js";
import { applyFootballUpdatesSep5 } from "./footballUpdatesSep5.js";

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
const footballGamesWithResults = applyFootballResultsAug29(
  footballGamesWithTrackedPrivateSchedules
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

export const games = footballGamesWithSep5Updates;

export const upcomingGames = games;

export default games;
