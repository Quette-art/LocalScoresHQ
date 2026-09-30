const FINAL_RESULTS = new Map([
  ["fb-2026-09-26-mckinley-tech-st-albans", [0, 46]],
  ["fb-2026-09-26-maret-allegany", [21, 57]],
  ["md-fb-2026-09-26-frederick-douglass-crossland", [42, 0]],
  ["fb-2026-09-26-flint-hill-episcopal", [0, 43]],
  ["fb-2026-09-26-bishop-mcnamara-archbishop-carroll", [20, 6]],
  ["md-fb-2026-09-26-central-surrattsville", [16, 14]],
  ["md-fb-2026-09-26-flowers-duval", [40, 7]],
  ["fb-2026-09-26-bishop-ireton-landon", [6, 35]],
  ["fb-2026-09-26-st-james-wyoming-seminary", [28, 19]],
  ["md-fb-2026-09-26-laurel-suitland", [0, 44]],
  ["fb-2026-09-26-st-johns-st-edward", [21, 22]],
  ["fb-2026-09-26-bullis-loyola-blakefield", [14, 25]],
  ["fb-2026-09-26-sidwell-friends-st-stephen-s-st-agnes", [6, 27]],
  ["fb-2026-09-26-northern-va-home-school-athletic-assoc-bishop-oconnell", [0, 48]],
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
    const stEdwardFinal = game.id === "fb-2026-09-26-st-johns-st-edward";
    const bullisFinal = game.id === "fb-2026-09-26-bullis-loyola-blakefield";
    const sidwellFinal = game.id === "fb-2026-09-26-sidwell-friends-st-stephen-s-st-agnes";
    const oconnellFinal = game.id === "fb-2026-09-26-northern-va-home-school-athletic-assoc-bishop-oconnell";
    const stAlbansFinal = game.id === "fb-2026-09-26-mckinley-tech-st-albans";
    return {
      ...game,
      score1,
      score2,
      status: undefined,
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier: episcopalFinal || sidwellFinal || stAlbansFinal ? "Official school athletics" : oconnellFinal ? "Bishop O’Connell football social post and MaxPreps" : stEdwardFinal ? "Ohio Sports Rankings and Maryland High School Sports roundup" : "Associated Press and MaxPreps",
      sourceUrl: episcopalFinal ? "https://www.episcopalhighschool.org/football" : sidwellFinal ? "https://www.sidwell.edu/athletics/upcoming-games" : stAlbansFinal ? "https://www.stalbansschool.org/athletics/schedules-and-scores" : oconnellFinal ? "https://www.maxpreps.com/va/football/game/bishop-oconnell-arlington-vs-northern-virginia-homeschool-manassas/9-26-2026/?c=a0b9186a-c7fd-43db-b4e0-0af20329fba8" : stEdwardFinal ? "https://ohsportsrank.com/football/school/1346" : "https://www.newstimes.com/sports/article/saturday-s-scores-22450729.php",
      notes: episcopalFinal
        ? "Final: Flint Hill 0, Episcopal 43. Confirmed by Episcopal High School athletics."
        : sidwellFinal
        ? "Final: Sidwell Friends 6, St. Stephen\'s & St. Agnes 27. Confirmed by Sidwell Friends athletics scoreboard."
        : stAlbansFinal
        ? "Final: McKinley Tech 0, St. Albans 46. Confirmed by St. Albans School athletics; other score listings reported 42-0."
        : oconnellFinal
        ? "Final: Northern Virginia HomeSchool 0, Bishop O’Connell 48. Confirmed by O’Connell football’s September 26 Instagram win graphic and MaxPreps game report."
        : stEdwardFinal
        ? "Final: St. John's 21, St. Edward 22. Confirmed by Ohio Sports Rankings and a Maryland High School Sports roundup."
        : bullisFinal
        ? "Final: Bullis 14, Loyola Blakefield 25. Confirmed by the Associated Press, MaxPreps and a Maryland High School Sports roundup."
        : `Final: ${game.team1} ${score1}, ${game.team2} ${score2}. Confirmed by the Associated Press and MaxPreps September 26 results.`,
      lastChecked: "2026-09-29",
    };
  });
}

export default applyFootballResultsSep26Finals;
