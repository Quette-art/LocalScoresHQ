/**
 * Exactly one alert category is eligible for a game in one publish/update.
 * A newly recorded final outranks schedule and status edits made alongside it.
 * This is shared by production builds, admin updates, and foreground alerts.
 */
export function hasFinalScore(game) {
  if (game?.forfeit === true && ["W:L", "L:W"].includes(`${game.score1}:${game.score2}`)) return true;
  return (
    game?.score1 !== null &&
    game?.score1 !== undefined &&
    game?.score2 !== null &&
    game?.score2 !== undefined &&
    String(game.score1).trim() !== "" &&
    String(game.score2).trim() !== "" &&
    Number.isFinite(Number(game.score1)) &&
    Number.isFinite(Number(game.score2))
  );
}

export function classifyGameNotification(before, after) {
  if (!after) return null;
  if (!before) return hasFinalScore(after) ? "score" : "added";

  const scoreChanged =
    before.score1 !== after.score1 || before.score2 !== after.score2;
  if (scoreChanged && hasFinalScore(after)) return "score";

  const status = String(after.status || "").toLowerCase();
  const oldStatus = String(before.status || "").toLowerCase();
  if (
    status !== oldStatus &&
    (status === "cancelled" || status === "postponed")
  ) {
    return "status";
  }

  const scheduleFields = [
    "team1", "team2", "division", "date", "time", "location",
  ];
  if (scheduleFields.some((field) => before[field] !== after[field])) {
    return "schedule";
  }

  return null;
}
