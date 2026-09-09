import React, { useState } from "react";
import TeamMascot from "../components/TeamMascot";
import ExactBatchLogo, { isExactBatchTeam } from "../components/ExactBatchLogo";
import "../components/ScoresTab.css";
import "./TeamProfileMobileFix.css";
import "./TeamProfileFeatures.css";

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
        const teamScore = Number(isTeam1 ? game.score1 : game.score2);
        const opponentScore = Number(isTeam1 ? game.score2 : game.score1);

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextGame = scheduleGames.find((game) => {
    const gameDate = new Date(`${game.date}T00:00:00`);
    const isPlayed =
      game.score1 !== null && game.score1 !== undefined &&
      game.score2 !== null && game.score2 !== undefined;
    const status = String(game.status || game.scheduleStatus || "").toLowerCase();
    return gameDate >= today && !isPlayed && !status.includes("cancel");
  });

  const recentResults = completedGames
    .slice()
    .sort((a, b) => new Date(`${b.date}T00:00:00`) - new Date(`${a.date}T00:00:00`))
    .slice(0, 5);

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
    const teamScore = Number(isTeam1 ? game.score1 : game.score2);
    const opponentScore = Number(isTeam1 ? game.score2 : game.score1);

    if (teamScore > opponentScore) return "W";
    if (teamScore < opponentScore) return "L";
    return "T";
  };

  const getOpponent = (game) =>
    game.team1 === teamName ? game.team2 : game.team1;

  const getTeamScore = (game) =>
    game.team1 === teamName ? game.score1 : game.score2;

  const getOpponentScore = (game) =>
    game.team1 === teamName ? game.score2 : game.score1;

  const getScheduleBadge = (game) => {
    const status = String(game.status || game.scheduleStatus || "").toLowerCase();
    const notes = String(game.notes || "").toLowerCase();

    if (status.includes("cancel")) return "CANCELED";
    if (status.includes("postpon")) return "POSTPONED";
    if (notes.includes("moved") || notes.includes("reschedul")) return "MOVED";
    if (notes.includes("time change") || notes.includes("time updated")) return "TIME CHANGED";
    if (game.subjectToChange) return "SCHEDULE UPDATE";
    return "";
  };

  return (
    <div className="team-profile">
      <div className="teamProfileTopBar">
        <button type="button" className="back-btn" onClick={onBack}>
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
            aria-label={isFavorite ? "Remove team from favorites" : "Add team to favorites"}
            onClick={toggleFavorite}
          >
            {isFavorite ? "⭐" : "☆"}
          </button>
        </div>
      </div>

      <div className="team-header">
        {isExactBatchTeam(teamName) ? (
          <ExactBatchLogo
            teamName={teamName}
            variant="full"
            className="team-logo"
          />
        ) : (
          <TeamMascot
            teamName={teamName}
            className={`team-logo ${teamName === "Benedictine" ? "team-logo-benedictine" : ""}`}
          />
        )}

        <div className="team-header-info">
          <div className="team-name-record-row">
            <h1>{teamName || "Unknown Team"}</h1>
            <span className="team-header-record">
              {wins}-{losses}{ties > 0 ? `-${ties}` : ""}
            </span>
          </div>

          <span>
            {ageGroup || "Varsity"} Football • {conferenceName}
          </span>
        </div>
      </div>

      {nextGame && (
        <div className="team-section team-feature-section">
          <div className="team-feature-title-row">
            <h2>Next Game</h2>
            {getScheduleBadge(nextGame) && (
              <span className="schedule-change-badge">{getScheduleBadge(nextGame)}</span>
            )}
          </div>
          <button
            type="button"
            className="next-game-card"
            onClick={() => onGameClick?.(nextGame)}
          >
            <div>
              <span className="next-game-kicker">
                {nextGame.team1 === teamName ? "VS" : "AT"}
              </span>
              <strong>{getOpponent(nextGame)}</strong>
            </div>
            <div className="next-game-meta">
              <span>{formatDate(nextGame.date)}</span>
              <span>{nextGame.time || "TBD"}</span>
              <span>{nextGame.location || "Location TBD"}</span>
            </div>
          </button>
        </div>
      )}

      {recentResults.length > 0 && (
        <div className="team-section team-feature-section">
          <h2>Recent Results</h2>
          <div className="recent-results-list">
            {recentResults.map((game) => {
              const result = getResult(game);
              return (
                <button
                  type="button"
                  key={`recent-${game.id}`}
                  className="recent-result-row"
                  onClick={() => onGameClick?.(game)}
                >
                  <span className={`recent-result-letter result-${result.toLowerCase()}`}>{result}</span>
                  <span className="recent-result-opponent">{getOpponent(game)}</span>
                  <strong>{getTeamScore(game)}-{getOpponentScore(game)}</strong>
                  <span className="recent-result-date">{formatDate(game.date)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="team-section">
        <h2>Standings</h2>

        <div className="maxpreps-record-grid">
          <div className="maxpreps-record-box">
            <span className="maxpreps-record-label">Overall</span>
            <strong className="maxpreps-record-value">
              {wins}-{losses}{ties > 0 ? `-${ties}` : ""}
            </strong>
            <span className="maxpreps-record-sub">
              {winPct.toFixed(3)} Win Pct
            </span>
          </div>

          <div className="maxpreps-record-box">
            <span className="maxpreps-record-label">Conference</span>
            <strong className="maxpreps-record-value">
              {conferenceWins}-{conferenceLosses}
              {conferenceTies > 0 ? `-${conferenceTies}` : ""}
            </strong>
            <span className="maxpreps-record-sub">{conferenceName}</span>
          </div>
        </div>
      </div>

      {showAlerts && (
        <div className="scoreModalOverlay" onClick={() => setShowAlerts(false)}>
          <div className="scoreModal" onClick={(event) => event.stopPropagation()}>
            <h2>{teamName} Alerts</h2>

            <label>
              <input
                type="checkbox"
                checked={teamAlertSettings.gameStart}
                onChange={() => toggleAlert("gameStart")}
              />
              Game start alerts
            </label>

            <label>
              <input
                type="checkbox"
                checked={teamAlertSettings.gameFinished}
                onChange={() => toggleAlert("gameFinished")}
              />
              Final score alerts
            </label>

            <button type="button" onClick={() => setShowAlerts(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
