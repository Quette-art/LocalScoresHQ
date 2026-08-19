import React, {
  useMemo,
  useState,
} from "react";
import { upcomingGames } from "../data/games";
import "./ScoresTab.css";

const DCIAA_TEAMS = [
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
];

const WCAC_TEAMS = [
  "Archbishop Carroll",
  "Bishop McNamara",
  "DeMatha",
  "Gonzaga",
  "Good Counsel",
  "St. John’s",
];

const DC_TEAMS = [
  ...DCIAA_TEAMS,
  "Archbishop Carroll",
  "Digital Pioneers Academy",
  "Gonzaga",
  "KIPP College Prep",
  "KIPP DC Legacy",
  "Sidwell Friends",
  "St. John’s",
];

const PGCPS_TEAMS = [
  "Bladensburg",
  "Bowie",
  "Central",
  "Crossland",
  "DuVal",
  "Eleanor Roosevelt",
  "Fairmont Heights",
  "Flowers",
  "Frederick Douglass",
  "Friendly",
  "Gwynn Park",
  "High Point",
  "Largo",
  "Laurel",
  "Northwestern",
  "Oxon Hill",
  "Parkdale",
  "Potomac",
  "Suitland",
  "Surrattsville",
  "Wise",
];

const VIEW_OPTIONS = [
  {
    id: "overall",
    label: "Overall DC",
  },
  {
    id: "dciaa",
    label: "DCIAA",
  },
  {
    id: "wcac",
    label: "WCAC",
  },
  {
    id: "pgcps",
    label: "Maryland · PGCPS",
  },
];

const emptyRecord = (team) => ({
  team,
  division: "Varsity",
  ageGroup: "Varsity",
  wins: 0,
  losses: 0,
  ties: 0,
  conferenceWins: 0,
  conferenceLosses: 0,
  conferenceTies: 0,
  pointsFor: 0,
  pointsAgainst: 0,
  results: [],
});

const isCompleted = (game) =>
  game.score1 !== null &&
  game.score1 !== undefined &&
  game.score2 !== null &&
  game.score2 !== undefined;

const isConferenceGame = (
  game,
  view
) => {
  const notes = (
    game.notes || ""
  ).toLowerCase();

  if (view === "dciaa") {
    return notes.includes(
      "dciaa league game"
    );
  }

  if (view === "wcac") {
    return notes.includes(
      "wcac league game"
    );
  }

  if (view === "pgcps") {
    return (
      PGCPS_TEAMS.includes(game.team1) &&
      PGCPS_TEAMS.includes(game.team2)
    );
  }

  return (
    notes.includes(
      "dciaa league game"
    ) ||
    notes.includes(
      "wcac league game"
    )
  );
};

const percentage = (team) => {
  const games =
    team.wins +
    team.losses +
    team.ties;

  if (!games) return ".000";

  return (
    (team.wins + team.ties * 0.5) /
    games
  )
    .toFixed(3)
    .replace(/^0/, "");
};

const streak = (results) => {
  if (!results.length) return "–";

  const latest = results.at(-1);
  let count = 0;

  for (
    let index = results.length - 1;
    index >= 0;
    index -= 1
  ) {
    if (
      results[index] !== latest
    ) {
      break;
    }

    count += 1;
  }

  return `${latest}${count}`;
};

