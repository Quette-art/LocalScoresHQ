(() => {
  const syncMobileMatchups = () => {
    document.querySelectorAll('.game-card').forEach((card) => {
      const desktopTeams = card.querySelectorAll('.desktop-matchup .team-name');
      const mobileTeams = card.querySelectorAll('.mobile-matchup .mobile-team');

      if (desktopTeams.length < 2 || mobileTeams.length < 2) return;

      // The first mobile row was accidentally rendering team2 twice.
      // Mirror the already-correct desktop matchup into the mobile markup.
      const desktopTeam1 = desktopTeams[0];
      const desktopTeam2 = desktopTeams[1];
      const mobileTeam1 = mobileTeams[0];
      const mobileTeam2 = mobileTeams[1];

      if (mobileTeam1.innerHTML !== desktopTeam1.innerHTML) {
        mobileTeam1.innerHTML = desktopTeam1.innerHTML;
      }

      if (mobileTeam2.innerHTML !== desktopTeam2.innerHTML) {
        mobileTeam2.innerHTML = desktopTeam2.innerHTML;
      }
    });
  };

  const run = () => requestAnimationFrame(syncMobileMatchups);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }

  const observer = new MutationObserver(run);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
