import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";

import { collection, onSnapshot } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebase";
import { requestNotificationPermission } from "./notifications";

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

function ScrollToTop() {
  const { pathname, search } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname, search]);
  return null;
}

function TeamProfileRoute({ games }) {
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
    />
  );
}

function AppContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [selectedSport, setSelectedSport] = useState("Soccer");
  const [games, setGames] = useState(upcomingGames);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin = !!adminUser;

 const baseSports = [
  { name: "Soccer", icon: "⚽" },
  { name: "Flag Football", icon: "🚩" },
  { name: "Basketball", icon: "🏀" },
  { name: "Baseball", icon: "⚾" },
  { name: "Football", icon: "🏈" },
];

const hasScore = (game) =>
  game.score1 !== null && game.score1 !== undefined &&
  game.score2 !== null && game.score2 !== undefined;

const favoriteTeamsList = JSON.parse(localStorage.getItem("favoriteTeams")) || [];

const favoriteSports = new Set(
  games
    .filter((game) => {
      const team1Key = `${game.team1}-${game.division}`;
      const team2Key = `${game.team2}-${game.division}`;
      return favoriteTeamsList.includes(team1Key) || favoriteTeamsList.includes(team2Key);
    })
    .map((game) => game.sport || "Soccer")
);

const nextGameBySport = {};
const today = new Date();
today.setHours(0, 0, 0, 0);

games.forEach((game) => {
  if (hasScore(game)) return;
  const sport = game.sport || "Soccer";
  const gameDate = new Date(game.date + "T00:00:00");
  if (gameDate < today) return;
  if (!nextGameBySport[sport] || gameDate < nextGameBySport[sport]) {
    nextGameBySport[sport] = gameDate;
  }
});

const sports = [...baseSports].sort((a, b) => {
  const aHasFavoriteUpcoming = favoriteSports.has(a.name) && nextGameBySport[a.name];
  const bHasFavoriteUpcoming = favoriteSports.has(b.name) && nextGameBySport[b.name];

  if (aHasFavoriteUpcoming && !bHasFavoriteUpcoming) return -1;
  if (bHasFavoriteUpcoming && !aHasFavoriteUpcoming) return 1;

  const aNext = nextGameBySport[a.name];
  const bNext = nextGameBySport[b.name];

  if (!aNext && bNext) return 1;
  if (!bNext && aNext) return -1;
  if (!aNext && !bNext) return 0;

  return aNext - bNext;
});

  const sportIcons = {
    Baseball: "⚾",
    Soccer: "⚽",
    Basketball: "🏀",
    Football: "🏈",
    "Flag Football": "🚩",
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
          ...(firebaseOverride ? {
            team1: firebaseOverride.team1 || game.team1,
            team2: firebaseOverride.team2 || game.team2,
            date: firebaseOverride.date || game.date,
            time: firebaseOverride.time || game.time,
            location: firebaseOverride.location || game.location,
            division: firebaseOverride.division || game.division,
          } : {}),
          ...(savedScore ? { score1: savedScore.score1, score2: savedScore.score2 } : {}),
          ...(status ? { status } : {}),
        };
      });

      const localIds = new Set(upcomingGames.map((g) => g.id));
      const newFirebaseGames = firebaseGames
        .filter((g) => !localIds.has(g.id))
        .map((game) => {
          const status = gameStatuses[game.id];
          return { ...game, ...(status ? { status } : {}) };
        });

      const merged = [...localWithScores, ...newFirebaseGames];
      setGames(merged);

      if (selectedGame) {
        const updated = merged.find((g) => g.id === selectedGame.id);
        if (updated) {
          setSelectedGame(updated);
          sessionStorage.setItem("selectedGame", JSON.stringify(updated));
        }
      }
    };

    const unsubscribeScores = onSnapshot(
      collection(db, "scores"),
      (snapshot) => {
        firebaseScores = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          firebaseScores[docSnap.id] = {
            score1: Number(data.score1),
            score2: Number(data.score2),
          };
        });
        buildMerged();
      }
    );

    const unsubscribeGames = onSnapshot(
      collection(db, "games"),
      (snapshot) => {
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
      }
    );

    const unsubscribeStatus = onSnapshot(
      collection(db, "gameStatus"),
      (snapshot) => {
        gameStatuses = {};
        snapshot.forEach((docSnap) => {
          gameStatuses[docSnap.id] = docSnap.data().status;
        });
        buildMerged();
      }
    );

    return () => {
      unsubscribeScores();
      unsubscribeGames();
      unsubscribeStatus();
    };
  }, [selectedGame]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
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

  const handleSportClick = (sportName) => {
    setSelectedSport(sportName);
    navigate("/");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedGame(null);
    sessionStorage.removeItem("selectedGame");
    navigate("/");
  };

  const getAgeGroup = (game) => {
    if (game.ageGroup) return game.ageGroup;
    if (game.division) return game.division.split(" / ")[0];
    return "Unknown";
  };

  const openTeamRoute = (team) => {
    navigate(
      `/team?name=${encodeURIComponent(team.teamName)}&division=${encodeURIComponent(team.division)}&ageGroup=${encodeURIComponent(team.ageGroup)}&sport=${encodeURIComponent(team.sport)}`
    );
  };

  const openGameDetails = (game) => {
    setSelectedGame(game);
    sessionStorage.setItem("selectedGame", JSON.stringify(game));
    sessionStorage.setItem("prevTab", activeTab);
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
        teamMap[key] = { teamName, sport, division, ageGroup, icon: sportIcons[sport] || "🏆" };
      }
    });
  });

  const normalize = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]/g, "");

