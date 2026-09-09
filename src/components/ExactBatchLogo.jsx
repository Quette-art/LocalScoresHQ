import React from "react";

const SPRITE = "/mascots/exact-batch/missing-team-batch-sprite.webp?v=react-direct-1";

const TILE_INDEX = new Map([
  ["Woodberry Forest", 0],
  ["Woodberry Forest School", 0],
  ["Loyola Blakefield", 1],
  ["Haverford School", 2],
  ["The Haverford School", 2],
  ["Boys Latin", 3],
  ["Boys' Latin", 3],
  ["Boys’ Latin", 3],
  ["Boys Latin School", 3],
  ["The Boys' Latin School of Maryland", 3],
  ["McDonogh", 4],
  ["McDonogh School", 4],
]);

export const isExactBatchTeam = (teamName = "") => TILE_INDEX.has(teamName);

export default function ExactBatchLogo({
  teamName,
  variant = "compact",
  className = "",
}) {
  const col = TILE_INDEX.get(teamName);
  if (col === undefined) return null;

  const row = variant === "full" ? 0 : 1;

  return (
    <span
      className={className}
      role="img"
      aria-label={`${teamName} ${variant === "full" ? "team crest" : "score mark"}`}
      style={{
        display: "inline-block",
        backgroundImage: `url("${SPRITE}")`,
        backgroundSize: "500% 200%",
        backgroundPosition: `${col * 25}% ${row * 100}%`,
        backgroundRepeat: "no-repeat",
        backgroundColor: "transparent",
        border: 0,
        boxShadow: "none",
        color: "transparent",
        overflow: "hidden",
        opacity: 1,
        visibility: "visible",
        flexShrink: 0,
      }}
    />
  );
}
