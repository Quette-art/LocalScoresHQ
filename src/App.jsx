import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { collection, onSnapshot } from "firebase/firestore";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { db, auth } from "./firebase";

import Home from "./pages/Home";
import TeamProfile from "./pages/TeamProfile";
import GameDetails from "./pages/GameDetails";

import ScoresTab from "./components/ScoresTab";
import StandingsTab from "./components/StandingsTab";
import TabNavigation from "./components/TabNavigation";

import InstallAppButton from "./components/InstallAppButton";
import IphoneInstallTip from "./components/IphoneInstallTip";

import { upcomingGames } from "./data/games";

import "./components/ScoresTab.css";

function TeamProfileRoute({ games }) {
  const navigate = useNavigate();

  const [params] = useSearchParams();

  const teamName = params.get("name") || "";

  const division =
    params.get("division") || "Unknown";

  const ageGroup =
    params.get("ageGroup") || "Unknown";

  const sport =
    params.get("sport") || "Soccer";

  return (
    <TeamProfile
      teamName={teamName}
      division={division}
      ageGroup={ageGroup}
      sport={sport}
      games={games.filter(
        (g) =>
          (g.team1 === teamName ||
            g.team2 === teamName) &&
          (g.division || "Unknown") ===
            division &&
          (g.sport || "Soccer") === sport
      )}
      onBack={() => navigate("/")}
    />
  );
}

