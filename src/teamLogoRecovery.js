const TEAM_PROFILE_LOGOS = new Map([
  ["Georgetown Prep", "/mascots/georgetown-prep.svg?v=exact-generated-mobile-3"],
  ["Georgetown Preparatory School", "/mascots/georgetown-prep.svg?v=exact-generated-mobile-3"],
]);

const ancestorText = (node, levels = 7) => {
  let current = node;
  let text = "";
  for (let i = 0; i < levels && current; i += 1, current = current.parentElement) {
    text += ` ${current.textContent || ""}`;
  }
  return text;
};

const setProfileLogo = (img, teamName, src) => {
  if (!img || img.closest(".score-team-mascot, .game-details-team-logo")) return false;
  img.setAttribute("src", src);
  img.setAttribute("alt", `${teamName} team crest`);
  img.style.setProperty("object-fit", "contain", "important");
  img.style.setProperty("display", "block", "important");
  img.style.setProperty("opacity", "1", "important");
  img.style.setProperty("visibility", "visible", "important");
  return true;
};

const applyTeamProfileLogos = () => {
  if (typeof document === "undefined") return;

  for (const [teamName, src] of TEAM_PROFILE_LOGOS) {
    let applied = false;

    document.querySelectorAll("img").forEach((img) => {
      if (applied) return;
      const alt = (img.getAttribute("alt") || "").trim();
      const nearbyText = ancestorText(img);
      if (!alt.includes(teamName) && !nearbyText.includes(teamName)) return;
      applied = setProfileLogo(img, teamName, src);
    });

    if (applied) continue;

    const textNodes = Array.from(document.querySelectorAll("h1,h2,h3,h4,strong,b,div,span"));
    const label = textNodes.find((el) => (el.textContent || "").trim() === teamName);
    if (!label) continue;

    let card = label;
    for (let i = 0; i < 7 && card; i += 1, card = card.parentElement) {
      const img = card.querySelector?.("img");
      if (img && setProfileLogo(img, teamName, src)) break;
    }
  }
};

if (typeof document !== "undefined") {
  queueMicrotask(applyTeamProfileLogos);
  window.addEventListener("load", applyTeamProfileLogos);
  const observer = new MutationObserver(() => requestAnimationFrame(applyTeamProfileLogos));
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
}
