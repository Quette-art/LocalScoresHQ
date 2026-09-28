const FINAL_RESULTS = new Map([
  ["fb-2026-09-26-maret-allegany", [21, 57]],
  ["md-fb-2026-09-26-frederick-douglass-crossland", [42, 0]],
  ["fb-2026-09-26-flint-hill-episcopal", [0, 43]],
  ["fb-2026-09-26-bishop-mcnamara-archbishop-carroll", [20, 6]],
  ["md-fb-2026-09-26-central-surrattsville", [16, 14]],
  ["md-fb-2026-09-26-flowers-duval", [40, 7]],
  ["fb-2026-09-26-bishop-ireton-landon", [6, 35]],
  ["fb-2026-09-26-st-james-wyoming-seminary", [28, 19]],
  ["md-fb-2026-09-26-laurel-suitland", [0, 44]],
]);

export function applyFootballResultsSep26Finals(games = []) {
  return games.map((game) => {
    if (game.id === "fb-2026-09-26-st-john-paul-the-great-potomac-school") {
      return {
        ...game,
        score1: null,
        score2: null,
        scheduleStatus: "Cancelled",
        verificationStatus: "Cancelled",
        sourceTier: "Official school athletics",
        sourceUrl: "https://www.potomacschool.org/athletics/team/fall/varsity-football",
        notes: "September 26 game marked CANCELLED on the Potomac School varsity football schedule. No final score.",
        lastChecked: "2026-09-28",
      };
    }
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
      sourceUrl: episcopalFinal ? "https://www.episcopalhighschool.org/football" : "https://www.newstimes.com/sports/article/saturday-s-scores-22450729.php",
      notes: episcopalFinal
        ? "Final: Flint Hill 0, Episcopal 43. Confirmed by Episcopal High School athletics."
        : `Final: ${game.team1} ${score1}, ${game.team2} ${score2}. Confirmed by the Associated Press and MaxPreps September 26 results.`,
      lastChecked: "2026-09-28",
    };
  });
}

export default applyFootballResultsSep26Finals;
