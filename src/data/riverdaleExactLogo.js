import { teamMascots } from "./teamMascots";
import full1 from "./exact-logo-chunks/riverdale-baptist-full.1.txt?raw";
import full2 from "./exact-logo-chunks/riverdale-baptist-full.2.txt?raw";
import full3 from "./exact-logo-chunks/riverdale-baptist-full.3.txt?raw";
import compact1 from "./exact-logo-chunks/riverdale-baptist-rbs.1.txt?raw";
import compact2 from "./exact-logo-chunks/riverdale-baptist-rbs.2.txt?raw";

const pngData = (...parts) =>
  `data:image/png;base64,${parts.join("").replace(/\s+/g, "")}`;

export const RIVERDALE_FULL = pngData(full1, full2, full3);
export const RIVERDALE_COMPACT = pngData(compact1, compact2);

teamMascots["Riverdale Baptist"] = RIVERDALE_FULL;
teamMascots["Riverdale Baptist School"] = RIVERDALE_FULL;

const setImage = (host, src, alt) => {
  if (!host || !src) return;

  const img = host.matches?.("img") ? host : host.querySelector?.("img");
  if (!img) return;

  img.src = src;
  img.alt = alt;
  img.loading = "eager";
  img.style.setProperty("display", "block", "important");
  img.style.setProperty("width", "100%", "important");
  img.style.setProperty("height", "100%", "important");
  img.style.setProperty("object-fit", "contain", "important");
  img.style.setProperty("opacity", "1", "important");
  img.style.setProperty("visibility", "visible", "important");

  if (!host.matches?.("img")) {
    host.style.setProperty("background", "transparent", "important");
    host.style.setProperty("background-image", "none", "important");
    host.style.setProperty("border", "0", "important");
    host.style.setProperty("box-shadow", "none", "important");
    host.style.setProperty("color", "transparent", "important");
  }
};

const installProfile = () => {
  if (typeof document === "undefined") return;

  const profile = document.querySelector(".team-profile .team-header");
  const profileName = profile?.querySelector("h1")?.textContent?.trim();

  if (
    profile &&
    (profileName === "Riverdale Baptist" ||
      profileName === "Riverdale Baptist School")
  ) {
    setImage(
      profile.querySelector(".team-logo"),
      RIVERDALE_FULL,
      "Riverdale Baptist crest"
    );
  }
};

if (typeof document !== "undefined") {
  queueMicrotask(installProfile);
  window.addEventListener("load", installProfile);

  const observer = new MutationObserver(() =>
    requestAnimationFrame(installProfile)
  );

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
