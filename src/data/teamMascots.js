const svgData = (svg) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const makeScoreMark = (label, primary, secondary) =>
  svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img">
      <text x="64" y="94" text-anchor="middle"
        font-family="Arial Black,Arial,sans-serif"
        font-size="${label.length > 2 ? 48 : label.length === 2 ? 66 : 88}"
        font-weight="900"
        fill="${primary}"
        stroke="#111827" stroke-width="10" stroke-linejoin="round">${label}</text>
      <text x="64" y="94" text-anchor="middle"
        font-family="Arial Black,Arial,sans-serif"
        font-size="${label.length > 2 ? 48 : label.length === 2 ? 66 : 88}"
        font-weight="900"
        fill="${primary}"
        stroke="${secondary}" stroke-width="4" stroke-linejoin="round">${label}</text>
    </svg>
  `);

const makeCrest = (mark, mascot, primary, secondary) =>
  svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img">
      <path d="M128 12 226 48v79c0 61-35 99-98 123-63-24-98-62-98-123V48Z"
        fill="#ffffff" stroke="#111827" stroke-width="9"/>
      <path d="M128 24 214 55v70c0 53-29 86-86 109-57-23-86-56-86-109V55Z"
        fill="${primary}" stroke="${secondary}" stroke-width="7"/>
      <path d="M128 37 201 63v58c0 44-23 72-73 94-50-22-73-50-73-94V63Z"
        fill="none" stroke="#ffffff" stroke-width="4" opacity=".9"/>
      <path d="M64 77h128" stroke="${secondary}" stroke-width="10" stroke-linecap="round"/>
      <path d="M73 91h110" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity=".9"/>
      <text x="128" y="165" text-anchor="middle"
        font-family="Arial Black,Arial,sans-serif"
        font-size="${mark.length > 2 ? 54 : mark.length === 2 ? 72 : 96}"
        font-weight="900" fill="#ffffff"
        stroke="#111827" stroke-width="7" stroke-linejoin="round">${mark}</text>
      <path d="M32 176 69 162c18 8 38 12 59 12s41-4 59-12l37 14-16 26 9 26-48-10c-14 7-28 10-41 10s-27-3-41-10l-48 10 9-26Z"
        fill="${secondary}" stroke="#111827" stroke-width="7" stroke-linejoin="round"/>
      <text x="128" y="202" text-anchor="middle"
        font-family="Arial Black,Arial,sans-serif"
        font-size="${mascot.length > 9 ? 16 : 19}"
        font-weight="900" letter-spacing="1"
        fill="${primary === '#111111' ? '#ffffff' : '#111827'}">${mascot.toUpperCase()}</text>
    </svg>
  `);

export const teamMascots = {
  Benedictine: "/mascots/benedictine-cadets.png",
};

const scoreMascots = {
  Benedictine: "/mascots/benedictine-score-b.svg",
};

const standingsMascots = {};

export const getTeamMascot = (teamName = "") =>
  teamMascots[teamName.trim()] || null;

export const getScoreMascot = (teamName = "") =>
  scoreMascots[teamName.trim()] || null;

export const getStandingsMascot = (teamName = "") =>
  standingsMascots[teamName.trim()] || null;

export default teamMascots;
