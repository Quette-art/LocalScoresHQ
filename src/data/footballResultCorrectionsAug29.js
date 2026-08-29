// LocalScoresHQ result correction — 2026-08-29.
//
// Ballou's football account posted the final as Ballou 28, Ron Brown 26.
// This correction is applied after the Aug. 29 verification layer so the
// newer team-posted final supersedes the earlier conflicting score entry.

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const isBallouRonBrown = (game) => {
  if (game.date !== "2026-08-28") return false;

  const team1 = normalize(game.team1);
  const team2 = normalize(game.team2);

  return (
    (team1 === "ballou" && team2 === "ron brown") ||
    (team1 === "ron brown" && team2 === "ballou")
  );
};

export function applyFootballResultCorrectionsAug29(games = []) {
  return games.map((game) => {
    if (!isBallouRonBrown(game)) return game;

    const ballouIsTeam1 = normalize(game.team1) === "ballou";

    return {
      ...game,
      score1: ballouIsTeam1 ? 28 : 26,
      score2: ballouIsTeam1 ? 26 : 28,
      resultStatus: "Final",
      verificationStatus: "Final verified",
      scheduleStatus: "Confirmed",
      subjectToChange: false,
      resultSource: "Ballou football Instagram post",
      resultSourceUrl: "https://www.instagram.com/bbbknightsfb/",
      resultNotes:
        "Corrected Aug. 29 from Ballou football's posted final: Ballou 28, Ron Brown 26. Supersedes the earlier conflicting result entry.",
      lastChecked: "2026-08-29",
    };
  });
}

export default applyFootballResultCorrectionsAug29;
