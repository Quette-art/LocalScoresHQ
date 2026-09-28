const BACKFILLED_FINALS = new Map([
  ["fb-2026-08-28-bishop-mcnamara-abraham-lincoln", [23, 6, "CBS Pittsburgh and High School On SI", "https://www.cbsnews.com/pittsburgh/news/pennsylvania-high-school-football-scores-august-28-2026/"]],
  ["fb-2026-08-28-good-counsel-bishop-mcdevitt", [21, 35, "Official Good Counsel athletics", "https://www.olgchs.org/football"]],
  ["fb-2026-08-28-mcdonogh-riverdale-baptist", [22, 14, "High School On SI and MaxPreps", "https://www.si.com/high-school/stats/maryland/football/scores?date=2026-08-28"]],
  ["fb-2026-08-29-mt-zion-prep-academy-st-johns", [8, 45, "DCSportsFan and Joe Eitel", "https://joeeitel.com/hsfoot/teams.jsp?teamID=14918&year=2026"]],
  ["fb-2026-09-12-kiski-school-st-james", [43, 0, "Official Kiski athletics", "https://kiski.org/athletics/team/boys-football-varsity-2026-27/"]],
]);

export function applyFootballResultsBackfillSep28(games = []) {
  return games.map((game) => {
    const result = BACKFILLED_FINALS.get(game.id);
    if (!result) return game;
    const [score1, score2, sourceTier, sourceUrl] = result;
    return {
      ...game,
      score1,
      score2,
      status: undefined,
      scheduleStatus: "Final",
      verificationStatus: "Final",
      subjectToChange: false,
      sourceTier,
      sourceUrl,
      notes: `Final: ${game.team1} ${score1}, ${game.team2} ${score2}. Confirmed by ${sourceTier}.`,
      lastChecked: "2026-09-28",
    };
  });
}
