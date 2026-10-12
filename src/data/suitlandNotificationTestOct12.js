// TEMPORARY notification test for Suitland.
// This is not a real game. Remove this overlay after the notification test is confirmed.

export function applySuitlandNotificationTestOct12(games) {
  const testId = "fb-test-2026-10-12-suitland-notification";

  if (games.some((game) => game.id === testId)) {
    return games;
  }

  return [
    ...games,
    {
      id: testId,
      sport: "Football",
      division: "Varsity",
      ageGroup: "Varsity",
      date: "2026-10-12",
      time: "1:30 PM",
      team1: "Suitland",
      team2: "Notification Test",
      score1: null,
      score2: null,
      location: "LocalScoresHQ Test",
      scheduleStatus: "TEST ONLY",
      subjectToChange: true,
      verificationStatus: "TEST ONLY — NOT A REAL GAME",
      sourceTier: "LocalScoresHQ test",
      notes: "Temporary notification test for the Suitland favorite-team alert. Remove after confirmation.",
      sourceUrl: "",
      lastChecked: "2026-10-12",
      notificationTest: true,
    },
  ];
}
