import { teamMascots } from "./teamMascots";

const GEORGETOWN_PREP_CREST =
  "/mascots/generated/georgetown-prep-team-exact.webp?v=team-page-exact-10";

// Keep the normal mascot lookup correct first.
teamMascots["Georgetown Prep"] = GEORGETOWN_PREP_CREST;
teamMascots["Georgetown Preparatory School"] = GEORGETOWN_PREP_CREST;

// Put the exact approved Georgetown Prep picture directly into the team page.
const installGeorgetownPrepCrest = () => {
  if (typeof document === "undefined") return;

  const profile = document.querySelector(".team-profile");
  const header = profile?.querySelector(".team-header");
  if (!header) return;

  const teamName = header.querySelector("h1")?.textContent?.trim() || "";
  if (
    teamName !== "Georgetown Prep" &&
    teamName !== "Georgetown Preparatory School"
  ) {
    return;
  }

  const logoHost = header.querySelector(".team-logo");
  if (!logoHost) return;

  let img = logoHost.matches("img") ? logoHost : logoHost.querySelector("img");

  if (!img) {
    logoHost.textContent = "";
    img = document.createElement("img");
    logoHost.appendChild(img);
  }

  img.setAttribute("src", GEORGETOWN_PREP_CREST);
  img.setAttribute("alt", "Georgetown Prep Hoyas crest");
  img.setAttribute("loading", "eager");
  img.style.setProperty("display", "block", "important");
  img.style.setProperty("width", "100%", "important");
  img.style.setProperty("height", "100%", "important");
  img.style.setProperty("object-fit", "contain", "important");
  img.style.setProperty("opacity", "1", "important");
  img.style.setProperty("visibility", "visible", "important");

  if (!logoHost.matches("img")) {
    logoHost.style.setProperty("background", "transparent", "important");
    logoHost.style.setProperty("background-image", "none", "important");
    logoHost.style.setProperty("border", "0", "important");
    logoHost.style.setProperty("box-shadow", "none", "important");
    logoHost.style.setProperty("color", "transparent", "important");
  }
};

if (typeof document !== "undefined") {
  queueMicrotask(installGeorgetownPrepCrest);
  window.addEventListener("load", installGeorgetownPrepCrest);

  const observer = new MutationObserver(() => {
    requestAnimationFrame(installGeorgetownPrepCrest);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