function AppContent() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState("home");

  const [selectedSport, setSelectedSport] =
    useState("Soccer");

  const [games, setGames] =
    useState(upcomingGames);

  const [selectedGame, setSelectedGame] =
    useState(null);

  const [showSettings, setShowSettings] =
    useState(false);

  const [adminUser, setAdminUser] =
    useState(null);

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [
    showGlobalSearch,
    setShowGlobalSearch,
  ] = useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const isAdmin = !!adminUser;

  const sports = [
    { name: "Baseball", icon: "⚾" },

    { name: "Soccer", icon: "⚽" },

    {
      name: "Basketball",
      icon: "🏀",
    },

    { name: "Football", icon: "🏈" },

    {
      name: "Flag Football",
      icon: "🚩",
    },
  ];

  const sportIcons = {
    Baseball: "⚾",

    Soccer: "⚽",

    Basketball: "🏀",

    Football: "🏈",

    "Flag Football": "🚩",
  };

  useEffect(() => {
    const unsubscribeAuth =
      onAuthStateChanged(auth, (user) => {
        setAdminUser(user);
      });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "scores"),
      (snapshot) => {
        const firebaseScores = {};

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();

          firebaseScores[docSnap.id] = {
            score1: Number(data.score1),

            score2: Number(data.score2),
          };
        });

        const mergedGames =
          upcomingGames.map((game) => {
            const savedScore =
              firebaseScores[game.id];

            if (!savedScore) return game;

            return {
              ...game,

              score1: savedScore.score1,

              score2: savedScore.score2,
            };
          });

        setGames(mergedGames);

        if (selectedGame) {
          const updatedSelected =
            mergedGames.find(
              (g) => g.id === selectedGame.id
            );

          if (updatedSelected) {
            setSelectedGame(
              updatedSelected
            );

            sessionStorage.setItem(
              "selectedGame",
              JSON.stringify(
                updatedSelected
              )
            );
          }
        }
      }
    );

    return () => unsubscribe();
  }, [selectedGame]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setShowSettings(false);

      setEmail("");

      setPassword("");

      alert("Admin signed in");
    } catch (error) {
      console.error(error);

      alert("Login failed");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);

    setActiveTab("home");

    setShowSettings(false);

    navigate("/");

    alert("Signed out");
  };

  const handleSportClick = (
    sportName
  ) => {
    setSelectedSport(sportName);

    navigate("/");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    setSelectedGame(null);

    sessionStorage.removeItem(
      "selectedGame"
    );

    navigate("/");
  };

  const getAgeGroup = (game) => {
    if (game.ageGroup)
      return game.ageGroup;

    if (game.division) {
      return game.division.split(
        " / "
      )[0];
    }

    return "Unknown";
  };

  const openTeamRoute = (team) => {
    navigate(
      `/team?name=${encodeURIComponent(
        team.teamName
      )}&division=${encodeURIComponent(
        team.division
      )}&ageGroup=${encodeURIComponent(
        team.ageGroup
      )}&sport=${encodeURIComponent(
        team.sport
      )}`
    );
  };

  const openGameDetails = (game) => {
    setSelectedGame(game);

    sessionStorage.setItem(
      "selectedGame",
      JSON.stringify(game)
    );

    navigate("/game");
  };

  const teamMap = {};

  games.forEach((game) => {
    [game.team1, game.team2].forEach(
      (teamName) => {
        if (!teamName) return;

        const sport =
          game.sport || "Soccer";

        const division =
          game.division || "Unknown";

        const ageGroup =
          getAgeGroup(game);

        const key = `${teamName}-${sport}-${division}-${ageGroup}`;

        if (!teamMap[key]) {
          teamMap[key] = {
            teamName,

            sport,

            division,

            ageGroup,

            icon:
              sportIcons[sport] || "🏆",
          };
        }
      }
    );
  });

  const searchResults =
    searchTerm.trim() === ""
      ? []
      : Object.values(teamMap)
          .filter((team) =>
            team.teamName
              .toLowerCase()
              .includes(
                searchTerm.toLowerCase()
              )
          )
          .sort((a, b) =>
            a.teamName.localeCompare(
              b.teamName
            )
          );

  return (
    <div className="appShell">
      <header className="mobileAppHeader">
        <button
          className="headerIconBtn"
          onClick={() =>
            setShowGlobalSearch(true)
          }
        >
          🔍
        </button>

        <div className="brandSection">
          <img
            src="/logo.png"
            alt="LocalScoresHQ"
            className="appLogo"
          />

          {isAdmin && (
            <div className="adminBadge">
              ADMIN MODE
            </div>
          )}
        </div>

        <button
          className="headerIconBtn"
          onClick={() =>
            setShowSettings(true)
          }
        >
          ⚙️
        </button>
      </header>

      <InstallAppButton />

      <IphoneInstallTip />

      {showGlobalSearch && (
        <div className="search-overlay">
          <div className="search-page-bar">
            <input
              className="search-input full-search"
              type="text"
              placeholder="Search any team..."
              value={searchTerm}
              autoFocus
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

            <button
              className="close-search-btn"
              onClick={() => {
                setShowGlobalSearch(
                  false);

                setSearchTerm("");
              }}
            >
              ×
            </button>
          </div>

          <div className="search-results-panel">
            {searchTerm.trim() ===
            "" ? (
              <p className="no-games">
                Type a team name to search.
              </p>
            ) : searchResults.length ===
              0 ? (
              <p className="no-games">
                No teams found.
              </p>
            ) : (
              <div className="team-search-list">
                {searchResults.map(
                  (team) => (
                    <button
                      key={`${team.teamName}-${team.division}-${team.ageGroup}-${team.sport}`}
                      className="team-search-result"
                      onClick={() => {
                        openTeamRoute(
                          team
                        );

                        setShowGlobalSearch(
                          false
                        );

                        setSearchTerm(
                          ""
                        );
                      }}
                    >
                      <div>
                        <strong>
                          {team.icon}{" "}
                          {
                            team.teamName
                          }
                        </strong>

                        <span>
                          {team.sport} •{" "}
                          {
                            team.ageGroup
                          }{" "}
                          •{" "}
                          {
                            team.division
                          }
                        </span>
                      </div>

                      <span className="team-result-arrow">
                        ›
                      </span>
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showSettings && (
        <div className="settings-modal">
          <div className="settings-card">
            <h3>Settings</h3>

            {isAdmin ? (
              <>
                <p className="settings-status">
                  Signed in as admin
                </p>

                <button
                  className="submit-score-btn"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <input
                  className="submit-input"
                  type="email"
                  placeholder="Admin email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                />

                <input
                  className="submit-input"
                  type="password"
                  placeholder="Admin password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  className="submit-score-btn"
                  onClick={handleLogin}
                >
                  Sign In
                </button>
              </>
            )}

            <button
              className="close-settings"
              onClick={() =>
                setShowSettings(false)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}

      {activeTab !== "home" && (
        <div className="topControls">
          <div className="sportsBar">
            {sports.map((sport) => (
              <button
                key={sport.name}
                className={`sportPill ${
                  selectedSport ===
                  sport.name
                    ? "sportPillActive"
                    : ""
                }`}
                onClick={() =>
                  handleSportClick(
                    sport.name
                  )
                }
              >
                {sport.icon}{" "}
                {sport.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <Routes>
        <Route
          path="/game"
          element={
            <GameDetails
              game={selectedGame}
              games={games}
              isAdmin={isAdmin}
              onBack={() =>
                navigate("/")
              }
              onScoreSaved={(
                updatedGame
              ) => {
                setSelectedGame(
                  updatedGame
                );

                sessionStorage.setItem(
                  "selectedGame",
                  JSON.stringify(
                    updatedGame
                  )
                );
              }}
              onTeamClick={(
                game,
                teamName
              ) =>
                openTeamRoute({
                  teamName,

                  division:
                    game.division ||
                    "Unknown",

                  ageGroup:
                    getAgeGroup(game),

                  sport:
                    game.sport ||
                    "Soccer",
                })
              }
            />
          }
        />

        <Route
          path="/team"
          element={
            <TeamProfileRoute
              games={games}
            />
          }
        />

        <Route
          path="/"
          element={
            <main className="mainContent">
              {activeTab ===
                "home" && (
                <Home
                  games={games}
                  selectedSport={
                    selectedSport
                  }
                  onSportSelect={
                    setSelectedSport
                  }
                  openGameDetails={
                    openGameDetails
                  }
                />
              )}

              {activeTab ===
                "scores" && (
                <ScoresTab
                  games={games}
                  selectedSport={
                    selectedSport
                  }
                  openTeamRoute={
                    openTeamRoute
                  }
                  openGameDetails={
                    openGameDetails
                  }
                  isAdmin={isAdmin}
                />
              )}

              {activeTab ===
                "standings" && (
                <StandingsTab
                  games={games}
                  selectedSport={
                    selectedSport
                  }
                  openTeamRoute={
                    openTeamRoute
                  }
                />
              )}
            </main>
          }
        />
      </Routes>

      <TabNavigation
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}