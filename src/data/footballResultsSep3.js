const sameMatchup = (game, teamA, teamB) => {
  const teams = new Set([game.team1, game.team2]);
  return teams.has(teamA) && teams.has(teamB);
};

const applyScore = (game, scores) => ({
  ...game,
  score1: scores[game.team1],
  score2: scores[game.team2],
  scheduleStatus: "Final",
  subjectToChange: false,
  verificationStatus: "Final",
  lastChecked: "2026-09-04",
});

export function applyFootballResultsSep3(games) {
  let foundBallouYorktown = false;

  const updated = games.map((game) => {
    if (sameMatchup(game, "McKinley Tech", "H.D. Woodson")) {
      return applyScore(
        {
          ...game,
          id: "fb-2026-09-03-mckinley-tech-h-d-woodson",
          date: "2026-09-03",
          notes: "Final score added Sept. 4; game date corrected from Sept. 4 to Sept. 3.",
        },
        { "McKinley Tech": 41, "H.D. Woodson": 0 }
      );
    }

    if (sameMatchup(game, "Yorktown", "Ballou")) {
      foundBallouYorktown = true;
      return applyScore(
        {
          ...game,
          date: "2026-09-03",
          notes: "Final score added Sept. 4.",
        },
        { Yorktown: 41, Ballou: 0 }
      );
    }

    return game;
  });

  if (!foundBallouYorktown) {
    updated.push({
      id: "fb-2026-09-03-yorktown-ballou",
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date: "2026-09-03",
      time: "TBD",
      team1: "Yorktown",
      team2: "Ballou",
      score1: 41,
      score2: 0,
      location: "TBD",
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier: "Verified score source",
      notes: "Final score added Sept. 4.",
      sourceUrl: "",
      lastChecked: "2026-09-04",
    });
  }

  return updated.sort(
    (a, b) =>
      a.date.localeCompare(b.date) || String(a.time).localeCompare(String(b.time))
  );
}

export default applyFootballResultsSep3;
