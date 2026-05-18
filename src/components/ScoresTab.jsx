import React, { useEffect, useMemo, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./ScoresTab.css";

export default function ScoresTab({
  games = [],
  selectedSport,
  openTeamRoute,
  openGameDetails,
  isAdmin,
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("ALL");

  const [selectedGame, setSelectedGame] = useState(null);
  const [team1Score, setTeam1Score] = useState("");
  const [team2Score, setTeam2Score] = useState("");

  const favoriteTeams = useMemo(() => {
    return JSON.parse(localStorage.getItem("favoriteTeams")) || [];
  }, []);

  const sportGames = useMemo(() => {
    return games.filter((game) => game.sport === selectedSport);
  }, [games, selectedSport]);

  const uniqueDates = useMemo(() => {
    return [...new Set(sportGames.map((g) => g.date))].sort();
  }, [sportGames]);

  const defaultDate = useMemo(() => {
    if (uniqueDates.length === 0) return "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingDate = uniqueDates.find((date) => {
      const gameDate = new Date(date + "T00:00:00");
      return gameDate >= today;
    });

    return upcomingDate || uniqueDates[0];
  }, [uniqueDates]);

  useEffect(() => {
    setSelectedDate(defaultDate);
  }, [defaultDate, selectedSport]);

  const divisions = useMemo(() => {
    const list = [...new Set(sportGames.map((g) => g.division || "Unknown"))];

    return ["ALL", ...list];
  }, [sportGames]);

  const filteredGames = useMemo(() => {
    const gamesForDateAndDivision = sportGames.filter((game) => {
      const matchesDate = game.date === selectedDate;

      const matchesDivision =
        divisionFilter === "ALL" ||
        (game.division || "Unknown") === divisionFilter;

      return matchesDate && matchesDivision;
    });

    return [...gamesForDateAndDivision].sort((a, b) => {
      const aTeam1Key = `${a.team1}-${a.division}`;
      const aTeam2Key = `${a.team2}-${a.division}`;

      const bTeam1Key = `${b.team1}-${b.division}`;
      const bTeam2Key = `${b.team2}-${b.division}`;

      const aFavoriteCount =
        (favoriteTeams.includes(aTeam1Key) ? 1 : 0) +
        (favoriteTeams.includes(aTeam2Key) ? 1 : 0);

      const bFavoriteCount =
        (favoriteTeams.includes(bTeam1Key) ? 1 : 0) +
        (favoriteTeams.includes(bTeam2Key) ? 1 : 0);

      if (bFavoriteCount !== aFavoriteCount) {
        return bFavoriteCount - aFavoriteCount;
      }

      return (
        new Date(`${a.date} ${a.time}`) -
        new Date(`${b.date} ${b.time}`)
      );
    });
  }, [sportGames, selectedDate, divisionFilter, favoriteTeams]);

  const getAgeGroup = (game) => {
    if (game.ageGroup) return game.ageGroup;

    if (game.division) {
      return game.division.split(" / ")[0];
    }

    return "Unknown";
  };

  const openTeamProfile = (game, teamName) => {
    if (!openTeamRoute) return;

    openTeamRoute({
      teamName,
      division: game.division || "Unknown",
      ageGroup: getAgeGroup(game),
      sport: game.sport || selectedSport,
    });
  };

  const openScoreModal = (game) => {
    setSelectedGame(game);
    setTeam1Score(game.score1 ?? "");
    setTeam2Score(game.score2 ?? "");
  };

  const closeScoreModal = () => {
    setSelectedGame(null);
    setTeam1Score("");
    setTeam2Score("");
  };

  const saveScore = async () => {
    if (!selectedGame) return;

    if (team1Score === "" || team2Score === "") {
      alert("Please enter both scores.");
      return;
    }

    try {
      await setDoc(
        doc(db, "scores", selectedGame.id),
        {
          ...selectedGame,
          gameId: selectedGame.id,
          score1: Number(team1Score),
          score2: Number(team2Score),
        },
        { merge: true }
      );

      closeScoreModal();

      alert("Score Saved");
    } catch (error) {
      console.error(error);
      alert("Failed to save score");
    }
  };

  if (
    selectedSport !== "Soccer" &&
    selectedSport !== "Flag Football"
  ) {
    return (
      <div className="scores-tab">
        <div className="comingSoonPage">
          <h1>{selectedSport.toUpperCase()}</h1>
          <p>Coming Soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scores-tab">
      <div className="scores-header">
        <h2>{selectedSport.toUpperCase()}</h2>
      </div>

      <div className="date-scroll">
        {uniqueDates.map((date) => (
          <button
            key={date}
            className={`date-btn ${
              selectedDate === date ? "active" : ""
            }`}
            onClick={() => setSelectedDate(date)}
          >
            {new Date(date + "T00:00:00").toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
              }
            )}
          </button>
        ))}
      </div>

      <select
        className="divisionSelect"
        value={divisionFilter}
        onChange={(e) => setDivisionFilter(e.target.value)}
      >
        {divisions.map((division) => (
          <option key={division} value={division}>
            {division === "ALL" ? "All" : division}
          </option>
        ))}
      </select>

      <div className="games-list">
        {filteredGames.length === 0 ? (
          <p className="no-games">No games found.</p>
        ) : (
          filteredGames.map((game) => {
            const isFinal =
              game.score1 != null && game.score2 != null;

            const team1Won =
              isFinal &&
              Number(game.score1) > Number(game.score2);

            const team2Won =
              isFinal &&
              Number(game.score2) > Number(game.score1);

            const team1Key = `${game.team1}-${game.division}`;
            const team2Key = `${game.team2}-${game.division}`;

            const team1Favorite =
              favoriteTeams.includes(team1Key);

            const team2Favorite =
              favoriteTeams.includes(team2Key);

            return (
              <div
                key={game.id}
                className="game-card"
                onClick={() =>
                  openGameDetails &&
                  openGameDetails(game)
                }
              >
                <div className="game-info">
                  <span>{game.time}</span>
                  <span>{game.location}</span>
                </div>

                <div className="matchup desktop-matchup">
                  <button
                    className={`team-name ${
                      team1Won ? "winner" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openTeamProfile(game, game.team1);
                    }}
                  >
                    {team1Favorite ? "⭐ " : ""}
                    {game.team1}
                  </button>

                  <span className="score">
                    {isFinal ? game.score1 : "-"}
                  </span>

                  <span className="vs">vs</span>

                  <span className="score">
                    {isFinal ? game.score2 : "-"}
                  </span>

                  <button
                    className={`team-name ${
                      team2Won ? "winner" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openTeamProfile(game, game.team2);
                    }}
                  >
                    {team2Favorite ? "⭐ " : ""}
                    {game.team2}
                  </button>

                  <span
                    className={`game-status ${
                      isFinal ? "final" : "upcoming"
                    }`}
                  >
                    {isFinal ? "FINAL" : "UPCOMING"}
                  </span>
                </div>

                <div className="mobile-matchup">
                  <button
                    className={`mobile-team ${
                      team1Won ? "winner" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openTeamProfile(game, game.team1);
                    }}
                  >
                    {team1Favorite ? "⭐ " : ""}
                    {game.team1}
                  </button>

                  <span className="mobile-score">
                    {isFinal ? game.score1 : "-"}
                  </span>

                  <button
                    className={`mobile-team ${
                      team2Won ? "winner" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      openTeamProfile(game, game.team2);
                    }}
                  >
                    {team2Favorite ? "⭐ " : ""}
                    {game.team2}
                  </button>

                  <span className="mobile-score">
                    {isFinal ? game.score2 : "-"}
                  </span>

                  <span
                    className={`mobile-status ${
                      isFinal ? "final" : "upcoming"
                    }`}
                  >
                    {isFinal ? "FINAL" : "UPCOMING"}
                  </span>
                </div>

                <div className="game-division">
                  {new Date(
                    game.date + "T00:00:00"
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  • {game.division}
                </div>

                {isAdmin && (
                  <button
                    className="report-score-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openScoreModal(game);
                    }}
                  >
                    {isFinal ? "Edit Score" : "Report Score"}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {selectedGame && (
        <div className="scoreModalOverlay">
          <div className="scoreModal">
            <h2>
              {selectedGame.score1 != null
                ? "Edit Score"
                : "Report Score"}
            </h2>

            <p>
              {selectedGame.team1} vs{" "}
              {selectedGame.team2}
            </p>

            <div className="scoreInputs">
              <input
                type="number"
                placeholder={selectedGame.team1}
                value={team1Score}
                onChange={(e) =>
                  setTeam1Score(e.target.value)
                }
              />

              <input
                type="number"
                placeholder={selectedGame.team2}
                value={team2Score}
                onChange={(e) =>
                  setTeam2Score(e.target.value)
                }
              />
            </div>

            <div className="scoreModalButtons">
              <button
                className="cancelScoreBtn"
                onClick={closeScoreModal}
              >
                Cancel
              </button>

              <button
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
}