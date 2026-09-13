const SATURDAY_UPDATES = [
  {
    teams: ["Maury", "Bishop McNamara"],
    scores: { Maury: 56, "Bishop McNamara": 28 },
    sourceUrl: "https://www.thehour.com/sports/article/saturday-s-scores-22429112.php",
  },
  {
    teams: ["Potomac School", "St. Albans"],
    scores: { "Potomac School": 28, "St. Albans": 35 },
    sourceUrl: "https://www.thehour.com/sports/article/saturday-s-scores-22429112.php",
  },
  {
    teams: ["Coolidge", "Mervo (Baltimore)"],
    scores: { Coolidge: 0, "Mervo (Baltimore)": 6 },
    sourceUrl: "https://www.thehour.com/sports/article/saturday-s-scores-22429269.php",
  },
];

const CANCELED_GAMES = [
  {
    teams: ["Cardozo", "Independence"],
    sourceUrl: "https://www.thehour.com/sports/article/saturday-s-scores-22429206.php",
  },
];

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const aliases = new Map([
  ["mervo", "mervo baltimore"],
  ["mergenthaler", "mervo baltimore"],
  ["mergenthaler vocational technical", "mervo baltimore"],
  ["independence high school", "independence"],
]);

const canonical = (value = "") => {
  const key = normalize(value);
  return aliases.get(key) || key;
};

const sameTeam = (a, b) => canonical(a) === canonical(b);
const sameMatchup = (game, teams) => {
  const [a, b] = teams;
  return (
    (sameTeam(game.team1, a) && sameTeam(game.team2, b)) ||
    (sameTeam(game.team1, b) && sameTeam(game.team2, a))
  );
};

const scoreForTeam = (teamName, result) => {
  for (const [name, score] of Object.entries(result.scores)) {
    if (sameTeam(teamName, name)) return score;
  }
  return null;
};

export function applyFootballResultsSep12Finals(games = []) {
  return games.map((game) => {
    if (game.date !== "2026-09-12") return game;

    const finalResult = SATURDAY_UPDATES.find((item) =>
      sameMatchup(game, item.teams)
    );

    if (finalResult) {
      return {
        ...game,
        score1: scoreForTeam(game.team1, finalResult),
        score2: scoreForTeam(game.team2, finalResult),
        status: undefined,
        scheduleStatus: "Final",
        subjectToChange: false,
        verificationStatus: "Final",
        sourceTier: "AP / verified score report",
        notes: "Saturday final score verified Sept. 13, 2026.",
        sourceUrl: finalResult.sourceUrl,
        lastChecked: "2026-09-13",
      };
    }

    const canceled = CANCELED_GAMES.find((item) =>
      sameMatchup(game, item.teams)
    );

    if (canceled) {
      return {
        ...game,
        score1: null,
        score2: null,
        status: "cancelled",
        scheduleStatus: "Canceled",
        subjectToChange: false,
        verificationStatus: "Canceled",
        sourceTier: "AP / verified score report",
        notes: "Game canceled; verified Sept. 13, 2026.",
        sourceUrl: canceled.sourceUrl,
        lastChecked: "2026-09-13",
      };
    }

    return game;
  });
}

export default applyFootballResultsSep12Finals;
