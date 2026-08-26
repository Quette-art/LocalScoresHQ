import React, { useEffect, useState } from "react";
import {
  getScoreMascot,
  getStandingsMascot,
  getTeamMascot,
} from "../data/teamMascots";

const getInitials = (teamName = "") =>
  teamName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "?";

export default function TeamMascot({ teamName, className = "", fallbackColor }) {
  const [failed, setFailed] = useState(false);
  const isStandingsMark = className.includes("footballTeamMark");
  const isScoreMark =
    className.includes("score-team-mascot") ||
    className.includes("game-details-team-logo");

  const mascot =
    (isScoreMark ? getScoreMascot(teamName) : null) ||
    (isStandingsMark ? getStandingsMascot(teamName) : null) ||
    getTeamMascot(teamName);

  useEffect(() => {
    setFailed(false);
  }, [mascot]);

  if (mascot && !failed) {
    return (
      <span className={`team-mascot ${className}`.trim()}>
        <img
          src={mascot}
          alt={`${teamName} unofficial mascot`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      </span>
    );
  }

  return (
    <span
      className={`team-mascot team-mascot-fallback ${className}`.trim()}
      style={fallbackColor ? { background: fallbackColor } : undefined}
      aria-label={teamName}
    >
      {getInitials(teamName)}
    </span>
  );
}
