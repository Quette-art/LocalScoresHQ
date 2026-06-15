import React, { useEffect, useMemo, useState } from "react";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
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
  const [showAddGame, setShowAddGame] = useState(false);
  const [editGame, setEditGame] = useState(null);
  const [saving, setSaving] = useState(false);
  const [newGame, setNewGame] = useState({
    team1: "", team2: "", score1: "", score2: "",
    date: "", time: "", location: "", division: "",
    sport: selectedSport || "Soccer",
  });

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

  useEffect(() => {
    setNewGame((prev) => ({
      ...prev,
      date: selectedDate,
      sport: selectedSport,
    }));
  }, [selectedDate, selectedSport]);

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
      const aFavoriteCount =
        (favoriteTeams.includes(`${a.team1}-${a.division}`) ? 1 : 0) +
        (favoriteTeams.includes(`${a.team2}-${a.division}`) ? 1 : 0);
      const bFavoriteCount =
        (favoriteTeams.includes(`${b.team1}-${b.division}`) ? 1 : 0) +
        (favoriteTeams.includes(`${b.team2}-${b.division}`) ? 1 : 0);
      if (bFavoriteCount !== aFavoriteCount) return bFavoriteCount - aFavoriteCount;
      return new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`);
    });
  }, [sportGames, selectedDate, divisionFilter, favoriteTeams]);

  const getAgeGroup = (game) => {
    if (game.ageGroup) return game.ageGroup;
    if (game.division) return game.division.split(" / ")[0];
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
        { ...selectedGame, gameId: selectedGame.id, score1: Number(team1Score), score2: Number(team2Score) },
        { merge: true }
      );
      closeScoreModal();
      alert("Score Saved");
    } catch (error) {
      console.error(error);
      alert("Failed to save score");
    }
  };

  const saveNewGame = async () => {
    if (!newGame.team1 || !newGame.team2 || !newGame.date || !newGame.division) {
      alert("Please fill in Team 1, Team 2, Date and Division at minimum.");
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, "games"), {
        team1: newGame.team1.trim(),
        team2: newGame.team2.trim(),
        score1: newGame.score1 !== "" ? Number(newGame.score1) : null,
        score2: newGame.score2 !== "" ? Number(newGame.score2) : null,
        date: newGame.date,
        time: newGame.time || "TBD",
        location: newGame.location.trim() || "TBD",
        division: newGame.division.trim(),
        sport: newGame.sport || selectedSport,
        ageGroup: newGame.division.split(" / ")[0] || "Unknown",
        createdAt: new Date().toISOString(),
      });
      setShowAddGame(false);
      setNewGame({ team1: "", team2: "", score1: "", score2: "", date: selectedDate, time: "", location: "", division: "", sport: selectedSport });
      alert("Game added!");
    } catch (error) {
      console.error(error);
      alert("Failed to add game");
    }
    setSaving(false);
  };

  const openEditGame = (game) => {
    setEditGame({
      id: game.id,
      team1: game.team1 || "",
      team2: game.team2 || "",
      score1: game.score1 ?? "",
      score2: game.score2 ?? "",
      date: game.date || "",
      time: game.time || "",
      location: game.location || "",
      division: game.division || "",
      sport: game.sport || selectedSport,
    });
  };

  const saveEditGame = async () => {
    if (!editGame.team1 || !editGame.team2 || !editGame.date || !editGame.division) {
      alert("Please fill in Team 1, Team 2, Date and Division at minimum.");
      return;
    }
    setSaving(true);
    try {
      await setDoc(
        doc(db, "games", editGame.id),
        {
          team1: editGame.team1.trim(),
          team2: editGame.team2.trim(),
          score1: editGame.score1 !== "" ? Number(editGame.score1) : null,
          score2: editGame.score2 !== "" ? Number(editGame.score2) : null,
          date: editGame.date,
          time: editGame.time || "TBD",
          location: editGame.location.trim() || "TBD",
          division: editGame.division.trim(),
          sport: editGame.sport || selectedSport,
          ageGroup: editGame.division.split(" / ")[0] || "Unknown",
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setEditGame(null);
      alert("Game updated!");
    } catch (error) {
      console.error(error);
      alert("Failed to update game");
    }
    setSaving(false);
  };

  if (selectedSport !== "Soccer" && selectedSport !== "Flag Football") {
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
            ref={(el) => {
              if (el && selectedDate === date) {
                el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
              }
            }}
            className={`date-btn ${selectedDate === date ? "active" : ""}`}
            onClick={() => setSelectedDate(date)}
          >
            {new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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

      {/* ADMIN ADD GAME BUTTON */}
      {isAdmin && (
        <div style={{ padding: "0 16px 12px" }}>
          <button
            onClick={() => setShowAddGame(!showAddGame)}
            style={{
              width: "100%", padding: "12px", borderRadius: "10px",
              border: "1px dashed #22d3ee", background: "transparent",
              color: "#22d3ee", fontWeight: 800, fontSize: "14px", cursor: "pointer",
            }}
          >
            {showAddGame ? "✕ Cancel" : "+ Add Game"}
          </button>

          {showAddGame && (
            <div style={{ marginTop: "12px", background: "#0f172a", border: "1px solid #1a2744", borderRadius: "14px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>New Game</p>
              <input placeholder="Team 1 *" value={newGame.team1} onChange={(e) => setNewGame({ ...newGame, team1: e.target.value })} style={inputStyle} />
              <input placeholder="Team 2 *" value={newGame.team2} onChange={(e) => setNewGame({ ...newGame, team2: e.target.value })} style={inputStyle} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <input placeholder="Score 1" type="number" value={newGame.score1} onChange={(e) => setNewGame({ ...newGame, score1: e.target.value })} style={inputStyle} />
                <input placeholder="Score 2" type="number" value={newGame.score2} onChange={(e) => setNewGame({ ...newGame, score2: e.target.value })} style={inputStyle} />
              </div>
              <input placeholder="Date (YYYY-MM-DD) *" value={newGame.date} onChange={(e) => setNewGame({ ...newGame, date: e.target.value })} style={inputStyle} />
              <input placeholder="Time (e.g. 10:00 AM - 11:00 AM)" value={newGame.time} onChange={(e) => setNewGame({ ...newGame, time: e.target.value })} style={inputStyle} />
              <input placeholder="Location" value={newGame.location} onChange={(e) => setNewGame({ ...newGame, location: e.target.value })} style={inputStyle} />
              <input placeholder="Division (e.g. 6U Division / American) *" value={newGame.division} onChange={(e) => setNewGame({ ...newGame, division: e.target.value })} style={inputStyle} />
              <button onClick={saveNewGame} disabled={saving} style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #0891b2, #22d3ee)", color: "#020617", fontWeight: 800, fontSize: "15px", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving..." : "Save Game"}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="games-list">
        {filteredGames.length === 0 ? (
          <div className="loadingWrapper">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        ) : (
          filteredGames.map((game) => {
            const isFinal = game.score1 != null && game.score2 != null;
            const team1Won = isFinal && Number(game.score1) > Number(game.score2);
            const team2Won = isFinal && Number(game.score2) > Number(game.score1);
            const team1Favorite = favoriteTeams.includes(`${game.team1}-${game.division}`);
            const team2Favorite = favoriteTeams.includes(`${game.team2}-${game.division}`);

            return (
              <div
                key={game.id}
                className="game-card"
                onClick={() => openGameDetails && openGameDetails(game)}
              >
                <div className="game-info">
                  <span>{game.time}</span>
                  <span>{game.location}</span>
                </div>

                <div className="matchup desktop-matchup">
                  <button className={`team-name ${team1Won ? "winner" : ""}`} onClick={(e) => { e.stopPropagation(); openTeamProfile(game, game.team1); }}>
                    {team1Favorite ? "⭐ " : ""}{game.team1}
                  </button>
                  <span className="score">{isFinal ? game.score1 : "-"}</span>
                  <span className="vs">vs</span>
                  <span className="score">{isFinal ? game.score2 : "-"}</span>
                  <button className={`team-name ${team2Won ? "winner" : ""}`} onClick={(e) => { e.stopPropagation(); openTeamProfile(game, game.team2); }}>
                    {team2Favorite ? "⭐ " : ""}{game.team2}
                  </button>
                  <span className={`game-status ${isFinal ? "final" : "upcoming"}`}>
                    {isFinal ? "FINAL" : "UPCOMING"}
                  </span>
                </div>

                <div className="mobile-matchup">
                  <button className={`mobile-team ${team1Won ? "winner" : ""}`} onClick={(e) => { e.stopPropagation(); openTeamProfile(game, game.team1); }}>
                    {team1Favorite ? "⭐ " : ""}{game.team1}
                  </button>
                  <span className="mobile-score">{isFinal ? game.score1 : "-"}</span>
                  <button className={`mobile-team ${team2Won ? "winner" : ""}`} onClick={(e) => { e.stopPropagation(); openTeamProfile(game, game.team2); }}>
                    {team2Favorite ? "⭐ " : ""}{game.team2}
                  </button>
                  <span className="mobile-score">{isFinal ? game.score2 : "-"}</span>
                  <span className={`mobile-status ${isFinal ? "final" : "upcoming"}`}>
                    {isFinal ? "FINAL" : "UPCOMING"}
                  </span>
                </div>

                <div className="game-division">
                  {new Date(game.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {game.division}
                </div>

                {isAdmin && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px" }}>
                    <button
                      className="report-score-btn"
                      style={{ margin: 0 }}
                      onClick={(e) => { e.stopPropagation(); openScoreModal(game); }}
                    >
                      {isFinal ? "Edit Score" : "Report Score"}
                    </button>
                    <button
                      className="report-score-btn"
                      style={{ margin: 0, background: "#1e3a5f" }}
                      onClick={(e) => { e.stopPropagation(); openEditGame(game); }}
                    >
                      ✏️ Edit Game
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* SCORE MODAL */}
      {selectedGame && (
        <div className="scoreModalOverlay">
          <div className="scoreModal">
            <h2>{selectedGame.score1 != null ? "Edit Score" : "Report Score"}</h2>
            <p>{selectedGame.team1} vs {selectedGame.team2}</p>
            <div className="scoreInputs">
              <input type="number" placeholder={selectedGame.team1} value={team1Score} onChange={(e) => setTeam1Score(e.target.value)} />
              <input type="number" placeholder={selectedGame.team2} value={team2Score} onChange={(e) => setTeam2Score(e.target.value)} />
            </div>
            <div className="scoreModalButtons">
              <button className="cancelScoreBtn" onClick={closeScoreModal}>Cancel</button>
              <button className="saveScoreBtn" onClick={saveScore}>Save Score</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT GAME MODAL */}
      {editGame && (
        <div className="scoreModalOverlay">
          <div className="scoreModal" style={{ maxHeight: "90vh", overflowY: "auto" }}>
            <h2>✏️ Edit Game</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
              <input placeholder="Team 1 *" value={editGame.team1} onChange={(e) => setEditGame({ ...editGame, team1: e.target.value })} style={inputStyle} />
              <input placeholder="Team 2 *" value={editGame.team2} onChange={(e) => setEditGame({ ...editGame, team2: e.target.value })} style={inputStyle} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <input placeholder="Score 1" type="number" value={editGame.score1} onChange={(e) => setEditGame({ ...editGame, score1: e.target.value })} style={inputStyle} />
                <input placeholder="Score 2" type="number" value={editGame.score2} onChange={(e) => setEditGame({ ...editGame, score2: e.target.value })} style={inputStyle} />
              </div>
              <input placeholder="Date (YYYY-MM-DD) *" value={editGame.date} onChange={(e) => setEditGame({ ...editGame, date: e.target.value })} style={inputStyle} />
              <input placeholder="Time" value={editGame.time} onChange={(e) => setEditGame({ ...editGame, time: e.target.value })} style={inputStyle} />
              <input placeholder="Location" value={editGame.location} onChange={(e) => setEditGame({ ...editGame, location: e.target.value })} style={inputStyle} />
              <input placeholder="Division *" value={editGame.division} onChange={(e) => setEditGame({ ...editGame, division: e.target.value })} style={inputStyle} />
            </div>
            <div className="scoreModalButtons" style={{ marginTop: "16px" }}>
              <button className="cancelScoreBtn" onClick={() => setEditGame(null)}>Cancel</button>
              <button className="saveScoreBtn" onClick={saveEditGame} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #263244",
  background: "#020617",
  color: "white",
  fontSize: "14px",
  fontWeight: 600,
  outline: "none",
  fontFamily: "inherit",
};