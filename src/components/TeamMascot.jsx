import React, { useState } from "react";
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
  const [failedMascot, setFailedMascot] = useState(null);
  const isStandingsMark = className.includes("footballTeamMark");
  const isScoreMark =
    className.includes("score-team-mascot") ||
    className.includes("game-details-team-logo");

  const normalizedTeamName = teamName.trim();
  const isStEdward =
    normalizedTeamName === "St. Edward" || normalizedTeamName === "St Edward";
  const isBenedictine = normalizedTeamName === "Benedictine";

  const specialMascot = isStEdward
    ? isScoreMark
      ? "/mascots/st-edward-score-se.svg"
      : "/mascots/st-edward-eagles-hq.svg"
    : null;

  const mascot =
    specialMascot ||
    (isScoreMark ? getScoreMascot(teamName) : null) ||
    (isStandingsMark ? getStandingsMascot(teamName) : null) ||
    getTeamMascot(teamName);

  if (mascot && failedMascot !== mascot) {
    return (
      <span className={`team-mascot ${className}`.trim()}>
        <img
          src={mascot}
          alt={`${teamName} unofficial mascot`}
          loading={isBenedictine && !isScoreMark ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailedMascot(mascot)}
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
