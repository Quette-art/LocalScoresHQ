const validScore = (value) =>
  value !== null && value !== undefined && String(value).trim() !== "" &&
  Number.isFinite(Number(value)) && Number(value) >= 0;

export const hasFinal = (game) =>
  validScore(game?.score1) && validScore(game?.score2) &&
  !["cancelled", "postponed"].includes(String(game?.status || "").toLowerCase());

export function todayEastern(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const value = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

export function dashboardGames(games, today = todayEastern()) {
  const football = games.filter((game) => game.sport === "Football" && game.id);
  const finals = football.filter(hasFinal);
  const missing = football.filter((game) =>
    !hasFinal(game) && game.date && game.date < today &&
    !["cancelled", "postponed"].includes(String(game.status || "").toLowerCase())
  );
  return {
    tracked: football.length, finalCount: finals.length, missingCount: missing.length,
    finals: [...finals].sort((a, b) => String(b.date).localeCompare(String(a.date))),
    missing: [...missing].sort((a, b) => String(b.date).localeCompare(String(a.date))),
  };
}

export function calculateTeamRecords(games) {
  const teams = new Map();
  for (const game of games) {
    if (game.sport !== "Football" || !hasFinal(game)) continue;
    const a = Number(game.score1), b = Number(game.score2);
    for (const [name, scored, conceded] of [
      [game.team1, a, b], [game.team2, b, a],
    ]) {
      if (!name) continue;
      const row = teams.get(name) || {
        team: name, wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0,
      };
      if (scored > conceded) row.wins += 1;
      else if (scored < conceded) row.losses += 1;
      else row.ties += 1;
      row.pointsFor += scored;
      row.pointsAgainst += conceded;
      teams.set(name, row);
    }
  }
  return [...teams.values()].sort((a, b) =>
    b.wins - a.wins || a.losses - b.losses || a.team.localeCompare(b.team)
  );
}
