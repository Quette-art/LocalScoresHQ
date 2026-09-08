const TEAM_PROFILE_LOGOS = new Map([
  ["Georgetown Prep", "/mascots/generated/georgetown-prep-crest-fixed.webp?v=exact-crest-ios-6"],
  ["Georgetown Preparatory School", "/mascots/generated/georgetown-prep-crest-fixed.webp?v=exact-crest-ios-6"],
]);

const styleCrest = (img) => {
  img.style.setProperty("width", "100%", "important");
  img.style.setProperty("height", "100%", "important");
  img.style.setProperty("object-fit", "contain", "important");
  img.style.setProperty("display", "block", "important");
  img.style.setProperty("opacity", "1", "important");
  img.style.setProperty("visibility", "visible", "important");
  img.style.setProperty("background", "transparent", "important");
};

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
  if (!logoHost) return;

  let img = logoHost.matches("img") ? logoHost : logoHost.querySelector("img");

  if (!img) {
    logoHost.textContent = "";
    logoHost.style.setProperty("background", "transparent", "important");
    logoHost.style.setProperty("background-image", "none", "important");
    logoHost.style.setProperty("border", "0", "important");
    logoHost.style.setProperty("box-shadow", "none", "important");
    logoHost.style.setProperty("color", "transparent", "important");
    logoHost.style.setProperty("overflow", "visible", "important");

    img = document.createElement("img");
    img.alt = "Georgetown Prep approved team crest";
    logoHost.appendChild(img);
  }

  if (img.getAttribute("src") !== matchedSrc) {
    img.setAttribute("src", matchedSrc);
  }

  styleCrest(img);
};

if (typeof document !== "undefined") {
  queueMicrotask(applyTeamProfileLogos);
  window.addEventListener("load", applyTeamProfileLogos);
  const observer = new MutationObserver(() => requestAnimationFrame(applyTeamProfileLogos));
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
