const FRIENDSHIP_NAME = /Friendship Collegiate(?: Academy)?/i;
const FRIENDSHIP_SCORE =
  "/mascots/missing-teams/friendship-score-fc.webp?v=identity-sheet-1";

const applyFriendshipGameDetailsFix = () => {
  if (typeof document === "undefined") return;

  document.querySelectorAll(".game-details-team").forEach((row) => {
    const isFriendship = FRIENDSHIP_NAME.test(row.textContent || "");
    row.classList.toggle("friendship-game-details-row", isFriendship);
    if (!isFriendship) return;

    const identity = row.querySelector(".game-details-team-identity");
    if (!identity) return;

    let logo = identity.querySelector(".game-details-team-logo");
    if (!logo) {
      logo = document.createElement("span");
      logo.className = "team-mascot game-details-team-logo friendship-game-details-logo";
      identity.prepend(logo);
    }

    let img = logo.querySelector("img");
    if (!img) {
      logo.textContent = "";
      img = document.createElement("img");
      logo.appendChild(img);
    }

    if (img.getAttribute("src") !== FRIENDSHIP_SCORE) img.setAttribute("src", FRIENDSHIP_SCORE);
    img.alt = "Friendship Collegiate Academy score mark";
    img.removeAttribute("aria-hidden");
  });
};

if (typeof document !== "undefined") {
  queueMicrotask(applyFriendshipGameDetailsFix);

  const observer = new MutationObserver(() => {
    requestAnimationFrame(applyFriendshipGameDetailsFix);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
