const TEAM_PROFILE_LOGOS = new Map([
  ["Georgetown Prep", "/mascots/georgetown-prep.svg?v=exact-generated-mobile-2"],
  ["Georgetown Preparatory School", "/mascots/georgetown-prep.svg?v=exact-generated-mobile-2"],
]);

const applyTeamProfileLogos = () => {
  if (typeof document === "undefined") return;

  document.querySelectorAll("img").forEach((img) => {
    const alt = (img.getAttribute("alt") || "").trim();
    for (const [teamName, src] of TEAM_PROFILE_LOGOS) {
      const rowText = img.closest("[class*='team'], [class*='profile']")?.textContent || "";
      const isTeamImage = alt.includes(teamName) || rowText.includes(teamName);
      if (!isTeamImage) continue;

      if (img.closest(".score-team-mascot, .game-details-team-logo")) continue;
      if (img.getAttribute("src") !== src) img.setAttribute("src", src);
      img.style.setProperty("object-fit", "contain", "important");
      img.style.setProperty("display", "block", "important");
      img.style.setProperty("opacity", "1", "important");
      img.style.setProperty("visibility", "visible", "important");
      break;
    }
  });
};

if (typeof document !== "undefined") {
  queueMicrotask(applyTeamProfileLogos);
  const observer = new MutationObserver(() => requestAnimationFrame(applyTeamProfileLogos));
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
