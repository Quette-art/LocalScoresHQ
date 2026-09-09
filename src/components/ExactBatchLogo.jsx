import React from "react";
import { EXACT_BATCH_SPRITE_DATA } from "../generated/exactBatchSpriteData";

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
      className={`${className} exact-batch-logo`.trim()}
      role="img"
      aria-label={`${teamName} ${variant === "full" ? "team crest" : "score mark"}`}
      style={{
        "--exact-batch-left": `-${col * 100}%`,
        "--exact-batch-top": `-${row * 100}%`,
      }}
    >
      <img
        className="exact-batch-sprite-image"
        src={EXACT_BATCH_SPRITE_DATA}
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
      />
    </span>
  );
}
