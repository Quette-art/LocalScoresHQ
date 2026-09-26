const FINAL_RESULTS = new Map([
  ["fb-2026-09-25-st-vincent-st-vincent-pallotti-archbishop-curley", [0, 41]],
  ["md-fb-2026-09-25-bowie-wise", [0, 51]],
  ["md-fb-2026-09-25-parkdale-bladensburg", [53, 0]],
  ["md-fb-2026-09-25-eleanor-roosevelt-northwestern", [46, 0]],
  ["md-fb-2026-09-25-gwynn-park-largo", [20, 24]],
  ["fb-2026-09-25-georgetown-prep-st-marys-ryken", [7, 27]],
  ["fb-2026-09-25-dematha-riverdale-baptist", [28, 12]],
]);

export function applyFootballResultsSep25Finals(games = []) {
  return games.map((game) => {
    if (game.date !== "2026-09-25") return game;
    const scores = FINAL_RESULTS.get(game.id);
    if (!scores) return game;

    const [score1, score2] = scores;
    return {
      ...game,
      score1,
      score2,
      status: undefined,
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier: "Maryland High School Sports roundup and High School On SI scoreboard",
      sourceUrl:
        "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-results-september-25-01m3e3539jew",
      notes: `Final: ${game.team1} ${score1}, ${game.team2} ${score2}. Also confirmed by @maryland_high_school_sports_ September 25 roundup.`,
      lastChecked: "2026-09-26",
    };
  });
}

export default applyFootballResultsSep25Finals;
