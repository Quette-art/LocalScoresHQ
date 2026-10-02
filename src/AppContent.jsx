import React, { useEffect, useRef, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";

import { collection, onSnapshot } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { db, auth } from "./firebase";
import { requestNotificationPermission } from "./notifications";
import { isNativeApp } from "./platform";

import Home from "./pages/Home";
import TeamProfile from "./pages/TeamProfile";
import GameDetails from "./pages/GameDetails";
import ScoresTab from "./components/ScoresTab";
import StandingsTab from "./components/StandingsTab";
import FavoritesTab from "./components/FavoritesTab";
import TabNavigation from "./components/TabNavigation";
import InstallAppButton from "./components/InstallAppButton";
import IphoneInstallTip from "./components/IphoneInstallTip";

import { upcomingGames } from "./data/games";
import "./components/ScoresTab.css";

function TeamProfileRoute({ games, onGameClick }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const teamName = params.get("name") || "";
  const division = params.get("division") || "Unknown";
  const ageGroup = params.get("ageGroup") || "Unknown";
  const sport = params.get("sport") || "Soccer";

  return (
    <TeamProfile
      teamName={teamName}
      division={division}
      ageGroup={ageGroup}
      sport={sport}
      games={games.filter(
        (g) =>
          (g.team1 === teamName || g.team2 === teamName) &&
          (g.division || "Unknown") === division &&
          (g.sport || "Soccer") === sport
      )}
      onBack={() => navigate("/")}
      onGameClick={onGameClick}
    />
  );
}

function gamesLookSame(prev, next) {
  if (prev.length !== next.length) return false;
  return prev.every((game, index) => {
    const other = next[index];
    return (
      game.id === other.id &&
      game.score1 === other.score1 &&
      game.score2 === other.score2 &&
      game.status === other.status &&
      game.team1 === other.team1 &&
      game.team2 === other.team2 &&
      game.date === other.date &&
      game.time === other.time
    );
  });
}

export default function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem("activeTab") || "home";
  });
  const [selectedSport, setSelectedSport] = useState("Football");
  const [games, setGames] = useState(upcomingGames);
  const [selectedGame, setSelectedGame] = useState(null);
  const selectedGameRef = useRef(null);

  useEffect(() => {
    selectedGameRef.current = selectedGame;
  }, [selectedGame]);

  const [showSettings, setShowSettings] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin = !!adminUser;

  const sports = [
    { name: "Soccer", icon: "⚽" },
    { name: "Basketball", icon: "🏀" },
    { name: "Baseball", icon: "⚾" },
    { name: "Football", icon: "🏈" },
  ];

  const sportIcons = {
    Baseball: "⚾",
    Soccer: "⚽",
    Basketball: "🏀",
    Football: "🏈",
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    let firebaseScores = {};
    let firebaseGames = [];
    let gameStatuses = {};

    const buildMerged = () => {
      const localWithScores = upcomingGames.map((game) => {
        const savedScore = firebaseScores[game.id];
        const status = gameStatuses[game.id];
        const firebaseOverride = firebaseGames.find((g) => g.id === game.id);
        return {
          ...game,
          ...(firebaseOverride
            ? {
                team1: firebaseOverride.team1 || game.team1,
                team2: firebaseOverride.team2 || game.team2,
                date: firebaseOverride.date || game.date,
                time: firebaseOverride.time || game.time,
                location: firebaseOverride.location || game.location,
                division: firebaseOverride.division || game.division,
                ...(firebaseOverride.score1 !== null &&
                firebaseOverride.score2 !== null
                  ? {
                      score1: Number(firebaseOverride.score1),
                      score2: Number(firebaseOverride.score2),
                    }
                  : {}),
                ...(firebaseOverride.status ? { status: firebaseOverride.status } : {}),
              }
            : {}),
          ...(savedScore ? { score1: savedScore.score1, score2: savedScore.score2 } : {}),
          ...(status ? { status } : {}),
        };
      });

      const localIds = new Set(upcomingGames.map((g) => g.id));
      const extraGames = firebaseGames
        .filter((game) => game.sport === "Football" && !localIds.has(game.id))
        .map((game) => ({
          ...game,
          ...(gameStatuses[game.id] ? { status: gameStatuses[game.id] } : {}),
        }));

      const merged = [...localWithScores, ...extraGames];
      setGames((prev) => (gamesLookSame(prev, merged) ? prev : merged));

      if (selectedGameRef.current) {
        const updated = merged.find((g) => g.id === selectedGameRef.current.id);
        if (updated) {
          setSelectedGame(updated);
          sessionStorage.setItem("selectedGame", JSON.stringify(updated));
        }
      }
    };

    const unsubscribeScores = onSnapshot(collection(db, "scores"), (snapshot) => {
      firebaseScores = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        firebaseScores[docSnap.id] = {
          score1: Number(data.score1),
          score2: Number(data.score2),
        };
      });
      buildMerged();
    });

    const unsubscribeGames = onSnapshot(collection(db, "games"), (snapshot) => {
      firebaseGames = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        firebaseGames.push({
          id: docSnap.id,
          sport: data.sport || "Soccer",
          division: data.division || "Unknown",
          ageGroup: data.ageGroup || data.division?.split(" / ")[0] || "Unknown",
          date: data.date || "",
          time: data.time || "TBD",
          team1: data.team1 || "",
          team2: data.team2 || "",
          score1: data.score1 ?? null,
          score2: data.score2 ?? null,
          location: data.location || "TBD",
          status: data.status || null,
        });
      });
      buildMerged();
    });

    const unsubscribeStatus = onSnapshot(collection(db, "gameStatus"), (snapshot) => {
      gameStatuses = {};
      snapshot.forEach((docSnap) => {
        gameStatuses[docSnap.id] = docSnap.data().status;
      });
      buildMerged();
    });

    return () => {
      unsubscribeScores();
      unsubscribeGames();
      unsubscribeStatus();
    };
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowSettings(false);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    handleTabChange("home");
    setShowSettings(false);
  };

  const handleTabChange = (tab) => {
    if (!tab || typeof tab !== "string") return;
    setActiveTab(tab);
    sessionStorage.setItem("activeTab", tab);
    setSelectedGame(null);
    sessionStorage.removeItem("selectedGame");
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const getAgeGroup = (game) => {
    if (game.ageGroup) return game.ageGroup;
    if (game.division) return game.division.split(" / ")[0];
    return "Unknown";
  };

  const openTeamRoute = (team) => {
    navigate(
      `/team?name=${encodeURIComponent(team.teamName)}&division=${encodeURIComponent(
        team.division
      )}&ageGroup=${encodeURIComponent(team.ageGroup)}&sport=${encodeURIComponent(
        team.sport
      )}`
    );
  };

  const openGameDetails = (game) => {
    setSelectedGame(game);
    sessionStorage.setItem("selectedGame", JSON.stringify(game));
    sessionStorage.setItem("prevTab", activeTab);
    sessionStorage.setItem("gameReturnPath", `${location.pathname}${location.search}`);
    navigate("/game");
  };

  const teamMap = {};
  games.forEach((game) => {
    [game.team1, game.team2].forEach((teamName) => {
      if (!teamName) return;
      const sport = game.sport || "Soccer";
      const division = game.division || "Unknown";
      const ageGroup = getAgeGroup(game);
      const key = `${teamName}-${sport}-${division}-${ageGroup}`;
      if (!teamMap[key]) {
        teamMap[key] = {
          teamName,
          sport,
          division,
          ageGroup,
          icon: sportIcons[sport] || "\uD83C\uDFC6",
        };
      }
    });
  });

  const query = searchTerm.trim().toLowerCase();
  const searchResults = Object.values(teamMap)
    .filter((team) => !query || team.teamName.toLowerCase().includes(query))
    .sort((a, b) => a.teamName.localeCompare(b.teamName));

  return (
    <div className="appShell">
      <header className="mobileAppHeader">
        <div className="mobileHeaderLeft">
          <button className="mobileHeaderAction" onClick={() => setShowGlobalSearch(true)} aria-label="Search">
            {"\uD83D\uDD0D"}
          </button>
        </div>
        <div className="mobileHeaderLogo">
          <img src="/logo-option-1.png" alt="Local Scores" />
        </div>
        <div className="mobileHeaderRight">
          <button className="mobileHeaderAction" onClick={() => setShowSettings(true)} aria-label="Settings">
            {"\u2699\uFE0F"}
          </button>
        </div>
        <div className="desktopHeaderBrand">
          <div className="brandSection">
            <img className="brandLogoImage" src="/logo-option-1.png" alt="Local Scores logo" />
            {isAdmin && <div className="adminBadge">ADMIN MODE</div>}
          </div>
          <nav className="headerNavLinks">
            {["home", "scores", "standings", "favorites"].map((tab) => (
              <button
                key={tab}
                className={`headerNavLink${activeTab === tab ? " headerNavLinkActive" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab[0].toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {!isNativeApp && (
        <>
          <InstallAppButton />
          <IphoneInstallTip />
        </>
      )}

      {showGlobalSearch && (
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
            <button className="close-search-btn" onClick={() => { setShowGlobalSearch(false); setSearchTerm(""); }}>
              {"\u00D7"}
            </button>
          </div>
          <div className="search-results-panel">
            {searchResults.length === 0 ? (
              <p className="no-games">No teams found.</p>
            ) : (
              <div className="team-search-list">
                {searchResults.map((team) => (
                  <button
                    key={`${team.teamName}-${team.division}-${team.ageGroup}-${team.sport}`}
                    className="team-search-result"
                    onClick={() => {
                      openTeamRoute(team);
                      setShowGlobalSearch(false);
                      setSearchTerm("");
                    }}
                  >
                    <div>
                      <strong>{team.icon} {team.teamName}</strong>
                      <span>{team.sport} \u2022 {team.ageGroup} \u2022 {team.division}</span>
                    </div>
                    <span className="team-result-arrow">\u203A</span>
                  </button>
                ))}
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
                <p className="settings-status">Signed in as admin</p>
                <button className="submit-score-btn" onClick={handleLogout}>Sign Out</button>
              </>
            ) : (
              <>
                <input className="submit-input" type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="submit-input" type="password" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="submit-score-btn" onClick={handleLogin}>Sign In</button>
              </>
            )}
            <button className="close-settings" onClick={() => setShowSettings(false)}>Close</button>
          </div>
        </div>
      )}

      <div className={`topControls${activeTab === "home" || activeTab === "favorites" ? " sports-bar-hidden" : ""}`}>
        <div className="sportsBar">
          {sports.map((sport) => (
            <button
              key={sport.name}
              className={`sportPill ${selectedSport === sport.name ? "sportPillActive" : ""}`}
              onClick={() => setSelectedSport(sport.name)}
            >
              {sport.icon} {sport.name}
            </button>
          ))}
        </div>
      </div>

      <Routes>
        <Route
          path="/game"
          element={
            <GameDetails
              game={selectedGame}
              games={games}
              isAdmin={isAdmin}
              onBack={() => {
                const returnPath = sessionStorage.getItem("gameReturnPath");
                if (returnPath?.startsWith("/team?")) {
                  navigate(returnPath);
                  return;
                }
                const previousTab = sessionStorage.getItem("prevTab") || "scores";
                setActiveTab(previousTab);
                sessionStorage.setItem("activeTab", previousTab);
                navigate("/");
              }}
              onScoreSaved={(updatedGame) => {
                setSelectedGame(updatedGame);
                sessionStorage.setItem("selectedGame", JSON.stringify(updatedGame));
              }}
              onTeamClick={(game, teamName) =>
                openTeamRoute({
                  teamName,
                  division: game.division || "Unknown",
                  ageGroup: getAgeGroup(game),
                  sport: game.sport || "Soccer",
                })
              }
            />
          }
        />
        <Route path="/team" element={<TeamProfileRoute games={games} onGameClick={openGameDetails} />} />
        <Route
          path="/"
          element={
            <main className="mainContent">
              {activeTab === "home" && <Home games={games} openGameDetails={openGameDetails} />}
              {activeTab === "scores" && (
                <ScoresTab
                  games={games}
                  selectedSport={selectedSport}
                  openTeamRoute={openTeamRoute}
                  openGameDetails={openGameDetails}
                  isAdmin={isAdmin}
                />
              )}
              {activeTab === "standings" && (
                <StandingsTab games={games} selectedSport={selectedSport} openTeamRoute={openTeamRoute} />
              )}
              {activeTab === "favorites" && (
                <FavoritesTab
                  games={games}
                  openTeamRoute={openTeamRoute}
                  setActiveTab={handleTabChange}
                  setSelectedSport={setSelectedSport}
                />
              )}
            </main>
          }
        />
      </Routes>

      <TabNavigation activeTab={activeTab} setActiveTab={handleTabChange} />
    </div>
  );
}
