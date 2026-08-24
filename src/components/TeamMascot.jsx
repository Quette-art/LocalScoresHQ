import React, { memo, useEffect, useState } from "react";
import { getTeamMascot } from "../data/teamMascots";

const standingsRasterCache = new Map();
let standingsRasterQueue = Promise.resolve();

const rasterizeStandingsLogo = (src) => {
  if (typeof window === "undefined" || !src) return Promise.resolve(src);

  if (standingsRasterCache.has(src)) {
    return standingsRasterCache.get(src);
  }

  const task = standingsRasterQueue.then(
    () =>
      new Promise((resolve) => {
        const image = new Image();

        image.onload = async () => {
          try {
            if (image.decode) {
              await image.decode().catch(() => {});
            }

            const size = 64;
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const context = canvas.getContext("2d", { alpha: true });

            if (!context) {
              resolve(src);
              return;
            }

            const scale = Math.min(size / image.width, size / image.height);
            const width = Math.max(1, image.width * scale);
            const height = Math.max(1, image.height * scale);
            const x = (size - width) / 2;
            const y = (size - height) / 2;

            context.clearRect(0, 0, size, size);
            context.drawImage(image, x, y, width, height);
            resolve(canvas.toDataURL("image/png"));
          } catch {
            resolve(src);
          }
        };

        image.onerror = () => resolve(src);
        image.decoding = "async";
        image.src = src;
      })
  );

  standingsRasterQueue = task.then(
    () => new Promise((resolve) => setTimeout(resolve, 40))
  );
  standingsRasterCache.set(src, task);
  return task;
};

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
  const mascot = getTeamMascot(teamName);
  const isStandingsMark = className.includes("footballTeamMark");
  const isMobileStandings =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 900px)").matches &&
    isStandingsMark;
  const [renderSrc, setRenderSrc] = useState(() =>
    isMobileStandings ? null : mascot
  );

  useEffect(() => {
    setFailed(false);

    if (!mascot) {
      setRenderSrc(null);
      return undefined;
    }

    if (!isMobileStandings) {
      setRenderSrc(mascot);
      return undefined;
    }

    let cancelled = false;
    setRenderSrc(null);

    rasterizeStandingsLogo(mascot).then((src) => {
      if (!cancelled) setRenderSrc(src);
    });

    return () => {
      cancelled = true;
    };
  }, [mascot, isMobileStandings]);

  if (mascot && !failed) {
    return (
      <span className={`team-mascot ${className}`.trim()}>
        {renderSrc && (
          <img
            src={renderSrc}
            alt={`${teamName} unofficial mascot`}
            loading={isMobileStandings ? "eager" : "lazy"}
            decoding="async"
            fetchPriority="low"
            onError={() => setFailed(true)}
          />
        )}
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
