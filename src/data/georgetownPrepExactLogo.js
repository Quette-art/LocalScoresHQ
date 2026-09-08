import { teamMascots } from "./teamMascots";

const GEORGETOWN_PREP_CREST =
  "/mascots/generated/georgetown-prep-crest.png?v=direct-team-profile-8";

// Keep the normal mascot lookup correct first.
teamMascots["Georgetown Prep"] = GEORGETOWN_PREP_CREST;
teamMascots["Georgetown Preparatory School"] = GEORGETOWN_PREP_CREST;

// The working detailed team logos are rendered as a real <img> inside the
// team-logo host. Do the same for Georgetown Prep instead of relying on the
// fallback/override chain that Safari has been dropping.
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

  let img = logoHost.querySelector("img");
  if (
    img &&
    img.getAttribute("src") === GEORGETOWN_PREP_CREST &&
    logoHost.dataset.georgetownExact === "1"
  ) {
    return;
  }

  logoHost.classList.remove("team-mascot-fallback");
  logoHost.style.setProperty("background", "transparent", "important");
  logoHost.style.setProperty("background-image", "none", "important");
  logoHost.style.setProperty("color", "transparent", "important");
  logoHost.style.setProperty("border", "0", "important");
  logoHost.style.setProperty("box-shadow", "none", "important");
  logoHost.style.setProperty("overflow", "visible", "important");

  if (!img) {
    logoHost.textContent = "";
    img = document.createElement("img");
    logoHost.appendChild(img);
  }

  img.setAttribute("src", GEORGETOWN_PREP_CREST);
  img.setAttribute("alt", "Georgetown Prep team crest");
  img.setAttribute("loading", "eager");
  img.setAttribute("decoding", "async");
  img.style.setProperty("display", "block", "important");
  img.style.setProperty("width", "100%", "important");
  img.style.setProperty("height", "100%", "important");
  img.style.setProperty("object-fit", "contain", "important");
  img.style.setProperty("opacity", "1", "important");
  img.style.setProperty("visibility", "visible", "important");

  logoHost.dataset.georgetownExact = "1";
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
