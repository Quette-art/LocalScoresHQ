// Dunbar (DC) official 2026 varsity schedule graphic from @dunbardcfootball.
// Posted Aug. 4, 2026. Applied Sept. 10, 2026.

const SOURCE = "https://www.instagram.com/dunbardcfootball/";
const CHECKED = "2026-09-10";
const NOTE = "Published on Dunbar DC's official 2026 varsity schedule graphic.";

const officialMeta = (notes = NOTE) => ({
  scheduleStatus: "Confirmed",
  subjectToChange: false,
  verificationStatus: "Published",
  sourceTier: "Official team graphic",
  notes,
  sourceUrl: SOURCE,
  lastChecked: CHECKED,
});

const teamsOf = (game) => new Set([game.team1, game.team2]);
const isDunbarDc = (name = "") => name === "Dunbar";
const involvesDunbarDc = (game) => isDunbarDc(game.team1) || isDunbarDc(game.team2);

const patch = (game, fields) => {
  const nextStatus =
    game.scheduleStatus === "Final" || (game.score1 != null && game.score2 != null)
      ? game.scheduleStatus === "Final"
        ? "Final"
        : game.scheduleStatus
      : "Confirmed";
  return {
    ...game,
    ...fields,
    ...officialMeta(fields.notes || NOTE),
    scheduleStatus: nextStatus === "Final" ? "Final" : "Confirmed",
    verificationStatus: nextStatus === "Final" ? "Final" : "Published",
    score1: game.score1,
    score2: game.score2,
  };
};

export function applyDunbarFootballScheduleSep10(games = []) {
  const withoutWoodbridge = games.filter((game) => {
    const teams = teamsOf(game);
    return !(involvesDunbarDc(game) && teams.has("Woodbridge (VA)"));
  });

  const patched = withoutWoodbridge.map((game) => {
    if (!involvesDunbarDc(game)) return game;
    const teams = teamsOf(game);

    if (teams.has("John Champe")) {
      return patch(game, {
        date: "2026-08-28",
        time: "7:00 PM",
        location: "Dunbar",
        notes: `${NOTE} Home opener vs John Champe.`,
      });
    }

    if (teams.has("Hoboken (NJ)")) {
      return patch(game, {
        date: "2026-09-19",
        time: "1:00 PM",
        location: "Dunbar",
      });
    }

    if (teams.has("Chester (PA)")) {
      return patch(game, {
        date: "2026-09-26",
        time: "1:00 PM",
        location: "Chester (PA)",
      });
    }

    if (teams.has("Bell")) {
      return patch(game, {
        date: "2026-10-01",
        time: "6:00 PM",
        location: "CHEC",
        notes: `${NOTE} CHEC (Bell).`,
      });
    }

    if (teams.has("H.D. Woodson")) {
      return patch(game, {
        date: "2026-10-08",
        time: "6:00 PM",
        location: "H.D. Woodson",
      });
    }

    if (teams.has("Eastern")) {
      return patch(game, {
        date: "2026-10-15",
        time: "6:00 PM",
        location: "Dunbar",
      });
    }

    if (teams.has("Roosevelt")) {
      return patch(game, {
        date: "2026-10-24",
        time: "2:00 PM",
        location: "Dunbar",
        notes: `${NOTE} Homecoming.`,
      });
    }

    if (teams.has("Ballou")) {
      return patch(game, {
        date: "2026-10-29",
        time: "6:00 PM",
        location: "Dunbar",
        notes: `${NOTE} Senior Night.`,
      });
    }

    if (teams.has("Coolidge")) {
      return patch(game, {
        date: "2026-11-06",
        time: "6:00 PM",
        location: "Dunbar",
      });
    }

    return game;
  });

  const alreadyHasBalt = patched.some((game) => {
    const teams = teamsOf(game);
    return involvesDunbarDc(game) && teams.has("Dunbar (Baltimore)");
  });

  const baltGame = {
    id: "fb-2026-09-10-dunbar-dunbar-baltimore",
    sport: "Football",
    division: "Varsity",
    ageGroup: "Varsity",
    date: "2026-09-10",
    time: "TBD",
    team1: "Dunbar",
    team2: "Dunbar (Baltimore)",
    score1: null,
    score2: null,
    location: "UA Stadium",
    ...officialMeta(`${NOTE} Neutral/away at UA Stadium vs Dunbar (Baltimore). Kickoff listed as TBA.`),
  };

  const withBalt = alreadyHasBalt ? patched : [...patched, baltGame];

  return withBalt.sort(
    (a, b) =>
      a.date.localeCompare(b.date) || String(a.time).localeCompare(String(b.time))
  );
}

export default applyDunbarFootballScheduleSep10;
