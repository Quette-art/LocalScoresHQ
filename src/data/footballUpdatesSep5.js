const sameMatchup = (game, teamA, teamB) => {
  const teams = new Set([game.team1, game.team2]);
  return teams.has(teamA) && teams.has(teamB);
};

const applyFinal = (game, scores, notes) => ({
  ...game,
  score1: scores[game.team1],
  score2: scores[game.team2],
  scheduleStatus: "Final",
  subjectToChange: false,
  verificationStatus: "Final",
  notes,
  lastChecked: "2026-09-05",
});

export function applyFootballUpdatesSep5(games) {
  return games.map((game) => {
    if (sameMatchup(game, "Maret", "Penn Wood")) {
      return applyFinal(game, { Maret: 14, "Penn Wood": 8 }, "Final confirmed by Maret Athletics; also reported by MaxPreps.");
    }

    if (sameMatchup(game, "Roosevelt", "KIPP DC Legacy" ) || sameMatchup(game, "Roosevelt", "KIPP DC Legacy College Prep")) {
      const kippName = game.team1 === "Roosevelt" ? game.team2 : game.team1;
      return applyFinal(game, { Roosevelt: 40, [kippName]: 15 }, "Final confirmed by Roosevelt football social post.");
    }

    if (sameMatchup(game, "Friendship Collegiate Academy", "Archbishop Carroll") || sameMatchup(game, "Friendship Collegiate", "Archbishop Carroll")) {
      const friendshipName = game.team1 === "Archbishop Carroll" ? game.team2 : game.team1;
      return applyFinal(game, { [friendshipName]: 24, "Archbishop Carroll": 6 }, "Final confirmed by Friendship football social post and DC News Now; overrides conflicting MaxPreps entry.");
    }

    if (sameMatchup(game, "Gonzaga", "Coolidge")) {
      return applyFinal({ ...game, date: "2026-09-03" }, { Gonzaga: 33, Coolidge: 0 }, "Final confirmed 33-0; Gonzaga game-day post and DCSAA/NFHS listing support Thursday Sept. 3 date.");
    }

    if (sameMatchup(game, "Ron Brown", "Sidwell Friends")) {
      return applyFinal(
        { ...game, date: "2026-09-03" },
        { "Ron Brown": 6, "Sidwell Friends": 0 },
        "Final confirmed by MaxPreps game result: Ron Brown 6, Sidwell Friends 0 on Sept. 3, 2026."
      );
    }

    const easternFlowers =
      sameMatchup(game, "Eastern", "Flowers") ||
      sameMatchup(game, "Eastern", "Charles Herbert Flowers") ||
      sameMatchup(game, "Eastern", "C.H. Flowers");

    if (easternFlowers) {
      return {
        ...game,
        scheduleStatus: "Canceled",
        subjectToChange: false,
        verificationStatus: "Canceled",
        notes: "Canceled due to PGCPS school closures. Eastern football stated the game will not be rescheduled.",
        lastChecked: "2026-09-05",
      };
    }

    return game;
  });
}

export default applyFootballUpdatesSep5;
