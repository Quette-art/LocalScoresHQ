import React, { useEffect, useState } from "react";
import { getTeamMascot } from "../data/teamMascots";

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
  const mascot = getTeamMascot(teamName);
  const isStandingsMark = className.includes("footballTeamMark");

  useEffect(() => {
    setFailed(false);
  }, [mascot]);

  if (mascot && !failed) {
    return (
      <span className={`team-mascot ${className}`.trim()}>
        <img
          src={mascot}
          alt={`${teamName} unofficial mascot`}
          loading={isStandingsMark ? "eager" : "lazy"}
          decoding={isStandingsMark ? "sync" : "async"}
          fetchPriority={isStandingsMark ? "high" : "auto"}
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
