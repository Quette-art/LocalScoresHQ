export function applyFootballResultsOct3Finals(games = []) {
  return games.map((game) => {
    const oconnell = game.id === "fb-2026-10-03-bishop-oconnell-potomac-school";
    const bullis = game.id === "fb-2026-10-03-bullis-roosevelt";
    if (!oconnell && !bullis) return game;
    return {
      ...game,
      score1: oconnell ? 14 : 40,
      score2: oconnell ? 28 : 6,
      status: undefined,
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier: "Official school athletics",
      sourceUrl: oconnell ? "https://www.bishopoconnell.org/athletics/teams/football" : "https://www.bullis.org/athletics/teams-schedules/team/~athletics-team-id/121",
      notes: oconnell
        ? "Final: Bishop O'Connell 14, Potomac School 28. Confirmed by Bishop O'Connell's official varsity football schedule for October 3, 2026."
        : "Final: Bullis 40, Roosevelt 6. Confirmed by Bullis School's official varsity football results for October 3, 2026.",
      lastChecked: "2026-10-03",
    };
  });
}
