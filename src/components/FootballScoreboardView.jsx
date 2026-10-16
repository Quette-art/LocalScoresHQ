import React, { useEffect, useMemo, useState } from "react";
import TeamMascot from "./TeamMascot";
import { gameMatchesRegion } from "../data/teamRegions";
import "./FootballScoreboardView.css";

function parseLocalDate(dateString) {
  if (!dateString) return null;
  const date = new Date(`${dateString}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getWeekStartKey(dateString) {
  const date = parseLocalDate(dateString);
  if (!date) return "";

  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + mondayOffset);
  return toDateKey(date);
}

function formatDay(dateString) {
  const date = parseLocalDate(dateString);
  if (!date) return { weekday: "", date: dateString || "" };

  return {
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
    date: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  };
}

function formatWeekRange(startKey) {
  const start = parseLocalDate(startKey);
  if (!start) return "";

  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const startText = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endText = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${startText}–${endText}`;
}

function isFavoriteGame(game, favorites) {
  const division = game.division || "Unknown";
  return (
    favorites.includes(game.team1) ||
    favorites.includes(game.team2) ||
    favorites.includes(`${game.team1}-${division}`) ||
    favorites.includes(`${game.team2}-${division}`)
  );
}

function getGameState(game) {
  const status = String(game.status || "").toLowerCase();

  if (
    status.includes("live") ||
    status.includes("in progress") ||
    status.includes("halftime") ||
    status.includes("quarter")
  ) {
    return "live";
  }

  if (
    status === "final" ||
    (game.score1 != null && game.score2 != null)
  ) {
    return "final";
  }

  return "upcoming";
}

function parseTimeValue(value) {
  if (!value || value === "TBD") return Number.MAX_SAFE_INTEGER;
  const match = String(value).match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return Number.MAX_SAFE_INTEGER;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const suffix = match[3].toUpperCase();

  if (suffix === "PM" && hour !== 12) hour += 12;
  if (suffix === "AM" && hour === 12) hour = 0;

  return hour * 60 + minute;
}

function gameSort(a, b) {
  if (a.date !== b.date) return String(a.date).localeCompare(String(b.date));
  return parseTimeValue(a.time) - parseTimeValue(b.time);
}

function buildRecords(games) {
  const records = {};

  const ensure = (team) => {
    if (!records[team]) {
      records[team] = { wins: 0, losses: 0, ties: 0 };
    }
    return records[team];
  };

  games.forEach((game) => {
    if (game.score1 == null || game.score2 == null) return;

    const score1 = Number(game.score1);
    const score2 = Number(game.score2);
    if (!Number.isFinite(score1) || !Number.isFinite(score2)) return;

    const team1 = ensure(game.team1);
    const team2 = ensure(game.team2);

    if (score1 > score2) {
      team1.wins += 1;
      team2.losses += 1;
    } else if (score2 > score1) {
      team2.wins += 1;
      team1.losses += 1;
    } else {
      team1.ties += 1;
      team2.ties += 1;
    }
  });

  return records;
}

function recordText(records, teamName) {
  const record = records[teamName] || { wins: 0, losses: 0, ties: 0 };
  return record.ties
    ? `${record.wins}-${record.losses}-${record.ties}`
    : `${record.wins}-${record.losses}`;
}

function ScoreboardGameRow({
  game,
  records,
  favoriteTeams,
  openTeamProfile,
  openGameDetails,
  isAdmin,
  openScoreModal,
  openEditGame,
  updateGameStatus,
  deleteGame,
}) {
  const state = getGameState(game);
  const favorite1 =
    favoriteTeams.includes(game.team1) ||
    favoriteTeams.includes(`${game.team1}-${game.division}`);
  const favorite2 =
    favoriteTeams.includes(game.team2) ||
    favoriteTeams.includes(`${game.team2}-${game.division}`);

  const status = String(game.status || "").toLowerCase();
  const statusLabel =
    status === "cancelled"
      ? "CANCELLED"
      : status === "postponed"
        ? "POSTPONED"
        : state === "live"
          ? String(game.status || "LIVE").toUpperCase()
          : state === "final"
            ? "FINAL"
            : game.time || "TBD";

  return (
    <div
      className={`weeklyScoreGame weeklyScoreGame--${state}`}
      onClick={() => openGameDetails?.(game)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          openGameDetails?.(game);
        }
      }}
    >
      <div className="weeklyScoreStatusCol">
        <strong>{statusLabel}</strong>
        <span>{formatDay(game.date).date}</span>
      </div>

      <div className="weeklyScoreTeams">
        <button
          className="weeklyScoreTeam"
          onClick={(event) => {
            event.stopPropagation();
            openTeamProfile(game, game.team1);
          }}
        >
          <TeamMascot
            teamName={game.team1}
            className="weeklyScoreMascot"
          />
          <span className="weeklyScoreTeamCopy">
            <strong>
              {favorite1 ? "★ " : ""}
              {game.team1}
            </strong>
            <small>({recordText(records, game.team1)})</small>
          </span>
        </button>

        <button
          className="weeklyScoreTeam"
          onClick={(event) => {
            event.stopPropagation();
            openTeamProfile(game, game.team2);
          }}
        >
          <TeamMascot
            teamName={game.team2}
            className="weeklyScoreMascot"
          />
          <span className="weeklyScoreTeamCopy">
            <strong>
              {favorite2 ? "★ " : ""}
              {game.team2}
            </strong>
            <small>({recordText(records, game.team2)})</small>
          </span>
        </button>
      </div>

      <div className="weeklyScoreNumbers">
        {state === "final" || state === "live" ? (
          <>
            <strong>{game.score1 ?? "-"}</strong>
            <span>–</span>
            <strong>{game.score2 ?? "-"}</strong>
          </>
        ) : (
          <span className="weeklyScoreVs">VS</span>
        )}
      </div>

      <div className="weeklyScoreMeta">
        <span>{game.division || "Varsity"}</span>
        <span>{game.location || "TBD"}</span>
      </div>

      <span className="weeklyScoreChevron" aria-hidden="true">›</span>

      {isAdmin && (
        <div className="weeklyScoreAdmin" onClick={(event) => event.stopPropagation()}>
          <button type="button" onClick={() => openScoreModal(game)}>
            {state === "final" ? "Edit Score" : "Report Score"}
          </button>
          <button type="button" onClick={() => openEditGame(game)}>
            Edit Game
          </button>
          <button
            type="button"
            className="weeklyScoreAdminWarn"
            onClick={() => updateGameStatus(game, "postponed")}
          >
            Postpone
          </button>
          <button
            type="button"
            className="weeklyScoreAdminDanger"
            onClick={() => updateGameStatus(game, "cancelled")}
          >
            Cancel
          </button>
          <button
            type="button"
            className="weeklyScoreAdminDanger"
            onClick={() => deleteGame(game)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function ScoreboardSection({
  type,
  title,
  games,
  ...rowProps
}) {
  if (!games.length) return null;

  return (
    <section className="weeklyScoreSection">
      <div className="weeklyScoreSectionHeader">
        <span className={`weeklyScoreSectionPill weeklyScoreSectionPill--${type}`}>
          {title}
        </span>
        <strong>{games.length} {games.length === 1 ? "GAME" : "GAMES"}</strong>
      </div>

      <div className="weeklyScoreSectionList">
        {games.map((game) => (
          <ScoreboardGameRow key={game.id} game={game} {...rowProps} />
        ))}
      </div>
    </section>
  );
}

export default function FootballScoreboardView({
  games = [],
  favoriteTeams = [],
  regionFilter,
  setRegionFilter,
  selectedDate,
  setSelectedDate,
  openTeamProfile,
  openGameDetails,
  isAdmin,
  openScoreModal,
  openEditGame,
  updateGameStatus,
  deleteGame,
}) {
  const footballGames = useMemo(
    () =>
      games.filter(
        (game) =>
          game.sport === "Football" &&
          !game.notificationTest
      ),
    [games]
  );

  const weekKeys = useMemo(
    () =>
      [
        ...new Set(
          footballGames
            .map((game) => getWeekStartKey(game.date))
            .filter(Boolean)
        ),
      ].sort(),
    [footballGames]
  );

  const todayKey = toDateKey(new Date());
  const todayWeekKey = getWeekStartKey(todayKey);

  const [selectedWeekKey, setSelectedWeekKey] = useState("");
  const [activeDate, setActiveDate] = useState("ALL");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    if (!weekKeys.length) return;

    const selectedDateWeek = getWeekStartKey(selectedDate);
    const initial =
      (selectedDateWeek && weekKeys.includes(selectedDateWeek)
        ? selectedDateWeek
        : null) ||
      (weekKeys.includes(todayWeekKey) ? todayWeekKey : null) ||
      weekKeys.find((key) => key >= todayWeekKey) ||
      weekKeys[weekKeys.length - 1];

    setSelectedWeekKey((current) =>
      current && weekKeys.includes(current) ? current : initial
    );
  }, [weekKeys, selectedDate, todayWeekKey]);

  useEffect(() => {
    setActiveDate("ALL");
  }, [selectedWeekKey]);

  const weekIndex = Math.max(0, weekKeys.indexOf(selectedWeekKey));

  const weekGames = useMemo(() => {
    return footballGames.filter(
      (game) => getWeekStartKey(game.date) === selectedWeekKey
    );
  }, [footballGames, selectedWeekKey]);

  const weekDates = useMemo(
    () => [...new Set(weekGames.map((game) => game.date))].sort(),
    [weekGames]
  );

  const visibleGames = useMemo(() => {
    return weekGames
      .filter((game) => gameMatchesRegion(game, regionFilter))
      .filter((game) => !favoritesOnly || isFavoriteGame(game, favoriteTeams))
      .filter((game) => activeDate === "ALL" || game.date === activeDate)
      .sort(gameSort);
  }, [
    weekGames,
    regionFilter,
    favoritesOnly,
    favoriteTeams,
    activeDate,
  ]);

  const records = useMemo(() => buildRecords(footballGames), [footballGames]);

  const liveGames = visibleGames.filter((game) => getGameState(game) === "live");
  const finalGames = visibleGames.filter((game) => getGameState(game) === "final");
  const upcomingGames = visibleGames.filter(
    (game) => getGameState(game) === "upcoming"
  );

  const rowProps = {
    records,
    favoriteTeams,
    openTeamProfile,
    openGameDetails,
    isAdmin,
    openScoreModal,
    openEditGame,
    updateGameStatus,
    deleteGame,
  };

  return (
    <div className="footballScoreboard">
      <div className="weeklyScoreTopline">
        <div>
          <p>DC &amp; Maryland High School Sports</p>
          <h2>Football Scoreboard</h2>
        </div>

        <label className="weeklyScoreWeekSelect">
          <span className="srOnly">Choose week</span>
          <select
            value={selectedWeekKey}
            onChange={(event) => setSelectedWeekKey(event.target.value)}
          >
            {weekKeys.map((key, index) => (
              <option key={key} value={key}>
                Week {index + 1} · {formatWeekRange(key)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="weeklyScoreDates" role="group" aria-label="Scoreboard dates">
        {weekDates.map((date) => {
          const formatted = formatDay(date);
          const active = activeDate === date;

          return (
            <button
              key={date}
              type="button"
              className={active ? "active" : ""}
              onClick={() => {
                setActiveDate(date);
                setSelectedDate?.(date);
              }}
            >
              <span>{formatted.weekday}</span>
              <strong>{formatted.date}</strong>
            </button>
          );
        })}

        <button
          type="button"
          className={activeDate === "ALL" ? "active" : ""}
          onClick={() => setActiveDate("ALL")}
        >
          <span>Whole</span>
          <strong>Week</strong>
        </button>
      </div>

      <div className="weeklyScoreFilters" role="group" aria-label="Scoreboard filters">
        {[
          { value: "ALL", label: "All Games" },
          { value: "DC", label: "DC" },
          { value: "MD", label: "Maryland" },
        ].map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={
              !favoritesOnly && regionFilter === filter.value ? "active" : ""
            }
            onClick={() => {
              setFavoritesOnly(false);
              setRegionFilter(filter.value);
            }}
          >
            {filter.label}
          </button>
        ))}

        <button
          type="button"
          className={favoritesOnly ? "active favorite" : "favorite"}
          onClick={() => setFavoritesOnly(true)}
        >
          ★ My Teams
        </button>
      </div>

      {!visibleGames.length ? (
        <div className="weeklyScoreEmpty">
          <strong>No games match these filters.</strong>
          <span>Try another day, area, or week.</span>
        </div>
      ) : (
        <>
          <ScoreboardSection
            type="live"
            title="LIVE"
            games={liveGames}
            {...rowProps}
          />
          <ScoreboardSection
            type="final"
            title="FINAL"
            games={finalGames}
            {...rowProps}
          />
          <ScoreboardSection
            type="upcoming"
            title="UPCOMING"
            games={upcomingGames}
            {...rowProps}
          />
        </>
      )}

      <div className="weeklyScoreFooter">
        Week {weekIndex + 1} · {formatWeekRange(selectedWeekKey)}
      </div>
    </div>
  );
}
