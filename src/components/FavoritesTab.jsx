import React, { useMemo, useState } from "react";
import "./ScoresTab.css";

const SPORT_DEFS = [
  { name: "Soccer", icon: "⚽" },
  { name: "Flag Football", icon: "🚩" },
  { name: "Basketball", icon: "🏀" },
  { name: "Baseball", icon: "⚾" },
  { name: "Football", icon: "🏈" },
];

const LEAGUE_NAME = "Prince George's County Boys & Girls Club Inc.";

const hasScore = (game) =>
  game.score1 !== null && game.score1 !== undefined &&
  game.score2 !== null && game.score2 !== undefined;

export default function FavoritesTab({ games = [], openTeamRoute, setActiveTab, setSelectedSport }) {
  const [favoriteTeams, setFavoriteTeams] = useState(() => {
    return JSON.parse(localStorage.getItem("favoriteTeams")) || [];
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSport, setExpandedSport] = useState(null);

  const getSportIcon = (sport) => {
    if (sport === "Baseball") return "⚾";
    if (sport === "Basketball") return "🏀";
    if (sport === "Football") return "🏈";
    if (sport === "Flag Football") return "🚩";
    return "⚽";
  };

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

  // Sports that have at least one favorited team
  const favoriteSports = useMemo(() => {
    return new Set(favoriteTeamDetails.map((t) => t.sport));
  }, [favoriteTeamDetails]);

  // Next upcoming game date per sport
  const nextGameBySport = useMemo(() => {
    const map = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    games.forEach((game) => {
      if (hasScore(game)) return;
      const sport = game.sport || "Soccer";
      const gameDate = new Date(game.date + "T00:00:00");
      if (gameDate < today) return;
      if (!map[sport] || gameDate < map[sport]) {
        map[sport] = gameDate;
      }
    });
    return map;
  }, [games]);

  const sortedSports = useMemo(() => {
    return [...SPORT_DEFS].sort((a, b) => {
      const aHasFavoriteUpcoming = favoriteSports.has(a.name) && nextGameBySport[a.name];
      const bHasFavoriteUpcoming = favoriteSports.has(b.name) && nextGameBySport[b.name];

      // 1. Favorited sport with upcoming game comes first
      if (aHasFavoriteUpcoming && !bHasFavoriteUpcoming) return -1;
      if (bHasFavoriteUpcoming && !aHasFavoriteUpcoming) return 1;

      const aNext = nextGameBySport[a.name];
      const bNext = nextGameBySport[b.name];

      // 2. Sports with no upcoming games go to the bottom
      if (!aNext && bNext) return 1;
      if (!bNext && aNext) return -1;
      if (!aNext && !bNext) return 0;

      // 3. Sort remaining by soonest upcoming game
      return aNext - bNext;
    });
  }, [favoriteSports, nextGameBySport]);

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

  const goToSport = (sportName) => {
    setSelectedSport(sportName);
    setActiveTab("scores");
  };

  const toggleSport = (sportName) => {
    setExpandedSport(expandedSport === sportName ? null : sportName);
  };

  return (
    <div className="scores-tab">
      <div className="scores-header">
        <h2>FAVORITES</h2>
      </div>

      {/* FAVORITE TEAM CHIPS */}
      <div
        style={{
          display: "flex",
          gap: "18px",
          overflowX: "auto",
          padding: "4px 16px 20px",
          WebkitOverflowScrolling: "touch",
        }}
      >
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
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
              width: "64px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0891b2, #22d3ee)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "16px",
                color: "#020617",
              }}
            >
              {team.teamName.substring(0, 2).toUpperCase()}
            </div>
            <span
              style={{
                color: "#cbd5e1",
                fontSize: "11px",
                fontWeight: 700,
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "64px",
              }}
            >
              {team.teamName}
            </span>
          </button>
        ))}

        {/* ADD BUTTON */}
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
            width: "64px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              border: "2px dashed #334155",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "24px",
              color: "#22d3ee",
            }}
          >
            +
          </div>
          <span style={{ color: "#cbd5e1", fontSize: "11px", fontWeight: 700 }}>Add</span>
        </button>
      </div>

      {favoriteTeamDetails.length === 0 && (
        <div style={{ padding: "0 20px 20px", textAlign: "center" }}>
          <p style={{ color: "#64748b", fontSize: "13px" }}>
            Tap the + above to add your first favorite team.
          </p>
        </div>
      )}

      {/* SPORTS LIST */}
      <div style={{ padding: "0 16px" }}>
        <p style={{ color: "#64748b", fontSize: "12px", fontWeight: 800, letterSpacing: "0.5px", margin: "0 0 10px" }}>
          ALL SPORTS
        </p>
        <div style={{ background: "#0f172a", border: "1px solid #1a2744", borderRadius: "14px", overflow: "hidden" }}>
          {sortedSports.map((sport, i) => {
            const isExpanded = expandedSport === sport.name;
            return (
              <div key={sport.name} style={{ borderBottom: i < sortedSports.length - 1 ? "1px solid #1a2744" : "none" }}>
                <button
                  onClick={() => toggleSport(sport.name)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    color: "white",
                    padding: "16px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: "15px", fontWeight: 700, display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "20px" }}>{sport.icon}</span> {sport.name}
                  </span>
                  <span
                    style={{
                      color: "#475569",
                      fontSize: "16px",
                      transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.15s ease",
                    }}
                  >
                    ›
                  </span>
                </button>

                {isExpanded && (
                  <div style={{ padding: "0 16px 14px" }}>
                    <button
                      onClick={() => goToSport(sport.name)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        background: "#020617",
                        border: "1px solid #1a2744",
                        borderRadius: "10px",
                        color: "#cbd5e1",
                        padding: "12px 14px",
                        cursor: "pointer",
                        textAlign: "left",
                        fontSize: "13px",
                        fontWeight: 700,
                      }}
                    >
                      {LEAGUE_NAME}
                      <span style={{ color: "#22d3ee", fontSize: "16px" }}>›</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

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