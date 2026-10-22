import React from "react";
import { ArrowRight, CalendarDays, CheckCircle2 } from "lucide-react";
import TeamMascot from "./TeamMascot";
import { favoriteSummary, shortGameDate, teamSearchLabel } from "../teamSummary.js";
import "./FavoriteTeamSummary.css";

export default function FavoriteTeamSummary({ team, games, today, onOpenTeam, onOpenGame }) {
  const { lastGame, nextGame, result } = favoriteSummary(team, games, today);
  const nextOpponent = nextGame?.team1 === team.teamName ? nextGame?.team2 : nextGame?.team1;
  const openGame = (game) => onOpenGame ? onOpenGame(game) : onOpenTeam(team);

  return (
    <article className="favoriteSummaryCard" aria-label={`${team.teamName} summary`}>
      <button type="button" className="favoriteSummaryHeading" onClick={() => onOpenTeam(team)}>
        <TeamMascot teamName={team.teamName} className="favoriteSummaryMascot" />
        <span className="favoriteSummaryIdentity">
          <strong>{team.teamName}</strong>
          <small>{teamSearchLabel(team)}</small>
        </span>
        <ArrowRight size={18} aria-hidden="true" />
      </button>
      {lastGame ? (
        <button type="button" className="favoriteSummaryGame" onClick={() => openGame(lastGame)}>
          <span className="favoriteSummaryLabel"><CheckCircle2 size={14} aria-hidden="true" /> Latest result</span>
          <span className="favoriteSummaryMatchup">
            <TeamMascot teamName={team.teamName} className="favoriteSummaryGameLogo" />
            <b className={`favoriteSummaryOutcome outcome${result.outcome}`}>{result.outcome} {result.ownScore}–{result.opponentScore}</b>
            <span className="favoriteSummaryOpponent"><span>vs</span><TeamMascot teamName={result.opponent} className="favoriteSummaryGameLogo" /><span>{result.opponent}</span></span>
          </span>
          <small>{shortGameDate(lastGame.date)} · Final</small>
        </button>
      ) : (
        <div className="favoriteSummaryEmpty"><span className="favoriteSummaryLabel">Latest result</span><p>No result recorded yet.</p></div>
      )}
      {nextGame ? (
        <button type="button" className="favoriteSummaryGame" onClick={() => openGame(nextGame)}>
          <span className="favoriteSummaryLabel"><CalendarDays size={14} aria-hidden="true" /> Next game</span>
          <span className="favoriteSummaryMatchup">
            <TeamMascot teamName={team.teamName} className="favoriteSummaryGameLogo" />
            <span className="favoriteSummaryOpponent"><span>vs</span><TeamMascot teamName={nextOpponent} className="favoriteSummaryGameLogo" /><strong>{nextOpponent}</strong></span>
          </span>
          <small>{shortGameDate(nextGame.date)} · {nextGame.time || "Time TBD"}</small>
          {nextGame.location && nextGame.location !== "TBD" && <small>{nextGame.location}</small>}
        </button>
      ) : (
        <div className="favoriteSummaryEmpty"><span className="favoriteSummaryLabel">Next game</span><p>No upcoming game scheduled.</p></div>
      )}
    </article>
  );
}
