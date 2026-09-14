// Record/schedule cleanup after the Sept. 13 full-league expansion.
// Applied last so verified finals and dedupes are not overwritten by schedule overlays.

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[’‘']/g, "")
    .replace(/\bsaint\b/g, "st")
    .replace(/\bcatholic high school\b/g, "")
    .replace(/\bcatholic\b/g, "")
    .replace(/\bst\.? vincent pallotti\b/g, "pallotti")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const hasTeam = (game, team) =>
  normalize(game.team1) === normalize(team) || normalize(game.team2) === normalize(team);

const isMatchup = (game, teamA, teamB) => hasTeam(game, teamA) && hasTeam(game, teamB);

const scoreGame = (game, scores, sourceUrl, notes) => ({
  ...game,
  score1: scores[normalize(game.team1)],
  score2: scores[normalize(game.team2)],
  scheduleStatus: "Final",
  subjectToChange: false,
  verificationStatus: "Final",
  sourceTier: "Verified result",
  sourceUrl,
  notes,
  lastChecked: "2026-09-13",
});

export function applyFootballRecordCorrectionsSep13(games = []) {
  const cleaned = [];
  let keptSidwellJohnPaul = false;
  let foundCarrollPallotti = false;
  let foundSidwellJohnPaul = false;

  for (const original of games) {
    // Sidwell lists this Aug. 26 event, but Fairmont Heights is an MPSSAA
    // member and Maryland's first allowable 2026 regular-season football date
    // was Sept. 4. Treat it as preseason/non-counting and omit it from the
    // regular-season schedule rather than showing a stale "Upcoming" game.
    if (
      original.date === "2026-08-26" &&
      isMatchup(original, "Sidwell Friends", "Fairmont Heights")
    ) {
      continue;
    }

    // Collapse the two Sept. 11 opponent-name variants into one final.
    if (
      original.date === "2026-09-11" &&
      hasTeam(original, "Sidwell Friends") &&
      (hasTeam(original, "St. John Paul the Great") ||
        hasTeam(original, "Saint John Paul the Great Catholic"))
    ) {
      if (keptSidwellJohnPaul) continue;
      keptSidwellJohnPaul = true;
      foundSidwellJohnPaul = true;

      const sidwellIsTeam1 = normalize(original.team1) === normalize("Sidwell Friends");
      const canonical = {
        ...original,
        id: "fb-2026-09-11-sidwell-friends-st-john-paul-the-great",
        team1: sidwellIsTeam1 ? "Sidwell Friends" : "St. John Paul the Great",
        team2: sidwellIsTeam1 ? "St. John Paul the Great" : "Sidwell Friends",
        time: "4:30 PM",
      };

      cleaned.push(
        scoreGame(
          canonical,
          {
            [normalize("Sidwell Friends")]: 6,
            [normalize("St. John Paul the Great")]: 13,
          },
          "https://dcsportsfan.com/2026/09/11/football-scores/",
          "Final: St. John Paul the Great 13, Sidwell Friends 6. Duplicate opponent-name listings consolidated Sept. 13."
        )
      );
      continue;
    }

    // Archbishop Carroll's Aug. 28 win over Pallotti is recorded as a 2-0 forfeit.
    if (
      original.date === "2026-08-28" &&
      isMatchup(original, "Archbishop Carroll", "Pallotti")
    ) {
      foundCarrollPallotti = true;
      cleaned.push(
        scoreGame(
          original,
          {
            [normalize("Archbishop Carroll")]: 2,
            [normalize("Pallotti")]: 0,
          },
          "https://www.maxpreps.com/inter-state/football/game/archbishop-carroll-washington-dc-vs-pallotti-laurel-md/8-28-2026/",
          "Archbishop Carroll credited with a 2-0 forfeit win over St. Vincent Pallotti."
        )
      );
      continue;
    }

    // Keep the verified Jackson-Reed / Flint Hill final at 47-7.
    if (
      original.date === "2026-09-11" &&
      isMatchup(original, "Jackson-Reed", "Flint Hill")
    ) {
      cleaned.push(
        scoreGame(
          original,
          {
            [normalize("Jackson-Reed")]: 7,
            [normalize("Flint Hill")]: 47,
          },
          "https://www.maxpreps.com/dc/washington/jackson-reed-tigers/football/",
          "Final corrected to Flint Hill 47, Jackson-Reed 7."
        )
      );
      continue;
    }

    cleaned.push(original);
  }

  // Safety fallbacks in case an older schedule layer did not contain a row.
  if (!foundCarrollPallotti) {
    cleaned.push({
      id: "fb-2026-08-28-archbishop-carroll-st-vincent-pallotti",
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date: "2026-08-28",
      time: "6:00 PM",
      team1: "Archbishop Carroll",
      team2: "St. Vincent Pallotti",
      score1: 2,
      score2: 0,
      location: "St. Vincent Pallotti",
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier: "Verified result",
      sourceUrl: "https://www.maxpreps.com/inter-state/football/game/archbishop-carroll-washington-dc-vs-pallotti-laurel-md/8-28-2026/",
      notes: "Archbishop Carroll credited with a 2-0 forfeit win over St. Vincent Pallotti.",
      lastChecked: "2026-09-13",
    });
  }

  if (!foundSidwellJohnPaul) {
    cleaned.push({
      id: "fb-2026-09-11-sidwell-friends-st-john-paul-the-great",
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date: "2026-09-11",
      time: "4:30 PM",
      team1: "Sidwell Friends",
      team2: "St. John Paul the Great",
      score1: 6,
      score2: 13,
      location: "St. John Paul the Great Catholic High School",
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier: "Verified result",
      sourceUrl: "https://dcsportsfan.com/2026/09/11/football-scores/",
      notes: "Final: St. John Paul the Great 13, Sidwell Friends 6.",
      lastChecked: "2026-09-13",
    });
  }

  return cleaned.sort(
    (a, b) => a.date.localeCompare(b.date) || String(a.time).localeCompare(String(b.time))
  );
}

export default applyFootballRecordCorrectionsSep13;
