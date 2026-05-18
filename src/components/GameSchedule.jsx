// src/components/GameSchedule.jsx
import React from "react";

const GameSchedule = ({ games, selectedSport, selectedDivision }) => {
  const filteredGames = games.filter((game) => {
    const sportMatch = !selectedSport || game.sport === selectedSport;
    const divisionMatch =
      selectedDivision === "ALL" || game.division === selectedDivision;

    return sportMatch && divisionMatch;
  });

  if (!filteredGames.length) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
        No games available
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "20px",
        marginTop: "20px",
      }}
    >
      {filteredGames.map((game) => {
        const isFinal = game.score1 !== null && game.score2 !== null;

        return (
          <div
            key={game.id}
            style={{
              background: "#1f2937",
              borderRadius: "16px",
              padding: "20px",
              border: "1px solid #374151",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {/* GAME STATUS */}
            <div
              style={{
                fontSize: "14px",
                color: isFinal ? "#9ca3af" : "#00d4ff",
                marginBottom: "12px",
                fontWeight: "600",
              }}
            >
              {isFinal ? "FINAL" : "UPCOMING"}
            </div>

            {/* TEAM LOGOS AND NAMES */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "12px",
              }}
            >
              {/* Team 1 Logo */}
              <img
                src={game.team1Logo}
                alt={`${game.team1} logo`}
                style={{ width: "30px", height: "30px", objectFit: "contain" }}
              />
              <span>{game.team1}</span>
              <span style={{ fontSize: "22px", fontWeight: "800" }}>
                {isFinal ? `${game.score1} - ${game.score2}` : "VS"}
              </span>
              {/* Team 2 Logo */}
              <img
                src={game.team2Logo}
                alt={`${game.team2} logo`}
                style={{ width: "30px", height: "30px", objectFit: "contain" }}
              />
              <span>{game.team2}</span>
            </div>

            {/* GAME TIME AND LOCATION */}
            <div
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              {game.time} • {game.location}
            </div>

            {/* DIVISION */}
            <div
              style={{
                fontSize: "13px",
                color: "#60a5fa",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              {game.division}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GameSchedule;