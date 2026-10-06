export function applyFootballResultsOct3Finals(games = []) {
  return games.map((game) => {
    const oconnell = game.id === "fb-2026-10-03-bishop-oconnell-potomac-school";
    const bullis = game.id === "fb-2026-10-03-bullis-roosevelt";
    const eastern = game.id === "fb-2026-10-03-h-d-woodson-eastern";
    const coolidge = game.id === "fb-2026-10-03-coolidge-ballou";
    if (game.id === "fb-2026-10-03-st-michael-the-archangel-bishop-mcnamara") {
      return {
        ...game,
        score1: 15,
        score2: 17,
        status: undefined,
        scheduleStatus: "Final",
        subjectToChange: false,
        verificationStatus: "Final",
        sourceTier: "Fredericksburg Free Press and MaxPreps",
        sourceUrl: "https://www.fredericksburgfreepress.com/2026/10/03/weekly-high-school-football-roundup-and-look-ahead-to-next-week-2/",
        notes: "Final: St. Michael the Archangel 15, Bishop McNamara 17. Confirmed by Fredericksburg Free Press's Saturday result and MaxPreps' October 3 varsity scoreboard: https://www.maxpreps.com/md/football/scores/?date=10/3/2026",
        lastChecked: "2026-10-04",
      };
    }
    if (game.id === "fb-2026-10-03-sidwell-friends-saint-james") {
      return {
        ...game,
        score1: 0,
        score2: 2,
        status: "Cancelled — Saint James win by forfeit",
        scheduleStatus: "Final",
        subjectToChange: false,
        verificationStatus: "Final",
        sourceTier: "Official school athletics",
        sourceUrl: "https://www.stjames.edu/athletics/teams/team-profile",
        notes: "Final: Sidwell Friends 0, Saint James 2 (forfeit). Both schools' official athletics pages list the October 3 game as cancelled and record a 2-0 Saint James win: https://www.sidwell.edu/enhancements/upcoming-games-clone",
        lastChecked: "2026-10-06",
      };
    }
    if (game.id === "md-fb-2026-10-03-eleanor-roosevelt-suitland") {
      return {
        ...game,
        score1: 6,
        score2: 40,
        status: undefined,
        scheduleStatus: "Final",
        subjectToChange: false,
        verificationStatus: "Final",
        sourceTier: "Maryland High School Football Scores and MaxPreps",
        sourceUrl: "https://www.maxpreps.com/md/football/scores/?date=10/3/2026",
        notes: "Final: Eleanor Roosevelt 6, Suitland 40. Confirmed by user-supplied @mdhsscores October 3 final graphic (https://www.instagram.com/mdhsscores/) and MaxPreps' October 3 varsity scoreboard.",
        lastChecked: "2026-10-03",
      };
    }
    if (eastern || coolidge) {
      return {
        ...game,
        score1: eastern ? 0 : 45,
        score2: eastern ? 34 : 0,
        status: undefined,
        scheduleStatus: "Final",
        subjectToChange: false,
        verificationStatus: "Final",
        sourceTier: "Official team account screenshot confirmed by user",
        sourceUrl: eastern ? "https://www.instagram.com/easternhs_fb/" : "https://www.nfhsnetwork.com/events/ballou-high-school-washington-dc/gam9549b9ab2e",
        notes: eastern
          ? "Final: H.D. Woodson 0, Eastern 34. User supplied and confirmed Eastern's official Instagram story sharing @EasternHS_FB's homecoming final. Matchup date confirmed by Eastern High School's October 3 calendar."
          : "Final: Coolidge 45, Ballou 0. User supplied and confirmed Coolidge athletics' official Instagram story showing the 45-0 win at Ballou. October 3 matchup corroborated by NFHS Network's varsity game listing.",
        lastChecked: "2026-10-03",
      };
    }
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
