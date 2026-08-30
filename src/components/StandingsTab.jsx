import React, { useMemo, useState } from "react";
import { upcomingGames } from "../data/games";
import {
  canonicalFootballTeamName,
  dcOverallFootballSchools,
  footballCompetitionGroups,
  getFootballCompetitionGroup,
  getPrimaryFootballCompetitionGroup,
  isFootballCompetitionGame,
  marylandOverallFootballSchools,
} from "../data/footballCompetitionGroups";
import TeamMascot from "./TeamMascot";
import "./ScoresTab.css";
import "./StandingsTab.css";

const OVERALL_VIEWS = [
  {
    id: "dc-overall",
    label: "D.C. Overall",
    title: "D.C. Tracked Schools",
    teams: dcOverallFootballSchools,
    groupId: null,
    note:
      "Overall record includes every verified final on LocalScoresHQ. DIV is each school's primary league/division record.",
  },
  {
    id: "md-overall",
    label: "Maryland Overall",
    title: "Maryland Tracked Schools",
    teams: marylandOverallFootballSchools,
    groupId: null,
    note:
      "Overall record includes every verified final on LocalScoresHQ. DIV is each school's primary league/division record.",
  },
];

const GROUP_VIEW_ORDER = [
  "dciaa-stars",
  "dciaa-stripes",
  "wcac-capital",
  "wcac-metro",
  "pgcps-4a3a",
  "pgcps-2a1a",
  "iac",
  "mac",
  "dc-other",
  "md-other",
];

const GROUP_VIEWS = GROUP_VIEW_ORDER.map((id) => {
  const entry = getFootballCompetitionGroup(id);
  return {
    id,
    label: entry?.label || id,
    title: entry?.label || id,
    teams: entry?.trackedTeams || [],
    groupId: id,
    note: entry?.note || "",
  };
});

const VIEW_OPTIONS = [...OVERALL_VIEWS, ...GROUP_VIEWS];
const VIEW_BY_ID = new Map(VIEW_OPTIONS.map((view) => [view.id, view]));

const emptyRecord = (team) => ({
  team,
  division: "Varsity",
  ageGroup: "Varsity",
  wins: 0,
  losses: 0,
  ties: 0,
  divisionWins: 0,
  divisionLosses: 0,
  divisionTies: 0,
  pointsFor: 0,
  pointsAgainst: 0,
  results: [],
});

const isCompleted = (game) =>
  game.score1 !== null &&
  game.score1 !== undefined &&
  game.score2 !== null &&
  game.score2 !== undefined &&
  game.status !== "cancelled" &&
  game.status !== "postponed";

const recordGames = (team, type = "overall") => {
  if (type === "division") {
    return team.divisionWins + team.divisionLosses + team.divisionTies;
  }
  return team.wins + team.losses + team.ties;
};

const percentage = (team, type = "overall") => {
  const games = recordGames(team, type);
  if (!games) return ".000";

  const wins = type === "division" ? team.divisionWins : team.wins;
  const ties = type === "division" ? team.divisionTies : team.ties;

  return ((wins + ties * 0.5) / games).toFixed(3).replace(/^0/, "");
};

const percentageNumber = (team, type = "overall") =>
  Number(percentage(team, type));

const streak = (results) => {
  if (!results.length) return "–";

  const latest = results.at(-1);
  let count = 0;

  for (let index = results.length - 1; index >= 0; index -= 1) {
    if (results[index] !== latest) break;
    count += 1;
  }

  return `${latest}${count}`;
};

const addResult = (record, score, opponentScore, divisionGame) => {
  record.pointsFor += score;
  record.pointsAgainst += opponentScore;

  const result = score > opponentScore ? "W" : score < opponentScore ? "L" : "T";
  record.results.push(result);

  if (result === "W") record.wins += 1;
  if (result === "L") record.losses += 1;
  if (result === "T") record.ties += 1;

  if (!divisionGame) return;

  if (result === "W") record.divisionWins += 1;
  if (result === "L") record.divisionLosses += 1;
  if (result === "T") record.divisionTies += 1;
};

const teamDivisionLabel = (teamName) =>
  getPrimaryFootballCompetitionGroup(teamName)?.shortLabel || "Independent";

