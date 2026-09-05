// Full 2026 varsity schedules for tracked private/prep programs.
// Sources were re-checked Sept. 5, 2026 against official school pages where
// available, otherwise current MaxPreps team schedules. Existing score/result
// layers still run after this overlay and remain authoritative for finals.

const SOURCES = {
  "St. Albans": "https://www.stalbansschool.org/team-detail?Team=150814&fromId=213575",
  "Georgetown Prep": "https://www.gprep.org/athletics/teams/team-details/~athletics-team-id/27",
  DeMatha: "https://www.maxpreps.com/md/hyattsville/dematha-stags/football/schedule/",
  Landon: "https://www.landon.net/athletics/fall-sports/football",
  "Good Counsel": "https://www.maxpreps.com/md/olney/our-lady-of-good-counsel-falcons/football/schedule/",
  "Bishop McNamara": "https://www.maxpreps.com/md/forestville/bishop-mcnamara-mustangs/football/schedule/",
  "St. Mary’s Ryken": "https://www.maxpreps.com/md/leonardtown/st-marys-ryken-knights/football/schedule/",
  "St. Vincent Pallotti": "https://www.maxpreps.com/md/laurel/pallotti-panthers/football/schedule/",
  "Riverdale Baptist": "https://www.maxpreps.com/md/upper-marlboro/riverdale-baptist-rbs/football/schedule/",
  Maret: "https://www.maxpreps.com/dc/washington/maret-frogs/football/schedule/",
  "Sidwell Friends": "https://www.sidwell.edu/athletics/team-page/~athletics-team-id/229",
  "St. John’s": "https://www.maxpreps.com/dc/washington/st-johns-cadets/football/schedule/",
};

