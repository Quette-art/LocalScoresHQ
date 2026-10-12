const SCOREBOARD_URL = "https://www.maxpreps.com/md/football/scores/?date=10/9/2026";
const ROUNDUP_URL = "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5";
const FINAL_RESULTS = new Map([
  [
    "fb-2026-10-03-haverford-school-georgetown-prep",
    {
      "id": "fb-2026-10-03-haverford-school-georgetown-prep",
      "team1": "Haverford School",
      "team2": "Georgetown Prep",
      "date": "2026-10-03",
      "score1": 42,
      "score2": 7,
      "sourceUrl": "https://www.haverford.org/athletics/teams/team-details/~athletics-team-id/143",
      "sourceTier": "Official school athletics",
      "confirmation": "Confirmed by The Haverford School's official varsity football results."
    }
  ],
  [
    "md-fb-2026-10-03-northwestern-bladensburg",
    {
      "id": "md-fb-2026-10-03-northwestern-bladensburg",
      "team1": "Northwestern",
      "team2": "Bladensburg",
      "date": "2026-10-03",
      "score1": 22,
      "score2": 20,
      "sourceUrl": "https://mdfootballscores.com/schools/northwestern/",
      "sourceTier": "Maryland High School Football Scores and MaxPreps",
      "confirmation": "Confirmed by Maryland High School Football Scores and MaxPreps: https://www.maxpreps.com/md/hyattsville/northwestern-wildcats/football/"
    }
  ],
  [
    "fb-2026-10-08-jackson-reed-mckinley-tech",
    {
      "id": "fb-2026-10-08-jackson-reed-mckinley-tech",
      "team1": "Jackson-Reed",
      "team2": "McKinley Tech",
      "date": "2026-10-08",
      "score1": 6,
      "score2": 16,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/dc/washington/mckinley-tech-trainers/football/"
    }
  ],
  [
    "fb-2026-10-09-ballou-bell",
    {
      "id": "fb-2026-10-09-ballou-bell",
      "team1": "Ballou",
      "team2": "Bell",
      "date": "2026-10-09",
      "score1": 14,
      "score2": 50,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/news/5MVmMy643kSQh_02QuLkxw/football-recap-bell-wins-high-profile-contest-against-ballou.htm"
    }
  ],
  [
    "fb-2026-10-09-cardozo-ron-brown",
    {
      "id": "fb-2026-10-09-cardozo-ron-brown",
      "team1": "Cardozo",
      "team2": "Ron Brown",
      "date": "2026-10-09",
      "score1": 6,
      "score2": 26,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/dc/football/game/cardozo-washington-vs-ron-brown-washington/10-9-2026/?c=42a50f48-68a5-489a-bbee-1f62cb13851e"
    }
  ],
  [
    "fb-2026-10-09-eastern-roosevelt",
    {
      "id": "fb-2026-10-09-eastern-roosevelt",
      "team1": "Eastern",
      "team2": "Roosevelt",
      "date": "2026-10-09",
      "score1": 20,
      "score2": 12,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/news/ouGw9Uf_lUCDeDnkCIrjBA/football-recap-eastern-takes-down-ranked-roosevelt.htm"
    }
  ],
  [
    "fb-2026-10-09-digital-pioneers-academy-kipp-college-prep",
    {
      "id": "fb-2026-10-09-digital-pioneers-academy-kipp-college-prep",
      "team1": "Digital Pioneers Academy",
      "team2": "KIPP College Prep",
      "date": "2026-10-09",
      "score1": 46,
      "score2": 0,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/dc/washington/digital-pioneers-academy-pythons/football/"
    }
  ],
  [
    "fb-2026-10-10-landon-archbishop-carroll",
    {
      "id": "fb-2026-10-10-landon-archbishop-carroll",
      "team1": "Landon",
      "team2": "Archbishop Carroll",
      "date": "2026-10-10",
      "score1": 13,
      "score2": 27,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/dc/washington/archbishop-carroll-lions/football/"
    }
  ],
  [
    "fb-2026-10-10-maret-potomac-school",
    {
      "id": "fb-2026-10-10-maret-potomac-school",
      "team1": "Maret",
      "team2": "Potomac School",
      "date": "2026-10-10",
      "score1": 36,
      "score2": 33,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/dc/washington/maret-frogs/football/"
    }
  ],
  [
    "fb-2026-10-10-bishop-mcnamara-gonzaga",
    {
      "id": "fb-2026-10-10-bishop-mcnamara-gonzaga",
      "team1": "Bishop McNamara",
      "team2": "Gonzaga",
      "date": "2026-10-10",
      "score1": 6,
      "score2": 38,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/dc/washington/gonzaga-eagles/football/"
    }
  ],
  [
    "fb-2026-10-10-woodberry-forest-georgetown-prep",
    {
      "id": "fb-2026-10-10-woodberry-forest-georgetown-prep",
      "team1": "Woodberry Forest",
      "team2": "Georgetown Prep",
      "date": "2026-10-10",
      "score1": 38,
      "score2": 16,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/va/woodberry-forest/woodberry-forest-tigers/football/"
    }
  ],
  [
    "md-fb-2026-10-10-crossland-fairmont-heights",
    {
      "id": "md-fb-2026-10-10-crossland-fairmont-heights",
      "team1": "Crossland",
      "team2": "Fairmont Heights",
      "date": "2026-10-10",
      "score1": 18,
      "score2": 19,
      "sourceUrl": "https://mdfootballscores.com/schools/crossland/",
      "sourceTier": "Maryland High School Football Scores and MaxPreps",
      "confirmation": "Confirmed by Maryland High School Football Scores and MaxPreps: https://www.maxpreps.com/md/temple-hills/crossland-cavaliers/football/"
    }
  ],
  [
    "fb-2026-10-10-long-island-lutheran-riverdale-baptist",
    {
      "id": "fb-2026-10-10-long-island-lutheran-riverdale-baptist",
      "team1": "Long Island Lutheran",
      "team2": "Riverdale Baptist",
      "date": "2026-10-10",
      "score1": 7,
      "score2": 57,
      "sourceUrl": "https://www.joeeitel.com/hsfoot/teams.jsp?teamID=15143&year=2026",
      "sourceTier": "Joe Eitel and MaxPreps",
      "confirmation": "Confirmed by Joe Eitel and MaxPreps: https://www.maxpreps.com/news/fGVyLykAuk6TPOdqrjb0bg/football-recap-riverdale-baptist-skates-past-long-island-lutheran-with-ease.htm"
    }
  ],
  [
    "fb-2026-10-09-kipp-dc-legacy-eastern-tech",
    {
      "id": "fb-2026-10-09-kipp-dc-legacy-eastern-tech",
      "team1": "KIPP DC Legacy",
      "team2": "Eastern Tech",
      "date": "2026-10-09",
      "score1": 47,
      "score2": 6,
      "sourceUrl": "https://www.maxpreps.com/inter-state/football/game/eastern-tech-baltimore-md-vs-kipp-dc-legacy-college-prep-washington-dc/10-9-2026/?c=b1d256d9-d776-402c-975f-28c341070fec",
      "sourceTier": "Official team / coach direct message",
      "confirmation": "Confirmed in a direct message provided by the user on October 10, 2026; the user confirmed the sender was the official team account or a coach. Screenshot: IMG_0731.jpeg. Public matchup link establishes the October 9 date."
    }
  ],
  [
    "md-fb-2026-10-10-friendly-surrattsville",
    {
      "id": "md-fb-2026-10-10-friendly-surrattsville",
      "team1": "Friendly",
      "team2": "Surrattsville",
      "date": "2026-10-10",
      "score1": 16,
      "score2": 26,
      "sourceUrl": "https://mdfootballscores.com/schools/friendly/",
      "sourceTier": "Maryland High School Football Scores and MaxPreps",
      "confirmation": "Confirmed by Maryland High School Football Scores and MaxPreps: https://www.maxpreps.com/md/clinton/surrattsville-hornets/football/"
    }
  ],
  [
    "md-fb-2026-10-10-wise-eleanor-roosevelt",
    {
      "id": "md-fb-2026-10-10-wise-eleanor-roosevelt",
      "team1": "Wise",
      "team2": "Eleanor Roosevelt",
      "date": "2026-10-10",
      "score1": 46,
      "score2": 21,
      "sourceUrl": "https://mdfootballscores.com/schools/wise/",
      "confirmation": "Confirmed by Maryland High School Football Scores and MaxPreps: https://www.maxpreps.com/md/upper-marlboro/wise-pumas/football/",
      "sourceTier": "Maryland High School Football Scores and MaxPreps"
    }
  ],
  [
    "md-fb-2026-10-10-oxon-hill-parkdale",
    {
      "id": "md-fb-2026-10-10-oxon-hill-parkdale",
      "team1": "Oxon Hill",
      "team2": "Parkdale",
      "date": "2026-10-10",
      "score1": 47,
      "score2": 0,
      "sourceUrl": "https://mdfootballscores.com/schools/parkdale/",
      "confirmation": "Confirmed by Maryland High School Football Scores and MaxPreps: https://www.maxpreps.com/md/oxon-hill/oxon-hill-clippers/football/",
      "sourceTier": "Maryland High School Football Scores and MaxPreps"
    }
  ],
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

