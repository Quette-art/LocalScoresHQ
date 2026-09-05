const BULLIS_SOURCE = "https://www.bullis.org/athletics/teams-schedules/team/~athletics-team-id/121";

const schedule = [
  ["2026-08-29", "12:00 PM", "Bishop Ireton", "Bishop Ireton High School"],
  ["2026-09-04", "7:30 PM", "Gilman", "Bullis School"],
  ["2026-09-18", "7:00 PM", "St. Christopher's", "Bullis School"],
  ["2026-09-26", "12:00 PM", "Loyola Blakefield", "Loyola Blakefield School"],
  ["2026-10-03", "12:30 PM", "Roosevelt", "Bullis School"],
  ["2026-10-09", "7:00 PM", "St. James School", "Bullis School"],
  ["2026-10-16", "7:00 PM", "Landon", "Bullis School"],
  ["2026-10-31", "1:00 PM", "Episcopal", "Episcopal High School"],
  ["2026-11-06", "7:00 PM", "St. Albans", "Bullis School"],
  ["2026-11-14", "5:00 PM", "Georgetown Prep", "Georgetown Preparatory School"],
];

const slug = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function applyBullisFootballScheduleSep5(games) {
  const withoutBullis = games.filter(
    (game) => game.team1 !== "Bullis" && game.team2 !== "Bullis"
  );

  const bullisGames = schedule.map(([date, time, opponent, location]) => ({
    id: `fb-${date}-bullis-${slug(opponent)}`,
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date,
    time,
    team1: "Bullis",
    team2: opponent,
    score1: null,
    score2: null,
    location,
    scheduleStatus: "Confirmed",
    subjectToChange: false,
    verificationStatus: "Published",
    sourceTier: "Official school",
    notes: "Published on Bullis School's official 2026 varsity football schedule.",
    sourceUrl: BULLIS_SOURCE,
    lastChecked: "2026-09-05",
  }));

  return [...withoutBullis, ...bullisGames].sort(
    (a, b) =>
      a.date.localeCompare(b.date) || String(a.time).localeCompare(String(b.time))
  );
}

export default applyBullisFootballScheduleSep5;