const levenshtein = (a, b) => {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = 1 + Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]);
      }
    }
  }
  return matrix[a.length][b.length];
};



const isFavoriteTeam = (team) =>
  favoriteTeamsList.includes(`${team.teamName}-${team.division}`);

const allTeamsSorted = Object.values(teamMap).sort((a, b) => {
  const aFav = isFavoriteTeam(a);
  const bFav = isFavoriteTeam(b);
  if (aFav && !bFav) return -1;
  if (bFav && !aFav) return 1;
  return a.teamName.localeCompare(b.teamName);
});

const searchResults =
  searchTerm.trim() === ""
    ? allTeamsSorted
    : allTeamsSorted
        .map((team) => {
          const normTeam = normalize(team.teamName);
          const normQuery = normalize(searchTerm);

          let score;
          if (normTeam.includes(normQuery)) {
            score = 0; // direct substring match, best priority
          } else {
            score = levenshtein(normTeam, normQuery);
          }
          return { team, score };
        })
        .filter(({ score, team }) => {
          const normQuery = normalize(searchTerm);
          // allow typos proportional to query length
          const maxDistance = Math.max(2, Math.floor(normQuery.length * 0.4));
          return score <= maxDistance;
        })
        .sort((a, b) => a.score - b.score || a.team.teamName.localeCompare(b.team.teamName))
        .map(({ team }) => team);

  return (
    <div className="appShell">
      <header className="mobileAppHeader">
        <button className="headerIconBtn" onClick={() => setShowGlobalSearch(true)}>🔍</button>
        <div className="brandSection">
          <img src="/logo.png" alt="LocalScoresHQ" className="appLogo" />
          {isAdmin && <div className="adminBadge">ADMIN MODE</div>}
        </div>
        <button className="headerIconBtn" onClick={() => setShowSettings(true)}>⚙️</button>
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="close-search-btn" onClick={() => { setShowGlobalSearch(false); setSearchTerm(""); }}>×</button>
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
                    onClick={() => { openTeamRoute(team); setShowGlobalSearch(false); setSearchTerm(""); }}
                  >
                    <div>
                      <strong>{team.icon} {team.teamName}</strong>
                      <span>{team.sport} • {team.ageGroup} • {team.division}</span>
                    </div>
                    <span className="team-result-arrow">›</span>
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
              ref={(el) => {
                if (el && selectedSport === sport.name) {
                  el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                }
              }}
              onClick={() => handleSportClick(sport.name)}
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
                const prev = sessionStorage.getItem("prevTab") || "scores";
                setActiveTab(prev);
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
        <Route path="/team" element={<TeamProfileRoute games={games} />} />
        <Route
          path="/"
          element={
            <main className="mainContent">
              {activeTab === "home" && (
                <Home
                  games={games}
                  selectedSport={selectedSport}
                  onSportSelect={setSelectedSport}
                  openGameDetails={openGameDetails}
                />
              )}
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
                <StandingsTab
                  games={games}
                  selectedSport={selectedSport}
                  openTeamRoute={openTeamRoute}
                />
              )}
              {activeTab === "favorites" && (
  <FavoritesTab
    games={games}
    openTeamRoute={openTeamRoute}
    setActiveTab={setActiveTab}
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

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}