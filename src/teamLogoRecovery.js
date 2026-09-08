const TEAM_PROFILE_LOGOS = new Map([
  ["Georgetown Prep", "/mascots/generated/georgetown-prep-crest-fixed.png?v=exact-crest-ios-4"],
  ["Georgetown Preparatory School", "/mascots/generated/georgetown-prep-crest-fixed.png?v=exact-crest-ios-4"],
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

  const logoHost = teamHeader.querySelector(".team-logo");
  const existingImg = teamHeader.querySelector("img.team-logo, .team-logo img");

  if (existingImg) {
    if (existingImg.getAttribute("src") !== matchedSrc) {
      existingImg.setAttribute("src", matchedSrc);
    }
    existingImg.style.setProperty("object-fit", "contain", "important");
    existingImg.style.setProperty("display", "block", "important");
    existingImg.style.setProperty("opacity", "1", "important");
    existingImg.style.setProperty("visibility", "visible", "important");
    existingImg.style.setProperty("background", "transparent", "important");
    return;
  }

  // TeamMascot renders its initials fallback as a square element instead of an img.
  // Replace that fallback content directly with the approved crest image.
  if (logoHost) {
    logoHost.textContent = "";
    logoHost.style.setProperty("background-image", `url('${matchedSrc}')`, "important");
    logoHost.style.setProperty("background-size", "contain", "important");
    logoHost.style.setProperty("background-repeat", "no-repeat", "important");
    logoHost.style.setProperty("background-position", "center", "important");
    logoHost.style.setProperty("background-color", "transparent", "important");
    logoHost.style.setProperty("color", "transparent", "important");
    logoHost.style.setProperty("border", "0", "important");
    logoHost.style.setProperty("box-shadow", "none", "important");
  }
};

if (typeof document !== "undefined") {
  queueMicrotask(applyTeamProfileLogos);
  const observer = new MutationObserver(() => requestAnimationFrame(applyTeamProfileLogos));
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