export default function StandingsTab({
  games = upcomingGames,
  selectedSport = "Football",
  openTeamRoute,
}) {
  const [activeView, setActiveView] = useState("dc-overall");

  const activeConfig = VIEW_BY_ID.get(activeView) || VIEW_OPTIONS[0];

  const standings = useMemo(() => {
    const includedTeams = activeConfig.teams;
    const includedSet = new Set(includedTeams);
    const table = Object.fromEntries(
      includedTeams.map((team) => [team, emptyRecord(team)])
    );

    games
      .filter((game) => game.sport === "Football" && isCompleted(game))
      .sort((gameA, gameB) =>
        `${gameA.date} ${gameA.time}`.localeCompare(
          `${gameB.date} ${gameB.time}`
        )
      )
      .forEach((game) => {
        const team1 = canonicalFootballTeamName(game.team1);
        const team2 = canonicalFootballTeamName(game.team2);
        const score1 = Number(game.score1);
        const score2 = Number(game.score2);

        [
          { name: team1, score: score1, opponentScore: score2 },
          { name: team2, score: score2, opponentScore: score1 },
        ].forEach(({ name, score, opponentScore }) => {
          if (!includedSet.has(name)) return;

          let divisionGame = false;

          if (activeConfig.groupId) {
            divisionGame = isFootballCompetitionGame(game, activeConfig.groupId);
          } else {
            const primaryGroup = getPrimaryFootballCompetitionGroup(name);
            divisionGame = primaryGroup
              ? isFootballCompetitionGame(game, primaryGroup.id)
              : false;
          }

          addResult(table[name], score, opponentScore, divisionGame);
        });
      });

    const rows = Object.values(table);
    const hasDivisionResults = rows.some((team) => recordGames(team, "division") > 0);

    return rows.sort((teamA, teamB) => {
      if (activeConfig.groupId && hasDivisionResults) {
        const divisionPctDifference =
          percentageNumber(teamB, "division") - percentageNumber(teamA, "division");
        if (divisionPctDifference) return divisionPctDifference;

        if (teamB.divisionWins !== teamA.divisionWins) {
          return teamB.divisionWins - teamA.divisionWins;
        }

        if (teamA.divisionLosses !== teamB.divisionLosses) {
          return teamA.divisionLosses - teamB.divisionLosses;
        }
      }

      const overallPctDifference =
        percentageNumber(teamB) - percentageNumber(teamA);
      if (overallPctDifference) return overallPctDifference;

      if (teamB.wins !== teamA.wins) return teamB.wins - teamA.wins;

      const teamADifference = teamA.pointsFor - teamA.pointsAgainst;
      const teamBDifference = teamB.pointsFor - teamB.pointsAgainst;
      if (teamBDifference !== teamADifference) {
        return teamBDifference - teamADifference;
      }

      return teamA.team.localeCompare(teamB.team);
    });
  }, [activeConfig, games]);

  if (selectedSport !== "Football") {
    return (
      <div className="standingsPage">
        <h2 className="standingsTitle">{selectedSport} Standings</h2>
        <div className="standingsEmpty">
          Standings for this sport are coming soon.
        </div>
      </div>
    );
  }

  const openTeam = (team) => {
    openTeamRoute?.({
      teamName: team.team,
      division: team.division,
      ageGroup: team.ageGroup,
      sport: "Football",
    });
  };

  return (
    <div className="standingsPage footballStandingsPage">
      <div className="footballStandingsHeading">
        <div>
          <span className="standingsEyebrow">2026 SEASON</span>
          <h2 className="standingsTitle">Football Standings</h2>
        </div>
        <span className="standingsUpdated">
          Verified finals update records automatically
        </span>
      </div>

      <div
        className="standingsViewTabs standingsDivisionTabs"
        role="tablist"
        aria-label="Football standings division"
      >
        {VIEW_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={activeView === option.id}
            className={activeView === option.id ? "active" : ""}
            onClick={() => setActiveView(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <section className="footballStandingsSection">
        <div className="footballStandingsSectionTitle">
          <div>
            <h3>{activeConfig.title}</h3>
            {activeConfig.groupId && (
              <span className="standingsGroupType">2026 division / league view</span>
            )}
          </div>
          <span>{standings.length} tracked teams</span>
        </div>

        {activeConfig.note && (
          <p className="standingsNotice">{activeConfig.note}</p>
        )}

        <div className="footballStandingsScroller">
          <div className="footballStandingsTable">
            <div className="footballStandingsRow footballStandingsHeader">
              <span className="footballTeamCell">TEAM</span>
              <span>W</span>
              <span>L</span>
              <span>T</span>
              <span>PCT</span>
              <span>DIV</span>
              <span>PF</span>
              <span>PA</span>
              <span>DIFF</span>
              <span>STRK</span>
            </div>

            {standings.map((team) => {
              const diff = team.pointsFor - team.pointsAgainst;
              const divisionRecord = `${team.divisionWins}-${team.divisionLosses}-${team.divisionTies}`;

              return (
                <div key={team.team} className="footballStandingsRow">
                  <button
                    type="button"
                    className="footballTeamCell footballTeamButton"
                    onClick={() => openTeam(team)}
                  >
                    <TeamMascot
                      teamName={team.team}
                      className="footballTeamMark"
                    />
                    <span className="standingsTeamText">
                      <strong>{team.team}</strong>
                      {!activeConfig.groupId && (
                        <small>{teamDivisionLabel(team.team)}</small>
                      )}
                    </span>
                  </button>

                  <span>{team.wins}</span>
                  <span>{team.losses}</span>
                  <span>{team.ties}</span>
                  <span>{percentage(team)}</span>
                  <span>{divisionRecord}</span>
                  <span>{team.pointsFor}</span>
                  <span>{team.pointsAgainst}</span>
                  <span
                    className={
                      diff > 0
                        ? "positiveDiff"
                        : diff < 0
                          ? "negativeDiff"
                          : ""
                    }
                  >
                    {diff > 0 ? `+${diff}` : diff}
                  </span>
                  <span>{streak(team.results)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="standingsLegend">
        <span><strong>PCT</strong> = Overall winning percentage</span>
        <span><strong>DIV</strong> = Division / league record</span>
        <span><strong>PF</strong> = Points for</span>
        <span><strong>PA</strong> = Points against</span>
        <span><strong>STRK</strong> = Overall current streak</span>
      </div>
    </div>
  );
}
