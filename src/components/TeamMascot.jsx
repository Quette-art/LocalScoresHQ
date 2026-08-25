import React, { useEffect, useState } from "react";
import { getStandingsMascot, getTeamMascot } from "../data/teamMascots";

const getInitials = (teamName = "") =>
  teamName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "?";

const strongCrestTeams = {
  "Calvert Hall": { initials: "CH", primary: "#7f1d1d", accent: "#d4a017" },
  "Archbishop Spalding": { initials: "AS", primary: "#111827", accent: "#b91c1c" },
  "Annapolis Area Christian": { initials: "AAC", primary: "#0f2d50", accent: "#c99700" },
  "KIPP Atlanta Collegiate": { initials: "KAC", primary: "#2e1065", accent: "#7e22ce" },
  "Lewis Bennett": { initials: "LB", primary: "#10243e", accent: "#c99700" },
  Benedictine: { initials: "B", primary: "#064e3b", accent: "#e5e7eb" },
  "St. Edward": { initials: "SE", primary: "#064e3b", accent: "#d4a017" },
  "Malvern Prep": { initials: "MP", primary: "#6b1118", accent: "#f3f4f6" },
  "Cornerstone Christian": { initials: "CC", primary: "#172554", accent: "#e5e7eb" },
  "Eastern Tech": { initials: "ET", primary: "#111827", accent: "#d4a017" },
  "Potomac School": { initials: "P", primary: "#10243e", accent: "#e5e7eb" },
  Columbia: { initials: "C", primary: "#0c4a6e", accent: "#7dd3fc" },
  Yorktown: { initials: "Y", primary: "#14532d", accent: "#f8fafc" },
};

function StrongCrest({ teamName, className = "" }) {
  const config = strongCrestTeams[teamName];
  const safeId = teamName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const fontSize = config.initials.length >= 3 ? 92 : 116;

  return (
    <span className={`team-mascot ${className}`.trim()} aria-label={`${teamName} crest`}>
      <svg
        viewBox="0 0 512 512"
        role="img"
        aria-hidden="true"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <linearGradient id={`crest-${safeId}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={config.primary} />
            <stop offset="1" stopColor="#07111f" />
          </linearGradient>
          <filter id={`shadow-${safeId}`} x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity="0.28" />
          </filter>
        </defs>

        <g filter={`url(#shadow-${safeId})`}>
          <path
            d="M256 24 420 76v144c0 119-67 210-164 269C159 430 92 339 92 220V76z"
            fill={`url(#crest-${safeId})`}
            stroke={config.accent}
            strokeWidth="15"
            strokeLinejoin="round"
          />
          <path
            d="M256 50 395 94v126c0 102-57 181-139 235-82-54-139-133-139-235V94z"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.92"
            strokeWidth="5"
          />
          <path
            d="M256 70 374 107v108c0 89-47 156-118 205-71-49-118-116-118-205V107z"
            fill="none"
            stroke={config.accent}
            strokeOpacity="0.82"
            strokeWidth="3"
          />

          <g transform="translate(256 139)">
            <path d="M-95 15 0-42 95 15 64 35 0-3-64 35z" fill={config.accent} />
            <path d="M-72 25 0-18 72 25 47 40 0 12-47 40z" fill="#ffffff" fillOpacity="0.92" />
            <path d="M-47 34 0 6 47 34 27 47 0 30-27 47z" fill={config.primary} />
            <circle cx="0" cy="-3" r="9" fill={config.accent} stroke="#fff" strokeWidth="3" />
          </g>

          <text
            x="256"
            y="288"
            textAnchor="middle"
            fontFamily="Arial Black, Arial, sans-serif"
            fontSize={fontSize}
            fontWeight="900"
            fill="#ffffff"
            stroke="#000000"
            strokeOpacity="0.3"
            strokeWidth="4"
            paintOrder="stroke"
          >
            {config.initials}
          </text>

          <path d="M77 321h358l-34 68H111z" fill={config.accent} stroke="#fff" strokeWidth="4" />
          <path d="M109 331h294l-17 47H126z" fill={config.primary} />
          <text
            x="256"
            y="361"
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize={teamName.length > 20 ? 19 : teamName.length > 14 ? 22 : 26}
            fontWeight="900"
            letterSpacing="1"
            fill="#ffffff"
          >
            {teamName.toUpperCase()}
          </text>

          <text
            x="256"
            y="421"
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="19"
            fontWeight="800"
            letterSpacing="6"
            fill={config.accent}
          >
            FOOTBALL
          </text>
          <path d="M178 440h48m60 0h48" stroke={config.accent} strokeWidth="4" strokeLinecap="round" />
          <circle cx="256" cy="440" r="6" fill={config.accent} />
        </g>
      </svg>
    </span>
  );
}

export default function TeamMascot({ teamName, className = "", fallbackColor }) {
  const [failed, setFailed] = useState(false);
  const cleanTeamName = teamName?.trim() || "";
  const isStandingsMark = className.includes("footballTeamMark");
  const mascot =
    (isStandingsMark ? getStandingsMascot(cleanTeamName) : null) ||
    getTeamMascot(cleanTeamName);

  useEffect(() => {
    setFailed(false);
  }, [mascot]);

  if (!isStandingsMark && strongCrestTeams[cleanTeamName]) {
    return <StrongCrest teamName={cleanTeamName} className={className} />;
  }

  if (mascot && !failed) {
    return (
      <span className={`team-mascot ${className}`.trim()}>
        <img
          src={mascot}
          alt={`${cleanTeamName} unofficial mascot`}
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
      aria-label={cleanTeamName}
    >
      {getInitials(cleanTeamName)}
    </span>
  );
}
