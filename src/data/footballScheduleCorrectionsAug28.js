const normalizeTeam = (name = "") =>
  String(name)
    .replace(/[’‘]/g, "'")
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const isPhelps = (name) => normalizeTeam(name).includes("phelps");
const isStJohns = (name) => normalizeTeam(name) === "st john's" || normalizeTeam(name) === "st johns";

const confirmedMeta = (sourceUrl, notes = "") => ({
  score1: null,
  score2: null,
  scheduleStatus: "Confirmed",
  subjectToChange: false,
  verificationStatus: "Published",
  sourceTier: "Official team",
  notes,
  sourceUrl,
  lastChecked: "2026-08-28",
});

const phelpsSource = "https://www.instagram.com/phelpspanthersfb/";
const stJohnsSource = "https://www.instagram.com/sjc.football/";

const phelpsGames = [
  {
    id: "fb-2026-08-28-edmondson-westside-phelps-ace",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-08-28",
    time: "6:30 PM",
    team1: "Edmondson-Westside",
    team2: "Phelps ACE",
    location: "Phelps ACE",
    ...confirmedMeta(phelpsSource, "Phelps 2026 official team schedule graphic; home game."),
  },
  {
    id: "fb-2026-09-05-phelps-ace-surrattsville",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-09-05",
    time: "2:00 PM",
    team1: "Phelps ACE",
    team2: "Surrattsville",
    location: "Surrattsville",
    ...confirmedMeta(phelpsSource, "Phelps 2026 official team schedule graphic; away game."),
  },
  {
    id: "fb-2026-09-11-connexions-leadership-academy-phelps-ace",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-09-11",
    time: "6:00 PM",
    team1: "Connexions Leadership Academy",
    team2: "Phelps ACE",
    location: "Phelps ACE",
    ...confirmedMeta(phelpsSource, "Phelps 2026 official team schedule graphic; home game."),
  },
  {
    id: "fb-2026-09-18-sidwell-friends-phelps-ace",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-09-18",
    time: "6:00 PM",
    team1: "Sidwell Friends",
    team2: "Phelps ACE",
    location: "Phelps ACE",
    ...confirmedMeta(phelpsSource, "Phelps 2026 official team schedule graphic; home game."),
  },
  {
    id: "fb-2026-09-26-arundel-christian-school-phelps-ace",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-09-26",
    time: "2:00 PM",
    team1: "Arundel Christian School",
    team2: "Phelps ACE",
    location: "Phelps ACE",
    ...confirmedMeta(phelpsSource, "Phelps 2026 official team schedule graphic; home game."),
  },
  {
    id: "fb-2026-10-09-phelps-ace-anacostia",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-10-09",
    time: "6:00 PM",
    team1: "Phelps ACE",
    team2: "Anacostia",
    location: "Anacostia",
    ...confirmedMeta(phelpsSource, "Phelps 2026 official team schedule graphic; away game."),
  },
  {
    id: "fb-2026-10-16-cardozo-phelps-ace",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-10-16",
    time: "6:00 PM",
    team1: "Cardozo",
    team2: "Phelps ACE",
    location: "Phelps ACE",
    ...confirmedMeta(phelpsSource, "Phelps 2026 official team schedule graphic; homecoming/home game."),
  },
  {
    id: "fb-2026-10-23-phelps-ace-jackson-reed",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-10-23",
    time: "6:00 PM",
    team1: "Phelps ACE",
    team2: "Jackson-Reed",
    location: "Jackson-Reed",
    ...confirmedMeta(phelpsSource, "Phelps 2026 official team schedule graphic; away game."),
  },
  {
    id: "fb-2026-10-30-phelps-ace-mckinley-tech",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-10-30",
    time: "6:00 PM",
    team1: "Phelps ACE",
    team2: "McKinley Tech",
    location: "McKinley Tech",
    ...confirmedMeta(phelpsSource, "Phelps 2026 official team schedule graphic; away game."),
  },
  {
    id: "fb-2026-11-06-ron-brown-phelps-ace",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-11-06",
    time: "6:00 PM",
    team1: "Ron Brown",
    team2: "Phelps ACE",
    location: "Phelps ACE",
    ...confirmedMeta(phelpsSource, "Phelps 2026 official team schedule graphic; senior night/home game."),
  },
];

