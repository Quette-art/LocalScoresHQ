import { saveTrackedFavorites } from "../siteActivity";
import { favoriteSummary, teamSearchLabel } from "../teamSummary.js";
import { hasFinal, resultValue, todayEastern } from "../dashboardUtils.js";
import React, { useState } from "react";
import TeamMascot from "../components/TeamMascot";
import { getNotificationPrefs, syncPushSubscription } from "../notifications";
import "../components/ScoresTab.css";
import "./TeamProfileMobileFix.css";
import "./TeamProfileFeatures.css";

const DCIAA_TEAMS = new Set([
  "Anacostia",
  "Ballou",
  "Bell",
  "Cardozo",
  "Coolidge",
  "Dunbar",
  "Eastern",
  "H.D. Woodson",
  "Jackson-Reed",
  "McKinley Tech",
  "Phelps ACE",
  "Ron Brown",
  "Roosevelt",
]);

const WCAC_TEAMS = new Set([
  "Archbishop Carroll",
  "Bishop McNamara",
  "DeMatha",
  "Gonzaga",
  "Good Counsel",
  "St. John's",
]);

export default function TeamProfile({
  teamName,
  division,
  ageGroup,
  sport = "Football",
  games,
  onBack,
  onGameClick,
}) {
  const [favoriteTeams, setFavoriteTeams] = useState(
    JSON.parse(localStorage.getItem("favoriteTeams")) || []
  );

  const teamKey = `${teamName}-${division}`;
  const isFavorite = favoriteTeams.includes(teamKey);

  const toggleFavorite = () => {
    let updated;

    if (isFavorite) {
      updated = favoriteTeams.filter((team) => team !== teamKey);
    } else {
      updated = [...favoriteTeams, teamKey];
    }

    setFavoriteTeams(updated);
    saveTrackedFavorites(updated);
    if (isFavorite || getNotificationPrefs().enabled) {
      void syncPushSubscription({ favorites: updated });
    }
    if (!isFavorite) {
      window.dispatchEvent(new CustomEvent("lshq:favorite-added", { detail: { teamName } }));
    }
  };

  const scheduleGames = games.filter(
    (game) =>
      (game.team1 === teamName || game.team2 === teamName) &&
      (game.division || "Unknown") === division
  ).sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));

  const completedGames = scheduleGames.filter(hasFinal);
  const today = todayEastern();
  const { nextGame } = favoriteSummary({ teamName, division, sport }, scheduleGames, today);
  const months = new Map();
  for (const game of scheduleGames) {
    if (game === nextGame) continue;
    const month = /^\d{4}-\d{2}-\d{2}$/.test(game.date || "") ? game.date.slice(0, 7) : "";
    if (!months.has(month)) months.set(month, []);
    months.get(month).push(game);
  }

  const currentMonth = today.slice(0, 7);
  const monthOrder = (month) => !month ? 2 : month >= currentMonth ? 0 : 1;
  const orderedMonths = [...months].sort(([a], [b]) =>
    monthOrder(a) - monthOrder(b) || (monthOrder(a) === 1 ? b.localeCompare(a) : a.localeCompare(b))
  );

  const conferenceName = DCIAA_TEAMS.has(teamName)
    ? "DCIAA"
    : WCAC_TEAMS.has(teamName)
      ? "WCAC"
      : "Independent";

  const isConferenceGame = (game) => {
    const notes = String(game.notes || "").toUpperCase();

    return (
      conferenceName !== "Independent" &&
      notes.includes(conferenceName)
    );
  };

  const conferenceGames = completedGames.filter(isConferenceGame);

  let conferenceWins = 0;
  let conferenceLosses = 0;
  let conferenceTies = 0;

  conferenceGames.forEach((game) => {
    const isTeam1 = game.team1 === teamName;
    const teamScore = resultValue(isTeam1 ? game.score1 : game.score2);
    const opponentScore = resultValue(isTeam1 ? game.score2 : game.score1);

    if (teamScore > opponentScore) {
      conferenceWins += 1;
    } else if (teamScore < opponentScore) {
      conferenceLosses += 1;
    } else {
      conferenceTies += 1;
    }
  });

  let wins = 0;
  let losses = 0;
  let ties = 0;
  let pf = 0;
  let pa = 0;

  completedGames.forEach((game) => {
    const isTeam1 = game.team1 === teamName;
    const teamScore = resultValue(isTeam1 ? game.score1 : game.score2);
    const opponentScore = resultValue(isTeam1 ? game.score2 : game.score1);

    if (!game.forfeit) {
      pf += teamScore;
      pa += opponentScore;
    }

    if (teamScore > opponentScore) {
      wins += 1;
    } else if (teamScore < opponentScore) {
      losses += 1;
    } else {
      ties += 1;
    }
  });

  const diff = pf - pa;
  const lastFive = completedGames.slice(-5).reverse();

  const winPct =
    completedGames.length > 0 ? wins / completedGames.length : 0;

  const streak = (() => {
    if (lastFive.length === 0) {
      return "-";
    }

    const results = completedGames
      .slice()
      .reverse()
      .map((game) => {
        const isTeam1 = game.team1 === teamName;
        const teamScore = resultValue(isTeam1 ? game.score1 : game.score2);
        const opponentScore = resultValue(isTeam1 ? game.score2 : game.score1);

        if (teamScore > opponentScore) return "W";
        if (teamScore < opponentScore) return "L";
        return "T";
      });

    const resultType = results[0];
    let count = 0;

    for (const result of results) {
      if (result === resultType) {
        count += 1;
      } else {
        break;
      }
    }

    return `${resultType}${count}`;
  })();

  const getResultLetter = (game) => {
    const isTeam1 = game.team1 === teamName;
    const teamScore = resultValue(isTeam1 ? game.score1 : game.score2);
    const opponentScore = resultValue(isTeam1 ? game.score2 : game.score1);

    if (teamScore > opponentScore) return "W";
    if (teamScore < opponentScore) return "L";
    return "T";
  };

  const lastFiveResults = lastFive
    .slice()
    .reverse()
    .map(getResultLetter);

  const getSplitRecord = (splitGames) => {
    let splitWins = 0;
    let splitLosses = 0;
    let splitTies = 0;

    splitGames.forEach((game) => {
      const result = getResultLetter(game);
      if (result === "W") splitWins += 1;
      else if (result === "L") splitLosses += 1;
      else splitTies += 1;
    });

    return `${splitWins}-${splitLosses}${splitTies ? `-${splitTies}` : ""}`;
  };

  const homeRecord = getSplitRecord(
    completedGames.filter((game) => game.team1 === teamName)
  );
  const awayRecord = getSplitRecord(
    completedGames.filter((game) => game.team2 === teamName)
  );

  const formatDate = (date) => {
    const formattedDate = new Date(`${date}T12:00:00`);
    if (Number.isNaN(formattedDate.getTime())) return "Date TBD";

    return formattedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getScheduleBadge = (game) => {
    const status = `${game.status || ""} ${game.scheduleStatus || ""}`.toLowerCase();
    const notes = String(game.notes || "").toLowerCase();

    if (status.includes("cancel")) return "CANCELED";
    if (status.includes("postpon")) return "POSTPONED";
    if (notes.includes("moved") || notes.includes("reschedul")) return "MOVED";
    if (notes.includes("time change") || notes.includes("time updated")) return "TIME CHANGED";
    if (game.subjectToChange) return "SCHEDULE UPDATE";
    return "";
  };

  const renderMatch = (game, featured = false) => {
    const final = hasFinal(game);
    const result = final ? getResultLetter(game) : "";
    const status = getScheduleBadge(game) ||
      (final ? "Final" : game.date && game.date < today ? "Result pending" : "Upcoming");

    return (
      <button type="button" className={`teamScheduleMatch${featured ? " is-next" : ""}`} key={game.id}
        onClick={() => onGameClick?.(game)}>
        {featured && <span className="teamScheduleNextLabel">Next game</span>}
        <span className="teamScheduleTeams">
          {[[game.team1, game.score1], [game.team2, game.score2]].map(([name, score], index) => (
            <span className="teamScheduleTeam" key={index}>
              <span aria-hidden="true"><TeamMascot teamName={name} className="teamScheduleCrest" /></span>
              <strong>{name}</strong>
              {final && <b className="teamScheduleScore">{score ?? "—"}</b>}
            </span>
          ))}
        </span>
        <span className="teamScheduleOutcome">
          {final && <strong className={`teamScheduleResult result-${result.toLowerCase()}`}>{result}</strong>}
          <small>{formatDate(game.date)}</small>
          {!final && game.time && <strong>{game.time}</strong>}
          {featured && game.location && <small>{game.location}</small>}
          {(!featured || status !== "Upcoming") && <small>{status}</small>}
        </span>
        <span className="teamScheduleArrow" aria-hidden="true">›</span>
      </button>
    );
  };

  return (
    <div className="team-profile">
      <div className="teamProfileTopBar">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Back
        </button>

        <div className="teamProfileActions">
          <button
            type="button"
            className="alert-btn"
            aria-label="Manage team alerts"
            onClick={() => window.dispatchEvent(new CustomEvent("lshq:manage-favorite-alerts", { detail: { teamName } }))}
          >
            🔔
          </button>

          <button
            type="button"
            className={`teamFollowButton${isFavorite ? " is-following" : ""}`}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Remove team from favorites" : "Add team to favorites"}
            onClick={toggleFavorite}
          >
            <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
            {isFavorite ? "Following" : "Follow"}
          </button>
        </div>
      </div>

      <div className="team-header">
        <TeamMascot
          teamName={teamName}
          className={`team-logo ${teamName === "Benedictine" ? "team-logo-benedictine" : ""}`}
        />

        <div className="team-header-info">
          <div className="team-name-record-row">
            <h1>{teamName || "Unknown Team"}</h1>
            <span className="team-header-record">
              {wins}-{losses}{ties > 0 ? `-${ties}` : ""}
            </span>
          </div>

          <span>
            {teamSearchLabel({ sport, ageGroup, division })}{conferenceName !== "Independent" ? ` • ${conferenceName}` : ""}
          </span>
        </div>
      </div>

      <section className="team-section teamSeasonSchedule" aria-label="Season schedule">
        <h2>Season Schedule</h2>
        {nextGame && renderMatch(nextGame, true)}
        {scheduleGames.length === 0 && <p className="no-games">No games scheduled.</p>}
        {orderedMonths.map(([month, monthGames]) => (
          <section className="teamScheduleMonth" key={month}>
            <h3>
              {month ? new Date(`${month}-15T12:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Date TBD"}
              <span>{monthGames.length} {monthGames.length === 1 ? "game" : "games"}</span>
            </h3>
            {monthGames.map((game) => renderMatch(game))}
          </section>
        ))}
      </section>

      <div className="team-section">
        <h2>Standings</h2>

        <div className="maxpreps-record-grid">
          <div className="maxpreps-record-box">
            <span className="maxpreps-record-label">Overall</span>
            <strong className="maxpreps-record-value">
              {wins}-{losses}{ties > 0 ? `-${ties}` : ""}
            </strong>
            <span className="maxpreps-record-sub">
              {winPct.toFixed(3)} Win Pct
            </span>
          </div>

          <div className="maxpreps-record-box">
            <span className="maxpreps-record-label">Conference</span>
            <strong className="maxpreps-record-value">
              {conferenceWins}-{conferenceLosses}
              {conferenceTies > 0 ? `-${conferenceTies}` : ""}
            </strong>
            <span className="maxpreps-record-sub">{conferenceName}</span>
          </div>

          <div className="maxpreps-record-mini-grid">
            <div className="maxpreps-mini-stat"><span>PF</span><strong>{pf}</strong></div>
            <div className="maxpreps-mini-stat"><span>PA</span><strong>{pa}</strong></div>
            <div className="maxpreps-mini-stat">
              <span>DIFF</span>
              <strong className={diff > 0 ? "diff-pos" : diff < 0 ? "diff-neg" : ""}>
                {diff > 0 ? "+" : ""}{diff}
              </strong>
            </div>
            <div className="maxpreps-mini-stat"><span>Streak</span><strong>{streak}</strong></div>
          </div>

          <div className="team-form-summary">
            <div className="team-form-block">
              <span className="team-form-label">Last 5</span>
              <div className="team-form-results" aria-label="Last five results">
                {lastFiveResults.length > 0 ? (
                  lastFiveResults.map((result, index) => (
                    <span
                      key={`form-${index}-${result}`}
                      className={`team-form-result result-${result.toLowerCase()}`}
                    >
                      {result}
                    </span>
                  ))
                ) : (
                  <span className="team-form-empty">No results yet</span>
                )}
              </div>
            </div>

            <div className="team-split-records">
              <div>
                <span>Home</span>
                <strong>{homeRecord}</strong>
              </div>
              <div>
                <span>Away</span>
                <strong>{awayRecord}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
