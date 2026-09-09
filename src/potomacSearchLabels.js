// Keep the two different Potomac football programs easy to distinguish in
// global team search without changing their underlying team names/routes.
const SEARCH_LABELS = new Map([
  ["Potomac", "Potomac — MD"],
  ["Potomac School", "Potomac School — VA"],
]);

const applyPotomacSearchLabels = () => {
  document.querySelectorAll(".team-search-result strong").forEach((label) => {
    const raw = label.textContent?.trim() || "";
    const iconMatch = raw.match(/^([^A-Za-z0-9]*)(.*)$/);
    const prefix = iconMatch?.[1] || "";
    const teamName = (iconMatch?.[2] || raw).trim();
    const displayName = SEARCH_LABELS.get(teamName);

    if (!displayName) return;
    label.textContent = `${prefix}${displayName}`;
  });
};

if (typeof document !== "undefined") {
  const start = () => {
    applyPotomacSearchLabels();

    const observer = new MutationObserver(applyPotomacSearchLabels);
    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}
