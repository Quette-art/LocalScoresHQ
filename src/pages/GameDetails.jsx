import React, { useEffect, useMemo, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../components/ScoresTab.css";

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

      const freshMatch = games.find(
        (g) => g.id === parsed.id
      );

      return freshMatch || parsed;
    } catch {
      return null;
    }
  }, [game, games]);

  const [localGame, setLocalGame] = useState(savedGame);

  const [showScoreModal, setShowScoreModal] =
    useState(false);

  const [team1Score, setTeam1Score] = useState("");
  const [team2Score, setTeam2Score] = useState("");

  useEffect(() => {
    if (savedGame) {
      setLocalGame(savedGame);

      setTeam1Score(savedGame.score1 ?? "");
      setTeam2Score(savedGame.score2 ?? "");
    }
  }, [savedGame]);

  if (!localGame) {
    return (
      <div className="game-details-page">
        <button
          type="button"
          className="profile-back-link"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="game-details-hero">
          <div className="game-details-pill">
            GAME NOT FOUND
          </div>

          <h1>No game selected</h1>

          <p className="game-details-sub">
            This can happen if the page was refreshed
            before a game was opened.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(
      dateString + "T00:00:00"
    );

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getAgeGroup = (gameData) => {
    if (gameData.ageGroup)
      return gameData.ageGroup;

    if (gameData.division) {
      return (
        gameData.division.split(" / ")[0] ||
        gameData.division.split(" ")[0]
      );
    }

    return "Unknown";
  };

  const isFinal =
    localGame.score1 != null &&
    localGame.score2 != null;

  const team1Won =
    isFinal &&
    Number(localGame.score1) >
      Number(localGame.score2);

  const team2Won =
    isFinal &&
    Number(localGame.score2) >
      Number(localGame.score1);

  const isTie =
    isFinal &&
    Number(localGame.score1) ===
      Number(localGame.score2);

  const openScoreModal = () => {
    setTeam1Score(localGame.score1 ?? "");
    setTeam2Score(localGame.score2 ?? "");

    setShowScoreModal(true);
  };

  const saveScore = async () => {
    if (
      team1Score === "" ||
      team2Score === ""
    ) {
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

      sessionStorage.setItem(
        "selectedGame",
        JSON.stringify(updatedGame)
      );

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

  return (
    <div className="game-details-page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <button
          type="button"
          className="profile-back-link"
          onClick={onBack}
        >
          ← Back
        </button>

        <button
          type="button"
          className="profile-back-link"
          onClick={() => {
            const text = `${localGame.team1} vs ${localGame.team2} • ${localGame.sport} • ${localGame.date} • ${localGame.time} • ${localGame.location}`;
            if (navigator.share) {
              navigator.share({
                title: `${localGame.team1} vs ${localGame.team2}`,
                text: text,
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(
                `${text}\n${window.location.href}`
              );
              alert("Copied to clipboard!");
            }
          }}
        >
          Share 📤
        </button>
      </div>

      <section className="game-details-hero">
        <div className="game-details-top-row">
          <div className="game-details-pill">
            {isFinal ? "FINAL" : "UPCOMING"}
          </div>

          <div className="game-details-sport-pill">
            {localGame.sport || "Soccer"}
          </div>
        </div>

        <div className="game-details-meta">
          {formatDate(localGame.date)} •{" "}
          {localGame.time || "TBD"}
        </div>

        <div className="game-details-teams">
          <button
            type="button"
            className={`game-details-team ${
              team1Won ? "winner" : ""
            }`}
            onClick={() =>
              onTeamClick?.(
                localGame,
                localGame.team1
              )
            }
          >
            <span>{localGame.team1}</span>

            {team1Won && (
              <small>Winner</small>
            )}
          </button>

          <div className="game-details-score">
            {isFinal ? (
              <>
                <strong>
                  {localGame.score1}
                </strong>

                <span>
                  {isTie ? "TIE" : "FINAL"}
                </span>

                <strong>
                  {localGame.score2}
                </strong>
              </>
            ) : (
              <>
                <strong>-</strong>
                <span>VS</span>
                <strong>-</strong>
              </>
            )}
          </div>

          <button
            type="button"
            className={`game-details-team ${
              team2Won ? "winner" : ""
            }`}
            onClick={() =>
              onTeamClick?.(
                localGame,
                localGame.team2
              )
            }
          >
            <span>{localGame.team2}</span>

            {team2Won && (
              <small>Winner</small>
            )}
          </button>
        </div>

        {isAdmin && (
          <button
            type="button"
            className="report-score-btn game-details-report-btn"
            onClick={openScoreModal}
          >
            {isFinal
              ? "Edit Score"
              : "Report Score"}
          </button>
        )}

        <div className="game-details-grid">
          <div className="game-info-tile">
            <span>Location</span>

            <strong>
              {localGame.location || "TBD"}
            </strong>
          </div>

          <div className="game-info-tile">
            <span>Division</span>

            <strong>
              {localGame.division ||
                "Unknown"}
            </strong>
          </div>

          <div className="game-info-tile">
            <span>Age Group</span>

            <strong>
              {getAgeGroup(localGame)}
            </strong>
          </div>

          <div className="game-info-tile">
            <span>Status</span>

            <strong>
              {isFinal
                ? "Final"
                : "Scheduled"}
            </strong>
          </div>
        </div>
      </section>

      {showScoreModal && (
        <div className="scoreModalOverlay">
          <div className="scoreModal">
            <h2>
              {isFinal
                ? "Edit Score"
                : "Report Score"}
            </h2>

            <p>
              {localGame.team1} vs{" "}
              {localGame.team2}
            </p>

            <div className="scoreInputs">
              <label>
                <span>
                  {localGame.team1}
                </span>

                <input
                  type="number"
                  inputMode="numeric"
                  value={team1Score}
                  onChange={(e) =>
                    setTeam1Score(
                      e.target.value
                    )
                  }
                />
              </label>

              <label>
                <span>
                  {localGame.team2}
                </span>

                <input
                  type="number"
                  inputMode="numeric"
                  value={team2Score}
                  onChange={(e) =>
                    setTeam2Score(
                      e.target.value
                    )
                  }
                />
              </label>
            </div>

            <div className="scoreModalButtons">
              <button
                type="button"
                className="cancelScoreBtn"
                onClick={() =>
                  setShowScoreModal(false)
                }
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