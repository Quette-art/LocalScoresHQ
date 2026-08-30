// LocalScoresHQ football coverage policy — 2026 season.
//
// Tracked schools get full schedule/result coverage and belong in the site's
// DC or Maryland school universe. Other teams may still appear as opponents
// when they play a tracked school, but LocalScoresHQ does not need to maintain
// their complete season until the coverage area expands.

export const dcTrackedFootballSchools = [
  "Anacostia",
  "Archbishop Carroll",
  "Ballou",
  "Bell",
  "Cardozo",
  "Coolidge",
  "Digital Pioneers Academy",
  "Dunbar",
  "Eastern",
  "Friendship Collegiate Academy",
  "Gonzaga",
  "H.D. Woodson",
  "Jackson-Reed",
  "KIPP College Prep",
  "KIPP DC Legacy",
  "Maret",
  "McKinley Tech",
  "Phelps ACE",
  "Ron Brown",
  "Roosevelt",
  "Sidwell Friends",
  "St. Albans",
  "St. John’s",
];

// Prince George's County public-school football programs in the LocalScoresHQ
// Maryland coverage area. High Point remains tracked even while its 2026
// schedule is incomplete/unpublished in the current data pass.
export const pgCountyPublicFootballSchools = [
  "Bladensburg",
  "Bowie",
  "Central",
  "Crossland",
  "DuVal",
  "Eleanor Roosevelt",
  "Fairmont Heights",
  "Flowers",
  "Frederick Douglass",
  "Friendly",
  "Gwynn Park",
  "High Point",
  "Largo",
  "Laurel",
  "Northwestern",
  "Oxon Hill",
  "Parkdale",
  "Potomac",
  "Suitland",
  "Surrattsville",
  "Wise",
];

// Maryland private/prep programs in the core DMV footprint that LocalScoresHQ
// will track as full programs rather than opponent-only schools.
export const marylandPrivateFootballSchools = [
  "Bishop McNamara",
  "Bullis",
  "DeMatha",
  "Georgetown Prep",
  "Landon",
  "Mt. Zion Prep Academy",
  "National Christian Academy",
  "Our Lady of Good Counsel",
  "Riverdale Baptist",
  "Rock Creek Christian Academy",
  "St. Mary's Ryken",
  "St. Vincent Pallotti",
];

export const marylandTrackedFootballSchools = [
  ...pgCountyPublicFootballSchools,
  ...marylandPrivateFootballSchools,
];

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\./g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const aliases = new Map([
  ["friendship collegiate", "Friendship Collegiate Academy"],
  ["friendship collegiate academy knights", "Friendship Collegiate Academy"],
  ["st johns", "St. John’s"],
  ["st john's", "St. John’s"],
  ["st johns college high school", "St. John’s"],
  ["st albans school", "St. Albans"],
  ["archbishop carroll high school", "Archbishop Carroll"],
  ["kipp dc legacy college prep", "KIPP DC Legacy"],
  ["phelps", "Phelps ACE"],
  ["charles h flowers", "Flowers"],
  ["charles h flowers high school", "Flowers"],
  ["dr henry a wise jr", "Wise"],
  ["dr henry wise", "Wise"],
  ["duval high school", "DuVal"],
  ["frederick douglass high school", "Frederick Douglass"],
  ["bishop mcnamara high school", "Bishop McNamara"],
  ["bullis school", "Bullis"],
  ["dematha catholic", "DeMatha"],
  ["dematha catholic high school", "DeMatha"],
  ["georgetown preparatory school", "Georgetown Prep"],
  ["landon school", "Landon"],
  ["mt zion", "Mt. Zion Prep Academy"],
  ["mt zion prep", "Mt. Zion Prep Academy"],
  ["mount zion prep academy", "Mt. Zion Prep Academy"],
  ["our lady of good counsel high school", "Our Lady of Good Counsel"],
  ["good counsel", "Our Lady of Good Counsel"],
  ["riverdale baptist school", "Riverdale Baptist"],
  ["rock creek christian", "Rock Creek Christian Academy"],
  ["st marys ryken", "St. Mary's Ryken"],
  ["st mary's ryken high school", "St. Mary's Ryken"],
  ["st vincent pallotti high school", "St. Vincent Pallotti"],
]);

const canonicalByNormalized = new Map(
  [...dcTrackedFootballSchools, ...marylandTrackedFootballSchools].map((name) => [
    normalize(name),
    name,
  ])
);

export const canonicalTrackedFootballSchool = (teamName = "") => {
  const key = normalize(teamName);
  return canonicalByNormalized.get(key) || aliases.get(key) || null;
};

export const getTrackedFootballRegion = (teamName = "") => {
  const canonical = canonicalTrackedFootballSchool(teamName);
  if (!canonical) return null;

  if (dcTrackedFootballSchools.includes(canonical)) return "DC";
  if (marylandTrackedFootballSchools.includes(canonical)) return "MD";
  return null;
};

export const isTrackedFootballSchool = (teamName = "") =>
  getTrackedFootballRegion(teamName) !== null;

export default {
  dcTrackedFootballSchools,
  pgCountyPublicFootballSchools,
  marylandPrivateFootballSchools,
  marylandTrackedFootballSchools,
  canonicalTrackedFootballSchool,
  getTrackedFootballRegion,
  isTrackedFootballSchool,
};
