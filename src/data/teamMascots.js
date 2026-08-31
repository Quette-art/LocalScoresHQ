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
  Bladensburg: "/mascots/bladensburg.svg",
  Bowie: "/mascots/bowie.svg",
  Central: "/mascots/central.svg",
  Crossland: "/mascots/crossland.svg",
  DuVal: "/mascots/duval.svg",
  "Eleanor Roosevelt": "/mascots/eleanor-roosevelt.svg",
  "Fairmont Heights": "/mascots/fairmont-heights.svg",
  Flowers: "/mascots/flowers.svg",
  "C.H. Flowers": "/mascots/flowers.svg",
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
  Anacostia: "/mascots/anacostia.svg",
  Ballou: "/mascots/ballou.svg",
  Bell: "/mascots/bell.svg",
  Cardozo: "/mascots/cardozo.svg",
  Coolidge: "/mascots/coolidge.svg",
  Dunbar: "/mascots/dunbar.svg",
  Eastern: "/mascots/eastern.svg",
  "H.D. Woodson": "/mascots/hd-woodson.svg",
  "Jackson-Reed": "/mascots/jackson-reed.svg",
  "McKinley Tech": "/mascots/mckinley-tech.svg",
  "Phelps ACE": "/mascots/phelps-ace.svg",
  "Ron Brown": "/mascots/ron-brown.svg",
  Roosevelt: "/mascots/roosevelt.svg",
  "Archbishop Carroll": "/mascots/archbishop-carroll.svg",
  "Bishop McNamara": "/mascots/standings/bishop-mcnamara.png",
  DeMatha: "/mascots/standings/dematha.png",
  "Good Counsel": "/mascots/standings/good-counsel.png",
  "Digital Pioneers Academy": "/mascots/digital-pioneers-academy.svg",
  Gonzaga: "/mascots/gonzaga.svg",
  "KIPP College Prep": "/mascots/kipp-college-prep.svg",
  "KIPP DC Legacy": "/mascots/kipp-dc-legacy.svg",
  "Sidwell Friends": "/mascots/sidwell-friends.svg",
  "St. John's": "/mascots/st-johns.svg",
  "St. John’s": "/mascots/st-johns.svg",
  "St Johns": "/mascots/st-johns.svg",
  Benedictine: "/mascots/benedictine-cadets-hq.svg",
  "Calvert Hall": makeCrest("CH", "Cardinals", "#7A0019", "#D4AF37"),
  "KIPP Atlanta Collegiate": makeCrest("KAC", "Warriors", "#5B2C83", "#39A852"),
  "Archbishop Spalding": makeCrest("AS", "Cavaliers", "#C8102E", "#FFFFFF"),
  "Annapolis Area Christian": makeCrest("A", "Eagles", "#0B1F3A", "#D4AF37"),
  "Lewis Bennett": makeCrest("LB", "Tigers", "#0057B8", "#F47C20"),
  Booker: makeCrest("B", "Tornadoes", "#5B2C83", "#F4C542"),
  "St. Edward": makeCrest("SE", "Eagles", "#006633", "#D4AF37"),
  "St Edward": makeCrest("SE", "Eagles", "#006633", "#D4AF37"),
  "Malvern Prep": makeCrest("M", "Friars", "#003A70", "#B7C9E2"),
  "Cornerstone Christian": makeCrest("C", "Warriors", "#14213D", "#B21E35"),
  "Eastern Tech": makeCrest("ET", "Mavericks", "#F58220", "#111111"),
  "Potomac School": makeCrest("P", "Panthers", "#0B2D5B", "#F47C20"),
  Yorktown: makeCrest("Y", "Patriots", "#6EC1E4", "#FFFFFF"),
  "Kinnard (SC)": "/mascots/approved-hunter-kinard-tyler.svg",
  "Hunter-Kinard-Tyler": "/mascots/approved-hunter-kinard-tyler.svg",
  "John Champe": "/mascots/approved-john-champe.svg",
  "New Town": "/mascots/approved-new-town.svg",
  "St. Michael the Archangel (VA)": "/mascots/approved-st-michael-archangel.svg",
  "St. Michael the Archangel": "/mascots/approved-st-michael-archangel.svg",
  "Edmondson-Westside": "/mascots/approved-edmondson-westside.svg",
  "Christ the King Regional": "/mascots/approved-christ-the-king-regional.svg",
  "Flint Hill": "/mascots/approved-flint-hill.svg",
  "Bishop Ireton": "/mascots/approved-bishop-ireton.svg",
  "Connexions Leadership Academy": "/mascots/approved-connexions-leadership-academy.svg",
  "Woodbridge (VA)": "/mascots/approved-woodbridge-va.svg",
  Woodbridge: "/mascots/approved-woodbridge-va.svg",
  "Riverdale Baptist": "/mascots/riverdale-baptist.svg",
  "Riverdale Baptist School": "/mascots/riverdale-baptist.svg",
  Independence: "/mascots/independence-wv.svg",
  "Independence High School": "/mascots/independence-wv.svg",
  "Mervo (Baltimore)": "/mascots/mervo.svg",
  Mervo: "/mascots/mervo.svg",
  "Mergenthaler Vocational-Technical": "/mascots/mervo.svg",
  Maret: "/mascots/maret.svg",
  "Maret School": "/mascots/maret.svg",
  "Georgetown Prep": "/mascots/georgetown-prep.svg",
  "Georgetown Preparatory School": "/mascots/georgetown-prep.svg",
  "Hoboken (NJ)": "/mascots/hoboken.svg",
  Hoboken: "/mascots/hoboken.svg",
  "Thomas Jefferson Science and Technology": "/mascots/thomas-jefferson-sst.svg",
  "Thomas Jefferson Science & Technology": "/mascots/thomas-jefferson-sst.svg",
  "Thomas Jefferson High School for Science and Technology": "/mascots/thomas-jefferson-sst.svg",
  "Mt. Zion": "/mascots/mt-zion-prep.svg",
  "Mt. Zion Prep": "/mascots/mt-zion-prep.svg",
  "Mt. Zion Prep Academy": "/mascots/mt-zion-prep.svg",
  "Manassas Park": "/mascots/manassas-park.svg",
  "Manassas Park High School": "/mascots/manassas-park.svg",
  "Chester (PA)": "/mascots/chester-pa.svg",
  Chester: "/mascots/chester-pa.svg",
};

