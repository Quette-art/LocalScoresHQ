const TEAM_PROFILE_LOGOS = new Map([
  ["Mt. Zion", "/mascots/mt-zion-prep.webp?v=direct-picture-2"],
  ["Mt. Zion Prep", "/mascots/mt-zion-prep.webp?v=direct-picture-2"],
  ["Mt. Zion Prep Academy", "/mascots/mt-zion-prep.webp?v=direct-picture-2"],
  ["Riverdale Baptist", "/mascots/riverdale-baptist.webp?v=direct-picture-2"],
  ["Riverdale Baptist School", "/mascots/riverdale-baptist.webp?v=direct-picture-2"],
]);

const EMPTY_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E";

const applyPictureBackground = (logoHost, teamName, src) => {
  logoHost.style.setProperty("background-image", `url("${src}")`, "important");
  logoHost.style.setProperty("background-repeat", "no-repeat", "important");
  logoHost.style.setProperty("background-position", "center", "important");
  logoHost.style.setProperty("background-size", "contain", "important");
  logoHost.style.setProperty("background-color", "transparent", "important");
  logoHost.style.setProperty("border", "0", "important");
  logoHost.style.setProperty("box-shadow", "none", "important");
  logoHost.style.setProperty("color", "transparent", "important");
  logoHost.style.setProperty("overflow", "visible", "important");

  if (logoHost.matches("img")) {
    logoHost.setAttribute("src", EMPTY_IMAGE);
    logoHost.setAttribute("alt", `${teamName} team crest`);
    logoHost.style.setProperty("display", "block", "important");
    logoHost.style.setProperty("opacity", "1", "important");
    logoHost.style.setProperty("visibility", "visible", "important");
    return;
  }

  let img = logoHost.querySelector("img");
  if (!img) {
    logoHost.textContent = "";
    img = document.createElement("img");
    logoHost.appendChild(img);
  }

  img.setAttribute("src", EMPTY_IMAGE);
  img.setAttribute("alt", `${teamName} team crest`);
  img.style.setProperty("width", "100%", "important");
  img.style.setProperty("height", "100%", "important");
  img.style.setProperty("opacity", "0", "important");
  img.style.setProperty("visibility", "hidden", "important");
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

  applyPictureBackground(logoHost, teamName, matchedSrc);
};

if (typeof document !== "undefined") {
  queueMicrotask(applyTeamProfileLogos);
  window.addEventListener("load", applyTeamProfileLogos, { once: true });

  const observer = new MutationObserver(() => {
    requestAnimationFrame(applyTeamProfileLogos);
  });

  const root = document.getElementById("root") || document.documentElement;
  observer.observe(root, { childList: true, subtree: true });
}