const rows = [
  // St. Albans (official; scrimmages excluded)
  ["2026-09-04","4:00 PM","St. Albans","St. Paul's","St. Paul's School (MD)","St. Albans"],
  ["2026-09-12","1:00 PM","Potomac School","St. Albans","St. Albans","St. Albans"],
  ["2026-09-17","5:00 PM","St. Albans","St. John's Catholic Prep","St. John's Catholic Prep","St. Albans"],
  ["2026-09-26","2:00 PM","McKinley Tech","St. Albans","St. Albans","St. Albans"],
  ["2026-10-02","7:00 PM","St. Albans","Paul VI","Paul VI","St. Albans"],
  ["2026-10-17","2:00 PM","Episcopal","St. Albans","St. Albans","St. Albans"],
  ["2026-10-24","2:00 PM","St. Albans","Georgetown Prep","Georgetown Prep","St. Albans"],
  ["2026-10-31","1:00 PM","St. Albans","Maret","Maret","St. Albans"],
  ["2026-11-06","7:00 PM","St. Albans","Bullis","Bullis","St. Albans"],
  ["2026-11-14","1:00 PM","Landon","St. Albans","St. Albans","St. Albans"],

  // Georgetown Prep (official; scrimmages excluded)
  ["2026-09-05","6:00 PM","St. Vincent Pallotti","Georgetown Prep","Georgetown Prep","Georgetown Prep"],
  ["2026-09-11","6:00 PM","Georgetown Prep","Loyola Blakefield","Loyola Blakefield","Georgetown Prep"],
  ["2026-09-18","6:30 PM","Eastern","Georgetown Prep","Georgetown Prep","Georgetown Prep"],
  ["2026-09-25","7:00 PM","Georgetown Prep","St. Mary’s Ryken","St. Mary’s Ryken","Georgetown Prep"],
  ["2026-10-03","2:00 PM","Haverford School","Georgetown Prep","Georgetown Prep","Georgetown Prep"],
  ["2026-10-10","2:00 PM","Woodberry Forest","Georgetown Prep","Georgetown Prep","Georgetown Prep"],
  ["2026-10-24","2:00 PM","St. Albans","Georgetown Prep","Georgetown Prep","Georgetown Prep"],
  ["2026-10-31","1:30 PM","Georgetown Prep","Landon","Landon","Georgetown Prep"],
  ["2026-11-07","1:00 PM","Georgetown Prep","Episcopal","Episcopal","Georgetown Prep"],
  ["2026-11-14","5:00 PM","Bullis","Georgetown Prep","Georgetown Prep","Georgetown Prep"],

  // DeMatha
  ["2026-08-28","7:00 PM","Archbishop Spalding","DeMatha","DeMatha","DeMatha"],
  ["2026-09-05","7:00 PM","DeMatha","Imhotep Charter","Imhotep Charter","DeMatha"],
  ["2026-09-11","7:00 PM","Roman Catholic","DeMatha","DeMatha","DeMatha"],
  ["2026-09-18","7:00 PM","Loudoun Sports Academy","DeMatha","DeMatha","DeMatha"],
  ["2026-09-25","7:00 PM","DeMatha","Riverdale Baptist","Riverdale Baptist","DeMatha"],
  ["2026-10-02","7:00 PM","Mt. Zion Prep Academy","DeMatha","DeMatha","DeMatha"],
  ["2026-10-09","7:00 PM","Good Counsel","DeMatha","DeMatha","DeMatha"],
  ["2026-10-16","7:00 PM","Bishop McNamara","DeMatha","DeMatha","DeMatha"],
  ["2026-10-24","2:00 PM","DeMatha","St. John’s","St. John’s","DeMatha"],
  ["2026-10-31","2:00 PM","DeMatha","Gonzaga","Gonzaga","DeMatha"],

  // Landon
  ["2026-08-21","5:00 PM","Bishop O'Connell","Landon","Landon","Landon"],
  ["2026-08-28","5:00 PM","Potomac School","Landon","Landon","Landon"],
  ["2026-09-04","4:00 PM","Boys Latin","Landon","Landon","Landon"],
  ["2026-09-10","4:00 PM","Paul VI","Landon","Landon","Landon"],
  ["2026-09-18","4:00 PM","Flint Hill","Landon","Landon","Landon"],
  ["2026-09-26","1:00 PM","Bishop Ireton","Landon","Landon","Landon"],
  ["2026-10-16","7:00 PM","Landon","Bullis","Bullis","Landon"],
  ["2026-10-24","1:30 PM","Episcopal","Landon","Landon","Landon"],
  ["2026-10-31","1:30 PM","Georgetown Prep","Landon","Landon","Landon"],
  ["2026-11-07","1:30 PM","St. Stephen's & St. Agnes","Landon","Landon","Landon"],
  ["2026-11-14","1:00 PM","Landon","St. Albans","St. Albans","Landon"],

  // Good Counsel
  ["2026-08-28","7:00 PM","Good Counsel","Bishop McDevitt","Bishop McDevitt","Good Counsel"],
  ["2026-09-04","7:00 PM","Bergen Catholic","Good Counsel","Good Counsel","Good Counsel"],
  ["2026-09-11","7:00 PM","Archbishop Spalding","Good Counsel","Good Counsel","Good Counsel"],
  ["2026-09-18","7:00 PM","Middletown","Good Counsel","Good Counsel","Good Counsel"],
  ["2026-09-25","7:00 PM","Good Counsel","Malvern Prep","Malvern Prep","Good Counsel"],
  ["2026-10-02","7:00 PM","St. Mary’s Ryken","Good Counsel","Good Counsel","Good Counsel"],
  ["2026-10-09","7:00 PM","Good Counsel","DeMatha","DeMatha","Good Counsel"],
  ["2026-10-16","7:00 PM","St. John’s","Good Counsel","Good Counsel","Good Counsel"],
  ["2026-10-23","7:00 PM","Gonzaga","Good Counsel","Good Counsel","Good Counsel"],
  ["2026-11-07","1:00 PM","Good Counsel","Bishop McNamara","Bishop McNamara","Good Counsel"],

  // Bishop McNamara
  ["2026-08-28","3:00 PM","Bishop McNamara","Abraham Lincoln","Abraham Lincoln","Bishop McNamara"],
  ["2026-09-04","6:30 PM","Bishop McNamara","Dundalk","Dundalk","Bishop McNamara"],
  ["2026-09-12","12:00 PM","Maury","Bishop McNamara","Bishop McNamara","Bishop McNamara"],
  ["2026-09-19","1:00 PM","St. Mary’s Ryken","Bishop McNamara","Bishop McNamara","Bishop McNamara"],
  ["2026-09-26","1:00 PM","Bishop McNamara","Archbishop Carroll","Archbishop Carroll","Bishop McNamara"],
  ["2026-10-03","1:00 PM","St. Michael the Archangel","Bishop McNamara","Bishop McNamara","Bishop McNamara"],
  ["2026-10-10","2:00 PM","Bishop McNamara","Gonzaga","Gonzaga","Bishop McNamara"],
  ["2026-10-16","7:00 PM","Bishop McNamara","DeMatha","DeMatha","Bishop McNamara"],
  ["2026-10-31","1:00 PM","St. John’s","Bishop McNamara","Bishop McNamara","Bishop McNamara"],

  // St. Mary's Ryken
  ["2026-08-28","7:00 PM","St. Mary’s Ryken","McCallie","McCallie","St. Mary’s Ryken"],
  ["2026-09-04","7:00 PM","Mount St. Joseph","St. Mary’s Ryken","St. Mary’s Ryken","St. Mary’s Ryken"],
  ["2026-09-11","7:00 PM","Woodberry Forest","St. Mary’s Ryken","St. Mary’s Ryken","St. Mary’s Ryken"],
  ["2026-09-19","1:00 PM","St. Mary’s Ryken","Bishop McNamara","Bishop McNamara","St. Mary’s Ryken"],
  ["2026-09-25","7:00 PM","Georgetown Prep","St. Mary’s Ryken","St. Mary’s Ryken","St. Mary’s Ryken"],
  ["2026-10-02","7:00 PM","St. Mary’s Ryken","Good Counsel","Good Counsel","St. Mary’s Ryken"],
  ["2026-10-09","7:00 PM","St. Mary’s Ryken","Paul VI","Paul VI","St. Mary’s Ryken"],
  ["2026-10-16","7:00 PM","Bishop O'Connell","St. Mary’s Ryken","St. Mary’s Ryken","St. Mary’s Ryken"],
  ["2026-10-23","7:00 PM","Bishop Ireton","St. Mary’s Ryken","St. Mary’s Ryken","St. Mary’s Ryken"],
  ["2026-11-07","12:00 PM","St. Mary’s Ryken","Archbishop Carroll","Archbishop Carroll","St. Mary’s Ryken"],

  // St. Vincent Pallotti
  ["2026-08-22","10:00 AM","St. Vincent Pallotti","St. Mary's","St. Mary's","St. Vincent Pallotti"],
  ["2026-08-28","6:00 PM","Archbishop Carroll","St. Vincent Pallotti","St. Vincent Pallotti","St. Vincent Pallotti"],
  ["2026-09-05","7:00 PM","St. Vincent Pallotti","Georgetown Prep","Georgetown Prep","St. Vincent Pallotti"],
  ["2026-09-25","4:00 PM","St. Vincent Pallotti","Archbishop Curley","Archbishop Curley","St. Vincent Pallotti"],
  ["2026-10-02","7:00 PM","St. Paul's","St. Vincent Pallotti","St. Vincent Pallotti","St. Vincent Pallotti"],
  ["2026-10-09","7:00 PM","St. Vincent Pallotti","John Carroll","John Carroll","St. Vincent Pallotti"],
  ["2026-10-16","7:00 PM","Severn School","St. Vincent Pallotti","St. Vincent Pallotti","St. Vincent Pallotti"],
  ["2026-10-23","4:00 PM","St. Vincent Pallotti","Annapolis Area Christian","Annapolis Area Christian","St. Vincent Pallotti"],
  ["2026-10-30","3:30 PM","St. Vincent Pallotti","Boys Latin","Boys Latin","St. Vincent Pallotti"],
  ["2026-11-06","7:00 PM","Our Lady of Mount Carmel","St. Vincent Pallotti","St. Vincent Pallotti","St. Vincent Pallotti"],

  // Riverdale Baptist
  ["2026-08-28","7:00 PM","McDonogh","Riverdale Baptist","Riverdale Baptist","Riverdale Baptist"],
  ["2026-09-04","7:00 PM","Riverdale Baptist","North East","North East","Riverdale Baptist"],
  ["2026-09-11","7:00 PM","Bell","Riverdale Baptist","Riverdale Baptist","Riverdale Baptist"],
  ["2026-09-18","7:00 PM","St. John's Gray","Riverdale Baptist","Riverdale Baptist","Riverdale Baptist"],
  ["2026-09-25","7:00 PM","DeMatha","Riverdale Baptist","Riverdale Baptist","Riverdale Baptist"],
  ["2026-10-02","7:00 PM","Digital Pioneers Academy","Riverdale Baptist","Riverdale Baptist","Riverdale Baptist"],
  ["2026-10-10","1:00 PM","Long Island Lutheran","Riverdale Baptist","Riverdale Baptist","Riverdale Baptist"],
  ["2026-10-16","6:00 PM","Riverdale Baptist","KIPP DC Legacy","KIPP DC Legacy","Riverdale Baptist"],
  ["2026-10-23","7:00 PM","Riverdale Baptist","Loudoun Sports Academy","Loudoun Sports Academy","Riverdale Baptist"],
  ["2026-10-30","6:00 PM","Riverdale Baptist","Friendship Collegiate Academy","Friendship Collegiate Academy","Riverdale Baptist"],
  ["2026-11-06","6:30 PM","Riverdale Baptist","St. John's Catholic Prep","St. John's Catholic Prep","Riverdale Baptist"],

  // Maret
  ["2026-09-04","4:30 PM","Penn Wood","Maret","Maret","Maret"],
  ["2026-09-10","6:30 PM","Maret","St. John's Catholic Prep","St. John's Catholic Prep","Maret"],
  ["2026-09-18","4:30 PM","Bell","Maret","Maret","Maret"],
  ["2026-09-26","1:00 PM","Maret","Allegany","Allegany","Maret"],
  ["2026-10-02","7:00 PM","Maret","Flint Hill","Flint Hill","Maret"],
  ["2026-10-10","12:00 PM","Maret","Potomac School","Potomac School","Maret"],
  ["2026-10-24","2:30 PM","Sidwell Friends","Maret","Maret","Maret"],
  ["2026-10-30","3:30 PM","St. Albans","Maret","Maret","Maret"],
  ["2026-11-07","1:30 PM","Saint James","Maret","Maret","Maret"],

  // Sidwell Friends (official)
  ["2026-08-26","5:00 PM","Sidwell Friends","Fairmont Heights","Fairmont Heights","Sidwell Friends"],
  ["2026-09-03","6:00 PM","Sidwell Friends","Ron Brown","Spingarn Field","Sidwell Friends"],
  ["2026-09-11","4:30 PM","St. John Paul the Great","Sidwell Friends","Sidwell Friends","Sidwell Friends"],
  ["2026-09-18","4:30 PM","Sidwell Friends","Phelps ACE","Spingarn Field","Sidwell Friends"],
  ["2026-09-26","1:00 PM","Sidwell Friends","St. Stephen's & St. Agnes","St. Stephen's & St. Agnes","Sidwell Friends"],
  ["2026-10-03","2:00 PM","Sidwell Friends","Saint James","Saint James","Sidwell Friends"],
  ["2026-10-17","2:00 PM","Flint Hill","Sidwell Friends","Sidwell Friends","Sidwell Friends"],
  ["2026-10-24","2:30 PM","Sidwell Friends","Maret","Maret","Sidwell Friends"],
  ["2026-10-31","12:00 PM","Potomac School","Sidwell Friends","Sidwell Friends","Sidwell Friends"],

  // St. John's
  ["2026-08-29","2:30 PM","Mt. Zion Prep Academy","St. John’s","St. John’s","St. John’s"],
  ["2026-09-05","7:00 PM","Archbishop Spalding","St. John’s","St. John’s","St. John’s"],
  ["2026-09-12","1:00 PM","Lewis Bennett","St. John’s","St. John’s","St. John’s"],
  ["2026-09-18","6:30 PM","St. John’s","West Boca Raton","West Boca Raton","St. John’s"],
  ["2026-09-26","1:00 PM","St. John’s","St. Edward","St. Edward","St. John’s"],
  ["2026-10-03","2:00 PM","Cornerstone Christian","St. John’s","St. John’s","St. John’s"],
  ["2026-10-16","7:00 PM","St. John’s","Good Counsel","Good Counsel","St. John’s"],
  ["2026-10-24","2:00 PM","DeMatha","St. John’s","St. John’s","St. John’s"],
  ["2026-10-31","1:00 PM","St. John’s","Bishop McNamara","Bishop McNamara","St. John’s"],
  ["2026-11-07","1:00 PM","Gonzaga","St. John’s","St. John’s","St. John’s"],
];

