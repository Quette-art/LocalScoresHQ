import { teamMascots } from "./teamMascots";

const GEORGETOWN_PREP_CREST =
  "/mascots/generated/georgetown-prep-crest-fixed.webp?v=team-page-clear-2";

teamMascots["Georgetown Prep"] = GEORGETOWN_PREP_CREST;
teamMascots["Georgetown Preparatory School"] = GEORGETOWN_PREP_CREST;

const isGeorgetownPrep = (name) =>
  name === "Georgetown Prep" || name === "Georgetown Preparatory School";

const styleImage = (img) => {
  img.setAttribute("alt", "Georgetown Prep Hoyas crest");
  img.setAttribute("loading", "eager");
  img.setAttribute("decoding", "async");
  img.style.setProperty("display", "block", "important");
  img.style.setProperty("width", "100%", "important");
  img.style.setProperty("height", "100%", "important");
  img.style.setProperty("object-fit", "contain", "important");
  img.style.setProperty("image-rendering", "auto", "important");
  img.style.setProperty("opacity", "1", "important");
  img.style.setProperty("visibility", "visible", "important");
};

const installGeorgetownPrepCrest = () => {
  if (typeof document === "undefined") return false;

  const header = document.querySelector(".team-profile .team-header");
  if (!header) return false;

  const teamName = header.querySelector("h1")?.textContent?.trim() || "";
  if (!isGeorgetownPrep(teamName)) return false;

  const logoHost = header.querySelector(".team-logo");
  if (!logoHost) return false;

  // If TeamMascot already rendered an image, keep that node and only correct
  // its source. This avoids repeatedly deleting/recreating DOM nodes.
  if (logoHost.matches("img")) {
    if (logoHost.getAttribute("src") !== GEORGETOWN_PREP_CREST) {
      logoHost.setAttribute("src", GEORGETOWN_PREP_CREST);
    }
    styleImage(logoHost);
    return true;
  }

  let img = logoHost.querySelector("img[data-georgetown-prep-crest='1']");
  if (!img) {
    img = logoHost.querySelector("img");
  }

  // Only clear a fallback once. The old code cleared and appended on every
  // MutationObserver callback, creating an infinite render loop on iPhone.
  if (!img) {
    logoHost.textContent = "";
    img = document.createElement("img");
    img.dataset.georgetownPrepCrest = "1";
    logoHost.appendChild(img);
  }

  if (img.getAttribute("src") !== GEORGETOWN_PREP_CREST) {
    img.setAttribute("src", GEORGETOWN_PREP_CREST);
  }
  styleImage(img);

  if (logoHost.dataset.georgetownPrepStyled !== "1") {
    logoHost.style.setProperty("background", "transparent", "important");
    logoHost.style.setProperty("background-image", "none", "important");
    logoHost.style.setProperty("border", "0", "important");
    logoHost.style.setProperty("box-shadow", "none", "important");
    logoHost.style.setProperty("color", "transparent", "important");
    logoHost.style.setProperty("overflow", "visible", "important");
    logoHost.dataset.georgetownPrepStyled = "1";
  }

  return true;
};

if (typeof document !== "undefined") {
  let observer = null;
  let framePending = false;

  const tryInstall = () => {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(() => {
      framePending = false;
      if (installGeorgetownPrepCrest() && observer) {
        observer.disconnect();
        observer = null;
      }
    });
  };

  queueMicrotask(tryInstall);
  window.addEventListener("load", tryInstall, { once: true });

  // Watch only until the Georgetown Prep team header appears, then stop.
  observer = new MutationObserver(tryInstall);
  const root = document.getElementById("root") || document.documentElement;
  observer.observe(root, { childList: true, subtree: true });
}
