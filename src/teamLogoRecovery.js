const TEAM_PROFILE_LOGOS = new Map([
  ["Mt. Zion", "/mascots/mt-zion-prep.svg?v=team-profile-1"],
  ["Mt. Zion Prep", "/mascots/mt-zion-prep.svg?v=team-profile-1"],
  ["Mt. Zion Prep Academy", "/mascots/mt-zion-prep.svg?v=team-profile-1"],
  ["Riverdale Baptist", "/mascots/riverdale-baptist.svg?v=team-profile-1"],
  ["Riverdale Baptist School", "/mascots/riverdale-baptist.svg?v=team-profile-1"],
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

  const teamName = teamHeader.querySelector("h1")?.textContent?.trim() || "";
  const matchedSrc = TEAM_PROFILE_LOGOS.get(teamName);
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
    logoHost.appendChild(img);
  }

  if (img.getAttribute("src") !== matchedSrc) {
    img.setAttribute("src", matchedSrc);
  }

  img.setAttribute("alt", `${teamName} team crest`);
  img.setAttribute("loading", "eager");
  img.setAttribute("decoding", "async");
  styleCrest(img);
};

if (typeof document !== "undefined") {
  queueMicrotask(applyTeamProfileLogos);
  window.addEventListener("load", applyTeamProfileLogos, { once: true });

  // Keep this available for in-app navigation. It observes child changes only;
  // once the image exists, styling/source updates do not retrigger the observer.
  const observer = new MutationObserver(() => {
    requestAnimationFrame(applyTeamProfileLogos);
  });

  const root = document.getElementById("root") || document.documentElement;
  observer.observe(root, { childList: true, subtree: true });
}