const normalize = (value) => String(value || "")
  .toLowerCase()
  .replace(/[’']/g, "")
  .replace(/\bsaint\b/g, "st")
  .replace(/\bour lady of good counsel\b/g, "good counsel")
  .replace(/\bpallotti\b/g, "st vincent pallotti")
  .replace(/\bst johns college high school\b/g, "st johns")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const matchupKey = (a, b) => [normalize(a), normalize(b)].sort().join("|");
const slug = (value) => normalize(value).replace(/\s+/g, "-");

export function applyTrackedPrivateFootballSchedulesSep5(games) {
  const merged = [...games];
  const indexByMatchup = new Map();
  merged.forEach((game, index) => indexByMatchup.set(matchupKey(game.team1, game.team2), index));

  for (const [date,time,team1,team2,location,sourceTeam] of rows) {
    const key = matchupKey(team1, team2);
    const sourceUrl = SOURCES[sourceTeam] || "";
    const existingIndex = indexByMatchup.get(key);

    if (existingIndex !== undefined) {
      const existing = merged[existingIndex];
      merged[existingIndex] = {
        ...existing,
        date,
        time,
        location,
        scheduleStatus: existing.scheduleStatus === "Final" ? "Final" : "Confirmed",
        subjectToChange: false,
        verificationStatus: existing.verificationStatus === "Final" ? "Final" : "Published",
        sourceTier: sourceUrl.includes("stalbansschool.org") || sourceUrl.includes("gprep.org") || sourceUrl.includes("landon.net") || sourceUrl.includes("sidwell.edu") ? "Official school" : "MaxPreps current schedule",
        notes: existing.scheduleStatus === "Final" ? existing.notes : `Full tracked-team schedule audit; source: ${sourceTeam}.`,
        sourceUrl,
        lastChecked: "2026-09-05",
      };
      continue;
    }

    const game = {
      id: `fb-${date}-${slug(team1)}-${slug(team2)}`,
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date,
      time,
      team1,
      team2,
      score1: null,
      score2: null,
      location,
      scheduleStatus: "Confirmed",
      subjectToChange: false,
      verificationStatus: "Published",
      sourceTier: sourceUrl.includes("stalbansschool.org") || sourceUrl.includes("gprep.org") || sourceUrl.includes("landon.net") || sourceUrl.includes("sidwell.edu") ? "Official school" : "MaxPreps current schedule",
      notes: `Added during full tracked private/prep schedule audit; source: ${sourceTeam}.`,
      sourceUrl,
      lastChecked: "2026-09-05",
    };
    indexByMatchup.set(key, merged.length);
    merged.push(game);
  }

  return merged.sort((a,b) => a.date.localeCompare(b.date) || String(a.time).localeCompare(String(b.time)));
}

export default applyTrackedPrivateFootballSchedulesSep5;
