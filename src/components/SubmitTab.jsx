import React, { useState, useEffect } from "react";
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { upcomingGames } from "../data/games";
import "./ScoresTab.css";

const sportIcons = {
  Baseball: "⚾",
  Soccer: "⚽",
  Basketball: "🏀",
  Football: "🏈",
  "Flag Football": "🚩",
};

const getGameSport = (game) => game.sport || "Soccer";

const SubmitTab = ({ selectedSport = "Soccer" }) => {
  const [selectedGame, setSelectedGame] = useState("");
  const [team1Score, setTeam1Score] = useState("");
  const [team2Score, setTeam2Score] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");
  const [submittedScores, setSubmittedScores] = useState({});

  const games = upcomingGames.filter(
    (game) => getGameSport(game) === selectedSport
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "scores"), (snapshot) => {
      const scoreData = {};

      snapshot.forEach((docSnap) => {
        scoreData[docSnap.id] = docSnap.data();
      });

      setSubmittedScores(scoreData);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getAgeGroup = (game) => {
    if (game.ageGroup) return game.ageGroup;
    if (game.division) return game.division.split(" ")[0];
    return "Unknown";
  };

  const uniqueDates = [...new Set(games.map((game) => game.date))];

  const uniqueAgeGroups = [
    ...new Set(games.map((game) => getAgeGroup(game))),
  ].sort();

  const uniqueDivisions = [
    ...new Set(games.map((game) => game.division || "Unknown")),
  ].sort();

  const filteredGames = games.filter((game) => {
    const matchesSearch =
      searchTerm.trim() === "" ||
      game.team1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.team2.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = selectedDate === "" || game.date === selectedDate;

    const matchesAgeGroup =
      selectedAgeGroup === "" || getAgeGroup(game) === selectedAgeGroup;

    const matchesDivision =
      selectedDivision === "" ||
      (game.division || "Unknown") === selectedDivision;

    return matchesSearch && matchesDate && matchesAgeGroup && matchesDivision;
  });

  const selectedGameDetails = games.find((game) => game.id === selectedGame);
  const isSelectedGameSubmitted = submittedScores[selectedGame];

  const handleSelectGame = (gameId) => {
    const gameScore = submittedScores[gameId];

    setSelectedGame(gameId);

    if (gameScore) {
      setTeam1Score(
        gameScore.score1 !== undefined
          ? String(gameScore.score1)
          : String(gameScore.team1Score ?? "")
      );
      setTeam2Score(
        gameScore.score2 !== undefined
          ? String(gameScore.score2)
          : String(gameScore.team2Score ?? "")
      );
    } else {
      setTeam1Score("");
      setTeam2Score("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedGame || team1Score === "" || team2Score === "") {
      alert("Please select a game and enter both scores.");
      return;
    }

    if (!selectedGameDetails) {
      alert("Game not found.");
      return;
    }

    try {
      await setDoc(
        doc(db, "scores", selectedGame),
        {
          gameId: selectedGame,
          sport: selectedSport,
          team1: selectedGameDetails.team1,
          team2: selectedGameDetails.team2,
          score1: Number(team1Score),
          score2: Number(team2Score),
          team1Score: Number(team1Score),
          team2Score: Number(team2Score),
          date: selectedGameDetails.date,
          time: selectedGameDetails.time || "",
          location: selectedGameDetails.location || "",
          division: selectedGameDetails.division || "Unknown",
          ageGroup: getAgeGroup(selectedGameDetails),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      alert(isSelectedGameSubmitted ? "Score updated!" : "Score submitted!");

      setSelectedGame("");
      setTeam1Score("");
      setTeam2Score("");
      setSearchTerm("");
      setSelectedDate("");
      setSelectedDivision("");
      setSelectedAgeGroup("");
    } catch (err) {
      console.error("Error saving score:", err);
      alert("Error saving score.");
    }
  };

  if (games.length === 0) {
    return (
      <div className="emptySportCard">
        <div className="emptySportIcon">{sportIcons[selectedSport] || "🏆"}</div>
        <h2>No {selectedSport} Games Yet</h2>
        <p>Add {selectedSport} games to your data file before submitting scores.</p>
      </div>
    );
  }

  return (
    <div className="submit-tab">
      <h2 className="submit-title">Submit {selectedSport} Score</h2>

      <form className="submit-card" onSubmit={handleSubmit}>
        <input
          className="submit-input"
          placeholder={`Search ${selectedSport} team...`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedGame("");
            setTeam1Score("");
            setTeam2Score("");
          }}
        />

        <div className="submit-filter-grid">
          <select
            className="submit-input"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedGame("");
              setTeam1Score("");
              setTeam2Score("");
            }}
          >
            <option value="">All Dates</option>
            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {formatDate(date)}
              </option>
            ))}
          </select>

          <select
            className="submit-input"
            value={selectedAgeGroup}
            onChange={(e) => {
              setSelectedAgeGroup(e.target.value);
              setSelectedGame("");
              setTeam1Score("");
              setTeam2Score("");
            }}
          >
            <option value="">All Age Groups</option>
            {uniqueAgeGroups.map((ageGroup) => (
              <option key={ageGroup} value={ageGroup}>
                {ageGroup}
              </option>
            ))}
          </select>

          <select
            className="submit-input"
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              setSelectedGame("");
              setTeam1Score("");
              setTeam2Score("");
            }}
          >
            <option value="">All Divisions</option>
            {uniqueDivisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
        </div>

        <div className="submit-game-list">
          {filteredGames.length === 0 ? (
            <p className="no-games">No games found.</p>
          ) : (
            filteredGames.map((game) => {
              const submittedScore = submittedScores[game.id];

              return (
                <button
                  type="button"
                  key={game.id}
                  className={`submit-game-item ${
                    selectedGame === game.id ? "active" : ""
                  } ${submittedScore ? "submitted" : ""}`}
                  onClick={() => handleSelectGame(game.id)}
                >
                  <strong>
                    {game.team1} vs {game.team2}
                  </strong>

                  <span>
                    {formatDate(game.date)} • {game.time}
                  </span>

                  <span>
                    {getAgeGroup(game)} • {game.division || "Unknown"} •{" "}
                    {game.location}
                  </span>

                  {submittedScore && (
                    <span className="submitted-label">
                      FINAL:{" "}
                      {submittedScore.score1 ?? submittedScore.team1Score} -{" "}
                      {submittedScore.score2 ?? submittedScore.team2Score}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {selectedGameDetails && (
          <div className="submit-preview">
            <strong>{selectedGameDetails.team1}</strong>
            <span>vs</span>
            <strong>{selectedGameDetails.team2}</strong>
            <p>
              {formatDate(selectedGameDetails.date)} •{" "}
              {selectedGameDetails.time}
            </p>
            <p>
              {getAgeGroup(selectedGameDetails)} •{" "}
              {selectedGameDetails.division || "Unknown"}
            </p>
          </div>
        )}

        <div className="score-input-row">
          <input
            className="submit-input"
            type="number"
            min="0"
            placeholder={
              selectedGameDetails
                ? `${selectedGameDetails.team1} Score`
                : "Team 1 Score"
            }
            value={team1Score}
            onChange={(e) => setTeam1Score(e.target.value)}
          />

          <input
            className="submit-input"
            type="number"
            min="0"
            placeholder={
              selectedGameDetails
                ? `${selectedGameDetails.team2} Score`
                : "Team 2 Score"
            }
            value={team2Score}
            onChange={(e) => setTeam2Score(e.target.value)}
          />
        </div>

        <button className="submit-score-btn" type="submit">
          {isSelectedGameSubmitted ? "Update Score" : "Submit Score"}
        </button>
      </form>
    </div>
  );
};

export default SubmitTab;