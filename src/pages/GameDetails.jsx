import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import "../components/ScoresTab.css";
import TeamMascot from "../components/TeamMascot";
import ShareScoreLogo from "../components/ShareScoreLogo";
import { RIVERDALE_COMPACT } from "../data/riverdaleExactLogo";

const SITE_HOST = "localscoreshq.com";

const roundRectPath = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

const wrapCanvasText = (ctx, text, maxWidth, maxLines) => {
  const words = String(text || "")
    .split(/\s+/)
    .filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (!current || ctx.measureText(next).width <= maxWidth) {
      current = next;
      continue;
    }

    lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) {
      break;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  return lines.length ? lines : [String(text || "")];
};

const drawContainedImage = (ctx, image, centerX, centerY, size) => {
  if (!image?.naturalWidth || !image?.naturalHeight) return;

  const scale = Math.min(
    size / image.naturalWidth,
    size / image.naturalHeight
  );
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  ctx.drawImage(
    image,
    centerX - width / 2,
    centerY - height / 2,
    width,
    height
  );
};

const canvasToPngBlob = (canvas) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }
        reject(new Error("Score graphic could not be created."));
      },
      "image/png",
      1
    );
  });

const renderScoreGraphicCanvas = async ({
  team1,
  team2,
  score1,
  score2,
  team1Won,
  team2Won,
  isTie,
  sport,
  dateLabel,
  location,
  logo1,
  logo2,
  brand,
}) => {
  const width = 1080;
  const height = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const background = ctx.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, "#0b1c33");
  background.addColorStop(0.58, "#07111f");
  background.addColorStop(1, "#050d18");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  const glowOne = ctx.createRadialGradient(90, 170, 10, 90, 170, 430);
  glowOne.addColorStop(0, "rgba(38, 128, 255, 0.34)");
  glowOne.addColorStop(1, "rgba(38, 128, 255, 0)");
  ctx.fillStyle = glowOne;
  ctx.fillRect(0, 0, width, height);

  const glowTwo = ctx.createRadialGradient(1000, 1180, 10, 1000, 1180, 430);
  glowTwo.addColorStop(0, "rgba(239, 51, 64, 0.24)");
  glowTwo.addColorStop(1, "rgba(239, 51, 64, 0)");
  ctx.fillStyle = glowTwo;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 2;
  roundRectPath(ctx, 32, 32, width - 64, height - 64, 38);
  ctx.stroke();

  if (brand) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(94, 94, 34, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(brand, 60, 60, 68, 68);
    ctx.restore();
  } else {
    ctx.fillStyle = "#1769e0";
    ctx.beginPath();
    ctx.arc(94, 94, 34, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "900 32px Arial, Helvetica, sans-serif";
  ctx.fillText("LOCAL SCORES HQ", 142, 96);

  ctx.fillStyle = "#e22635";
  roundRectPath(ctx, 868, 72, 148, 46, 23);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "900 20px Arial, Helvetica, sans-serif";
  ctx.fillText("FINAL", 942, 96);

  ctx.fillStyle = "#7eb4ff";
  ctx.font = "900 24px Arial, Helvetica, sans-serif";
  ctx.fillText(String(sport || "Football").toUpperCase(), 540, 186);
  ctx.fillStyle = "#dbeafe";
  ctx.font = "800 28px Arial, Helvetica, sans-serif";
  ctx.fillText(dateLabel, 540, 226);

  const leftX = 278;
  const rightX = 802;
  const logoY = 430;
  drawContainedImage(ctx, logo1, leftX, logoY, 248);
  drawContainedImage(ctx, logo2, rightX, logoY, 248);

  ctx.fillStyle = "#5f7491";
  ctx.font = "500 48px Arial, Helvetica, sans-serif";
  ctx.fillText("—", 540, 430);

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 36px Arial, Helvetica, sans-serif";
  wrapCanvasText(ctx, team1, 400, 2).forEach((line, index) => {
    ctx.fillText(line, leftX, 590 + index * 42);
  });
  wrapCanvasText(ctx, team2, 400, 2).forEach((line, index) => {
    ctx.fillText(line, rightX, 590 + index * 42);
  });

  ctx.font = "900 168px Arial, Helvetica, sans-serif";
  ctx.fillStyle = team1Won ? "#7eb4ff" : "#ffffff";
  ctx.fillText(String(score1 ?? ""), leftX, 760);
  ctx.fillStyle = team2Won ? "#7eb4ff" : "#ffffff";
  ctx.fillText(String(score2 ?? ""), rightX, 760);

  ctx.fillStyle = "#80b5ff";
  ctx.font = "900 20px Arial, Helvetica, sans-serif";
  if (team1Won) ctx.fillText("WINNER", leftX, 860);
  if (team2Won) ctx.fillText("WINNER", rightX, 860);
  if (isTie) {
    ctx.fillText("TIE", leftX, 860);
    ctx.fillText("TIE", rightX, 860);
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(78, 1178);
  ctx.lineTo(1002, 1178);
  ctx.stroke();

  ctx.fillStyle = "#9fb5d4";
  ctx.textAlign = "left";
  ctx.font = "700 22px Arial, Helvetica, sans-serif";
  const locationLabel = String(location || "Location TBD");
  ctx.fillText(
    ctx.measureText(locationLabel).width > 520
      ? `${locationLabel.slice(0, 28)}…`
      : locationLabel,
    78,
    1228
  );

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "right";
  ctx.font = "800 22px Arial, Helvetica, sans-serif";
  ctx.fillText("LOCALSCORESHQ", 1002, 1228);

  ctx.fillStyle = "#7eb4ff";
  ctx.textAlign = "center";
  ctx.font = "800 26px Arial, Helvetica, sans-serif";
  ctx.fillText(SITE_HOST, 540, 1284);

  return canvasToPngBlob(canvas);
};

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

  const [graphicAction, setGraphicAction] =
    useState("");

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

  const formatShortDate = (dateString) => {
    if (!dateString) return "TBD";

    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date
      .toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
      .toUpperCase();
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

    const started = Date.now();
    while (Date.now() - started < 2500) {
      const logos = Array.from(
        shareCardRef.current?.querySelectorAll("[data-share-logo]") || []
      );
      if (
        logos.length &&
        logos.every((logo) => logo.getAttribute("data-share-logo") === "ready")
      ) {
        break;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 50));
    }

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

    const logos = shareCardRef.current.querySelectorAll(
      ".share-score-matchup img"
    );
    const brand = shareCardRef.current.querySelector(
      ".share-score-wordmark img"
    );

    return renderScoreGraphicCanvas({
      team1: localGame.team1,
      team2: localGame.team2,
      score1: localGame.score1,
      score2: localGame.score2,
      team1Won,
      team2Won,
      isTie,
      sport: localGame.sport,
      dateLabel: `${formatShortDate(localGame.date)}${
        localGame.time ? `  •  ${localGame.time}` : ""
      }`,
      location: localGame.location,
      logo1: logos[0] || null,
      logo2: logos[1] || null,
      brand: brand?.complete ? brand : null,
    });
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
      const file = new File([blob], getGraphicFilename(), {
        type: "image/png",
      });

      if (
        /iP(hone|ad|od)/.test(navigator.userAgent) &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: `${localGame.team1} vs ${localGame.team2} final`,
        });
        setGraphicAction("saved");
        return;
      }

      downloadGraphic(blob);
      setGraphicAction("saved");
    } catch (error) {
      if (error?.name === "AbortError") {
        setGraphicAction("");
        return;
      }

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
        text: `Final: ${localGame.team1} ${localGame.score1}, ${localGame.team2} ${localGame.score2} — LocalScoresHQ`,
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
  }) => {
    const isRiverdale =
      teamName === "Riverdale Baptist" ||
      teamName === "Riverdale Baptist School";

    return (
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
          {isRiverdale ? (
            <span className={`team-mascot game-details-team-logo game-details-team-logo-${side}`}>
              <img
                src={RIVERDALE_COMPACT}
                alt="Riverdale Baptist RBS compact logo"
                loading="eager"
                decoding="async"
              />
            </span>
          ) : (
            <TeamMascot
              teamName={teamName}
              className={`game-details-team-logo game-details-team-logo-${side}`}
            />
          )}

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
  };

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
            </button>
          )}

          <button
            type="button"
            className="game-details-action"
            onClick={shareGame}
          >
            Share
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
                <span>INSTAGRAM READY</span>
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
                  <div className="share-score-wordmark">
                    <img src="/icon-192.png" alt="" />
                    <strong>LOCAL SCORES HQ</strong>
                  </div>
                  <b>FINAL</b>
                </header>

                <div className="share-score-event">
                  <span>{localGame.sport || "Football"}</span>
                  <strong>
                    {formatShortDate(localGame.date)}
                    {localGame.time ? `  •  ${localGame.time}` : ""}
                  </strong>
                </div>

                <div className="share-score-matchup">
                  <div className={team1Won ? "is-winner" : isTie ? "is-tie" : ""}>
                    <ShareScoreLogo teamName={localGame.team1} />
                    <strong>{localGame.team1}</strong>
                    <b>{localGame.score1}</b>
                    {team1Won && <span>WINNER</span>}
                    {isTie && <span>TIE</span>}
                  </div>

                  <i>—</i>

                  <div className={team2Won ? "is-winner" : isTie ? "is-tie" : ""}>
                    <ShareScoreLogo teamName={localGame.team2} />
                    <strong>{localGame.team2}</strong>
                    <b>{localGame.score2}</b>
                    {team2Won && <span>WINNER</span>}
                    {isTie && <span>TIE</span>}
                  </div>
                </div>

                <footer className="share-score-footer">
                  <div className="share-score-footer-row">
                    <span>{localGame.location || "Location TBD"}</span>
                    <strong>LOCALSCORESHQ</strong>
                  </div>
                  <em>{SITE_HOST}</em>
                </footer>
              </article>
            </div>

            <p className="share-score-hint">
              4:5 Instagram post with both teams, logos, and the final score.
            </p>

            <div className="share-score-buttons">
              <button
                type="button"
                className="share-score-share"
                onClick={shareScoreGraphic}
                disabled={
                  graphicAction === "sharing" || graphicAction === "saving"
                }
              >
                {graphicAction === "sharing" ? "Creating…" : "Share Image"}
              </button>

              <button
                type="button"
                onClick={saveScoreGraphic}
                disabled={
                  graphicAction === "sharing" || graphicAction === "saving"
                }
              >
                {graphicAction === "saving" ? "Creating…" : "Save Image"}
              </button>
            </div>

            {graphicAction === "saved" && (
              <p className="share-score-feedback">
                Image saved. Post it to Instagram from your camera roll.
              </p>
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
