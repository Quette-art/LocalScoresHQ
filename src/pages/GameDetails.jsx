import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toBlob } from "html-to-image";
import {
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import "../components/ScoresTab.css";
import TeamMascot from "../components/TeamMascot";

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
      const stored =
        sessionStorage.getItem(
          "selectedGame"
        );

      if (!stored) return null;

      const parsed = JSON.parse(stored);

      const freshMatch = games.find(
        (item) => item.id === parsed.id
      );

      return freshMatch || parsed;
    } catch {
      return null;
    }
  }, [game, games]);

  const [localGame, setLocalGame] =
    useState(savedGame);

  const [
    showScoreModal,
    setShowScoreModal,
  ] = useState(false);

  const [team1Score, setTeam1Score] =
    useState("");

  const [team2Score, setTeam2Score] =
    useState("");

  const [
    showShareGraphic,
    setShowShareGraphic,
  ] = useState(false);

  const [
    graphicAction,
    setGraphicAction,
  ] = useState("");

  const shareCardRef = useRef(null);

  useEffect(() => {
    if (!savedGame) return;

    setLocalGame(savedGame);
    setTeam1Score(savedGame.score1 ?? "");
    setTeam2Score(savedGame.score2 ?? "");
  }, [savedGame]);

  if (!localGame) {
    return (
      <div className="game-details-page">
        <button
          type="button"
          className="game-details-action"
          onClick={onBack}
        >
          ← Back
        </button>

        <section className="game-details-empty">
          <span>GAME NOT FOUND</span>
          <h1>No game selected</h1>

          <p>
            This can happen if the page was
            refreshed before a game was
            opened.
          </p>
        </section>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBD";

    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const getAgeGroup = (gameData) => {
    if (gameData.ageGroup) {
      return gameData.ageGroup;
    }

    if (gameData.division) {
      return (
        gameData.division.split(
          " / "
        )[0] ||
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

  const score1 = Number(
    localGame.score1
  );

  const score2 = Number(
    localGame.score2
  );

  const team1Won =
    isFinal && score1 > score2;

  const team2Won =
    isFinal && score2 > score1;

  const isTie =
    isFinal && score1 === score2;

  const openScoreModal = () => {
    setTeam1Score(
      localGame.score1 ?? ""
    );

    setTeam2Score(
      localGame.score2 ?? ""
    );

    setShowScoreModal(true);
  };

  const shareGame = async () => {
    const text = `${
      localGame.team1
    } vs ${localGame.team2} • ${
      localGame.sport || "Game"
    } • ${formatDate(
      localGame.date
    )} • ${
      localGame.time || "TBD"
    } • ${
      localGame.location ||
      "Location TBD"
    }`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${localGame.team1} vs ${localGame.team2}`,
          text,
          url: window.location.href,
        });

        return;
      }

      await navigator.clipboard.writeText(
        `${text}\n${window.location.href}`
      );

      alert("Game link copied.");
    } catch (error) {
      if (
        error?.name !== "AbortError"
      ) {
        console.error(error);
      }
    }
  };

  const getGraphicFilename = () =>
    `${localGame.team1}-vs-${localGame.team2}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") + "-final.png";

  const waitForGraphicAssets = async () => {
    await document.fonts?.ready;

    const images = Array.from(
      shareCardRef.current?.querySelectorAll("img") || []
    );

    await Promise.all(
      images.map(async (image) => {
        if (!image.complete) {
          await new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          });
        }

        await image.decode?.().catch(() => {});
      })
    );
  };

  const createScoreGraphic = async () => {
    if (!shareCardRef.current) {
      throw new Error("Score graphic is not ready.");
    }

    await waitForGraphicAssets();

    const cardWidth = shareCardRef.current.offsetWidth;
    const pixelRatio = Math.max(2, 1080 / cardWidth);
    const blob = await toBlob(shareCardRef.current, {
      cacheBust: true,
      pixelRatio,
      backgroundColor: "#071426",
    });

    if (!blob) {
      throw new Error("Score graphic could not be created.");
    }

    return blob;
  };

  const downloadGraphic = (blob) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = getGraphicFilename();
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const saveScoreGraphic = async () => {
    setGraphicAction("saving");

    try {
      const blob = await createScoreGraphic();
      downloadGraphic(blob);
      setGraphicAction("saved");
    } catch (error) {
      console.error(error);
      setGraphicAction("error");
    }
  };

  const shareScoreGraphic = async () => {
    setGraphicAction("sharing");

    try {
      const blob = await createScoreGraphic();
      const file = new File([blob], getGraphicFilename(), {
        type: "image/png",
      });
      const shareData = {
        files: [file],
        title: `${localGame.team1} vs ${localGame.team2} final`,
        text: `Final score on LocalScoresHQ: ${localGame.team1} ${localGame.score1}, ${localGame.team2} ${localGame.score2}.`,
      };

      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        setGraphicAction("shared");
      } else {
        downloadGraphic(blob);
        setGraphicAction("saved");
      }
    } catch (error) {
      if (error?.name === "AbortError") {
        setGraphicAction("");
        return;
      }

      console.error(error);
      setGraphicAction("error");
    }
  };

  const saveScore = async () => {
    if (
      team1Score === "" ||
      team2Score === ""
    ) {
      alert(
        "Please enter both scores."
      );

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
        doc(
          db,
          "scores",
          localGame.id
        ),
        {
          gameId: localGame.id,
          score1: Number(team1Score),
          score2: Number(team2Score),
          updatedAt:
            new Date().toISOString(),
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
        winner
          ? "game-details-team-winner"
          : ""
      }`}
      onClick={onClick}
    >
      <div className="game-details-team-identity">
      
          <TeamMascot
  teamName={teamName}
  className={`game-details-team-logo game-details-team-logo-${side}`}
/>

        <div>
          {winner && (
            <span className="game-details-winner-label">
              Winner
            </span>
          )}

          {isTie && (
            <span className="game-details-winner-label">
              Tie
            </span>
          )}

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

        <div className="game-details-share-actions">
          {isFinal && (
            <button
              type="button"
              className="game-details-action game-details-action-primary"
              onClick={() => {
                setGraphicAction("");
                setShowShareGraphic(true);
              }}
            >
              Score Graphic
              <span>▣</span>
            </button>
          )}

          <button
            type="button"
            className="game-details-action"
            onClick={shareGame}
          >
            Share Link
            <span>↗</span>
          </button>
        </div>
      </div>

      <section className="game-details-card">
        <div className="game-details-header">
          <div>
            <div className="game-details-badges">
              <span
                className={`game-details-status ${
                  isFinal
                    ? "is-final"
                    : "is-upcoming"
                }`}
              >
                {isFinal
                  ? "FINAL"
                  : "UPCOMING"}
              </span>

              <span className="game-details-sport">
                {localGame.sport ||
                  "Soccer"}
              </span>

              {localGame.subjectToChange && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    background: "#fef3c7",
                    color: "#92400e",
                    border:
                      "1px solid #fcd34d",
                    borderRadius: "999px",
                    padding: "5px 9px",
                    fontSize: "10px",
                    fontWeight: 900,
                    letterSpacing: "0.4px",
                  }}
                >
                  SUBJECT TO CHANGE
                </span>
              )}
            </div>

            <p className="game-details-date">
              {formatDate(
                localGame.date
              )}

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
              {isFinal
                ? "Edit Score"
                : "Report Score"}
            </button>
          )}
        </div>

        <div className="game-details-matchup">
          {renderTeam({
            teamName: localGame.team1,
            score: localGame.score1,
            winner: team1Won,
            side: "one",
            onClick: () =>
              onTeamClick?.(
                localGame,
                localGame.team1
              ),
          })}

          <div className="game-details-score-divider">
            <span>
              {isFinal ? "FINAL" : "VS"}
            </span>
          </div>

          {renderTeam({
            teamName: localGame.team2,
            score: localGame.score2,
            winner: team2Won,
            side: "two",
            onClick: () =>
              onTeamClick?.(
                localGame,
                localGame.team2
              ),
          })}
        </div>

        <div className="game-details-info-grid">
          <article className="game-details-info-card">
            <span className="game-details-info-icon">
              📍
            </span>

            <div>
              <span>Location</span>

              <strong>
                {localGame.location ||
                  "TBD"}
              </strong>
            </div>
          </article>

          <article className="game-details-info-card">
            <span className="game-details-info-icon">
              🏆
            </span>

            <div>
              <span>Division</span>

              <strong>
                {localGame.division ||
                  "Unknown"}
              </strong>
            </div>
          </article>

          <article className="game-details-info-card">
            <span className="game-details-info-icon">
              👥
            </span>

            <div>
              <span>Age Group</span>

              <strong>
                {getAgeGroup(localGame)}
              </strong>
            </div>
          </article>

          <article className="game-details-info-card">
            <span className="game-details-info-icon">
              ●
            </span>

            <div>
              <span>Status</span>

              <strong>
                {isFinal
                  ? "Final"
                  : "Scheduled"}
              </strong>
            </div>
          </article>
        </div>
      </section>

      {showShareGraphic && (
        <div
          className="share-score-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-score-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowShareGraphic(false);
            }
          }}
        >
          <section className="share-score-modal">
            <div className="share-score-modal-header">
              <div>
                <span>READY TO POST</span>
                <h2 id="share-score-title">Share final score</h2>
              </div>

              <button
                type="button"
                className="share-score-close"
                aria-label="Close score graphic"
                onClick={() => setShowShareGraphic(false)}
              >
                ×
              </button>
            </div>

            <div className="share-score-preview">
              <article className="share-score-card" ref={shareCardRef}>
                <div className="share-score-card-glow share-score-card-glow-one" />
                <div className="share-score-card-glow share-score-card-glow-two" />

                <header className="share-score-brand">
                  <div className="share-score-brand-mark">LS</div>
                  <div>
                    <strong>LOCAL SCORES HQ</strong>
                    <span>DMV HIGH SCHOOL SPORTS</span>
                  </div>
                  <b>FINAL</b>
                </header>

                <div className="share-score-event">
                  <span>{localGame.sport || "Football"}</span>
                  <strong>{formatDate(localGame.date)}</strong>
                </div>

                <div className="share-score-matchup">
                  <div className={team1Won ? "is-winner" : ""}>
                    <TeamMascot
                      teamName={localGame.team1}
                      className="share-score-mascot game-details-team-logo"
                    />
                    <strong>{localGame.team1}</strong>
                    <b>{localGame.score1}</b>
                    {team1Won && <span>WINNER</span>}
                  </div>

                  <i>—</i>

                  <div className={team2Won ? "is-winner" : ""}>
                    <TeamMascot
                      teamName={localGame.team2}
                      className="share-score-mascot game-details-team-logo"
                    />
                    <strong>{localGame.team2}</strong>
                    <b>{localGame.score2}</b>
                    {team2Won && <span>WINNER</span>}
                  </div>
                </div>

                <footer className="share-score-footer">
                  <span>{localGame.location || "Location TBD"}</span>
                  <strong>LOCALSCORESHQ.COM</strong>
                </footer>
              </article>
            </div>

            <div className="share-score-buttons">
              <button
                type="button"
                className="share-score-share"
                onClick={shareScoreGraphic}
                disabled={graphicAction === "sharing" || graphicAction === "saving"}
              >
                {graphicAction === "sharing" ? "Creating…" : "Share Image"}
              </button>

              <button
                type="button"
                onClick={saveScoreGraphic}
                disabled={graphicAction === "sharing" || graphicAction === "saving"}
              >
                {graphicAction === "saving" ? "Creating…" : "Save Image"}
              </button>
            </div>

            {graphicAction === "saved" && (
              <p className="share-score-feedback">Image saved to your downloads.</p>
            )}
            {graphicAction === "shared" && (
              <p className="share-score-feedback">Score graphic shared.</p>
            )}
            {graphicAction === "error" && (
              <p className="share-score-feedback is-error">
                The image could not be created. Please try again.
              </p>
            )}
          </section>
        </div>
      )}

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
                  min="0"
                  inputMode="numeric"
                  value={team1Score}
                  onChange={(event) =>
                    setTeam1Score(
                      event.target.value
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
                  min="0"
                  inputMode="numeric"
                  value={team2Score}
                  onChange={(event) =>
                    setTeam2Score(
                      event.target.value
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
