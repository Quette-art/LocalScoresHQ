import React, { useMemo } from "react";
import "./ScoresTab.css";

export default function FavoritesTab({ games = [], openTeamRoute }) {
  const favoriteTeams = useMemo(() => {
    return JSON.parse(localStorage.getItem("favoriteTeams")) || [];
  }, []);

  const favoriteTeamDetails = useMemo(() => {
    return favoriteTeams
      .map((key) => {
        const lastDashIndex = key.lastIndexOf("-");
        const teamName = key.substring(0, lastDashIndex);
        const division = key.substring(lastDashIndex + 1);

        const match = games.find(
          (g) =>
            (g.team1 === teamName || g.team2 === teamName) &&
            (g.division || "Unknown") === division
        );

        return {
          key,
          teamName,
          division,
          sport: match?.sport || "Soccer",
          ageGroup: match?.ageGroup || division.split(" / ")[0] || "Unknown",
        };
      })
      .sort((a, b) => a.teamName.localeCompare(b.teamName));
  }, [favoriteTeams, games]);

  const getSportIcon = (sport) => {
    if (sport === "Baseball") return "⚾";
    if (sport === "Basketball") return "🏀";
    if (sport === "Football") return "🏈";
    if (sport === "Flag Football") return "🚩";
    return "⚽";
  };

  return (
    <div className="scores-tab">
      <div className="scores-header">
        <h2>FAVORITES</h2>
      </div>

      {favoriteTeamDetails.length === 0 ? (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: "15px", fontWeight: 600 }}>
            No favorite teams yet.
          </p>
          <p style={{ color: "#64748b", fontSize: "13px", marginTop: "8px" }}>
            Tap the ☆ on any team profile to add them here.
          </p>
        </div>
      ) : (
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {favoriteTeamDetails.map((team) => (
            <button
              key={team.key}
              onClick={() =>
                openTeamRoute({
                  teamName: team.teamName,
                  division: team.division,
                  ageGroup: team.ageGroup,
                  sport: team.sport,
                })
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                width: "100%",
                background: "#0f172a",
                border: "1px solid #1a2744",
                borderRadius: "14px",
                padding: "14px 16px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #0891b2, #22d3ee)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "15px",
                  color: "#020617",
                  flexShrink: 0,
                }}
              >
                {team.teamName.substring(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, color: "white", fontWeight: 800, fontSize: "15px" }}>
                  ⭐ {team.teamName}
                </p>
                <p style={{ margin: "2px 0 0", color: "#94a3b8", fontSize: "13px", fontWeight: 600 }}>
                  {getSportIcon(team.sport)} {team.sport} • {team.division}
                </p>
              </div>
              <span style={{ color: "#475569", fontSize: "20px" }}>›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}