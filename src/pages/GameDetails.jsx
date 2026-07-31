import React, { useEffect, useMemo, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../components/ScoresTab.css";

const getInitials = (teamName = "") =>
  teamName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const GameDetails = ({
  game,
  games = [],
  onBack,
  onTeamClick,
  isAdmin,
  onScoreSaved,
}) => {
  const savedGame = useMemo(() => {
    if (game) return game;

    try {
      const stored = sessionStorage.getItem("selectedGame");
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      const freshMatch = games.find((item) => item.id === parsed.id);

      return freshMatch || parsed;
    } catch {
      return null;
    }
  }, [game, games]);

  const [localGame, setLocalGame] = useState(savedGame);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [team1Score, setTeam1Score] = useState("");
  const [team2Score, setTeam2Score] = useState("");

  useEffect(() => {
    if (!savedGame) return;

    setLocalGame(savedGame);
    setTeam1Score(savedGame.score1 ?? "");
    setTeam2Score(savedGame.score2 ?? "");
  }, [savedGame]);

  if (!localGame) {
    return (
      <div className="game-details-page">
        <button type="button" className="game-details-action" onClick={onBack}>
          ← Back
        </button>

        <section className="game-details-empty">
          <span>GAME NOT FOUND</span>
          <h1>No game selected</h1>
          <p>
            This can happen if the page was refreshed before a game was opened.
          </p>
        </section>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBD";

    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getAgeGroup = (gameData) => {
    if (gameData.ageGroup) return gameData.ageGroup;

    if (gameData.division) {
      return (
        gameData.division.split(" / ")[0] ||
        gameData.division.split(" ")[0]
      );
    }

    return "Unknown";
  };

  const isFinal =
    localGame.score1 !== null &&
    localGame.score1 !== undefined &&
    localGame.score2 !== null &&
    localGame.score2 !== undefined;

  const score1 = Number(localGame.score1);
  const score2 = Number(localGame.score2);

  const team1Won = isFinal && score1 > score2;
  const team2Won = isFinal && score2 > score1;
  const isTie = isFinal && score1 === score2;

  const openScoreModal = () => {
    setTeam1Score(localGame.score1 ?? "");
    setTeam2Score(localGame.score2 ?? "");
    setShowScoreModal(true);
  };

  const shareGame = async () => {
    const text = `${localGame.team1} vs ${localGame.team2} • ${
      localGame.sport || "Game"
    } • ${formatDate(localGame.date)} • ${
      localGame.time || "TBD"
    } • ${localGame.location || "Location TBD"}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${localGame.team1} vs ${localGame.team2}`,
          text,
          url: window.location.href,
        });
        return;
      }

      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      alert("Game link copied.");
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error(error);
      }
    }
  };

  const saveScore = async () => {
    if (team1Score === "" || team2Score === "") {
      alert("Please enter both scores.");
      return;
    }

    const updatedGame = {
      ...localGame,
      score1: Number(team1Score),
      score2: Number(team2Score),
    };

    try {
      setLocalGame(updatedGame);
      sessionStorage.setItem("selectedGame", JSON.stringify(updatedGame));
      onScoreSaved?.(updatedGame);

      await setDoc(
        doc(db, "scores", localGame.id),
        {
          gameId: localGame.id,
          score1: Number(team1Score),
          score2: Number(team2Score),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setShowScoreModal(false);
      alert("Score saved.");
    } catch (error) {
      console.error(error);
      alert("Failed to save score.");
    }
  };

  const renderTeam = ({
    teamName,
    score,
    winner,
    onClick,
    side,
  }) => (
    <button
      type="button"
      className={`game-details-team ${
        winner ? "game-details-team-winner" : ""
      }`}
      onClick={onClick}
    >
      <div className="game-details-team-identity">
        <span
          className={`game-details-team-logo game-details-team-logo-${side}`}
        >
          {getInitials(teamName)}
        </span>

        <div>
          {winner && <span className="game-details-winner-label">Winner</span>}
          {isTie && <span className="game-details-winner-label">Tie</span>}
          <strong>{teamName}</strong>
        </div>
      </div>

      <span className="game-details-team-score">
        {isFinal ? score : "–"}
      </span>
    </button>
  );

  return (
    <div className="game-details-page">
      <div className="game-details-actions">
        <button
          type="button"
          className="game-details-action"
          onClick={onBack}
        >
          <span>←</span>
          Back
        </button>

        <button
          type="button"
          className="game-details-action"
          onClick={shareGame}
        >
          Share
          <span>↗</span>
        </button>
      </div>

      <section className="game-details-card">
        <div className="game-details-header">
          <div>
            <div className="game-details-badges">
              <span
                className={`game-details-status ${
                  isFinal ? "is-final" : "is-upcoming"
                }`}
              >
                {isFinal ? "FINAL" : "UPCOMING"}
              </span>

              <span className="game-details-sport">
                {localGame.sport || "Soccer"}
              </span>
            </div>

            <p className="game-details-date">
              {formatDate(localGame.date)}
              <span>•</span>
              {localGame.time || "TBD"}
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              className="game-details-edit-score"
              onClick={openScoreModal}
            >
              {isFinal ? "Edit Score" : "Report Score"}
            </button>
          )}
        </div>

        <div className="game-details-matchup">
          {renderTeam({
            teamName: localGame.team1,
            score: localGame.score1,
            winner: team1Won,
            side: "one",
            onClick: () => onTeamClick?.(localGame, localGame.team1),
          })}

          <div className="game-details-score-divider">
            <span>{isFinal ? "FINAL" : "VS"}</span>
          </div>

          {renderTeam({
            teamName: localGame.team2,
            score: localGame.score2,
            winner: team2Won,
            side: "two",
            onClick: () => onTeamClick?.(localGame, localGame.team2),
          })}
        </div>

        <div className="game-details-info-grid">
          <article className="game-details-info-card">
            <span className="game-details-info-icon">📍</span>
            <div>
              <span>Location</span>
              <strong>{localGame.location || "TBD"}</strong>
            </div>
          </article>

          <article className="game-details-info-card">
            <span className="game-details-info-icon">🏆</span>
            <div>
              <span>Division</span>
              <strong>{localGame.division || "Unknown"}</strong>
            </div>
          </article>

          <article className="game-details-info-card">
            <span className="game-details-info-icon">👥</span>
            <div>
              <span>Age Group</span>
              <strong>{getAgeGroup(localGame)}</strong>
            </div>
          </article>

          <article className="game-details-info-card">
            <span className="game-details-info-icon">●</span>
            <div>
              <span>Status</span>
              <strong>{isFinal ? "Final" : "Scheduled"}</strong>
            </div>
          </article>
        </div>
      </section>

      {showScoreModal && (
        <div className="scoreModalOverlay">
          <div className="scoreModal">
            <h2>{isFinal ? "Edit Score" : "Report Score"}</h2>
            <p>
              {localGame.team1} vs {localGame.team2}
            </p>

            <div className="scoreInputs">
              <label>
                <span>{localGame.team1}</span>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={team1Score}
                  onChange={(event) => setTeam1Score(event.target.value)}
                />
              </label>

              <label>
                <span>{localGame.team2}</span>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={team2Score}
                  onChange={(event) => setTeam2Score(event.target.value)}
                />
              </label>
            </div>

            <div className="scoreModalButtons">
              <button
                type="button"
                className="cancelScoreBtn"
                onClick={() => setShowScoreModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="saveScoreBtn"
                onClick={saveScore}
              >
                Save Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetails;