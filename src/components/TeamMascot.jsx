import React, { memo, useEffect, useRef, useState } from "react";
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

function TeamMascot({ teamName, className = "", fallbackColor }) {
  const [failed, setFailed] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(() => {
    if (typeof window === "undefined") return true;
    return !(
      window.matchMedia("(max-width: 900px)").matches &&
      className.includes("footballTeamMark")
    );
  });
  const holderRef = useRef(null);
  const mascot = getTeamMascot(teamName);
  const isStandingsMark = className.includes("footballTeamMark");

  useEffect(() => {
    setFailed(false);
  }, [mascot]);

  useEffect(() => {
    if (shouldLoad || !isStandingsMark || typeof window === "undefined") {
      return undefined;
    }

    if (!window.matchMedia("(max-width: 900px)").matches) {
      setShouldLoad(true);
      return undefined;
    }

    const node = holderRef.current;
    if (!node || !("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "180px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isStandingsMark, shouldLoad]);

  if (mascot && !failed) {
    return (
      <span ref={holderRef} className={`team-mascot ${className}`.trim()}>
        {shouldLoad && (
          <img
            src={mascot}
            alt={`${teamName} unofficial mascot`}
            loading="lazy"
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
      ref={holderRef}
      className={`team-mascot team-mascot-fallback ${className}`.trim()}
      style={fallbackColor ? { background: fallbackColor } : undefined}
      aria-label={teamName}
    >
      {getInitials(teamName)}
    </span>
  );
}

export default memo(TeamMascot);
