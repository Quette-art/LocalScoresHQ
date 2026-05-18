import React, { useState } from "react";
import "../components/ScoresTab.css";

export default function TeamProfile({
  teamName,
  division,
  ageGroup,
  games,
  onBack,
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
      updated = favoriteTeams.filter((t) => t !== teamKey);
    } else {
      updated = [...favoriteTeams, teamKey];
    }

    setFavoriteTeams(updated);

    localStorage.setItem(
      "favoriteTeams",
      JSON.stringify(updated)
    );
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

    localStorage.setItem(
      "teamAlerts",
      JSON.stringify(updatedAlerts)
    );
  };

  const teamGames = games.filter(
    (g) =>
      (g.team1 === teamName || g.team2 === teamName) &&
      g.division === division
  );

  const completedGames = teamGames.filter(
    (g) =>
      g.score1 !== null &&
      g.score2 !== null &&
      g.score1 !== undefined &&
      g.score2 !== undefined
  );

  const upcomingGames = teamGames.filter(
    (g) =>
      g.score1 === null ||
      g.score2 === null ||
      g.score1 === undefined ||
      g.score2 === undefined
  );

  let wins = 0;
  let losses = 0;
  let ties = 0;
  let pf = 0;
  let pa = 0;

  completedGames.forEach((g) => {
    const isTeam1 = g.team1 === teamName;

    const teamScore = Number(
      isTeam1 ? g.score1 : g.score2
    );

    const oppScore = Number(
      isTeam1 ? g.score2 : g.score1
    );

    pf += teamScore;
    pa += oppScore;

    if (teamScore > oppScore) wins++;
    else if (teamScore < oppScore) losses++;
    else ties++;
  });

  const points = wins * 3 + ties;

  const diff = pf - pa;

  const last5 = completedGames.slice(-5).reverse();

  const formatDate = (date) => {
    const d = new Date(date + "T00:00:00");

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getResult = (g) => {
    const isTeam1 = g.team1 === teamName;

    const teamScore = isTeam1
      ? Number(g.score1)
      : Number(g.score2);

    const oppScore = isTeam1
      ? Number(g.score2)
      : Number(g.score1);

    if (teamScore > oppScore) return "W";

    if (teamScore < oppScore) return "L";

    return "T";
  };

  return (
    <div className="team-profile">

      {/* TOP BAR */}
      <div className="teamProfileTopBar">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>

        <div className="teamProfileActions">
          <button
            className="alert-btn"
            onClick={() => setShowAlerts(true)}
          >
            🔔
          </button>

          <button
            className="favorite-btn"
            onClick={toggleFavorite}
          >
            {isFavorite ? "⭐" : "☆"}
          </button>
        </div>
      </div>

      {/* HEADER */}
      <div className="team-header">
        <div className="team-logo">
          {teamName.substring(0, 2).toUpperCase()}
        </div>

        <div className="team-header-info">
          <h1>{teamName}</h1>

          <span>
            {ageGroup} • {division}
          </span>
        </div>
      </div>

      {/* STATS */}
      <div className="team-stats">
        <div className="stat-card">
          <span>Record</span>
          <strong>
            {wins}-{losses}-{ties}
          </strong>
        </div>

        <div className="stat-card">
          <span>PTS</span>
          <strong>{points}</strong>
        </div>

        <div className="stat-card">
          <span>PF</span>
          <strong>{pf}</strong>
        </div>

        <div className="stat-card">
          <span>PA</span>
          <strong>{pa}</strong>
        </div>

        <div className="stat-card">
          <span>DIFF</span>
          <strong>{diff}</strong>
        </div>
      </div>

      {/* LAST 5 */}
      <div className="team-section">
        <h2>Last 5</h2>

        <div className="last5-row">
          {last5.length === 0 ? (
            <p className="no-games">
              No completed games.
            </p>
          ) : (
            last5.map((g, i) => {
              const result = getResult(g);

              return (
                <div
                  key={i}
                  className={`result-circle ${
                    result === "W"
                      ? "result-win"
                      : result === "L"
                      ? "result-loss"
                      : "result-tie"
                  }`}
                >
                  {result}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* PREVIOUS GAMES */}
      <div className="team-section">
        <h2>Previous Games</h2>

        {completedGames.length === 0 ? (
          <p className="no-games">
            No completed games.
          </p>
        ) : (
          completedGames
            .slice()
            .reverse()
            .map((g) => (
              <div key={g.id} className="game-row">
                <div>
                  <strong>
                    {g.team1} vs {g.team2}
                  </strong>

                  <p>
                    {formatDate(g.date)} • {g.time}
                  </p>
                </div>

                <div className="game-result">
                  <strong>
                    {g.score1} - {g.score2}
                  </strong>
                </div>
              </div>
            ))
        )}
      </div>

      {/* UPCOMING */}
      <div className="team-section">
        <h2>Upcoming</h2>

        {upcomingGames.length === 0 ? (
          <p className="no-games">
            No upcoming games.
          </p>
        ) : (
          upcomingGames.map((g) => (
            <div key={g.id} className="game-row">
              <div>
                <strong>
                  {g.team1} vs {g.team2}
                </strong>

                <p>
                  {formatDate(g.date)} • {g.time}
                </p>
              </div>

              <span className="status upcoming">
                UPCOMING
              </span>
            </div>
          ))
        )}
      </div>

      {/* ALERTS MODAL */}
      {showAlerts && (
        <div
          className="alertsOverlay"
          onClick={() => setShowAlerts(false)}
        >
          <div
            className="alertsSheet"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Alerts</h2>

            <div className="alertRow">
              <span>Game Start</span>

              <button
                className={`toggleBtn ${
                  teamAlertSettings.gameStart
                    ? "toggleOn"
                    : ""
                }`}
                onClick={() =>
                  toggleAlert("gameStart")
                }
              >
                {teamAlertSettings.gameStart
                  ? "ON"
                  : "OFF"}
              </button>
            </div>

            <div className="alertRow">
              <span>Game Finished</span>

              <button
                className={`toggleBtn ${
                  teamAlertSettings.gameFinished
                    ? "toggleOn"
                    : ""
                }`}
                onClick={() =>
                  toggleAlert("gameFinished")
                }
              >
                {teamAlertSettings.gameFinished
                  ? "ON"
                  : "OFF"}
              </button>
            </div>

            <button
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