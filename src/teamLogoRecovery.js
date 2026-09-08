const TEAM_PROFILE_LOGOS = new Map([
  ["Mt. Zion", "/mascots/mt-zion-prep.svg?v=exact-existing-picture-4"],
  ["Mt. Zion Prep", "/mascots/mt-zion-prep.svg?v=exact-existing-picture-4"],
  ["Mt. Zion Prep Academy", "/mascots/mt-zion-prep.svg?v=exact-existing-picture-4"],
]);

const styleImage = (img) => {
  img.style.setProperty("display", "block", "important");
  img.style.setProperty("width", "100%", "important");
  img.style.setProperty("height", "100%", "important");
  img.style.setProperty("object-fit", "contain", "important");
  img.style.setProperty("opacity", "1", "important");
  img.style.setProperty("visibility", "visible", "important");
  img.style.setProperty("background", "transparent", "important");
};

const installPicture = (logoHost, teamName, src) => {
  const current = logoHost.querySelector("img[data-exact-team-picture='1']");

  if (
    logoHost.dataset.exactTeamPicture === src &&
    current?.getAttribute("src") === src
  ) {
    styleImage(current);
    return;
  }

  logoHost.classList.remove("team-mascot-fallback");
  logoHost.style.setProperty("background", "transparent", "important");
  logoHost.style.setProperty("background-image", "none", "important");
  logoHost.style.setProperty("background-color", "transparent", "important");
  logoHost.style.setProperty("border", "0", "important");
  logoHost.style.setProperty("box-shadow", "none", "important");
  logoHost.style.setProperty("color", "transparent", "important");
  logoHost.style.setProperty("overflow", "visible", "important");

  logoHost.textContent = "";
  const img = document.createElement("img");
  img.setAttribute("src", src);
  img.setAttribute("alt", `${teamName} team crest`);
  img.setAttribute("loading", "eager");
  img.setAttribute("decoding", "async");
  img.dataset.exactTeamPicture = "1";
  styleImage(img);
  logoHost.appendChild(img);
  logoHost.dataset.exactTeamPicture = src;
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

  installPicture(logoHost, teamName, matchedSrc);
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
