import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { upcomingGames } from "../data/games";

import "./ScoresTab.css";

const soccerFilters = [
  "6U Division / American",
  "6U Division / National",
  "8U Division / American",
  "8U Division / National",
  "10U Division / Division",
  "12U Division / Division",
];

const flagFootballFilters = [
  "Coed / 5U",
  "Coed / 6U American",
  "Coed / 6U National",
  "Coed / 7U",
  "Coed / 8U American",
  "Coed / 8U National",
  "Coed / 9U",
  "Coed / 10U American",
  "Coed / 10U National",
  "Coed / 11U",
  "Coed / 12U American",
  "Coed / 12U National",
  "Coed / 13U",
  "Coed / 14U",
  "Girls / 14U",
];

export default function StandingsTab({
  games = upcomingGames,
  selectedSport = "Soccer",
  openTeamRoute,
}) {
  const activeFilters =
    selectedSport === "Flag Football"
      ? flagFootballFilters
      : soccerFilters;

  const [divisionFilter, setDivisionFilter] =
    useState(activeFilters[0]);

  useEffect(() => {
    setDivisionFilter(activeFilters[0]);
  }, [selectedSport]);

  const standings = useMemo(() => {
    const table = {};

    const filteredGames = games.filter(
      (game) => {
        const matchesSport =
          game.sport === selectedSport;

        const matchesDivision =
          !divisionFilter ||
          game.division ===
            divisionFilter;

        const hasScore =
          game.score1 != null &&
          game.score2 != null;

        return (
          matchesSport &&
          matchesDivision &&
          hasScore
        );
      }
    );

    filteredGames.forEach((game) => {
      const s1 = Number(game.score1);

      const s2 = Number(game.score2);

      const teams = [
        {
          name: game.team1,
          score: s1,
          opponentScore: s2,
        },

        {
          name: game.team2,
          score: s2,
          opponentScore: s1,
        },
      ];

      teams.forEach((team) => {
        if (!team.name) return;

        const key = `${team.name}-${game.division}`;

        if (!table[key]) {
          table[key] = {
            team: team.name,

            division:
              game.division ||
              "Unknown",

            ageGroup:
              game.ageGroup ||
              game.division?.split(
                " / "
              )[0] ||
              "Unknown",

            wins: 0,

            losses: 0,

            ties: 0,

            gamesPlayed: 0,

            pointsFor: 0,

            pointsAgainst: 0,
          };
        }

        table[key].gamesPlayed += 1;

        table[key].pointsFor +=
          team.score;

        table[key].pointsAgainst +=
          team.opponentScore;

        if (
          team.score >
          team.opponentScore
        ) {
          table[key].wins += 1;
        } else if (
          team.score <
          team.opponentScore
        ) {
          table[key].losses += 1;
        } else {
          table[key].ties += 1;
        }
      });
    });

    return Object.values(table).sort(
      (a, b) => {
        const ptsA =
          a.wins * 3 + a.ties;

        const ptsB =
          b.wins * 3 + b.ties;

        if (ptsB !== ptsA)
          return ptsB - ptsA;

        const diffA =
          a.pointsFor -
          a.pointsAgainst;

        const diffB =
          b.pointsFor -
          b.pointsAgainst;

        if (diffB !== diffA)
          return diffB - diffA;

        return (
          b.pointsFor - a.pointsFor
        );
      }
    );
  }, [
    games,
    divisionFilter,
    selectedSport,
  ]);

  const handleTeamClick = (team) => {
    if (!openTeamRoute) return;

    openTeamRoute({
      teamName: team.team,

      division: team.division,

      ageGroup: team.ageGroup,

      sport: selectedSport,
    });
  };

  return (
    <div className="standingsPage">
      <h2 className="standingsTitle">
        {selectedSport} Standings
      </h2>

      <select
        className="divisionSelect"
        value={divisionFilter}
        onChange={(e) =>
          setDivisionFilter(
            e.target.value
          )
        }
      >
        {activeFilters.map(
          (division) => (
            <option
              key={division}
              value={division}
            >
              {division}
            </option>
          )
        )}
      </select>

      <div className="standingsTable">
        <div className="standingsHeader">
          <span>Team</span>
          <span>W</span>
          <span>L</span>
          <span>T</span>
          <span>GP</span>
          <span>PF</span>
          <span>PA</span>
          <span>DIFF</span>
          <span>PTS</span>
        </div>

        {standings.length === 0 ? (
          <div className="standingsEmpty">
            No completed games for
            this division yet.
          </div>
        ) : (
          standings.map((team, i) => {
            const diff =
              team.pointsFor -
              team.pointsAgainst;

            const pts =
              team.wins * 3 +
              team.ties;

            return (
              <div
                key={`${team.team}-${team.division}-${team.ageGroup}`}
                className="standingsRow"
              >
                <button
                  className="standingTeamButton"
                  onClick={() =>
                    handleTeamClick(
                      team
                    )
                  }
                >
                {team.team}
                </button>

                <span className="winText">
                  {team.wins}
                </span>

                <span className="lossText">
                  {team.losses}
                </span>

                <span>
                  {team.ties}
                </span>

                <span>
                  {team.gamesPlayed}
                </span>

                <span>
                  {team.pointsFor}
                </span>

                <span>
                  {
                    team.pointsAgainst
                  }
                </span>

                <span>{diff}</span>

                <span className="points">
                  {pts}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="standingsLegend">
        <span>
          <strong>W</strong> = Wins
        </span>

        <span>
          <strong>L</strong> = Losses
        </span>

        <span>
          <strong>T</strong> = Ties
        </span>

        <span>
          <strong>GP</strong> = Games
          Played
        </span>

        <span>
          <strong>PF</strong> = Points
          For
        </span>

        <span>
          <strong>PA</strong> = Points
          Against
        </span>

        <span>
          <strong>DIFF</strong> = Point
          Differential
        </span>

        <span>
          <strong>PTS</strong> = Total
          Points
        </span>
      </div>
    </div>
  );
}