import React, { useMemo, useState } from "react";
import TeamProfile from "./TeamProfile";
import "../components/ScoresTab.css";

const getAgeGroup = (game) => {
  if (game.ageGroup) return game.ageGroup;

  if (game.division) {
    return game.division.split(" ")[0];
  }

  return "Unknown";
};

const getSportIcon = (sport) => {
  if (sport === "Baseball") return "⚾";
  if (sport === "Basketball") return "🏀";
  if (sport === "Football") return "🏈";
  if (sport === "Flag Football") return "🚩";

  return "⚽";
};

const hasScore = (game) =>
  game.score1 !== null &&
  game.score1 !== undefined &&
  game.score2 !== null &&
  game.score2 !== undefined;

const AVATAR_COLORS = [
  "#e11d48", "#f59e0b", "#22c55e", "#0ea5e9",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316",
];

const getTeamAvatar = (name) => {
  const clean = typeof name === "string" ? name.trim() : "";

  if (!clean) {
    return { initials: "?", color: "#475569" };
  }

  const words = clean.split(/\s+/).filter(Boolean);
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : clean.slice(0, 2).toUpperCase();

  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = clean.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];

  return { initials, color };
};

const TeamAvatar = ({ name }) => {
  const { initials, color } = getTeamAvatar(name);
  return (
    <span className="team-avatar" style={{ background: color }}>
      {initials}
    </span>
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const Home = ({ games = [], openGameDetails }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [showUpcoming, setShowUpcoming] = useState(true);

  const [showFinals, setShowFinals] = useState(true);

  const favoriteTeams = useMemo(() => {
    return JSON.parse(localStorage.getItem("favoriteTeams")) || [];
  }, []);

  const allGames = useMemo(
    () =>
      games.map((game) => ({
        ...game,
        sport: game.sport || "Soccer",
      })),
    [games]
  );

 const finalGames = useMemo(() => {
  return allGames
    .filter((game) => hasScore(game))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}, [allGames]);

const upcomingGames = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return allGames
    .filter((game) => {
      if (hasScore(game)) return false;
      const gameDate = new Date(game.date + "T00:00:00");
      return gameDate >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}, [allGames]);

  const favoriteGames = useMemo(() => {
    return upcomingGames.filter((game) => {
      const team1Key = `${game.team1}-${game.division}`;
      const team2Key = `${game.team2}-${game.division}`;

      return (
        favoriteTeams.includes(team1Key) ||
        favoriteTeams.includes(team2Key)
      );
    });
  }, [upcomingGames, favoriteTeams]);

  const nextFavoriteGames = useMemo(() => {
    return Object.values(
      favoriteGames.reduce((acc, game) => {
        const team1Key = `${game.team1}-${game.division}`;
        const team2Key = `${game.team2}-${game.division}`;

        const favoriteKey = favoriteTeams.includes(team1Key)
          ? team1Key
          : team2Key;

        if (!acc[favoriteKey]) {
          acc[favoriteKey] = game;
        }

        return acc;
      }, {})
    );
  }, [favoriteGames, favoriteTeams]);

  const featuredGame =
    upcomingGames.find((game) => game.featured === true) ||
    upcomingGames.find((game) => {
      const team1Key = `${game.team1}-${game.division}`;
      const team2Key = `${game.team2}-${game.division}`;

      return (
        !favoriteTeams.includes(team1Key) &&
        !favoriteTeams.includes(team2Key)
      );
    }) ||
    finalGames[0];

  // Games involving any favorite team, across finals + upcoming
  const favoriteTeamAllGames = useMemo(() => {
    return allGames.filter((game) => {
      const team1Key = `${game.team1}-${game.division}`;
      const team2Key = `${game.team2}-${game.division}`;
      return (
        favoriteTeams.includes(team1Key) || favoriteTeams.includes(team2Key)
      );
    });
  }, [allGames, favoriteTeams]);

  // Hero game: favorite team's most recent final, else their soonest upcoming
  const favoriteHeroGame = useMemo(() => {
    const recentFinal = favoriteTeamAllGames
      .filter((g) => hasScore(g))
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    if (recentFinal) return recentFinal;

    return favoriteTeamAllGames
      .filter((g) => !hasScore(g))
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  }, [favoriteTeamAllGames]);

  const heroGame = favoriteHeroGame || featuredGame;
  const hasFavoriteHero = Boolean(favoriteHeroGame);

  // The sport your favorite team plays — or, with no favorites set, whichever
  // sport has the most recent activity
  const activeSport = favoriteHeroGame?.sport || finalGames[0]?.sport;

  const sportScoreboard = useMemo(() => {
    if (!activeSport) return [];
    return finalGames.filter((g) => g.sport === activeSport).slice(0, 6);
  }, [finalGames, activeSport]);

  const liveGames = useMemo(() => {
    const now = new Date();
    return allGames.filter((game) => {
      if (hasScore(game)) return false;
      if (!game.date || !game.time) return false;
      const start = new Date(`${game.date}T${game.time}`);
      if (isNaN(start.getTime())) return false;
      const elapsed = now - start;
      // "live" window: kicked off, but not more than 2 hours ago
      return elapsed >= 0 && elapsed <= 2 * 60 * 60 * 1000;
    });
  }, [allGames]);

  const openTeam = (game, teamName) => {
    setSelectedTeam({
      teamName,
      division: game.division || "Unknown",
      ageGroup: getAgeGroup(game),
    });
  };

  const openGame = (game) => {
    if (openGameDetails) {
      openGameDetails(game);
    }
  };

  if (selectedTeam) {
    return (
      <TeamProfile
        teamName={selectedTeam.teamName}
        division={selectedTeam.division}
        ageGroup={selectedTeam.ageGroup}
        games={allGames}
        onBack={() => setSelectedTeam(null)}
      />
    );
  }

  return (
    <div className="home-page">
      <div className="home-feed-header">
        <div>
          <p className="home-kicker">LLOCAL SCORES</p>

          <h1>Today's Games</h1>
        </div>

        <div className="home-stat-row">
          <div className="home-stat-item">
            <strong>{allGames.length}</strong>
            <span>Games</span>
          </div>

          <div className="home-stat-item home-stat-live">
            <strong>{liveGames.length}</strong>
            <span>Live</span>
          </div>

          <div className="home-stat-item">
            <strong>{finalGames.length}</strong>
            <span>Final</span>
          </div>

          <div className="home-stat-item">
            <strong>{Math.max(upcomingGames.length - liveGames.length, 0)}</strong>
            <span>Upcoming</span>
          </div>
        </div>
      </div>

      {heroGame && (
        <div
          className="home-hero-card"
          onClick={() => openGame(heroGame)}
        >
          <div className="hero-top-row">
            <p className="home-kicker">
              {hasFavoriteHero ? "YOUR TEAM" : "FEATURED MATCHUP"}
            </p>
            <span className="hero-status">
              {hasScore(heroGame) ? "FINAL" : "UPCOMING"}
            </span>
          </div>

          <div className="hero-matchup">
            <div className="hero-team">
              <TeamAvatar name={heroGame.team1} />
              <span
                className={
                  hasScore(heroGame)
                    ? Number(heroGame.score1) > Number(heroGame.score2)
                      ? "winner"
                      : "loser"
                    : ""
                }
              >
                {heroGame.team1}
              </span>
            </div>

            {hasScore(heroGame) ? (
              <div className="hero-score">
                {heroGame.score1} - {heroGame.score2}
              </div>
            ) : (
              <span className="vs-text">VS</span>
            )}

            <div className="hero-team">
              <TeamAvatar name={heroGame.team2} />
              <span
                className={
                  hasScore(heroGame)
                    ? Number(heroGame.score2) > Number(heroGame.score1)
                      ? "winner"
                      : "loser"
                    : ""
                }
              >
                {heroGame.team2}
              </span>
            </div>
          </div>

          <p className="featured-details">
            {getSportIcon(heroGame.sport)} {heroGame.sport} •{" "}
            {formatDate(heroGame.date)} • {heroGame.time} •{" "}
            {heroGame.location}
          </p>
        </div>
      )}

      {sportScoreboard.length > 0 && (
        <div className="home-section-card">
          <div className="section-header">
            <h2>
              {getSportIcon(activeSport)} {activeSport} Scoreboard
            </h2>
          </div>

          <div className="sport-scoreboard-grid">
            {sportScoreboard.map((game) => {
              const team1Won = Number(game.score1) > Number(game.score2);
              const team2Won = Number(game.score2) > Number(game.score1);

              return (
                <div
                  className="scoreboard-mini-row"
                  key={game.id}
                  onClick={() => openGame(game)}
                >
                  <div className="scoreboard-mini-teams">
                    <div className="scoreboard-mini-team">
                      <TeamAvatar name={game.team1} />
                      <span className={team1Won ? "winner" : "loser"}>
                        {game.team1}
                      </span>
                      <b className={team1Won ? "winner" : "loser"}>
                        {game.score1}
                      </b>
                    </div>

                    <div className="scoreboard-mini-team">
                      <TeamAvatar name={game.team2} />
                      <span className={team2Won ? "winner" : "loser"}>
                        {game.team2}
                      </span>
                      <b className={team2Won ? "winner" : "loser"}>
                        {game.score2}
                      </b>
                    </div>
                  </div>

                  <span className="scoreboard-mini-status">Final</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {nextFavoriteGames.length > 0 && (
        <div className="home-section-card">
          <div className="section-header">
            <h2>⭐ Favorite Teams</h2>

            <span>{nextFavoriteGames.length} Teams</span>
          </div>

          <div className="favorite-strip">
            {nextFavoriteGames.map((game) => {
              const team1Favorite = favoriteTeams.includes(
                `${game.team1}-${game.division}`
              );

              const team2Favorite = favoriteTeams.includes(
                `${game.team2}-${game.division}`
              );

              return (
                <div
                  className="favorite-mini-card"
                  key={game.id}
                  onClick={() => openGame(game)}
                >
                  <div className="favorite-card-top">
                    <span>
                      {getSportIcon(game.sport)} {game.sport}
                    </span>

                    <span>{formatDate(game.date)}</span>
                  </div>

                  <div className="favorite-card-matchup">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openTeam(game, game.team1);
                      }}
                    >
                      {team1Favorite ? "⭐ " : ""}
                      {game.team1}
                    </button>

                    <span>VS</span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openTeam(game, game.team2);
                      }}
                    >
                      {team2Favorite ? "⭐ " : ""}
                      {game.team2}
                    </button>
                  </div>

                  <p>{game.time}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="home-feed-grid">
        <div className="home-section-card">
          <div
            className="section-header collapsible-section-header"
            onClick={() => setShowUpcoming(!showUpcoming)}
          >
            <h2>Upcoming Games</h2>

            <span>{showUpcoming ? "−" : "+"}</span>
          </div>

          {showUpcoming && (
            <>
              {upcomingGames.length === 0 ? (
                <p className="home-muted">No upcoming games.</p>
              ) : (
                upcomingGames.slice(0, 6).map((game) => (
                  <div
                    className="home-game-feed-row"
                    key={game.id}
                    onClick={() => openGame(game)}
                  >
                    <div className="feed-sport-icon">
                      {getSportIcon(game.sport)}
                    </div>

                    <div className="feed-game-info">
                      <span className="feed-game-meta">
  {game.sport} • {game.division}
  {game.division?.toLowerCase().includes("playoff") && (
    <span style={{
      marginLeft: "6px",
      background: "linear-gradient(135deg, #b45309, #f59e0b)",
      color: "#000",
      fontSize: "10px",
      fontWeight: 900,
      padding: "2px 7px",
      borderRadius: "20px",
      letterSpacing: "0.5px",
      textTransform: "uppercase",
    }}>🏆 Playoffs</span>
  )} • {formatDate(game.date)} • {game.time}
</span>

                      <div className="feed-matchup">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openTeam(game, game.team1);
                          }}
                        >
                          <TeamAvatar name={game.team1} />
                          {game.team1}
                        </button>

                        <span>VS</span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openTeam(game, game.team2);
                          }}
                        >
                          <TeamAvatar name={game.team2} />
                          {game.team2}
                        </button>
                      </div>

                      <p>{game.location}</p>
                    </div>

                    <span className="upcoming-status">UPCOMING</span>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        <div className="home-section-card">
          <div
            className="section-header collapsible-section-header"
            onClick={() => setShowFinals(!showFinals)}
          >
            <h2>Recent Finals</h2>

            <span>{showFinals ? "−" : "+"}</span>
          </div>

          {showFinals && (
            <>
              {finalGames.length === 0 ? (
                <p className="home-muted">No finals yet.</p>
              ) : (
                finalGames.slice(0, 6).map((game) => {
                  const team1Won = Number(game.score1) > Number(game.score2);
                  const team2Won = Number(game.score2) > Number(game.score1);

                  return (
                  <div
                    className="home-final-row"
                    key={game.id}
                    onClick={() => openGame(game)}
                  >
                    <div className="home-final-info">
  <span>
    {getSportIcon(game.sport)} {game.sport} • {game.division}
    {game.division?.toLowerCase().includes("playoff") && (
      <span style={{
        marginLeft: "6px",
        background: "linear-gradient(135deg, #b45309, #f59e0b)",
        color: "#000",
        fontSize: "10px",
        fontWeight: 900,
        padding: "2px 7px",
        borderRadius: "20px",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
      }}>🏆 Playoffs</span>
    )}
  </span>

                      <div className="home-final-matchup">
                        <button
                          className={team1Won ? "winner" : "loser"}
                          onClick={(e) => {
                            e.stopPropagation();
                            openTeam(game, game.team1);
                          }}
                        >
                          <TeamAvatar name={game.team1} />
                          {game.team1}
                        </button>

                        <span>VS</span>

                        <button
                          className={team2Won ? "winner" : "loser"}
                          onClick={(e) => {
                            e.stopPropagation();
                            openTeam(game, game.team2);
                          }}
                        >
                          <TeamAvatar name={game.team2} />
                          {game.team2}
                        </button>
                      </div>
                    </div>

                    <b className="score-display">
                      {game.score1} - {game.score2}
                    </b>
                  </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;