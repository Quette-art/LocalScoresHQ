import { footballGames } from "./footballGamesAug22.js";
import { marylandFootballGames } from "./marylandFootballGames.js";
import { applyFootballScheduleCorrections } from "./footballScheduleCorrectionsAug28.js";
import { applyFootballScheduleAudit } from "./footballScheduleAuditAug28.js";

const correctedFootballGames = applyFootballScheduleCorrections(footballGames);
const auditedFootballGames = applyFootballScheduleAudit(correctedFootballGames);

export const games = [
  ...auditedFootballGames,
  ...marylandFootballGames,
];

export const upcomingGames = games;

export default games;