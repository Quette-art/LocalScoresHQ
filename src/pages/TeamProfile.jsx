import React, { useState } from "react";
import "../components/ScoresTab.css";

const DCIAA_TEAMS = new Set([
  "Anacostia",
  "Ballou",
  "Bell",
  "Cardozo",
  "Coolidge",
  "Dunbar",
  "Eastern",
  "H.D. Woodson",
  "Jackson-Reed",
  "McKinley Tech",
  "Phelps ACE",
  "Ron Brown",
  "Roosevelt",
]);

const WCAC_TEAMS = new Set([
  "Archbishop Carroll",
  "Bishop McNamara",
  "DeMatha",
  "Gonzaga",
  "Good Counsel",
  "St. John's",
]);

export default function TeamProfile({
  teamName,
  division,
  ageGroup,
  games,
  onBack,
  onGameClick,
}) {
  const [favoriteTeams, setFavoriteTeams] = useState(
    JSON.parse(localStorage.getItem("favoriteTeams")) || []
  );

  const [showAlerts, setShowAlerts] = useState(false);

  const [alerts, setAlerts] = useState(
    JSON.parse(localStorage.getItem("teamAlerts")) || {}
  );

  const teamKey = `${teamName}-${division}`;
  const isFavorite = favoriteTeams.includes(teamKey);

  const teamAlertSettings = alerts[teamKey] || {
    gameStart: false,
    gameFinished: false,
  };

  const toggleFavorite = () => {
    let updated;

    if (isFavorite) {
      updated = favoriteTeams.filter((team) => team !== teamKey);
    } else {
      updated = [...favoriteTeams, teamKey];
    }

    setFavoriteTeams(updated);
    localStorage.setItem("favoriteTeams", JSON.stringify(updated));
  };

  const toggleAlert = (type) => {
    const updatedAlerts = {
      ...alerts,
      [teamKey]: {
        ...teamAlertSettings,
        [type]: !teamAlertSettings[type],
      },
    };

    setAlerts(updatedAlerts);
    localStorage.setItem("teamAlerts", JSON.stringify(updatedAlerts));
  };

  const teamGames = games.filter(
    (game) =>
      (game.team1 === teamName || game.team2 === teamName) &&
      game.division === division
  );

  const completedGames = teamGames.filter(
    (game) =>
      game.score1 !== null &&
      game.score2 !== null &&
      game.score1 !== undefined &&
      game.score2 !== undefined
  );

  const conferenceName = DCIAA_TEAMS.has(teamName)
    ? "DCIAA"
    : WCAC_TEAMS.has(teamName)
      ? "WCAC"
      : "Independent";

  const isConferenceGame = (game) => {
    const notes = String(game.notes || "").toUpperCase();

    return (
      conferenceName !== "Independent" &&
      notes.includes(conferenceName)
    );
  };

  const conferenceGames = completedGames.filter(isConferenceGame);

  let conferenceWins = 0;
  let conferenceLosses = 0;
  let conferenceTies = 0;

  conferenceGames.forEach((game) => {
    const isTeam1 = game.team1 === teamName;
    const teamScore = Number(isTeam1 ? game.score1 : game.score2);
    const opponentScore = Number(isTeam1 ? game.score2 : game.score1);

    if (teamScore > opponentScore) {
      conferenceWins += 1;
    } else if (teamScore < opponentScore) {
      conferenceLosses += 1;
    } else {
      conferenceTies += 1;
    }
  });

  let wins = 0;
  let losses = 0;
  let ties = 0;
  let pf = 0;
  let pa = 0;

  completedGames.forEach((game) => {
    const isTeam1 = game.team1 === teamName;
    const teamScore = Number(isTeam1 ? game.score1 : game.score2);
    const opponentScore = Number(isTeam1 ? game.score2 : game.score1);

    pf += teamScore;
    pa += opponentScore;

    if (teamScore > opponentScore) {
      wins += 1;
    } else if (teamScore < opponentScore) {
      losses += 1;
    } else {
      ties += 1;
    }
  });

  const diff = pf - pa;
  const lastFive = completedGames.slice(-5).reverse();

  const winPct =
    completedGames.length > 0 ? wins / completedGames.length : 0;

  const streak = (() => {
    if (lastFive.length === 0) {
      return "-";
    }

    const results = completedGames
      .slice()
      .reverse()
      .map((game) => {
        const isTeam1 = game.team1 === teamName;
        const teamScore = Number(
          isTeam1 ? game.score1 : game.score2
        );
        const opponentScore = Number(
          isTeam1 ? game.score2 : game.score1
        );

        if (teamScore > opponentScore) return "W";
        if (teamScore < opponentScore) return "L";
        return "T";
      });

    const resultType = results[0];
    let count = 0;

    for (const result of results) {
      if (result === resultType) {
        count += 1;
      } else {
        break;
      }
    }

    return `${resultType}${count}`;
  })();

  const scheduleGames = teamGames
    .slice()
    .sort((firstGame, secondGame) => {
      return new Date(firstGame.date) - new Date(secondGame.date);
    });

  const formatDate = (date) => {
    const formattedDate = new Date(`${date}T00:00:00`);

      return formattedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getResult = (game) => {
    const isTeam1 = game.team1 === teamName;

    const teamScore = Number(
      isTeam1 ? game.score1 : game.score2
    );

    const opponentScore = Number(
      isTeam1 ? game.score2 : game.score1
    );

    if (teamScore > opponentScore) return "W";
    if (teamScore < opponentScore) return "L";

    return "T";
  };

  return (
    <div className="team-profile">
      <div className="teamProfileTopBar">
        <button
          type="button"
          className="back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="teamProfileActions">
          <button
            type="button"
            className="alert-btn"
            aria-label="Manage team alerts"
            onClick={() => setShowAlerts(true)}
          >
            🔔
          </button>

          <button
            type="button"
            className="favorite-btn"
            aria-label={
              isFavorite
                ? "Remove team from favorites"
                : "Add team to favorites"
            }
            onClick={toggleFavorite}
          >
            {isFavorite ? "⭐" : "☆"}
          </button>
        </div>
      </div>

      <div className="team-header">
        <div className="team-logo">
          {(teamName || "").substring(0, 2).toUpperCase() || "?"}
        </div>

        <div className="team-header-info">
          <h1>{teamName || "Unknown Team"}</h1>

          <span>
            {ageGroup || "Varsity"} Football • {conferenceName}
          </span>
        </div>
      </div>

      <div className="team-section">
        <h2>Standings</h2>

        <div className="maxpreps-record-grid">
          <div className="maxpreps-record-box">
            <span className="maxpreps-record-label">
              Overall
            </span>

            <strong className="maxpreps-record-value">
              {wins}-{losses}
              {ties > 0 ? `-${ties}` : ""}
            </strong>

            <span className="maxpreps-record-sub">
              {winPct.toFixed(3)} Win Pct
            </span>
          </div>

          <div className="maxpreps-record-box">
            <span className="maxpreps-record-label">
              Conference
            </span>

            <strong className="maxpreps-record-value">
              {conferenceWins}-{conferenceLosses}
              {conferenceTies > 0 ? `-${conferenceTies}` : ""}
            </strong>

            <span className="maxpreps-record-sub">
              {conferenceName}
            </span>
          </div>

          <div className="maxpreps-record-mini-grid">
            <div className="maxpreps-mini-stat">
              <span>PF</span>
              <strong>{pf}</strong>
            </div>

            <div className="maxpreps-mini-stat">
              <span>PA</span>
              <strong>{pa}</strong>
            </div>

            <div className="maxpreps-mini-stat">
              <span>DIFF</span>

              <strong
                className={
                  diff > 0
                    ? "diff-pos"
                    : diff < 0
                      ? "diff-neg"
                      : ""
                }
              >
                {diff > 0 ? "+" : ""}
                {diff}
              </strong>
            </div>

            <div className="maxpreps-mini-stat">
              <span>Streak</span>
              <strong>{streak}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="team-section">
        <h2>Schedule</h2>

        {scheduleGames.length === 0 ? (
          <p className="no-games">No games scheduled.</p>
        ) : (
          <div className="maxpreps-schedule-table">
            <div className="maxpreps-schedule-header-row">
              <span>Date/Time</span>
              <span>Opponent</span>
              <span>Game Info</span>
            </div>

            {scheduleGames.map((game) => {
              const isTeam1 = game.team1 === teamName;
              const opponent = isTeam1
                ? game.team2
                : game.team1;

              const isPlayed =
                game.score1 !== null &&
                game.score1 !== undefined &&
                game.score2 !== null &&
                game.score2 !== undefined;

              const teamScore = isTeam1
                ? game.score1
                : game.score2;

              const opponentScore = isTeam1
                ? game.score2
                : game.score1;

              const result = isPlayed
                ? getResult(game)
                : null;

              return (
                <button
  type="button"
  key={game.id}
  className="maxpreps-schedule-row"
  onClick={() => onGameClick?.(game)}
  aria-label={`Open ${teamName} ${
    isTeam1 ? "versus" : "at"
  } ${opponent} game details`}
>
                  <div className="maxpreps-schedule-date">
                    <span>{formatDate(game.date)}</span>

                    <span className="maxpreps-schedule-time">
                      {game.time}
                    </span>
                  </div>

                  <div className="maxpreps-schedule-opponent">
                    <span className="scheduleVenue">
                      {isTeam1 ? "vs" : "at"}
                    </span>

                    <span>{opponent}</span>
                  </div>

                  <div className="maxpreps-schedule-info">
                    {isPlayed ? (
                      <span
                        className={`maxpreps-result-tag ${
                          result === "W"
                            ? "tag-win"
                            : result === "L"
                              ? "tag-loss"
                              : "tag-tie"
                        }`}
                      >
                        {result} {teamScore}-{opponentScore}
                      </span>
                    ) : (
                      <span className="maxpreps-result-tag tag-upcoming">
                        Upcoming
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
                    </div>
        )}
      </div>

      {showAlerts && (
        <div
          className="alertsOverlay"
          onClick={() => setShowAlerts(false)}
        >
          <div
            className="alertsSheet"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Team Alerts</h2>

            <div className="alertRow">
              <span>Game Start</span>

              <button
                type="button"
                className={`toggleBtn ${
                  teamAlertSettings.gameStart
                    ? "toggleOn"
                    : ""
                }`}
                onClick={() => toggleAlert("gameStart")}
              >
                {teamAlertSettings.gameStart ? "ON" : "OFF"}
              </button>
            </div>

            <div className="alertRow">
              <span>Game Finished</span>

              <button
                type="button"
                className={`toggleBtn ${
                  teamAlertSettings.gameFinished
                    ? "toggleOn"
                    : ""
                }`}
                onClick={() => toggleAlert("gameFinished")}
              >
                {teamAlertSettings.gameFinished ? "ON" : "OFF"}
              </button>
            </div>

            <button
              type="button"
              className="closeAlertsBtn"
              onClick={() => setShowAlerts(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}