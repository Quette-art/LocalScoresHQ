const createCrestMascot = ({ primary, secondary, accent, initials, banner, sub, symbol = "★" }) => {
  const initialsSize = initials.length > 2 ? 25 : 32;
  const bannerSize = banner.length > 11 ? 10 : 12;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 180">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${primary}"/>
        <stop offset="1" stop-color="#0b1020"/>
      </linearGradient>
      <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#000" flood-opacity=".35"/>
      </filter>
    </defs>
    <g filter="url(#s)">
      <path d="M80 4 146 22v56c0 43-27 76-66 96C41 154 14 121 14 78V22L80 4Z" fill="#0b1020" stroke="${secondary}" stroke-width="5"/>
      <path d="M80 11 138 27v49c0 37-23 66-58 85-35-19-58-48-58-85V27L80 11Z" fill="url(#g)" stroke="${accent}" stroke-width="2.5"/>
      <path d="M80 19 130 33v41c0 31-18 56-50 75-32-19-50-44-50-75V33L80 19Z" fill="none" stroke="${secondary}" stroke-opacity=".9" stroke-width="2"/>
      <path d="M35 50 125 30" stroke="${secondary}" stroke-width="8" opacity=".16"/>
      <path d="M31 72 132 49" stroke="${accent}" stroke-width="4" opacity=".12"/>
      <circle cx="80" cy="35" r="15" fill="#0b1020" stroke="${secondary}" stroke-width="3"/>
      <path d="M70 34c3-9 17-9 20 0l-4 2v8H74v-8l-4-2Z" fill="${accent}" stroke="${secondary}" stroke-width="2"/>
      <path d="M75 41h10M80 35v9" stroke="${primary}" stroke-width="1.8"/>
      <text x="80" y="68" text-anchor="middle" fill="${accent}" font-family="Arial Black,Arial,sans-serif" font-size="${initialsSize}" font-weight="900" stroke="#000" stroke-opacity=".45" stroke-width="1.2" paint-order="stroke">${initials}</text>
      <path d="M25 84h110l-8 24H33L25 84Z" fill="${secondary}" stroke="#0b1020" stroke-width="3"/>
      <path d="M18 90 33 84v24l-15-7 7-5-7-6ZM142 90l-15-6v24l15-7-7-5 7-6Z" fill="${primary}" stroke="#0b1020" stroke-width="3"/>
      <text x="80" y="100" text-anchor="middle" fill="#0b1020" font-family="Arial Black,Arial,sans-serif" font-size="${bannerSize}" font-weight="900" letter-spacing=".7">${banner}</text>
      <text x="80" y="125" text-anchor="middle" fill="${accent}" font-family="Arial,Helvetica,sans-serif" font-size="10" font-weight="900" letter-spacing="1.3">${sub}</text>
      <text x="80" y="145" text-anchor="middle" fill="${secondary}" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="900">${symbol}</text>
      <path d="M55 151h50" stroke="${secondary}" stroke-width="2" opacity=".8"/>
      <circle cx="45" cy="147" r="3" fill="${accent}"/>
      <circle cx="115" cy="147" r="3" fill="${accent}"/>
    </g>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const opponentCrests = {
  "Calvert Hall": createCrestMascot({ primary: "#6b0f1a", secondary: "#d4a017", accent: "#f8fafc", initials: "CH", banner: "CALVERT HALL", sub: "CARDINALS" }),
  "Archbishop Spalding": createCrestMascot({ primary: "#c8102e", secondary: "#111111", accent: "#f8fafc", initials: "AS", banner: "SPALDING", sub: "CAVALIERS", symbol: "✝" }),
  "Annapolis Area Christian": createCrestMascot({ primary: "#0f2747", secondary: "#d4a017", accent: "#f8fafc", initials: "AAC", banner: "AACS", sub: "EAGLES", symbol: "✝" }),
  "KIPP Atlanta Collegiate": createCrestMascot({ primary: "#3b1d5f", secondary: "#8b5cf6", accent: "#f8fafc", initials: "KAC", banner: "KIPP ATLANTA", sub: "COLLEGIATE" }),
  "Lewis Bennett": createCrestMascot({ primary: "#0b1f3a", secondary: "#d4a017", accent: "#f8fafc", initials: "LB", banner: "LEWIS BENNETT", sub: "FOOTBALL" }),
  Benedictine: createCrestMascot({ primary: "#0b4f2f", secondary: "#f8fafc", accent: "#d4a017", initials: "B", banner: "BENEDICTINE", sub: "CADETS" }),
  "St. Edward": createCrestMascot({ primary: "#0b4f2f", secondary: "#d4a017", accent: "#f8fafc", initials: "SE", banner: "ST. EDWARD", sub: "EAGLES" }),
  "Malvern Prep": createCrestMascot({ primary: "#6b0f1a", secondary: "#f8fafc", accent: "#d4a017", initials: "MP", banner: "MALVERN PREP", sub: "FRIARS", symbol: "✝" }),
  "Cornerstone Christian": createCrestMascot({ primary: "#0f2747", secondary: "#cbd5e1", accent: "#f8fafc", initials: "CC", banner: "CORNERSTONE", sub: "CHRISTIAN", symbol: "✝" }),
  "Eastern Tech": createCrestMascot({ primary: "#111827", secondary: "#d4a017", accent: "#f8fafc", initials: "ET", banner: "EASTERN TECH", sub: "MAVERICKS" }),
  "Potomac School": createCrestMascot({ primary: "#0f2747", secondary: "#cbd5e1", accent: "#f8fafc", initials: "PS", banner: "POTOMAC", sub: "SCHOOL" }),
  Columbia: createCrestMascot({ primary: "#0f4c81", secondary: "#cbd5e1", accent: "#f8fafc", initials: "C", banner: "COLUMBIA", sub: "FOOTBALL" }),
  Yorktown: createCrestMascot({ primary: "#0b4f2f", secondary: "#f8fafc", accent: "#d4a017", initials: "Y", banner: "YORKTOWN", sub: "PATRIOTS" }),
};

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

  "Calvert Hall": opponentCrests["Calvert Hall"],
  "Archbishop Spalding": opponentCrests["Archbishop Spalding"],
  "Annapolis Area Christian": opponentCrests["Annapolis Area Christian"],
  "KIPP Atlanta Collegiate": opponentCrests["KIPP Atlanta Collegiate"],
  "Lewis Bennett": opponentCrests["Lewis Bennett"],
  Benedictine: opponentCrests.Benedictine,
  "St. Edward": opponentCrests["St. Edward"],
  "Malvern Prep": opponentCrests["Malvern Prep"],
  "Cornerstone Christian": opponentCrests["Cornerstone Christian"],
  "Eastern Tech": opponentCrests["Eastern Tech"],
  "Potomac School": opponentCrests["Potomac School"],
  Columbia: opponentCrests.Columbia,
  Yorktown: opponentCrests.Yorktown,

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

export const getTeamMascot = (teamName = "") =>
  teamMascots[teamName.trim()] || null;

export const getStandingsMascot = (teamName = "") =>
  standingsMascots[teamName.trim()] || null;

export default teamMascots;
