import React, { memo, useEffect, useState } from "react";
import { getTeamMascot } from "../data/teamMascots";

const PGCPS_TEAMS = new Set([
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
]);

const getInitials = (teamName = "") =>
  teamName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "?";

function TeamMascot({ teamName, className = "", fallbackColor }) {
  const [failed, setFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches
  );
  const mascot = getTeamMascot(teamName);

  useEffect(() => {
    setFailed(false);
  }, [mascot]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const media = window.matchMedia("(max-width: 900px)");
    const onChange = (event) => setIsMobile(event.matches);

    setIsMobile(media.matches);
    media.addEventListener?.("change", onChange);

    return () => media.removeEventListener?.("change", onChange);
  }, []);

  // The approved DC/WCAC crest SVGs contain large embedded artwork. Decoding many
  // of them at once was causing visible scroll jank on iPhone standings pages.
  // Keep the already-smooth PGCPS standings logos intact, but use a lightweight
  // initials mark for the other standings rows on mobile. Full crests still show
  // everywhere else and on desktop.
  const lightweightStandingsMark =
    isMobile &&
    className.includes("footballTeamMark") &&
    !PGCPS_TEAMS.has(teamName);

  if (mascot && !failed && !lightweightStandingsMark) {
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

export default memo(TeamMascot);
