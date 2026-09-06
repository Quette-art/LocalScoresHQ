const isCardozoEdmondson = (game) => {
  const teams = new Set([game.team1, game.team2]);
  return teams.has("Cardozo") && teams.has("Edmondson-Westside");
};

export function applyFootballScheduleCorrectionsSep6(games) {
  return games.map((game) => {
    if (!isCardozoEdmondson(game)) return game;
    return {
      ...game,
      date: "2026-09-05",
      scheduleStatus: game.scheduleStatus === "Final" ? "Final" : "Confirmed",
      subjectToChange: false,
      verificationStatus: game.scheduleStatus === "Final" ? "Final" : "Published",
      notes: "Game date corrected from Sept. 4 to Sept. 5, 2026.",
      lastChecked: "2026-09-06",
    };
  });
}

export default applyFootballScheduleCorrectionsSep6;
