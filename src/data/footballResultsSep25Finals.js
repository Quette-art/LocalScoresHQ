const FINAL_RESULTS = new Map([
  ["fb-2026-09-25-st-vincent-st-vincent-pallotti-archbishop-curley", [0, 41]],
  ["md-fb-2026-09-25-bowie-wise", [0, 51]],
  ["md-fb-2026-09-25-parkdale-bladensburg", [53, 0]],
  ["md-fb-2026-09-25-eleanor-roosevelt-northwestern", [46, 0]],
  ["md-fb-2026-09-25-gwynn-park-largo", [20, 24]],
  ["fb-2026-09-25-georgetown-prep-st-marys-ryken", [7, 27]],
  ["fb-2026-09-25-dematha-riverdale-baptist", [28, 12]],
  ["fb-2026-09-25-gonzaga-benedictine", [21, 14]],
  ["fb-2026-09-25-friendship-collegiate-academy-roanoke-catholic", [18, 28]],
  ["fb-2026-09-25-jackson-reed-thomas-jefferson-science-and-technology", [40, 0]],
  ["fb-2026-09-25-mt-zion-ron-brown", [38, 28]],
  ["fb-2026-09-25-digital-pioneers-academy-paul-vi", [50, 7]],
  ["fb-2026-09-25-bell-coolidge", [0, 43]],
  ["fb-2026-09-25-cardozo-manassas-park", [14, 22]],
  ["md-fb-2026-09-25-fairmont-heights-friendly", [0, 2]],
  ["md-fb-2026-09-26-oxon-hill-potomac", [28, 26]],
]);

const NEW_RESULT_SOURCES = {
  "fb-2026-09-25-gonzaga-benedictine": ["MaxPreps and High School On SI WCAC scoreboard", "https://www.si.com/high-school/stats/maryland/30705-washington-catholic-athletic-conference/football/scores?date=2026-09-25"],
  "fb-2026-09-25-friendship-collegiate-academy-roanoke-catholic": ["MaxPreps and High School On SI Virginia scoreboard", "https://www.si.com/high-school/virginia/virginia-high-school-football-final-scores-results-september-25-01m3e2kydydg"],
  "fb-2026-09-25-jackson-reed-thomas-jefferson-science-and-technology": ["MaxPreps and High School On SI Virginia scoreboard", "https://www.si.com/high-school/virginia/virginia-high-school-football-final-scores-results-september-25-01m3e2kydydg"],
  "fb-2026-09-25-mt-zion-ron-brown": ["MaxPreps and High School On SI Maryland scoreboard", "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-results-september-25-01m3e3539jew"],
  "fb-2026-09-25-digital-pioneers-academy-paul-vi": ["MaxPreps and High School On SI Virginia scoreboard", "https://www.si.com/high-school/virginia/virginia-high-school-football-final-scores-results-september-25-01m3e2kydydg"],
  "md-fb-2026-09-26-oxon-hill-potomac": ["Associated Press and High School On SI", "https://www.newstimes.com/sports/article/saturday-s-scores-22450729.php"],
  "fb-2026-09-25-bell-coolidge": ["On3 and MaxPreps", "https://www.on3.com/high-school/bell-multicultural-washington-dc-21404/football/schedule/"],
  "fb-2026-09-25-cardozo-manassas-park": ["InsideNoVa and MaxPreps", "https://www.perspectify.com/article/945449564/northern-virginia-high-school-football-results-for-sept-25"],
  "md-fb-2026-09-25-fairmont-heights-friendly": ["High School On SI and MaxPreps", "https://www.si.com/high-school/stats/maryland/football/teams/244155-friendly-patriots/games"],
};

export function applyFootballResultsSep25Finals(games = []) {
  return games.map((game) => {
    const scores = FINAL_RESULTS.get(game.id);
    if (!scores) return game;

    const [score1, score2] = scores;
    return {
      ...game,
      date: game.date,
      score1,
      score2,
      status: undefined,
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier: NEW_RESULT_SOURCES[game.id]?.[0] ?? "Maryland High School Sports roundup and High School On SI scoreboard",
      sourceUrl: NEW_RESULT_SOURCES[game.id]?.[1] ??
        "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-results-september-25-01m3e3539jew",
      notes: game.id === "md-fb-2026-09-26-oxon-hill-potomac"
        ? "Final: Oxon Hill 28, Potomac 26. September 26 date supported by the Associated Press Saturday roundup and both teams\u0027 published schedules."
        : NEW_RESULT_SOURCES[game.id]
        ? `Final: ${game.team1} ${score1}, ${game.team2} ${score2}. Confirmed by ${NEW_RESULT_SOURCES[game.id][0]}.`
        : `Final: ${game.team1} ${score1}, ${game.team2} ${score2}. Also confirmed by @maryland_high_school_sports_ September 25 roundup.`,
      lastChecked: ["fb-2026-09-25-bell-coolidge", "fb-2026-09-25-cardozo-manassas-park", "md-fb-2026-09-25-fairmont-heights-friendly"].includes(game.id) ? "2026-09-28" : "2026-09-26",
    };
  });
}

export default applyFootballResultsSep25Finals;
