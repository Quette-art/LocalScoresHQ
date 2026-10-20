const easternClock = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", hourCycle: "h23",
});

export function selectScoreboardDate(dates, now = new Date()) {
  const available = [...new Set(dates.filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)))].sort();
  if (!available.length) return "";
  const parts = Object.fromEntries(easternClock.formatToParts(now).map(({ type, value }) => [type, value]));
  let cutoff = `${parts.year}-${parts.month}-${parts.day}`;
  if (Number(parts.hour) < 6) {
    // Calendar arithmetic avoids moving the cutoff during daylight-saving changes.
    const previous = new Date(`${cutoff}T12:00:00Z`);
    previous.setUTCDate(previous.getUTCDate() - 1);
    cutoff = previous.toISOString().slice(0, 10);
  }
  return available.filter((date) => date <= cutoff).at(-1) || available[0];
}