const scoreMascots = {
  Benedictine: "/mascots/benedictine-score-b.svg",
  Bullis: "/mascots/bullis-score-bulldog.svg",
  "Friendship Collegiate": "/mascots/custom/friendship-collegiate-custom.svg",
  "Friendship Collegiate Academy": "/mascots/custom/friendship-collegiate-custom.svg",
  "St. Albans": "/mascots/custom/st-albans-custom.svg",
  Landon: "/mascots/custom/landon-custom.svg",
  "National Christian Academy": "/mascots/custom/national-christian-academy-custom.svg",
  "Rock Creek Christian Academy": "/mascots/custom/rock-creek-christian-academy-custom.svg",
  "St. Mary's Ryken": "/mascots/custom/st-marys-ryken-custom.svg",
  "St. Mary’s Ryken": "/mascots/custom/st-marys-ryken-custom.svg",
  "St. Vincent Pallotti": "/mascots/custom/st-vincent-pallotti-custom.svg",
  "Calvert Hall": makeScoreMark("CH", "#7A0019", "#D4AF37"),
  "KIPP Atlanta Collegiate": makeScoreMark("KAC", "#5B2C83", "#39A852"),
  "Archbishop Spalding": makeScoreMark("AS", "#C8102E", "#FFFFFF"),
  "Annapolis Area Christian": makeScoreMark("A", "#0B1F3A", "#D4AF37"),
  "Lewis Bennett": makeScoreMark("LB", "#0057B8", "#F47C20"),
  Booker: makeScoreMark("B", "#5B2C83", "#F4C542"),
  "St. Edward": makeScoreMark("SE", "#006633", "#D4AF37"),
  "St Edward": makeScoreMark("SE", "#006633", "#D4AF37"),
  "Malvern Prep": makeScoreMark("M", "#003A70", "#B7C9E2"),
  "Cornerstone Christian": makeScoreMark("C", "#14213D", "#B21E35"),
  "Eastern Tech": makeScoreMark("ET", "#F58220", "#111111"),
  "Potomac School": makeScoreMark("P", "#0B2D5B", "#F47C20"),
  Yorktown: makeScoreMark("Y", "#6EC1E4", "#FFFFFF"),
};

