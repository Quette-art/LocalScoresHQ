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

  const winPct = completedGames.length > 0
    ? (wins / completedGames.length)
    : 0;

  const streak = (() => {
    if (last5.length === 0) return "-";
    const results = completedGames
      .slice()
      .reverse()
      .map((g) => {
        const isTeam1 = g.team1 === teamName;
        const teamScore = isTeam1 ? Number(g.score1) : Number(g.score2);
        const oppScore = isTeam1 ? Number(g.score2) : Number(g.score1);
        if (teamScore > oppScore) return "W";
        if (teamScore < oppScore) return "L";
        return "T";
      });
    const type = results[0];
    let count = 0;
    for (const r of results) {
      if (r === type) count++;
      else break;
    }
    return `${type}${count}`;
  })();

  // Combined schedule: every game, chronological, past + upcoming
  const scheduleGames = teamGames
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date));

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
          {(teamName || "").substring(0, 2).toUpperCase() || "?"}
        </div>

        <div className="team-header-info">
          <h1>{teamName || "Unknown Team"}</h1>

          <span>
            {ageGroup} • {division}
          </span>
        </div>
      </div>

      {/* STANDINGS — MaxPreps-style record box */}
      <div className="team-section">
        <h2>Standings</h2>

        <div className="maxpreps-record-grid">
          <div className="maxpreps-record-box">
            <span className="maxpreps-record-label">Overall</span>
            <strong className="maxpreps-record-value">
              {wins}-{losses}{ties > 0 ? `-${ties}` : ""}
            </strong>
            <span className="maxpreps-record-sub">
              {(winPct * 1000 / 1000).toFixed(3)} Win Pct
            </span>
          </div>

          <div className="maxpreps-record-box">
            <span className="maxpreps-record-label">Division</span>
            <strong className="maxpreps-record-value">{division}</strong>
            <span className="maxpreps-record-sub">{ageGroup}</span>
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
              <strong className={diff > 0 ? "diff-pos" : diff < 0 ? "diff-neg" : ""}>
                {diff > 0 ? "+" : ""}{diff}
              </strong>
            </div>
            <div className="maxpreps-mini-stat">
              <span>Streak</span>
              <strong>{streak}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* SCHEDULE — MaxPreps-style table, past + upcoming combined */}
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

            {scheduleGames.map((g) => {
              const isTeam1 = g.team1 === teamName;
              const opponent = isTeam1 ? g.team2 : g.team1;
              const isPlayed =
                g.score1 !== null &&
                g.score1 !== undefined &&
                g.score2 !== null &&
                g.score2 !== undefined;
              const teamScore = isTeam1 ? g.score1 : g.score2;
              const oppScore = isTeam1 ? g.score2 : g.score1;
              const result = isPlayed ? getResult(g) : null;

              return (
                <div key={g.id} className="maxpreps-schedule-row">
                  <div className="maxpreps-schedule-date">
                    <span>{formatDate(g.date)}</span>
                    <span className="maxpreps-schedule-time">{g.time}</span>
                  </div>

                  <div className="maxpreps-schedule-opponent">
                    vs {opponent}
                  </div>

                  <div className="maxpreps-schedule-info">
                    {isPlayed ? (
                      <span className={`maxpreps-result-tag ${
                        result === "W" ? "tag-win" : result === "L" ? "tag-loss" : "tag-tie"
                      }`}>
                        {result} {teamScore}-{oppScore}
                      </span>
                    ) : (
                      <span className="maxpreps-result-tag tag-upcoming">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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