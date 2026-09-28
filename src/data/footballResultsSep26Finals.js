const FINAL_RESULTS = new Map([
  ["fb-2026-09-26-maret-allegany", [21, 57]],
  ["md-fb-2026-09-26-frederick-douglass-crossland", [42, 0]],
  ["fb-2026-09-26-flint-hill-episcopal", [0, 43]],
]);

export function applyFootballResultsSep26Finals(games = []) {
  return games.map((game) => {
    const scores = FINAL_RESULTS.get(game.id);
    if (!scores) return game;

    const [score1, score2] = scores;
    const episcopalFinal = game.id === "fb-2026-09-26-flint-hill-episcopal";
    return {
      ...game,
      score1,
      score2,
      status: undefined,
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier: episcopalFinal ? "Official school athletics" : "Associated Press and MaxPreps",
      sourceUrl: episcopalFinal ? "https://www.episcopalhighschool.org/football" : "https://www.nhregister.com/sports/article/saturday-s-scores-22450729.php",
      notes: episcopalFinal
        ? "Final: Flint Hill 0, Episcopal 43. Confirmed by Episcopal High School athletics."
        : `Final: ${game.team1} ${score1}, ${game.team2} ${score2}. Confirmed by the Associated Press and MaxPreps September 26 results.`,
      lastChecked: episcopalFinal ? "2026-09-28" : "2026-09-27",
    };
  });
}

export default applyFootballResultsSep26Finals;
