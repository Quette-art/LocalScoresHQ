(() => {
  const syncMobileMatchups = () => {
    const cards = document.querySelectorAll('.game-card');
    if (!cards.length) return;

    cards.forEach((card) => {
      const desktopTeams = card.querySelectorAll('.desktop-matchup .team-name');
      const mobileTeams = card.querySelectorAll('.mobile-matchup .mobile-team');

      if (desktopTeams.length < 2 || mobileTeams.length < 2) return;

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

  const scheduleSync = () => {
    requestAnimationFrame(syncMobileMatchups);
    setTimeout(syncMobileMatchups, 80);
    setTimeout(syncMobileMatchups, 250);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleSync, { once: true });
  } else {
    scheduleSync();
  }

  document.addEventListener('click', scheduleSync, { passive: true });
  window.addEventListener('popstate', scheduleSync, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) scheduleSync();
  });
})();
