import { useMemo, useState } from "react";
import { upcomingGames } from "../data/games";

const sportIcons = {
  Baseball: "⚾",
  Soccer: "⚽",
  Basketball: "🏀",
  Football: "🏈",
};

const getGameSport = (game) => game.sport || "Soccer";

const isPlayed = (game) => {
  return (
    game.score1 !== null &&
    game.score2 !== null &&
    game.score1 !== undefined &&
    game.score2 !== undefined
  );
};

const getTeamKey = (game, side) => {
  const sport = getGameSport(game);
  const division = game.division || "No Division";
  const team = side === 1 ? game.team1 : game.team2;

  return `${sport}__${division}__${team}`;
};

export default function SearchOverlay({
  showSearch,
  setShowSearch,
  selectedSport = "Soccer",
  games = [],
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [sportFilter, setSportFilter] = useState("ALL");

  const allGames = useMemo(() => {
    const scheduleGames = Array.isArray(upcomingGames) ? upcomingGames : [];
    const firebaseGames = Array.isArray(games) ? games : [];

    return [...scheduleGames, ...firebaseGames];
  }, [games]);

  const teams = useMemo(() => {
    const map = new Map();

    allGames.forEach((game) => {
      if (game.team1) {
        map.set(getTeamKey(game, 1), {
          id: getTeamKey(game, 1),
          name: game.team1,
          division: game.division || "No Division",
          sport: getGameSport(game),
        });
      }

      if (game.team2) {
        map.set(getTeamKey(game, 2), {
          id: getTeamKey(game, 2),
          name: game.team2,
          division: game.division || "No Division",
          sport: getGameSport(game),
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const sportCompare = a.sport.localeCompare(b.sport);
      if (sportCompare !== 0) return sportCompare;

      const nameCompare = a.name.localeCompare(b.name);
      if (nameCompare !== 0) return nameCompare;

      return a.division.localeCompare(b.division);
    });
  }, [allGames]);

  const searchResults = teams.filter((team) => {
    const q = searchTerm.trim().toLowerCase();

    if (sportFilter !== "ALL" && team.sport !== sportFilter) return false;
    if (!q) return false;

    return (
      team.name.toLowerCase().includes(q) ||
      team.division.toLowerCase().includes(q) ||
      team.sport.toLowerCase().includes(q)
    );
  });

  const teamGames = selectedTeam
    ? allGames.filter((game) => {
        return (
          getTeamKey(game, 1) === selectedTeam.id ||
          getTeamKey(game, 2) === selectedTeam.id
        );
      })
    : [];

  const record = teamGames.reduce(
    (stats, game) => {
      if (!isPlayed(game)) return stats;

      const isTeam1 = getTeamKey(game, 1) === selectedTeam.id;
      const teamScore = Number(isTeam1 ? game.score1 : game.score2);
      const oppScore = Number(isTeam1 ? game.score2 : game.score1);

      stats.g += 1;
      stats.f += teamScore;
      stats.a += oppScore;

      if (teamScore > oppScore) {
        stats.w += 1;
        stats.p += 2;
      } else if (teamScore < oppScore) {
        stats.l += 1;
      } else {
        stats.t += 1;
        stats.p += 1;
      }

      return stats;
    },
    { g: 0, w: 0, l: 0, t: 0, p: 0, f: 0, a: 0 }
  );

  const previousGames = teamGames
    .filter(isPlayed)
    .sort((a, b) => {
      const dateCompare = (b.date || "").localeCompare(a.date || "");
      if (dateCompare !== 0) return dateCompare;
      return (b.time || "").localeCompare(a.time || "");
    });

  const upcoming = teamGames
    .filter((game) => !isPlayed(game))
    .sort((a, b) => {
      const dateCompare = (a.date || "").localeCompare(b.date || "");
      if (dateCompare !== 0) return dateCompare;
      return (a.time || "").localeCompare(b.time || "");
    });

  const saveFavorite = () => {
    if (!selectedTeam) return;

    localStorage.setItem("followedTeam", selectedTeam.name);
  };

  if (!showSearch) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background:
          "radial-gradient(circle at top, #172554 0%, #020617 42%, #020617 100%)",
        color: "#fff",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
          padding: "16px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "10px",
            marginBottom: "12px",
          }}
        >
          <input
            autoFocus
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedTeam(null);
            }}
            placeholder="Search any team..."
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "14px",
              border: "1px solid rgba(34,211,238,0.45)",
              outline: "none",
              background: "rgba(15,23,42,0.95)",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={() => {
              setShowSearch(false);
              setSelectedTeam(null);
              setSearchTerm("");
            }}
            style={{
              width: "52px",
              borderRadius: "14px",
              border: "1px solid rgba(148,163,184,0.18)",
              background: "rgba(30,41,59,0.95)",
              color: "#fff",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {!selectedTeam && (
          <>
            <div
              style={{
                display: "flex",
                gap: "10px",
                overflowX: "auto",
                marginBottom: "16px",
              }}
            >
              {["ALL", "Soccer", "Baseball", "Basketball", "Football"].map(
                (sport) => {
                  const active = sportFilter === sport;

                  return (
                    <button
                      key={sport}
                      onClick={() => setSportFilter(sport)}
                      style={{
                        flexShrink: 0,
                        borderRadius: "999px",
                        padding: "9px 14px",
                        border: active
                          ? "1px solid rgba(34,211,238,0.9)"
                          : "1px solid rgba(148,163,184,0.18)",
                        background: active
                          ? "linear-gradient(135deg, #22d3ee, #0284c7)"
                          : "rgba(15,23,42,0.9)",
                        color: active ? "#020617" : "#cbd5e1",
                        fontWeight: "900",
                        cursor: "pointer",
                      }}
                    >
                      {sport === "ALL"
                        ? "All Sports"
                        : `${sportIcons[sport]} ${sport}`}
                    </button>
                  );
                }
              )}
            </div>

            {searchTerm.trim() === "" ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#94a3b8",
                  marginTop: "90px",
                }}
              >
                <div style={{ fontSize: "54px", marginBottom: "10px" }}>🔎</div>
                <div style={{ fontSize: "21px", fontWeight: "900" }}>
                  Search Teams
                </div>
                <div style={{ marginTop: "6px", fontWeight: "600" }}>
                  Search soccer now. Other sports will appear when teams are added.
                </div>
              </div>
            ) : searchResults.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#94a3b8",
                  marginTop: "90px",
                }}
              >
                <div style={{ fontSize: "54px", marginBottom: "10px" }}>😕</div>
                <div style={{ fontSize: "21px", fontWeight: "900" }}>
                  No teams found
                </div>
                <div style={{ marginTop: "6px", fontWeight: "600" }}>
                  Try another team name or switch sports.
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "12px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                }}
              >
                {searchResults.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    style={{
                      textAlign: "left",
                      background:
                        "linear-gradient(180deg, rgba(30,41,59,0.98), rgba(15,23,42,0.98))",
                      color: "#fff",
                      border: "1px solid rgba(148,163,184,0.14)",
                      borderRadius: "18px",
                      padding: "16px",
                      cursor: "pointer",
                      boxShadow: "0 14px 34px rgba(0,0,0,0.22)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "1000", fontSize: "17px" }}>
                          {team.name}
                        </div>

                        <div
                          style={{
                            color: "#67e8f9",
                            fontSize: "13px",
                            fontWeight: "800",
                            marginTop: "4px",
                          }}
                        >
                          {team.division}
                        </div>
                      </div>

                      <div style={{ fontSize: "28px" }}>
                        {sportIcons[team.sport] || "🏆"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {selectedTeam && (
          <div>
            <button
              onClick={() => setSelectedTeam(null)}
              style={{
                background: "transparent",
                border: "none",
                color: "#67e8f9",
                fontWeight: "900",
                marginBottom: "14px",
                cursor: "pointer",
              }}
            >
              ← Back to search
            </button>

            <div
              style={{
                background:
                  "linear-gradient(180deg, rgba(30,41,59,0.98), rgba(15,23,42,0.98))",
                border: "1px solid rgba(148,163,184,0.16)",
                borderRadius: "22px",
                padding: "18px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "14px",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: "1000",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {selectedTeam.name}
                  </div>

                  <div
                    style={{
                      color: "#67e8f9",
                      fontWeight: "800",
                      marginTop: "4px",
                    }}
                  >
                    {sportIcons[selectedTeam.sport]} {selectedTeam.sport} •{" "}
                    {selectedTeam.division}
                  </div>
                </div>

                <button
                  onClick={saveFavorite}
                  style={{
                    border: "1px solid rgba(34,211,238,0.65)",
                    background: "rgba(34,211,238,0.12)",
                    color: "#67e8f9",
                    borderRadius: "999px",
                    padding: "10px 14px",
                    fontWeight: "900",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  ⭐ Follow
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  marginTop: "16px",
                  overflow: "hidden",
                  borderRadius: "16px",
                  border: "1px solid rgba(148,163,184,0.12)",
                  textAlign: "center",
                }}
              >
                {["G", "W", "L", "T", "P", "F", "A"].map((label) => (
                  <div
                    key={label}
                    style={{
                      padding: "10px 4px",
                      color: "#94a3b8",
                      fontWeight: "900",
                      background: "rgba(2,6,23,0.5)",
                    }}
                  >
                    {label}
                  </div>
                ))}

                {[
                  record.g,
                  record.w,
                  record.l,
                  record.t,
                  record.p,
                  record.f,
                  record.a,
                ].map((value, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "12px 4px",
                      fontWeight: "1000",
                      background: "rgba(15,23,42,0.9)",
                    }}
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>

            <SectionTitle title="Previous Games" count={previousGames.length} />
            {previousGames.length === 0 ? (
              <EmptyLine text="No previous games yet." />
            ) : (
              <GameGrid games={previousGames} selectedTeam={selectedTeam} />
            )}

            <SectionTitle title="Upcoming Games" count={upcoming.length} />
            {upcoming.length === 0 ? (
              <EmptyLine text="No upcoming games." />
            ) : (
              <GameGrid games={upcoming} selectedTeam={selectedTeam} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ title, count }) {
  return (
    <div
      style={{
        margin: "22px 0 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "20px",
          fontWeight: "1000",
          letterSpacing: "-0.03em",
        }}
      >
        {title}
      </h2>

      <span
        style={{
          color: "#94a3b8",
          fontSize: "13px",
          fontWeight: "900",
        }}
      >
        {count}
      </span>
    </div>
  );
}

function EmptyLine({ text }) {
  return (
    <div
      style={{
        color: "#94a3b8",
        background: "rgba(15,23,42,0.7)",
        border: "1px solid rgba(148,163,184,0.12)",
        borderRadius: "16px",
        padding: "16px",
        fontWeight: "700",
      }}
    >
      {text}
    </div>
  );
}

function GameGrid({ games, selectedTeam }) {
  return (
    <div
      style={{
        display: "grid",
        gap: "12px",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      }}
    >
      {games.map((game) => (
        <GameCard key={game.id} game={game} selectedTeam={selectedTeam} />
      ))}
    </div>
  );
}

function GameCard({ game, selectedTeam }) {
  const played = isPlayed(game);
  const isTeam1 = getTeamKey(game, 1) === selectedTeam.id;

  const teamScore = isTeam1 ? game.score1 : game.score2;
  const oppScore = isTeam1 ? game.score2 : game.score1;

  const result =
    !played
      ? "Upcoming"
      : Number(teamScore) > Number(oppScore)
      ? "Win"
      : Number(teamScore) < Number(oppScore)
      ? "Loss"
      : "Tie";

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(30,41,59,0.98), rgba(15,23,42,0.98))",
        border: "1px solid rgba(148,163,184,0.14)",
        borderRadius: "18px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background:
            result === "Win"
              ? "rgba(34,197,94,0.22)"
              : result === "Loss"
              ? "rgba(239,68,68,0.22)"
              : result === "Tie"
              ? "rgba(234,179,8,0.22)"
              : "rgba(37,99,235,0.35)",
          color:
            result === "Win"
              ? "#86efac"
              : result === "Loss"
              ? "#fca5a5"
              : result === "Tie"
              ? "#fde68a"
              : "#93c5fd",
          padding: "7px 12px",
          fontSize: "11px",
          fontWeight: "1000",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {result}
      </div>

      <div style={{ padding: "14px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "12px",
            alignItems: "center",
            fontWeight: "1000",
          }}
        >
          <div>{game.team1}</div>

          <div style={{ color: played ? "#fff" : "#67e8f9" }}>
            {played ? `${game.score1}-${game.score2}` : "VS"}
          </div>

          <div style={{ textAlign: "right" }}>{game.team2}</div>
        </div>

        <div
          style={{
            marginTop: "10px",
            color: "#94a3b8",
            fontSize: "12px",
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {game.date} • {game.time} • {game.location}
        </div>
      </div>
    </div>
  );
}