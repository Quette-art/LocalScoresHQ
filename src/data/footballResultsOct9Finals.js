const SCOREBOARD_URL = "https://www.maxpreps.com/md/football/scores/?date=10/9/2026";
const ROUNDUP_URL = "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5";
const FINAL_RESULTS = new Map([
  [
    "fb-2026-09-11-jackson-reed-flint-hill",
    {
      "id": "fb-2026-09-11-jackson-reed-flint-hill",
      "team1": "Jackson-Reed",
      "team2": "Flint Hill",
      "date": "2026-09-11",
      "score1": 7,
      "score2": 49,
      "sourceUrl": "https://flinthill.myschoolapp.com/page/test-athletic-teams-schedule-2024?BlockId=3353828&SeasonLabel=2026+-+2027&Team=99828&fromId=295525&siteId=708",
      "sourceTier": "Official school athletics",
      "confirmation": "Confirmed by Flint Hill's official 2026-27 varsity football results, linked from its football athletics page."
    }
  ],
  [
    "fb-2026-10-03-cornerstone-christian-st-johns",
    {
      "id": "fb-2026-10-03-cornerstone-christian-st-johns",
      "team1": "Cornerstone Christian",
      "team2": "St. John's",
      "date": "2026-10-03",
      "score1": 28,
      "score2": 35,
      "sourceUrl": "https://www.stjohnschs.org/athletics/teams/team-page/~athletics-team-id/126",
      "sourceTier": "Official school athletics",
      "confirmation": "Confirmed by St. John's official varsity football results."
    }
  ],
  [
    "fb-2026-10-10-bishop-oconnell-bishop-ireton",
    {
      "id": "fb-2026-10-10-bishop-oconnell-bishop-ireton",
      "team1": "Bishop O'Connell",
      "team2": "Bishop Ireton",
      "date": "2026-10-10",
      "score1": 34,
      "score2": 7,
      "sourceUrl": "https://www.bishopoconnell.org/athletics/teams/football",
      "sourceTier": "Official school athletics",
      "confirmation": "Confirmed by Bishop O'Connell's official varsity football results."
    }
  ],
  [
    "fb-2026-10-09-dunbar-h-d-woodson",
    {
      "id": "fb-2026-10-09-dunbar-h-d-woodson",
      "team1": "Dunbar",
      "team2": "H.D. Woodson",
      "date": "2026-10-08",
      "score1": 48,
      "score2": 0,
      "sourceUrl": "https://www.si.com/high-school/stats/washington-dc/football/games/6853884-dunbar-vs-woodson",
      "confirmationUrl": "https://www.maxpreps.com/dc/washington/dunbar-crimson-tide/football/",
      "sourceTier": "MaxPreps and High School On SI"
    }
  ],
  [
    "fb-2026-10-08-episcopal-st-stephens-st-agnes",
    {
      "id": "fb-2026-10-08-episcopal-st-stephens-st-agnes",
      "score1": 42,
      "score2": 0,
      "team1": "Episcopal",
      "team2": "St. Stephen's & St. Agnes",
      "date": "2026-10-08",
      "sourceUrl": "https://www.sssas.org/fall-team-1/varsity-football",
      "sourceTier": "Official school athletics"
    }
  ],
  [
    "md-fb-2026-10-09-central-gwynn-park",
    {
      "id": "md-fb-2026-10-09-central-gwynn-park",
      "score1": 0,
      "score2": 39,
      "team1": "Central",
      "team2": "Gwynn Park",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "md-fb-2026-10-09-suitland-bowie",
    {
      "id": "md-fb-2026-10-09-suitland-bowie",
      "score1": 30,
      "score2": 0,
      "team1": "Suitland",
      "team2": "Bowie",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "fb-2026-10-09-friendship-collegiate-academy-mt-zion-prep-academy",
    {
      "id": "fb-2026-10-09-friendship-collegiate-academy-mt-zion-prep-academy",
      "score1": 20,
      "score2": 8,
      "team1": "Friendship Collegiate Academy",
      "team2": "Mt. Zion Prep Academy",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "md-fb-2026-10-09-duval-laurel",
    {
      "id": "md-fb-2026-10-09-duval-laurel",
      "score1": 7,
      "score2": 20,
      "team1": "DuVal",
      "team2": "Laurel",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "md-fb-2026-10-09-bladensburg-flowers",
    {
      "id": "md-fb-2026-10-09-bladensburg-flowers",
      "score1": 0,
      "score2": 63,
      "team1": "Bladensburg",
      "team2": "Flowers",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "md-fb-2026-10-09-potomac-northwestern",
    {
      "id": "md-fb-2026-10-09-potomac-northwestern",
      "score1": 55,
      "score2": 0,
      "team1": "Potomac",
      "team2": "Northwestern",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "fb-2026-10-09-bullis-st-james-school",
    {
      "id": "fb-2026-10-09-bullis-st-james-school",
      "score1": 8,
      "score2": 27,
      "team1": "Saint James",
      "team2": "Bullis",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "fb-2026-10-09-good-counsel-dematha",
    {
      "id": "fb-2026-10-09-good-counsel-dematha",
      "score1": 0,
      "score2": 35,
      "team1": "Good Counsel",
      "team2": "DeMatha",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "fb-2026-10-09-st-vincent-st-vincent-pallotti-john-carroll",
    {
      "id": "fb-2026-10-09-st-vincent-st-vincent-pallotti-john-carroll",
      "score1": 21,
      "score2": 28,
      "team1": "St. Vincent Pallotti",
      "team2": "John Carroll",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "md-fb-2026-10-09-largo-frederick-douglass",
    {
      "id": "md-fb-2026-10-09-largo-frederick-douglass",
      "score1": 6,
      "score2": 0,
      "team1": "Largo",
      "team2": "Frederick Douglass",
      "date": "2026-10-09",
      "sourceUrl": "https://mdfootballscores.com/schools/douglass-pg/",
      "sourceTier": "Maryland High School Football Scores and High School On SI"
    }
  ],
  [
    "fb-2026-10-09-st-marys-ryken-paul-vi",
    {
      "id": "fb-2026-10-09-st-marys-ryken-paul-vi",
      "score1": 41,
      "score2": 6,
      "team1": "St. Mary's Ryken",
      "team2": "Paul VI",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ]
]);

export function applyFootballResultsOct9Finals(games = []) {
  return games.map((game) => {
    const result = FINAL_RESULTS.get(game.id);
    if (!result || game.date !== result.date || game.team1 !== result.team1 || game.team2 !== result.team2) return game;
    const { score1, score2, sourceUrl, sourceTier } = result;
    const confirmation = result.confirmation || (result.confirmationUrl
      ? `Confirmed by MaxPreps and High School On SI: ${result.confirmationUrl}`
      : sourceTier === "Official school athletics"
      ? "Confirmed by St. Stephen's & St. Agnes official varsity football results."
      : sourceTier === "Maryland High School Football Scores and High School On SI"
      ? `Confirmed by Maryland High School Football Scores and High School On SI: ${ROUNDUP_URL}`
      : `Confirmed by High School On SI and MaxPreps: ${SCOREBOARD_URL}`);
    return {
      ...game,
      score1,
      score2,
      status: undefined,
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier,
      sourceUrl,
      notes: `Final: ${game.team1} ${score1}, ${game.team2} ${score2}. ${confirmation}`,
      lastChecked: "2026-10-10",
    };
  });
}

