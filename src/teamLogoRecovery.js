const TEAM_PROFILE_LOGOS = new Map([
  ["Georgetown Prep", "/mascots/generated/georgetown-prep-crest-fixed.png?v=exact-crest-ios-3"],
  ["Georgetown Preparatory School", "/mascots/generated/georgetown-prep-crest-fixed.png?v=exact-crest-ios-3"],
]);

const applyTeamProfileLogos = () => {
  if (typeof document === "undefined") return;

  const profile = document.querySelector(".team-profile");
  if (!profile) return;

  const teamHeader = profile.querySelector(".team-header");
  if (!teamHeader) return;

  const headerText = teamHeader.textContent || "";
  let matchedSrc = null;

  for (const [teamName, src] of TEAM_PROFILE_LOGOS) {
    if (headerText.includes(teamName)) {
      matchedSrc = src;
      break;
    }
  }

  if (!matchedSrc) return;

  const img = teamHeader.querySelector("img.team-logo, .team-logo img, img");
  if (!img) return;

  if (img.getAttribute("src") !== matchedSrc) img.setAttribute("src", matchedSrc);
  img.style.setProperty("object-fit", "contain", "important");
  img.style.setProperty("display", "block", "important");
  img.style.setProperty("opacity", "1", "important");
  img.style.setProperty("visibility", "visible", "important");
};

if (typeof document !== "undefined") {
  queueMicrotask(applyTeamProfileLogos);
  const observer = new MutationObserver(() => requestAnimationFrame(applyTeamProfileLogos));
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