export default function StandingsTab({
  games = upcomingGames,
  selectedSport = "Football",
  openTeamRoute,
}) {
  const [
    activeView,
    setActiveView,
  ] = useState("overall");

  const standings = useMemo(() => {
    const includedTeams =
      activeView === "pgcps"
        ? PGCPS_TEAMS
        : activeView === "dciaa"
        ? DCIAA_TEAMS
        : activeView === "wcac"
          ? WCAC_TEAMS
          : DC_TEAMS;

    const includedSet =
      new Set(includedTeams);

    const table =
      Object.fromEntries(
        includedTeams.map((team) => [
          team,
          emptyRecord(team),
        ])
      );

    games
      .filter(
        (game) =>
          game.sport === "Football" &&
          isCompleted(game)
      )
      .sort((gameA, gameB) =>
        `${gameA.date} ${gameA.time}`.localeCompare(
          `${gameB.date} ${gameB.time}`
        )
      )
      .forEach((game) => {
        const conferenceGame =
          isConferenceGame(
            game,
            activeView
          );

        if (
          ["dciaa", "wcac"].includes(activeView) &&
          !conferenceGame
        ) {
          return;
        }

        const score1 = Number(
          game.score1
        );

        const score2 = Number(
          game.score2
        );

        const entries = [
          {
            name: game.team1,
            score: score1,
            opponentScore: score2,
          },
          {
            name: game.team2,
            score: score2,
            opponentScore: score1,
          },
        ];

        entries.forEach(
          ({
            name,
            score,
            opponentScore,
          }) => {
            if (
              !includedSet.has(name)
            ) {
              return;
            }

            const record =
              table[name];

            record.pointsFor +=
              score;

            record.pointsAgainst +=
              opponentScore;

            const result =
              score > opponentScore
                ? "W"
                : score <
                    opponentScore
                  ? "L"
                  : "T";

            record.results.push(
              result
            );

            if (result === "W") {
              record.wins += 1;
            }

            if (result === "L") {
              record.losses += 1;
            }

            if (result === "T") {
              record.ties += 1;
            }

            if (conferenceGame) {
              if (result === "W") {
                record.conferenceWins += 1;
              }

              if (result === "L") {
                record.conferenceLosses += 1;
              }

              if (result === "T") {
                record.conferenceTies += 1;
              }
            }
          }
        );
      });

    return Object.values(
      table
    ).sort((teamA, teamB) => {
      const pctDifference =
        Number(
          percentage(teamB)
        ) -
        Number(
          percentage(teamA)
        );

      if (pctDifference) {
        return pctDifference;
      }

      if (
        teamB.wins !==
        teamA.wins
      ) {
        return (
          teamB.wins -
          teamA.wins
        );
      }

      const teamADifference =
        teamA.pointsFor -
        teamA.pointsAgainst;

      const teamBDifference =
        teamB.pointsFor -
        teamB.pointsAgainst;

      if (
        teamBDifference !==
        teamADifference
      ) {
        return (
          teamBDifference -
          teamADifference
        );
      }

      return teamA.team.localeCompare(
        teamB.team
      );
    });
  }, [activeView, games]);

  if (
    selectedSport !== "Football"
  ) {
    return (
      <div className="standingsPage">
        <h2 className="standingsTitle">
          {selectedSport} Standings
        </h2>

        <div className="standingsEmpty">
          Standings for this sport
          are coming soon.
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

  const sectionTitle =
    activeView === "pgcps"
      ? "Prince George’s County Football"
      : activeView === "dciaa"
      ? "DCIAA Football"
      : activeView === "wcac"
        ? "WCAC Football"
        : "D.C. Overall";
          return (
    <div className="standingsPage footballStandingsPage">
      <div className="footballStandingsHeading">
        <div>
          <span className="standingsEyebrow">2026 SEASON</span>
          <h2 className="standingsTitle">Football Standings</h2>
        </div>
        <span className="standingsUpdated">
          Records update when final scores are entered
        </span>
      </div>

      <div
        className="standingsViewTabs"
        role="tablist"
        aria-label="Standings view"
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
          <h3>{sectionTitle}</h3>
          <span>{standings.length} teams</span>
        </div>

        {activeView === "dciaa" && (
          <p className="standingsNotice">
            Stars and Stripes groups will be added when the official 2026
            alignment is published.
          </p>
        )}

        {activeView === "pgcps" && (
          <p className="standingsNotice">
            High Point’s 2026 varsity schedule has not been published. Schedule
            details marked subject to change are awaiting official confirmation.
          </p>
        )}

        <div className="footballStandingsScroller">
          <div className="footballStandingsTable">
            <div className="footballStandingsRow footballStandingsHeader">
              <span className="footballTeamCell">TEAM</span>
              <span>W</span>
              <span>L</span>
              <span>T</span>
              <span>PCT</span>
              <span>CONF</span>
              <span>PF</span>
              <span>PA</span>
              <span>DIFF</span>
              <span>STRK</span>
            </div>

            {standings.map((team) => {
              const diff = team.pointsFor - team.pointsAgainst;
              const conf = `${team.conferenceWins}-${team.conferenceLosses}-${team.conferenceTies}`;

              return (
                <div key={team.team} className="footballStandingsRow">
                  <button
                    type="button"
                    className="footballTeamCell footballTeamButton"
                    onClick={() => openTeam(team)}
                  >
                    <span className="footballTeamMark">
                      {team.team
                        .split(/\s+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((word) => word[0])
                        .join("")}
                    </span>

                    <strong>{team.team}</strong>
                  </button>

                  <span>{team.wins}</span>
                  <span>{team.losses}</span>
                  <span>{team.ties}</span>
                  <span>{percentage(team)}</span>
                  <span>{conf}</span>
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
        <span>
          <strong>PCT</strong> = Winning percentage
        </span>
        <span>
          <strong>CONF</strong> = Conference record
        </span>
        <span>
          <strong>PF</strong> = Points for
        </span>
        <span>
          <strong>PA</strong> = Points against
        </span>
        <span>
          <strong>STRK</strong> = Current streak
        </span>
      </div>
    </div>
  );
}
