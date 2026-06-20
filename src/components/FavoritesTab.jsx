import React, { useMemo, useState } from "react";
import "./ScoresTab.css";

export default function FavoritesTab({ games = [], openTeamRoute }) {
  const [favoriteTeams, setFavoriteTeams] = useState(() => {
    return JSON.parse(localStorage.getItem("favoriteTeams")) || [];
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getSportIcon = (sport) => {
    if (sport === "Baseball") return "⚾";
    if (sport === "Basketball") return "🏀";
    if (sport === "Football") return "🏈";
    if (sport === "Flag Football") return "🚩";
    return "⚽";
  };

  // Build full team list across all games
  const allTeams = useMemo(() => {
    const map = {};
    games.forEach((game) => {
      [game.team1, game.team2].forEach((teamName) => {
        if (!teamName) return;
        const sport = game.sport || "Soccer";
        const division = game.division || "Unknown";
        const ageGroup = game.ageGroup || division.split(" / ")[0] || "Unknown";
        const key = `${teamName}-${division}`;
        if (!map[key]) {
          map[key] = { key, teamName, sport, division, ageGroup };
        }
      });
    });
    return Object.values(map).sort((a, b) => a.teamName.localeCompare(b.teamName));
  }, [games]);

  const favoriteTeamDetails = useMemo(() => {
    return favoriteTeams
      .map((key) => {
        const found = allTeams.find((t) => t.key === key);
        if (found) return found;
        // fallback if team no longer found in games
        const lastDashIndex = key.lastIndexOf("-");
        return {
          key,
          teamName: key.substring(0, lastDashIndex),
          division: key.substring(lastDashIndex + 1),
          sport: "Soccer",
          ageGroup: "Unknown",
        };
      })
      .sort((a, b) => a.teamName.localeCompare(b.teamName));
  }, [favoriteTeams, allTeams]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return allTeams
      .filter(
        (t) =>
          t.teamName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !favoriteTeams.includes(t.key)
      )
      .slice(0, 20);
  }, [searchTerm, allTeams, favoriteTeams]);

  const addFavorite = (key) => {
    const updated = [...favoriteTeams, key];
    setFavoriteTeams(updated);
    localStorage.setItem("favoriteTeams", JSON.stringify(updated));
  };

  const removeFavorite = (key) => {
    const updated = favoriteTeams.filter((k) => k !== key);
    setFavoriteTeams(updated);
    localStorage.setItem("favoriteTeams", JSON.stringify(updated));
  };

  return (
    <div className="scores-tab">
      <div className="scores-header">
        <h2>FAVORITES</h2>
      </div>

      <div style={{ padding: "0 16px 12px" }}>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px dashed #22d3ee",
            background: "transparent",
            color: "#22d3ee",
            fontWeight: 800,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          + Add Team
        </button>
      </div>

      {favoriteTeamDetails.length === 0 ? (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: "15px", fontWeight: 600 }}>
            No favorite teams yet.
          </p>
          <p style={{ color: "#64748b", fontSize: "13px", marginTop: "8px" }}>
            Tap "+ Add Team" above to get started.
          </p>
        </div>
      ) : (
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {favoriteTeamDetails.map((team) => (
            <div
              key={team.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                width: "100%",
                background: "#0f172a",
                border: "1px solid #1a2744",
                borderRadius: "14px",
                padding: "14px 16px",
              }}
            >
              <button
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
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: 0,
                  minWidth: 0,
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
              </button>
              <button
                onClick={() => removeFavorite(team.key)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#f87171",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "4px 8px",
                  flexShrink: 0,
                }}
                title="Remove from favorites"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ADD TEAM MODAL */}
      {showAddModal && (
        <div className="search-overlay">
          <div className="search-page-bar">
            <input
              className="search-input full-search"
              type="text"
              placeholder="Search any team..."
              value={searchTerm}
              autoFocus
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="close-search-btn"
              onClick={() => {
                setShowAddModal(false);
                setSearchTerm("");
              }}
            >
              ×
            </button>
          </div>
          <div className="search-results-panel">
            {searchTerm.trim() === "" ? (
              <p className="no-games">Type a team name to search.</p>
            ) : searchResults.length === 0 ? (
              <p className="no-games">No teams found.</p>
            ) : (
              <div className="team-search-list">
                {searchResults.map((team) => (
                  <button
                    key={team.key}
                    className="team-search-result"
                    onClick={() => {
                      addFavorite(team.key);
                      setSearchTerm("");
                      setShowAddModal(false);
                    }}
                  >
                    <div>
                      <strong>{getSportIcon(team.sport)} {team.teamName}</strong>
                      <span>{team.sport} • {team.ageGroup} • {team.division}</span>
                    </div>
                    <span className="team-result-arrow">+</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}