const standingsMascots = {
  Anacostia: "/mascots/standings/anacostia.png",
  Ballou: "/mascots/standings/ballou.png",
  Bell: "/mascots/standings/bell.png",
  Cardozo: "/mascots/standings/cardozo.png",
  Coolidge: "/mascots/standings/coolidge.png",
  Dunbar: "/mascots/standings/dunbar.png",
  Eastern: "/mascots/standings/eastern.png",
  "H.D. Woodson": "/mascots/standings/hd-woodson.png",
  "Jackson-Reed": "/mascots/standings/jackson-reed.png",
  "McKinley Tech": "/mascots/standings/mckinley-tech.png",
  "Phelps ACE": "/mascots/standings/phelps-ace.png",
  "Ron Brown": "/mascots/standings/ron-brown.png",
  Roosevelt: "/mascots/standings/roosevelt.png",
  "Archbishop Carroll": "/mascots/standings/archbishop-carroll.png",
  "Bishop McNamara": "/mascots/standings/bishop-mcnamara.png",
  DeMatha: "/mascots/standings/dematha.png",
  Gonzaga: "/mascots/standings/gonzaga.png",
  "Good Counsel": "/mascots/standings/good-counsel.png",
  "Digital Pioneers Academy": "/mascots/standings/digital-pioneers-academy.png",
  "KIPP College Prep": "/mascots/standings/kipp-college-prep.png",
  "KIPP DC Legacy": "/mascots/standings/kipp-dc-legacy.png",
  "Sidwell Friends": "/mascots/standings/sidwell-friends.png",
  "St. John's": "/mascots/standings/st-johns.png",
  "St. John’s": "/mascots/standings/st-johns.png",
  "St Johns": "/mascots/standings/st-johns.png",
};

// These source files are pixel-traced SVGs with thousands of tiny paths.
// Decoding them as vectors while they enter the viewport blocks iOS Safari's
// main thread and makes momentum scrolling visibly stall. The 192px WebP
// versions preserve more detail than the UI displays while decoding cheaply.
const HEAVY_MASCOT_FILES = new Set([
  "anacostia.svg",
  "archbishop-carroll.svg",
  "ballou.svg",
  "bell.svg",
  "bladensburg.svg",
  "bowie.svg",
  "cardozo.svg",
  "central.svg",
  "coolidge.svg",
  "crossland.svg",
  "digital-pioneers-academy.svg",
  "dunbar.svg",
  "duval.svg",
  "eastern.svg",
  "eleanor-roosevelt.svg",
  "fairmont-heights.svg",
  "flowers.svg",
  "frederick-douglass.svg",
  "friendly.svg",
  "gonzaga.svg",
  "gwynn-park.svg",
  "hd-woodson.svg",
  "high-point.svg",
  "jackson-reed.svg",
  "kipp-college-prep.svg",
  "kipp-dc-legacy.svg",
  "largo.svg",
  "laurel.svg",
  "mckinley-tech.svg",
  "northwestern.svg",
  "oxon-hill.svg",
  "parkdale.svg",
  "phelps-ace.svg",
  "potomac.svg",
  "ron-brown.svg",
  "roosevelt.svg",
  "sidwell-friends.svg",
  "st-johns.svg",
  "suitland.svg",
  "surrattsville.svg",
  "wise.svg",
]);

const optimizeHeavyMascot = (mascotPath) => {
  if (!mascotPath?.startsWith("/mascots/") || !mascotPath.endsWith(".svg")) {
    return mascotPath;
  }

  const fileName = mascotPath.slice("/mascots/".length);
  return HEAVY_MASCOT_FILES.has(fileName)
    ? `/mascots/optimized/${fileName.replace(/\.svg$/, ".webp")}`
    : mascotPath;
};

export const getTeamMascot = (teamName = "") =>
  optimizeHeavyMascot(teamMascots[teamName.trim()] || null);

export const getScoreMascot = (teamName = "") =>
  scoreMascots[teamName.trim()] || null;

export const getStandingsMascot = (teamName = "") =>
  standingsMascots[teamName.trim()] || null;

export default teamMascots;
