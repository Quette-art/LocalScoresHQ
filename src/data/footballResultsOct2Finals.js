const ROUNDUP_URL = "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-oct-2-01m40q7r6yrg";
const SCOREBOARD_URL = "https://www.maxpreps.com/md/football/scores/?date=10/2/2026";

const FINAL_RESULTS = new Map([
  ["fb-2026-10-02-bishop-ireton-st-stephens-st-agnes", [21, 28]],
  ["fb-2026-10-02-malvern-prep-gonzaga", [27, 19]],
  ["md-fb-2026-10-02-friendly-crossland", [22, 51]],
  ["md-fb-2026-10-02-surrattsville-gwynn-park", [0, 49]],
  ["md-fb-2026-10-02-fairmont-heights-largo", [0, 51]],
  ["fb-2026-10-02-episcopal-st-christophers", [48, 7]],
  ["fb-2026-10-02-friendship-collegiate-academy-loudoun-sports-academy", [10, 40]],
  ["fb-2026-10-02-maret-flint-hill", [25, 22]],
  ["fb-2026-10-02-st-albans-paul-vi", [29, 7]],
  ["fb-2026-10-02-digital-pioneers-academy-riverdale-baptist", [6, 14]],
  ["md-fb-2026-10-02-duval-wise", [6, 71]],
  ["md-fb-2026-10-02-parkdale-flowers", [8, 27]],
  ["fb-2026-10-02-st-marys-ryken-good-counsel", [0, 42]],
  ["fb-2026-10-02-st-pauls-st-vincent-st-vincent-pallotti", [18, 0]],
]);

export function applyFootballResultsOct2Finals(games = []) {
  return games.map((game) => {
    const scores = FINAL_RESULTS.get(game.id);
    if (!scores) return game;
    const [score1, score2] = scores;
    const saints = game.id === "fb-2026-10-02-bishop-ireton-st-stephens-st-agnes";
    const malvern = game.id === "fb-2026-10-02-malvern-prep-gonzaga";
    const largo = game.id === "md-fb-2026-10-02-fairmont-heights-largo";
    const confirmation = saints
      ? "Confirmed by St. Stephen's & St. Agnes official varsity football schedule."
      : malvern
      ? "Confirmed by High School On SI and the Associated Press October 2 score report: https://www.cbsnews.com/pittsburgh/news/pennsylvania-high-school-football-scores-october-2-2026/"
      : `Confirmed by High School On SI's October 2 final-score roundup and MaxPreps: ${SCOREBOARD_URL}`;
    return {
      ...game,
      score1,
      score2,
      status: undefined,
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier: saints ? "Official school athletics" : malvern ? "High School On SI and Associated Press" : "High School On SI and MaxPreps",
      sourceUrl: saints
        ? "https://www.sssas.org/fall-team-1/varsity-football"
        : largo
        ? "https://www.si.com/high-school/stats/maryland/football/games/6834846-fairmont-heights-vs-largo"
        : ROUNDUP_URL,
      notes: `Final: ${game.team1} ${score1}, ${game.team2} ${score2}. ${confirmation}`,
      lastChecked: game.id === "md-fb-2026-10-02-parkdale-flowers" ? "2026-10-08" : largo ? "2026-10-06" : "2026-10-03",
    };
  });
}
