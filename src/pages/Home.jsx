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
          <p className="home-kicker">LOCALSCORESHQ</p>

          <h1>Today’s Local Scoreboard</h1>

          <span>
            {upcomingGames.length} upcoming • {finalGames.length} finals
          </span>
        </div>

        <div className="home-mini-stat">
          <strong>{allGames.length}</strong>

          <span>Total Games</span>
        </div>
      </div>

      {featuredGame && (
        <div
          className="home-featured-card"
          onClick={() => openGame(featuredGame)}
        >
          <div className="featured-top">
            <div>
              <p className="home-kicker">FEATURED MATCHUP</p>

              <span className="featured-status">
                {hasScore(featuredGame) ? "FINAL" : "UPCOMING"}
              </span>
            </div>
          </div>

          <div className="home-featured-teams">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openTeam(featuredGame, featuredGame.team1);
              }}
            >
              {featuredGame.team1}
            </button>

            <span className="vs-text">VS</span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openTeam(featuredGame, featuredGame.team2);
              }}
            >
              {featuredGame.team2}
            </button>
          </div>

          <p className="featured-details">
            {getSportIcon(featuredGame.sport)} {featuredGame.sport} •{" "}
            {formatDate(featuredGame.date)} • {featuredGame.time} •{" "}
            {featuredGame.location}
          </p>
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
                upcomingGames.slice(0, 4).map((game) => (
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
                          {game.team1}
                        </button>

                        <span>VS</span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openTeam(game, game.team2);
                          }}
                        >
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
                finalGames.slice(0, 4).map((game) => (
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
                          onClick={(e) => {
                            e.stopPropagation();
                            openTeam(game, game.team1);
                          }}
                        >
                          {game.team1}
                        </button>

                        <span>VS</span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openTeam(game, game.team2);
                          }}
                        >
                          {game.team2}
                        </button>
                      </div>
                    </div>

                    <b className="score-display">
                      {game.score1} - {game.score2}
                    </b>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;