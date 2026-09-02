// Test-branch schedule overlay built from the official 2026 team schedule graphics
// supplied Aug. 22. The Aug. 21 Ballou data remains in footballGames.js; this
// file replaces rows involving the other newly verified DCIAA teams and then
// de-duplicates the combined schedule.

import { footballGames as baseFootballGames } from "./footballGames.js";

const UPDATED_TEAMS = new Set([
  "Anacostia", "Bell", "Cardozo", "Coolidge", "Dunbar", "Eastern",
  "H.D. Woodson", "Jackson-Reed", "McKinley Tech", "Phelps ACE",
  "Ron Brown", "Roosevelt",
]);

const ROOSEVELT_SOURCE = "https://www.instagram.com/roughridersfootball/";
const ROOSEVELT_NOTE = "Published on Roosevelt's updated official 2026 football schedule graphic.";

const rows = [
["2026-08-28","4:00 PM","Coolidge","Kinnard (SC)","Kinnard (SC)"],["2026-08-28","6:00 PM","John Champe","Dunbar","Dunbar"],["2026-08-28","6:00 PM","KIPP College Prep","Jackson-Reed","Jackson-Reed"],["2026-08-28","6:00 PM","KIPP DC Legacy","McKinley Tech","KIPP Legacy"],["2026-08-28","6:00 PM","New Town","Eastern","Eastern"],["2026-08-28","6:00 PM","St. Michael the Archangel (VA)","Bell","Cardozo HS"],["2026-08-28","6:30 PM","Edmondson-Westside","Phelps ACE","Phelps ACE"],["2026-08-28","7:30 PM","Digital Pioneers Academy","Anacostia","The St. James, Springfield, VA"],
["2026-09-03","6:00 PM","Sidwell Friends","Ron Brown","Monarch Stadium"],["2026-09-04","6:00 PM","C.H. Flowers","Eastern","Eastern"],["2026-09-04","6:00 PM","Edmondson-Westside","Cardozo","Cardozo"],["2026-09-04","6:00 PM","KIPP DC Legacy","Roosevelt","Roosevelt",false,ROOSEVELT_NOTE,ROOSEVELT_SOURCE,"2026-09-02"],["2026-09-04","6:00 PM","McKinley Tech","H.D. Woodson","H.D. Woodson"],["2026-09-04","6:30 PM","Anacostia","Friendly","Friendly High School"],["2026-09-04","6:30 PM","Coolidge","Gonzaga","Buchanan Field"],["2026-09-05","2:00 PM","Christ the King Regional","Jackson-Reed","Jackson-Reed"],["2026-09-05","2:00 PM","Phelps ACE","Surrattsville","Surrattsville High School"],
["2026-09-11","4:30 PM","Anacostia","Surrattsville","Surrattsville High School"],["2026-09-11","4:30 PM","Jackson-Reed","Flint Hill","Flint Hill School"],["2026-09-11","6:00 PM","Bishop Ireton","McKinley Tech","McKinley Tech"],["2026-09-11","6:00 PM","Connexions Leadership Academy","Phelps ACE","Phelps ACE"],["2026-09-11","6:00 PM","Ron Brown","H.D. Woodson","H.D. Woodson"],["2026-09-11","6:00 PM","Woodbridge (VA)","Dunbar","Dunbar"],["2026-09-11","6:30 PM","Eastern","Gonzaga","Buchanan Field"],["2026-09-11","7:00 PM","Bell","Riverdale Baptist","Riverdale Baptist"],["2026-09-11","TBD","Digital Pioneers Academy","Roosevelt","Roosevelt",false,ROOSEVELT_NOTE,ROOSEVELT_SOURCE,"2026-09-02"],
["2026-09-12","2:00 PM","Cardozo","Independence","Independence High School, Coal City, WV"],["2026-09-12","6:00 PM","Coolidge","Mervo (Baltimore)","Mervo (Baltimore)"],["2026-09-17","6:00 PM","Roosevelt","McKinley Tech","McKinley Tech",false,ROOSEVELT_NOTE,ROOSEVELT_SOURCE,"2026-09-02"],["2026-09-18","4:30 PM","Bell","Maret","Maret"],["2026-09-18","6:00 PM","Anacostia","Ballou","Ballou High School"],["2026-09-18","6:00 PM","Digital Pioneers Academy","H.D. Woodson","H.D. Woodson"],["2026-09-18","6:00 PM","KIPP College Prep","Coolidge","Coolidge"],["2026-09-18","6:00 PM","KIPP DC Legacy","Jackson-Reed","Jackson-Reed"],["2026-09-18","6:00 PM","Sidwell Friends","Phelps ACE","Phelps ACE"],["2026-09-18","6:30 PM","Eastern","Georgetown Prep","Georgetown Prep"],["2026-09-19","12:00 PM","Ron Brown","Bishop Ireton","CY Donnelly Field"],["2026-09-19","1:00 PM","Hoboken (NJ)","Dunbar","Dunbar"],
["2026-09-24","6:00 PM","Eastern","Ballou","Ballou"],["2026-09-24","6:00 PM","H.D. Woodson","Roosevelt","Roosevelt",false,ROOSEVELT_NOTE,ROOSEVELT_SOURCE,"2026-09-02"],["2026-09-25","6:00 PM","Bell","Coolidge","Coolidge HS"],["2026-09-25","6:00 PM","Jackson-Reed","Thomas Jefferson Science and Technology","Thomas Jefferson Science and Technology"],["2026-09-25","6:00 PM","KIPP College Prep","Anacostia","Anacostia High School"],["2026-09-25","6:00 PM","Mt. Zion","Ron Brown","Monarch Stadium"],["2026-09-25","7:00 PM","Cardozo","Manassas Park","Manassas Park"],["2026-09-26","1:00 PM","Dunbar","Chester (PA)","Chester (PA)"],["2026-09-26","2:00 PM","Arundel Christian School","Phelps ACE","Phelps ACE"],["2026-09-26","2:00 PM","McKinley Tech","St. Albans","St. Albans"],
["2026-10-01","6:00 PM","Dunbar","Bell","Cardozo HS"],["2026-10-02","TBD","Bullis","Roosevelt","Bullis",false,ROOSEVELT_NOTE,ROOSEVELT_SOURCE,"2026-09-02"],["2026-10-03","1:00 PM","H.D. Woodson","Eastern","Eastern"],["2026-10-03","TBD","Coolidge","Ballou","Ballou",true,"Ballou Aug. 21 schedule lists Oct. 3; Coolidge Aug. 3 graphic lists Oct. 2."],["2026-10-08","6:00 PM","Jackson-Reed","McKinley Tech","McKinley Tech"],["2026-10-08","6:00 PM","Phelps ACE","Anacostia","Anacostia High School"],["2026-10-09","6:00 PM","Ballou","Bell","Cardozo HS"],["2026-10-09","6:00 PM","Cardozo","Ron Brown","Spingarn"],["2026-10-09","6:00 PM","Dunbar","H.D. Woodson","H.D. Woodson"],["2026-10-09","6:00 PM","Eastern","Roosevelt","Roosevelt",false,ROOSEVELT_NOTE,ROOSEVELT_SOURCE,"2026-09-02"],
["2026-10-15","TBD","Ballou","Roosevelt","Ballou",false,ROOSEVELT_NOTE,ROOSEVELT_SOURCE,"2026-09-02"],["2026-10-16","6:00 PM","Cardozo","Phelps ACE","Spingarn"],["2026-10-16","6:00 PM","Eastern","Dunbar","Dunbar",true,"Dunbar graphic lists Oct. 16; Eastern graphic appears to show Oct. 15."],["2026-10-17","2:00 PM","Anacostia","McKinley Tech","McKinley Tech High School"],["2026-10-17","2:00 PM","H.D. Woodson","Coolidge","Coolidge"],["2026-10-17","2:00 PM","Ron Brown","Jackson-Reed","Jackson-Reed"],["2026-10-22","6:00 PM","Cardozo","Anacostia","Anacostia High School",true,"Anacostia Aug. 6 graphic lists Oct. 22; Cardozo July graphic lists Oct. 23."],["2026-10-23","6:00 PM","Eastern","Coolidge","Coolidge",true,"Coolidge Aug. 3 graphic lists Oct. 23; Eastern graphic appears to show Oct. 22."],["2026-10-23","6:00 PM","McKinley Tech","Ron Brown","Spingarn"],["2026-10-23","6:00 PM","Phelps ACE","Jackson-Reed","Jackson-Reed"],["2026-10-24","12:00 PM","Bell","H.D. Woodson","H.D. Woodson HS"],["2026-10-24","6:00 PM","Roosevelt","Dunbar","Dunbar",false,ROOSEVELT_NOTE,ROOSEVELT_SOURCE,"2026-09-02"],
["2026-10-29","6:00 PM","Ballou","Dunbar","Dunbar",true,"Ballou Aug. 21 schedule lists Oct. 29; Dunbar May graphic lists Oct. 30."],["2026-10-29","6:00 PM","Jackson-Reed","Cardozo","Cardozo"],["2026-10-30","6:00 PM","Phelps ACE","McKinley Tech","McKinley Tech",true,"Phelps July 14 graphic lists Oct. 30; McKinley Tech May graphic lists Oct. 29."],["2026-10-31","11:00 AM","Bell","Eastern","Eastern HS"],["2026-10-31","11:00 AM","Ron Brown","Anacostia","Anacostia High School"],["2026-10-31","6:00 PM","Coolidge","Roosevelt","Roosevelt",false,ROOSEVELT_NOTE,ROOSEVELT_SOURCE,"2026-09-02"],
["2026-11-05","6:00 PM","Ron Brown","Phelps ACE","Phelps ACE",true,"Ron Brown graphic lists Nov. 5; Phelps graphic lists Nov. 6."],["2026-11-06","6:00 PM","Ballou","H.D. Woodson","H.D. Woodson"],["2026-11-06","6:00 PM","Coolidge","Dunbar","Dunbar"],["2026-11-06","6:00 PM","Jackson-Reed","Anacostia","Anacostia High School"],["2026-11-06","6:00 PM","McKinley Tech","Cardozo","Cardozo"],["2026-11-07","2:00 PM","Roosevelt","Bell","Cardozo HS",false,ROOSEVELT_NOTE,ROOSEVELT_SOURCE,"2026-09-02"]
];

const slug = (v) => String(v).toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const official = rows.map(([date,time,team1,team2,location,subjectToChange=false,notes="Published on official 2026 team schedule graphic.",sourceUrl="",rowLastChecked="2026-08-22"]) => ({
  id:`fb-${date}-${slug(team1)}-${slug(team2)}`, sport:"Football", division:"Varsity", ageGroup:"Varsity",
  date,time,team1,team2,score1:null,score2:null,location,
  scheduleStatus:subjectToChange?"Subject to change":"Confirmed", subjectToChange,
  verificationStatus:subjectToChange?"Conflicting official graphics":"Published", sourceTier:"Official team graphic",
  notes,sourceUrl,lastChecked:rowLastChecked
}));

const retained = baseFootballGames.filter((game) => !UPDATED_TEAMS.has(game.team1) && !UPDATED_TEAMS.has(game.team2));
const byKey = new Map();
for (const game of [...retained, ...official]) {
  const teams = [game.team1, game.team2].sort().join("|");
  byKey.set(`${game.date}|${teams}`, game);
}

export const footballGames = [...byKey.values()].sort((a,b) => a.date.localeCompare(b.date) || String(a.time).localeCompare(String(b.time)));
export default footballGames;
