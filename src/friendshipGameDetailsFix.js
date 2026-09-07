const FRIENDSHIP_NAME = /Friendship Collegiate(?: Academy)?/i;
const TRANSPARENT_PIXEL =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/%3E';

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

    // This transparent hook deliberately matches friendshipCompactFix.css.
    // That stylesheet contains the exact FC artwork already proven to render
    // correctly on the Scores cards, so Game Details now uses the same source.
    img.src = TRANSPARENT_PIXEL;
    img.alt = "Friendship Collegiate Academy compact mark";
    img.setAttribute("aria-hidden", "true");
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
