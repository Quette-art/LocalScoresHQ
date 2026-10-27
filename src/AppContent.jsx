import { teamSearchLabel } from "./teamSummary.js";
import { Search, Settings } from "lucide-react";
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
import {
  requestNotificationPermission,
  notifyGameChanges,
  getNotificationPrefs,
  saveNotificationPrefs,
  syncPushSubscription,
  listenForForegroundPush,
  sendIphonePushTest,
} from "./notifications";

import Home from "./pages/Home";
import TeamProfile from "./pages/TeamProfile";
import GameDetails from "./pages/GameDetails";
import ScoresTab from "./components/ScoresTab";
import AdminScoreDashboard from "./components/AdminScoreDashboard";
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
  const [notifPrefs, setNotifPrefs] = useState(() => getNotificationPrefs());
  const [notifTestStatus, setNotifTestStatus] = useState("");

  const isAdmin = !!adminUser;

  const sports = [
    { name: "Football", icon: "\uD83C\uDFC8" },
    { name: "Soccer", icon: "\u26bd" },
    { name: "Basketball", icon: "\uD83C\uDFC0" },
    { name: "Baseball", icon: "\u26BE" },
  ];

  const sportIcons = {
    Baseball: "\u26BE",
    Soccer: "\u26bd",
    Basketball: "\uD83C\uDFC0",
    Football: "\uD83C\uDFC8",
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    ) {
      const prefs = getNotificationPrefs();
      // Having OS permission does not mean the user opted in, or that a
      // push subscription was successfully created.
      if (prefs.enabled) {
        void syncPushSubscription({ prefs });
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = listenForForegroundPush();
    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    let firebaseScores = {};
    let firebaseGames = [];
    let gameStatuses = {};
    // Initial Firestore collection snapshots are history, not new score alerts.
    const initialSnapshots = { scores: false, games: false, status: false };
    let resumedAt = Date.now();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") resumedAt = Date.now();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const buildMerged = (announceLiveChanges = false) => {
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
          ...(savedScore ? {
            score1: savedScore.score1, score2: savedScore.score2,
            ...(savedScore.sourceUrl ? { sourceUrl: savedScore.sourceUrl } : {}),
            ...(savedScore.sourceTier ? { sourceTier: savedScore.sourceTier } : {}),
            ...(savedScore.verificationStatus
              ? { verificationStatus: savedScore.verificationStatus } : {}),
          } : {}),
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
      setGames((prev) => gamesLookSame(prev, merged) ? prev : merged);

      // Never emit notifications inside React state updaters, which React
      // Strict Mode may invoke multiple times. Server push handles background
      // delivery; loading old results must not replay them as fresh alerts.
      const isActive =
        document.visibilityState === "visible" &&
        Date.now() - resumedAt > 10000;
      notifyGameChanges(merged, { silent: !announceLiveChanges || !isActive });

      if (selectedGameRef.current) {
        const updated = merged.find((g) => g.id === selectedGameRef.current.id);
        if (updated) {
          setSelectedGame(updated);
          sessionStorage.setItem("selectedGame", JSON.stringify(updated));
        }
      }
    };

    const unsubscribeScores = onSnapshot(collection(db, "scores"), (snapshot) => {
      const announceLiveChanges =
        initialSnapshots.scores && initialSnapshots.games && initialSnapshots.status;
      firebaseScores = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        firebaseScores[docSnap.id] = {
          score1: Number(data.score1),
          score2: Number(data.score2),
          sourceUrl: data.sourceUrl || "",
          sourceTier: data.sourceTier || "",
          verificationStatus: data.verificationStatus || "",
        };
      });
      initialSnapshots.scores = true;
      buildMerged(announceLiveChanges);
    });

    const unsubscribeGames = onSnapshot(collection(db, "games"), (snapshot) => {
      const announceLiveChanges =
        initialSnapshots.scores && initialSnapshots.games && initialSnapshots.status;
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
      initialSnapshots.games = true;
      buildMerged(announceLiveChanges);
    });

    const unsubscribeStatus = onSnapshot(collection(db, "gameStatus"), (snapshot) => {
      const announceLiveChanges =
        initialSnapshots.scores && initialSnapshots.games && initialSnapshots.status;
      gameStatuses = {};
      snapshot.forEach((docSnap) => {
        gameStatuses[docSnap.id] = docSnap.data().status;
      });
      initialSnapshots.status = true;
      buildMerged(announceLiveChanges);
    });

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
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
    if (tab === "admin" && !isAdmin) return;
    setActiveTab(tab);
    sessionStorage.setItem("activeTab", tab);
    setSelectedGame(null);
    sessionStorage.removeItem("selectedGame");
    const destination = tab === "admin" ? "/admin/scores" : "/";
    if (location.pathname !== destination) {
      navigate(destination);
    }
  };

  // Direct preview links and browser refreshes must select the admin workspace.
  useEffect(() => {
    if (location.pathname === "/admin/scores") {
      setActiveTab("admin");
      sessionStorage.setItem("activeTab", "admin");
    }
  }, [location.pathname]);

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
            <Search size={21} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
        <div className="mobileHeaderLogo">
          <img src="/logo-option-1.png" alt="Local Scores" />
        </div>
        <div className="mobileHeaderRight">
          <button className="mobileHeaderAction" onClick={() => setShowSettings(true)} aria-label="Settings">
            <Settings size={21} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
        <div className="desktopHeaderBrand">
          <div className="brandSection">
            <img className="brandLogoImage" src="/logo-option-1.png" alt="Local Scores logo" />
            {isAdmin && <div className="adminBadge">ADMIN MODE</div>}
          </div>
          <nav className="headerNavLinks">
            {["home", "scores", "standings", "favorites", ...(isAdmin ? ["admin"] : [])].map((tab) => (
              <button
                key={tab}
                className={`headerNavLink${activeTab === tab ? " headerNavLinkActive" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab === "admin" ? "Admin Dashboard" : tab[0].toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
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
            <button className="close-search-btn" aria-label="Close team search" onClick={() => { setShowGlobalSearch(false); setSearchTerm(""); }}>
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
                      <span>{teamSearchLabel(team)}</span>
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
                <button className="submit-score-btn" onClick={() => { handleTabChange("admin"); setShowSettings(false); }} style={{ width: "100%", marginBottom: 10 }}>Score Management Dashboard</button>
                <button className="submit-score-btn" onClick={handleLogout}>Sign Out</button>
              </>
            ) : (
              <>
                <input className="submit-input" type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="submit-input" type="password" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="submit-score-btn" onClick={handleLogin}>Sign In</button>
              </>
            )}
            <div className="settings-notif" style={{ margin: "16px 0", textAlign: "left" }}>
              <p style={{ margin: "0 0 8px", fontWeight: 700 }}>Notifications</p>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "#64748b" }}>
                Alerts for your favorite teams when scores or schedules change.
              </p>
              <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={!!notifPrefs.enabled}
                  onChange={async (e) => {
                    if (e.target.checked) {
                      const token = await requestNotificationPermission();
                      const next = {
                        ...getNotificationPrefs(),
                        enabled: !!token,
                      };
                      saveNotificationPrefs(next);
                      setNotifPrefs(next);
                      setNotifTestStatus(token ? "" : "Push registration did not complete. Open the Home Screen app and check iPhone notification permissions.");
                    } else {
                      const next = { ...notifPrefs, enabled: false };
                      saveNotificationPrefs(next);
                      setNotifPrefs(next);
                      void syncPushSubscription({ prefs: next });
                    }
                  }}
                />
                <span>Enable notifications</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, cursor: "pointer", opacity: notifPrefs.enabled ? 1 : 0.5 }}>
                <input
                  type="checkbox"
                  disabled={!notifPrefs.enabled}
                  checked={!!notifPrefs.scores}
                  onChange={(e) => {
                    const next = { ...notifPrefs, scores: e.target.checked };
                    saveNotificationPrefs(next);
                    setNotifPrefs(next);
                    void syncPushSubscription({ prefs: next });
                  }}
                />
                <span>Score updates</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", opacity: notifPrefs.enabled ? 1 : 0.5 }}>
                <input
                  type="checkbox"
                  disabled={!notifPrefs.enabled}
                  checked={!!notifPrefs.schedule}
                  onChange={(e) => {
                    const next = { ...notifPrefs, schedule: e.target.checked };
                    saveNotificationPrefs(next);
                    setNotifPrefs(next);
                    void syncPushSubscription({ prefs: next });
                  }}
                />
                <span>Schedule changes</span>
              </label>
              <details className="notification-troubleshooting">
                <summary>Troubleshoot notifications</summary>
                <p>Check whether notifications reach your iPhone while the app is in the background.</p>
                <button
                  type="button"
                  className="submit-score-btn"
                  style={{ marginTop: 14, width: "100%" }}
                  onClick={async () => {
                    setNotifTestStatus("Sending a test in five seconds. Lock your iPhone now.");
                    try {
                      await sendIphonePushTest();
                      setNotifTestStatus("The push service accepted the test. Check your iPhone's Notification Center.");
                    } catch (error) {
                      setNotifTestStatus(error?.message || "The push test failed.");
                    }
                  }}
                >
                  Test iPhone background notification
                </button>
              </details>
              {notifTestStatus && (
                <p role="status" aria-live="polite" style={{ fontSize: 13, marginTop: 10 }}>
                  {notifTestStatus}
                </p>
              )}
            </div>
            <button className="close-settings" onClick={() => setShowSettings(false)}>Close</button>
          </div>
        </div>
      )}

      <div className={`topControls${activeTab === "home" || activeTab === "favorites" || activeTab === "admin" ? " sports-bar-hidden" : ""}`}>
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
                navigate(previousTab === "admin" ? "/admin/scores" : "/");
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
          path="/admin/scores"
          element={
            <main className="mainContent">
              {isAdmin ? (
                <AdminScoreDashboard games={games} onOpenGame={openGameDetails} adminUser={adminUser} />
              ) : (
                <div className="no-games">
                  <p>Sign in through Settings to access the admin dashboard.</p>
                  <button type="button" className="submit-score-btn" onClick={() => setShowSettings(true)}>
                    Open admin sign in
                  </button>
                </div>
              )}
            </main>
          }
        />
        <Route
          path="/"
          element={
            <main className="mainContent">
              {activeTab === "home" && <Home games={games} openGameDetails={openGameDetails} />}
              {activeTab === "admin" && isAdmin && (
                <AdminScoreDashboard games={games} onOpenGame={openGameDetails} adminUser={adminUser} />
              )}
              {activeTab === "admin" && !isAdmin && (
                <div className="no-games">Sign in through Settings to access the admin dashboard.</div>
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
                <StandingsTab games={games} selectedSport={selectedSport} openTeamRoute={openTeamRoute} />
              )}
              {activeTab === "favorites" && (
                <FavoritesTab
                  games={games}
                  onOpenGame={openGameDetails}
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
