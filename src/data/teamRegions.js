export const dcFootballTeams = new Set([
  "Anacostia",
  "Archbishop Carroll",
  "Ballou",
  "Bell",
  "Cardozo",
  "Coolidge",
  "Digital Pioneers Academy",
  "Dunbar",
  "Eastern",
  "Gonzaga",
  "H.D. Woodson",
  "Jackson-Reed",
  "KIPP College Prep",
  "KIPP DC Legacy",
  "Maret",
  "McKinley Tech",
  "Phelps ACE",
  "Ron Brown",
  "Roosevelt",
  "Sidwell Friends",
  "St. John’s",
]);

export const marylandFootballTeams = new Set([
  "Bishop McNamara",
  "Bladensburg",
  "Bowie",
  "Central",
  "Chesapeake",
  "Crossland",
  "DeMatha",
  "Douglass BM",
  "Eleanor Roosevelt",
  "Fairmont Heights",
  "Flowers",
  "Frederick Douglass",
  "Friendly",
  "Glen Burnie",
  "Gwynn Park",
  "High Point",
  "Lake Clifton",
  "Largo",
  "Laurel",
  "Lewis",
  "New Town",
  "Northwestern",
  "Oxon Hill",
  "Parkdale",
  "Potomac",
  "Suitland",
  "Surrattsville",
  "Wise",
]);

export const gameMatchesRegion = (game, region) => {
  if (region === "ALL") return true;

  const teams = [game.team1, game.team2];

  if (region === "DC") {
    return teams.some((team) => dcFootballTeams.has(team));
  }

  if (region === "MD") {
    return teams.some((team) =>
      marylandFootballTeams.has(team)
    );
  }

  return true;
};