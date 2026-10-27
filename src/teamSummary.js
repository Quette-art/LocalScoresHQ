import { hasFinal, todayEastern, resultValue } from "./dashboardUtils.js";

export function teamSearchLabel(team) {
  const seen = new Set();
  return [team.sport, team.ageGroup, team.division].filter((value) => {
    const key = String(value || "").trim().toLowerCase();
    if (!key || key === "unknown" || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map((value) => String(value).trim()).join(" • ");
}

const unavailable = (game) => /cancel|postpon/i.test(`${game.status || ""} ${game.scheduleStatus || ""}`);

function timeOrder(time = "") {
  const match = String(time).trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return 24 * 60;
  let hour = Number(match[1]);
  if (match[3]) hour = hour % 12 + (match[3].toUpperCase() === "PM" ? 12 : 0);
  return hour * 60 + Number(match[2]);
}

export function favoriteSummary(team, games, today = todayEastern()) {
  const matching = games.filter((game) =>
    (game.team1 === team.teamName || game.team2 === team.teamName) &&
    (game.sport || "Soccer") === team.sport &&
    (game.division || "Unknown") === team.division &&
    game.date && !unavailable(game)
  );
  const ordered = [...matching].sort((a, b) =>
    a.date.localeCompare(b.date) || timeOrder(a.time) - timeOrder(b.time)
  );
  const lastGame = ordered.filter((game) => hasFinal(game) && game.date <= today).at(-1) || null;
  const nextGame = ordered.find((game) => !hasFinal(game) && game.date >= today) || null;
  let result = null;
  if (lastGame) {
    const first = lastGame.team1 === team.teamName;
    const ownScore = resultValue(first ? lastGame.score1 : lastGame.score2);
    const opponentScore = resultValue(first ? lastGame.score2 : lastGame.score1);
    result = {
      ownScore: lastGame.forfeit ? (first ? lastGame.score1 : lastGame.score2) : ownScore,
      opponentScore: lastGame.forfeit ? (first ? lastGame.score2 : lastGame.score1) : opponentScore,
      outcome: ownScore > opponentScore ? "W" : ownScore < opponentScore ? "L" : "T",
      opponent: first ? lastGame.team2 : lastGame.team1,
    };
  }
  return { lastGame, nextGame, result };
}

export function shortGameDate(date) {
  if (!date) return "Date TBD";
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", timeZone: "America/New_York",
  }).format(new Date(`${date}T12:00:00Z`));
}
