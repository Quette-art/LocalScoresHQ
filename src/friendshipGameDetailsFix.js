const FRIENDSHIP_NAME = /Friendship Collegiate(?: Academy)?/i;

const applyFriendshipGameDetailsClass = () => {
  if (typeof document === "undefined") return;

  document.querySelectorAll(".game-details-team").forEach((row) => {
    const isFriendship = FRIENDSHIP_NAME.test(row.textContent || "");
    row.classList.toggle("friendship-game-details-row", isFriendship);
  });
};

if (typeof document !== "undefined") {
  queueMicrotask(applyFriendshipGameDetailsClass);

  const observer = new MutationObserver(() => {
    requestAnimationFrame(applyFriendshipGameDetailsClass);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
