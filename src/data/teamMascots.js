export const teamMascots = {
  Bladensburg: "/mascots/bladensburg.svg",
  Bowie: "/mascots/bowie.svg",
  Central: "/mascots/central.svg",
  Crossland: "/mascots/crossland.svg",
  DuVal: "/mascots/duval.svg",
  "Eleanor Roosevelt": "/mascots/eleanor-roosevelt.svg",
  "Fairmont Heights": "/mascots/fairmont-heights.svg",
  Flowers: "/mascots/flowers.svg",
  "Frederick Douglass": "/mascots/frederick-douglass.svg",
  Friendly: "/mascots/friendly.svg",
  "Gwynn Park": "/mascots/gwynn-park.svg",
  "High Point": "/mascots/high-point.svg",
  Largo: "/mascots/largo.svg",
  Laurel: "/mascots/laurel.svg",
  Northwestern: "/mascots/northwestern.svg",
  "Oxon Hill": "/mascots/oxon-hill.svg",
  Parkdale: "/mascots/parkdale.svg",
  Potomac: "/mascots/potomac.svg",
  Suitland: "/mascots/suitland.svg",
  Surrattsville: "/mascots/surrattsville.svg",
  Wise: "/mascots/wise.svg",
};

export const getTeamMascot = (teamName = "") =>
  teamMascots[teamName.trim()] || null;

export default teamMascots;
