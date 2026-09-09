import { teamMascots } from "./teamMascots";
import full1 from "./exact-logo-chunks/riverdale-baptist-full.1.txt?raw";
import full2 from "./exact-logo-chunks/riverdale-baptist-full.2.txt?raw";
import full3 from "./exact-logo-chunks/riverdale-baptist-full.3.txt?raw";

const pngData = (...parts) =>
  `data:image/png;base64,${parts.join("").replace(/\s+/g, "")}`;

export const RIVERDALE_FULL = pngData(full1, full2, full3);
export const RIVERDALE_COMPACT = "data:image/png;base64,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";

teamMascots["Riverdale Baptist"] = RIVERDALE_FULL;
teamMascots["Riverdale Baptist School"] = RIVERDALE_FULL;

const styleImage = (img) => {
  img.style.setProperty("display", "block", "important");
  img.style.setProperty("width", "100%", "important");
  img.style.setProperty("height", "100%", "important");
  img.style.setProperty("object-fit", "contain", "important");
  img.style.setProperty("opacity", "1", "important");
  img.style.setProperty("visibility", "visible", "important");
};

const forceImage = (host, src, alt) => {
  if (!host || !src) return;

  if (host.matches?.("img")) {
    if (host.getAttribute("src") !== src) host.setAttribute("src", src);
    host.setAttribute("alt", alt);
    host.setAttribute("loading", "eager");
    styleImage(host);
    return;
  }

  let img = host.querySelector?.("img[data-riverdale-full='1']");

  if (!img) {
    host.textContent = "";
    host.classList.remove("team-mascot-fallback");
    host.style.setProperty("background", "transparent", "important");
    host.style.setProperty("background-image", "none", "important");
    host.style.setProperty("border", "0", "important");
    host.style.setProperty("box-shadow", "none", "important");
    host.style.setProperty("color", "transparent", "important");
    host.style.setProperty("overflow", "visible", "important");

    img = document.createElement("img");
    img.dataset.riverdaleFull = "1";
    host.appendChild(img);
  }

  if (img.getAttribute("src") !== src) img.setAttribute("src", src);
  img.setAttribute("alt", alt);
  img.setAttribute("loading", "eager");
  styleImage(img);
};

const installRiverdaleExactProfileLogo = () => {
  if (typeof document === "undefined") return;

  const profile = document.querySelector(".team-profile .team-header");
  const profileName = profile?.querySelector("h1")?.textContent?.trim();

  if (
    profile &&
    (profileName === "Riverdale Baptist" ||
      profileName === "Riverdale Baptist School")
  ) {
    forceImage(
      profile.querySelector(".team-logo"),
      RIVERDALE_FULL,
      "Riverdale Baptist crest"
    );
  }
};

if (typeof document !== "undefined") {
  queueMicrotask(installRiverdaleExactProfileLogo);
  window.addEventListener("load", installRiverdaleExactProfileLogo, { once: true });

  const observer = new MutationObserver(() => {
    requestAnimationFrame(installRiverdaleExactProfileLogo);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