const stJohnsGames = [
  {
    id: "fb-2026-08-29-mt-zion-st-johns",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-08-29",
    time: "2:30 PM",
    team1: "Mt. Zion",
    team2: "St. John’s",
    location: "Fernandez Stadium",
    ...confirmedMeta(stJohnsSource, "St. John's 2026 Varsity Scarlet official team schedule; home game."),
  },
  {
    id: "fb-2026-09-05-st-johns-archbishop-spalding",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-09-05",
    time: "3:00 PM",
    team1: "St. John’s",
    team2: "Archbishop Spalding",
    location: "Under Armour Sports Headquarters",
    ...confirmedMeta(stJohnsSource, "St. John's 2026 Varsity Scarlet official team schedule."),
  },
  {
    id: "fb-2026-09-12-lewis-bennett-st-johns",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-09-12",
    time: "2:00 PM",
    team1: "Lewis Bennett",
    team2: "St. John’s",
    location: "Fernandez Stadium",
    ...confirmedMeta(stJohnsSource, "St. John's 2026 Varsity Scarlet official team schedule; home game."),
  },
  {
    id: "fb-2026-09-18-st-johns-west-boca-raton",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-09-18",
    time: "6:30 PM",
    team1: "St. John’s",
    team2: "West Boca Raton",
    location: "West Boca Raton High School",
    ...confirmedMeta(stJohnsSource, "St. John's 2026 Varsity Scarlet official team schedule; away game in Florida."),
  },
  {
    id: "fb-2026-09-26-st-johns-st-edward",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-09-26",
    time: "1:00 PM",
    team1: "St. John’s",
    team2: "St. Edward",
    location: "St. Edward High School",
    ...confirmedMeta(stJohnsSource, "St. John's 2026 Varsity Scarlet official team schedule; away game in Ohio."),
  },
  {
    id: "fb-2026-10-03-cornerstone-christian-st-johns",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-10-03",
    time: "2:00 PM",
    team1: "Cornerstone Christian",
    team2: "St. John’s",
    location: "Fernandez Stadium",
    ...confirmedMeta(stJohnsSource, "St. John's 2026 Varsity Scarlet official team schedule; home game."),
  },
  {
    id: "fb-2026-10-16-st-johns-good-counsel",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-10-16",
    time: "7:00 PM",
    team1: "St. John’s",
    team2: "Good Counsel",
    location: "Our Lady of Good Counsel High School",
    ...confirmedMeta(stJohnsSource, "St. John's 2026 Varsity Scarlet official team schedule; away game."),
  },
  {
    id: "fb-2026-10-24-dematha-st-johns",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-10-24",
    time: "2:00 PM",
    team1: "DeMatha",
    team2: "St. John’s",
    location: "Fernandez Stadium",
    ...confirmedMeta(stJohnsSource, "St. John's 2026 Varsity Scarlet official team schedule; homecoming/home game."),
  },
  {
    id: "fb-2026-10-31-st-johns-bishop-mcnamara",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-10-31",
    time: "2:00 PM",
    team1: "St. John’s",
    team2: "Bishop McNamara",
    location: "Bishop McNamara High School",
    ...confirmedMeta(stJohnsSource, "St. John's 2026 Varsity Scarlet official team schedule; away game."),
  },
  {
    id: "fb-2026-11-07-gonzaga-st-johns",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-11-07",
    time: "1:00 PM",
    team1: "Gonzaga",
    team2: "St. John’s",
    location: "Fernandez Stadium",
    ...confirmedMeta(stJohnsSource, "St. John's 2026 Varsity Scarlet official team schedule; home game."),
  },
];

const timeValue = (time = "") => {
  const match = String(time).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 24 * 60;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3].toUpperCase();
  if (hour === 12) hour = 0;
  if (period === "PM") hour += 12;
  return hour * 60 + minute;
};

export function applyFootballScheduleCorrections(games = []) {
  const untouched = games.filter((game) => {
    const teams = [game.team1, game.team2];
    return !teams.some(isPhelps) && !teams.some(isStJohns);
  });

  return [...untouched, ...phelpsGames, ...stJohnsGames].sort((a, b) => {
    const dateCompare = String(a.date).localeCompare(String(b.date));
    if (dateCompare !== 0) return dateCompare;
    return timeValue(a.time) - timeValue(b.time);
  });
}
