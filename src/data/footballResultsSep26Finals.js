const FINAL_RESULTS = new Map([
  ["fb-2026-09-26-maret-allegany", [21, 57]],
  ["md-fb-2026-09-26-frederick-douglass-crossland", [42, 0]],
]);

export function applyFootballResultsSep26Finals(games = []) {
  return games.map((game) => {
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
      sourceTier: "Associated Press and MaxPreps",
      sourceUrl: "https://www.nhregister.com/sports/article/saturday-s-scores-22450729.php",
      notes: `Final: ${game.team1} ${score1}, ${game.team2} ${score2}. Confirmed by the Associated Press and MaxPreps September 26 results.`,
      lastChecked: "2026-09-27",
    };
  });
}

export default applyFootballResultsSep26Finals;
