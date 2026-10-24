const SCOREBOARD_URL = "https://www.maxpreps.com/md/football/scores/?date=10/9/2026";
const ROUNDUP_URL = "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5";
const FINAL_RESULTS = new Map([
  ["fb-2026-10-23-mckinley-tech-ron-brown", {
  "id": "fb-2026-10-23-mckinley-tech-ron-brown",
  "team1": "McKinley Tech",
  "team2": "Ron Brown",
  "date": "2026-10-23",
  "score1": 7,
  "score2": 0,
  "sourceUrl": "https://www.maxpreps.com/dc/football/game/mckinley-tech-washington-vs-ron-brown-washington/10-23-2026/?c=ed4e2a9e-0da1-48e2-b42b-6a0747231d44",
  "sourceTier": "MaxPreps and DCSportsFan",
  "confirmation": "October 23 varsity final McKinley Tech 7, Ron Brown 0 confirmed by MaxPreps final box score (7-0 in overtime) and independent original local DCSportsFan October 24 results: https://dcsportsfan.com/2026/10/24/football-scores/. Added once to shared game for both teams derived records; date/time unchanged.",
  "lastChecked": "2026-10-24"
}],
  ["md-fb-2026-10-23-gwynn-park-friendly", {
  "id": "md-fb-2026-10-23-gwynn-park-friendly",
  "team1": "Gwynn Park",
  "team2": "Friendly",
  "date": "2026-10-23",
  "score1": 100,
  "score2": 0,
  "sourceUrl": "https://www.maxpreps.com/md/fort-washington/friendly-patriots/football/schedule/",
  "sourceTier": "MaxPreps and High School On SI",
  "confirmation": "October 23 varsity final Gwynn Park 100, Friendly 0 independently listed by current MaxPreps team results and SBLive final game page: https://www.si.com/high-school/stats/maryland/football/games/6629849-gwynn-park-vs-friendly. Previously held single-source result now corroborated; SI Maryland roundup also lists 100-0. Dedicated MaxPreps matchup remains stale/unscored, not conflicting. Added once to shared game for both teams derived records; date/time unchanged.",
  "lastChecked": "2026-10-24"
}],
  ["fb-2026-10-23-bishop-ireton-st-marys-ryken", {
  "id": "fb-2026-10-23-bishop-ireton-st-marys-ryken",
  "team1": "Bishop Ireton",
  "team2": "St. Mary's Ryken",
  "date": "2026-10-23",
  "score1": 6,
  "score2": 49,
  "sourceUrl": "https://www.maxpreps.com/md/leonardtown/st-marys-ryken-knights/football/schedule/",
  "sourceTier": "MaxPreps and High School On SI",
  "confirmation": "Confirmed October 23 varsity final St. Mary's Ryken 49, Bishop Ireton 6 by MaxPreps current Ryken results and independent SBLive final: https://www.si.com/high-school/stats/maryland/football/games/6621993-bishop-ireton-vs-st-marys-ryken. Both official school schedules establish October 23, 7 PM matchup; their result fields remain blank, not conflicting. Dedicated MaxPreps game page and SI statewide roundup are still awaiting updates, but current Ryken schedule and SBLive game page agree exactly. Added once to shared game for both teams' derived records.",
  "lastChecked": "2026-10-24"
}],
  ["fb-2026-10-23-gonzaga-good-counsel", {
  "id": "fb-2026-10-23-gonzaga-good-counsel",
  "team1": "Gonzaga",
  "team2": "Good Counsel",
  "date": "2026-10-23",
  "score1": 21,
  "score2": 3,
  "sourceUrl": "https://www.maxpreps.com/inter-state/football/game/gonzaga-washington-dc-vs-our-lady-of-good-counsel-olney-md/10-23-2026/?c=95a09ef7-f6b7-43a7-aacc-f7ff5082e646",
  "sourceTier": "MaxPreps and High School On SI",
  "confirmation": "Confirmed October 23 varsity final Gonzaga 21, Good Counsel 3 by MaxPreps and independent SBLive final: https://www.si.com/high-school/stats/maryland/football/games/6629857-gonzaga-vs-our-lady-of-good-counsel. Official Gonzaga schedule confirms October 23, 7 PM away matchup. Result added once to shared game for both teams' derived records.",
  "lastChecked": "2026-10-24"
}],
  ["fb-2026-10-23-st-vincent-st-vincent-pallotti-annapolis-area-christian", {
  "id": "fb-2026-10-23-st-vincent-st-vincent-pallotti-annapolis-area-christian",
  "team1": "St. Vincent Pallotti",
  "team2": "Annapolis Area Christian",
  "date": "2026-10-23",
  "score1": 27,
  "score2": 13,
  "sourceUrl": "https://www.maxpreps.com/md/laurel/pallotti-panthers/football/schedule/",
  "sourceTier": "MaxPreps and High School On SI",
  "confirmation": "Confirmed October 23 varsity final Pallotti 27, Annapolis Area Christian 13 by MaxPreps and independent SBLive final: https://www.si.com/high-school/stats/maryland/football/games/6629828-st-vincent-pallotti-vs-annapolis-area-christian. User-supplied Pallotti spirit club post IMG_0836.jpeg explicitly reports the 27-13 win; scoreboard photo has 21 seconds left and is supporting evidence, not sole final confirmation. Official AACS calendar establishes October 23 4:15 PM matchup. Previously reported 4 PM tracked vs 4:15 PM source discrepancy remains held for review; schedule time unchanged.",
  "lastChecked": "2026-10-23"
}],
  ["fb-2026-10-23-digital-pioneers-academy-steubenville", {
  "id": "fb-2026-10-23-digital-pioneers-academy-steubenville",
  "team1": "Digital Pioneers Academy",
  "team2": "Steubenville",
  "date": "2026-10-23",
  "score1": 6,
  "score2": 40,
  "sourceUrl": "https://wtov9.com/sports/scoreboard/oct-23-24-2026-high-school-football-scoreboard",
  "sourceTier": "WTOV9 and Joe Eitel",
  "confirmation": "Confirmed October 23 varsity final Steubenville 40, Digital Pioneers Academy (DC) 6 by original local WTOV9 scoreboard and independent Joe Eitel 2026 Steubenville results: https://joeeitel.com/hsfoot/teams.jsp?teamID=1488&year=2026. MaxPreps matchup establishes October 23, 7 PM varsity game but its final field is unreported, not conflicting. Added once to shared game for both teams' derived records.",
  "lastChecked": "2026-10-23"
}],
  ["md-fb-2026-10-23-surrattsville-largo", {
  "id": "md-fb-2026-10-23-surrattsville-largo",
  "team1": "Surrattsville",
  "team2": "Largo",
  "date": "2026-10-23",
  "score1": 0,
  "score2": 53,
  "sourceUrl": "https://www.instagram.com/largolionsfootball/",
  "sourceTier": "Official team account; MaxPreps corroboration",
  "confirmation": "Official Largo Lions Football final scoreboard photo supplied by user in IMG_0835.jpeg shows Lions 53, Guest 0, fourth quarter 0:00. MaxPreps independently identifies October 23 varsity opponent Surrattsville and final Largo 53-0: https://www.maxpreps.com/md/football/game/largo-upper-marlboro-vs-surrattsville-clinton/10-23-2026/?c=0c929857-6190-477e-9ff9-782aba179d04. Reported 7 PM kickoff versus tracked 6:30 PM remains held for review; schedule time unchanged. Result added once to shared game for both teams' derived records.",
  "lastChecked": "2026-10-23"
}],
  ["fb-2026-08-29-st-annes-belfield-episcopal", {
  "id": "fb-2026-08-29-st-annes-belfield-episcopal",
  "team1": "St. Anne's-Belfield",
  "team2": "Episcopal",
  "date": "2026-08-29",
  "score1": 0,
  "score2": 28,
  "sourceUrl": "https://www.si.com/high-school/stats/virginia/football/games/6620378-st-annesbelfield-vs-episcopal",
  "sourceTier": "MaxPreps and High School On SI",
  "confirmation": "Confirmed August 29 varsity final Episcopal 28, St. Anne's-Belfield 0 by independent SBLive final game page and MaxPreps August 29 postgame recap: https://www.maxpreps.com/news/fzcpQ92Z-EK-N4uK8qAc3Q/football-recap-episcopal-skates-past-st-annes-belfield-with-ease.htm. Official Episcopal varsity schedule establishes August 29, 2 PM home matchup; its result field remains blank, not a conflicting score. Score added once to the shared game for both teams' derived records.",
  "lastChecked": "2026-10-23"
}],
  ["fb-2026-10-23-eastern-coolidge", {
  "id": "fb-2026-10-23-eastern-coolidge",
  "team1": "Eastern",
  "team2": "Coolidge",
  "date": "2026-10-22",
  "expectedDate": "2026-10-23",
  "time": "6:00 PM",
  "score1": 7,
  "score2": 10,
  "sourceUrl": "https://www.maxpreps.com/dc/football/game/coolidge-washington-vs-eastern-washington/10-22-2026/?c=1a497fab-81f2-4036-af54-79c8da200b51",
  "sourceTier": "MaxPreps and user-supplied Self Stock Football report; user-approved date correction",
  "confirmation": "MaxPreps confirms October 22 varsity final Coolidge 10, Eastern 7, agreeing with Self Stock Football report supplied by user in IMG_0831.png. Eastern official calendar lists October 22, 6 PM: https://www.easternhighschooldcps.org/. User explicitly approved correcting tracked October 23 date to October 22 and publishing the final, resolving the conflicting official schedule graphics.",
  "lastChecked": "2026-10-23"
}],
  ["fb-2026-10-22-cardozo-anacostia", {
  "id": "fb-2026-10-22-cardozo-anacostia",
  "team1": "Cardozo",
  "team2": "Anacostia",
  "date": "2026-10-22",
  "score1": 0,
  "score2": 55,
  "sourceUrl": "https://www.maxpreps.com/dc/football/game/anacostia-washington-vs-cardozo-washington/10-22-2026/?c=828ae7ac-b6ef-4424-99d5-f63cd9108c7d",
  "sourceTier": "MaxPreps and High School On SI; user-confirmed date",
  "confirmation": "MaxPreps and independent SBLive both report October 22 varsity final Anacostia 55, Cardozo 0: https://www.si.com/high-school/stats/washington-dc/football/games/6891738-cardozo-vs-anacostia. User confirmed October 22, 2026 as the played date, resolving the earlier conflicting official schedule graphics.",
  "lastChecked": "2026-10-22"
}],
  ["fb-2026-10-17-ron-brown-jackson-reed", {
  "id": "fb-2026-10-17-ron-brown-jackson-reed",
  "team1": "Ron Brown",
  "team2": "Jackson-Reed",
  "date": "2026-10-17",
  "score1": 26,
  "score2": 21,
  "sourceUrl": "https://www.maxpreps.com/dc/football/game/jackson-reed-washington-vs-ron-brown-washington/10-17-2026/?c=b36fe79d-b169-4032-b0e6-3f164b70947f",
  "sourceTier": "MaxPreps and On3",
  "confirmation": "Confirmed October 17 varsity final Ron Brown 26, Jackson-Reed 21 by MaxPreps and independent On3 final results: https://www.on3.com/high-school/scores/football/national/game/jackson-reed-vs-brown-2026-10-17-2003354/. On3 identifies Brown as the DC Monarchs, with matching Cardozo and McKinley opponents. The actual game page is Final 26-21; its schedule preview and prediction are not used as final scores.",
  "lastChecked": "2026-10-19"
}],
  ["fb-2026-10-17-h-d-woodson-coolidge", {
  "id": "fb-2026-10-17-h-d-woodson-coolidge",
  "team1": "H.D. Woodson",
  "team2": "Coolidge",
  "date": "2026-10-17",
  "score1": 0,
  "score2": 42,
  "sourceUrl": "https://www.maxpreps.com/dc/football/game/coolidge-washington-vs-woodson-washington/10-17-2026/?c=76f14d5a-5b62-4429-a8a3-147940d54fcf",
  "sourceTier": "MaxPreps and On3",
  "confirmation": "Confirmed October 17 varsity final Coolidge 42, H.D. Woodson 0 by MaxPreps and independent On3 final results: https://www.on3.com/high-school/scores/football/national/game/coolidge-vs-woodson-hd-2026-10-17-2027799/. Previously flagged kickoff discrepancy (11 AM sources versus tracked 2 PM) remains for review; schedule time unchanged.",
  "lastChecked": "2026-10-19"
}],
  ["fb-2026-10-17-anacostia-mckinley-tech", {
  "id": "fb-2026-10-17-anacostia-mckinley-tech",
  "team1": "Anacostia",
  "team2": "McKinley Tech",
  "date": "2026-10-17",
  "score1": 9,
  "score2": 12,
  "sourceUrl": "https://www.maxpreps.com/dc/washington/mckinley-tech-trainers/football/",
  "sourceTier": "MaxPreps and On3",
  "confirmation": "Confirmed October 17 varsity final McKinley Tech 12, Anacostia 9 by MaxPreps and independent On3 final results: https://www.on3.com/high-school/scores/football/national/game/mckinley-technology-vs-anacostia-2026-10-17-1971290/. Both sources agree on the October 17 matchup and 2 PM Eastern kickoff (18:00 UTC on On3).",
  "lastChecked": "2026-10-18"
}],
  ["fb-2026-10-17-episcopal-st-albans", {
  "id": "fb-2026-10-17-episcopal-st-albans",
  "team1": "Episcopal",
  "team2": "St. Albans",
  "date": "2026-10-17",
  "score1": 28,
  "score2": 6,
  "sourceUrl": "https://www.maxpreps.com/inter-state/football/game/episcopal-alexandria-va-vs-st-albans-washington-dc/10-17-2026/?c=e6cbce46-1f6a-4f3d-a47a-ab5aaf664e78",
  "sourceTier": "MaxPreps and On3",
  "confirmation": "Confirmed October 17 varsity final Episcopal 28, St. Albans 6 by MaxPreps and independent On3 results (actual Score field, not prediction): https://www.on3.com/high-school/scores/football/national/game/st-albans-school-vs-episcopal-2026-10-17-1992994/. Official school schedules establish the October 17 matchup.",
  "lastChecked": "2026-10-18"
}],
  ["fb-2026-09-18-st-johns-gray-riverdale-baptist", {
  "id": "fb-2026-09-18-st-johns-gray-riverdale-baptist",
  "team1": "St. John's Gray",
  "team2": "Riverdale Baptist",
  "date": "2026-09-18",
  "score1": 0,
  "score2": 2,
  "sourceUrl": "https://www.maxpreps.com/inter-state/football/game/riverdale-baptist-rbs-upper-marlboro-md-vs-st-johns-gray-washington-dc/9-18-2026/?c=f821ad60-8ff5-4f45-857f-724c8466e5d6",
  "sourceTier": "MaxPreps and High School On SI",
  "confirmation": "Forfeit final: Riverdale Baptist 2, St. John's Gray 0. MaxPreps explicitly identifies the forfeit; Gary Adornato's independent September 18 final-score roundup agrees exactly: https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-september-18-01m2wr6ycbgj",
  "lastChecked": "2026-10-18"
}],
  ["fb-2026-09-26-dunbar-chester-pa", {
  "id": "fb-2026-09-26-dunbar-chester-pa",
  "team1": "Dunbar",
  "team2": "Chester (PA)",
  "date": "2026-09-26",
  "score1": 0,
  "score2": 1,
  "sourceUrl": "https://www.easternpafootball.com/db/schedules/viewteam.php5?id=43",
  "sourceTier": "EasternPAFootball and MaxPreps",
  "confirmation": "Forfeit final: Chester 1, Dunbar (Washington, DC) 0. EasternPAFootball's 2026 Chester schedule lists September 26, 1 PM, W 1-0 Forfeit win; MaxPreps independently agrees: https://www.maxpreps.com/inter-state/football/game/chester-pa-vs-dunbar-washington-dc/9-26-2026/?c=752272e5-3393-4052-90b6-501f53f4a2f9",
  "lastChecked": "2026-10-18"
}],
  ["fb-2026-10-17-archbishop-carroll-bishop-ireton", {
  "id": "fb-2026-10-17-archbishop-carroll-bishop-ireton",
  "team1": "Archbishop Carroll",
  "team2": "Bishop Ireton",
  "date": "2026-10-17",
  "score1": 36,
  "score2": 0,
  "sourceUrl": "https://www.maxpreps.com/inter-state/football/game/archbishop-carroll-washington-dc-vs-bishop-ireton-alexandria-va/10-17-2026/?c=d39f9de4-05eb-4f9e-9d38-f508e2b8854d",
  "sourceTier": "MaxPreps and High School On SI",
  "confirmation": "Confirmed October 17 varsity final Archbishop Carroll 36, Bishop Ireton 0 by MaxPreps and independent Scorebook Live/High School On SI: https://www.si.com/high-school/stats/virginia/football/games/6874465-archbishop-carroll-vs-bishop-ireton. Kickoff discrepancy (official noon versus tracked 1 PM) remains for review; schedule time unchanged.",
  "lastChecked": "2026-10-18"
}],
  ["fb-2026-10-16-bullis-landon", {
  "id": "fb-2026-10-16-bullis-landon",
  "team1": "Bullis",
  "team2": "Landon",
  "date": "2026-10-17",
  "expectedDate": "2026-10-16",
  "time": "12:00 PM",
  "score1": 21,
  "score2": 14,
  "sourceUrl": "https://www.instagram.com/bullisathletics/",
  "sourceTier": "Official school athletics",
  "confirmation": "Confirmed by verified Bullis Athletics official October17 2026 FINAL graphic: Bullis21 Landon14, supplied in IMG_0815.jpeg. Caption notes lightning delay. User approved date correction from October16 to October17; MaxPreps lists October17 noon kickoff: https://www.maxpreps.com/md/potomac/bullis-bulldogs/football/schedule/",
  "lastChecked": "2026-10-18"
}],
  ["fb-2026-10-16-cardozo-phelps-ace", {
  "id": "fb-2026-10-16-cardozo-phelps-ace",
  "team1": "Cardozo",
  "team2": "Phelps ACE",
  "date": "2026-10-16",
  "score1": 0,
  "score2": 42,
  "sourceUrl": "https://www.maxpreps.com/dc/football/game/cardozo-washington-vs-phelps-architecture-construction-and-engineering-washington/10-16-2026/?c=589ff4ac-8043-441d-bc15-c5481ff216e3",
  "sourceTier": "MaxPreps and user-supplied NSMT scoreboard",
  "confirmation": "User approved addition October18 after reviewing MaxPreps and NSMT October15-17 weekend scoreboard supplied in IMG_0810.jpeg; Friday final Phelps42 Cardozo0.",
  "lastChecked": "2026-10-18"
}],
  ["fb-2026-10-16-bishop-mcnamara-dematha", {
  "id": "fb-2026-10-16-bishop-mcnamara-dematha",
  "team1": "Bishop McNamara",
  "team2": "DeMatha",
  "date": "2026-10-17",
  "expectedDate": "2026-10-16",
  "time": "2:00 PM",
  "score1": 6,
  "score2": 44,
  "sourceUrl": "https://www.maxpreps.com/md/hyattsville/dematha-stags/football/",
  "sourceTier": "MaxPreps; user-approved date correction",
  "confirmation": "User approved October17 date correction and DeMatha44 McNamara6 after reviewing MaxPreps and NSMT Saturday final in IMG_0808.jpeg. October17 2PM kickoff also listed on official DeMatha schedule.",
  "lastChecked": "2026-10-18"
}],
  ["fb-2026-10-16-bishop-oconnell-st-marys-ryken", {
  "id": "fb-2026-10-16-bishop-oconnell-st-marys-ryken",
  "team1": "Bishop O'Connell",
  "team2": "St. Mary's Ryken",
  "date": "2026-10-16",
  "score1": 27,
  "score2": 62,
  "sourceUrl": "https://www.maxpreps.com/inter-state/football/game/bishop-oconnell-arlington-va-vs-st-marys-ryken-leonardtown-md/10-16-2026/?c=53719689-a0c9-4a9a-afb1-9f5290f4104e",
  "sourceTier": "MaxPreps - user-approved conflict resolution",
  "confirmation": "User explicitly approved62-27 on October18 after being informed OConnell official site reports62-28; MaxPreps,DCSportsFan and suppliedNSMT graphic IMG_0807.jpeg report62-27.",
  "lastChecked": "2026-10-18"
}],
  ["fb-2026-10-17-st-james-potomac-school", {
  "id": "fb-2026-10-17-st-james-potomac-school",
  "team1": "Saint James",
  "team2": "Potomac School",
  "date": "2026-10-17",
  "score1": 23,
  "score2": 27,
  "sourceUrl": "https://www.maxpreps.com/inter-state/football/game/potomac-school-mclean-va-vs-saint-james-hagerstown-md/10-17-2026/?c=f45966f7-3496-4224-b2bd-1eb5647c45d1",
  "sourceTier": "MaxPreps and High School On SI",
  "confirmation": "Confirmed October17 final Potomac School27 Saint James23 by MaxPreps and independent Scorebook Live/High School On SI: https://www.si.com/high-school/stats/virginia/football/games/6621907-st-james-vs-potomac-school",
  "lastChecked": "2026-10-18"
}],
  ["fb-2026-10-17-flint-hill-sidwell-friends", {
  "id": "fb-2026-10-17-flint-hill-sidwell-friends",
  "team1": "Flint Hill",
  "team2": "Sidwell Friends",
  "date": "2026-10-17",
  "score1": 45,
  "score2": 0,
  "sourceUrl": "https://www.sidwell.edu/athletics/team-page/~athletics-team-id/229",
  "sourceTier": "Official school athletics",
  "confirmation": "Confirmed by Sidwell Friends official varsity football results: October17 home loss0-45 against Flint Hill School.",
  "lastChecked": "2026-10-17"
}],
  ["md-fb-2026-10-17-friendly-frederick-douglass", {
  "id": "md-fb-2026-10-17-friendly-frederick-douglass",
  "team1": "Friendly",
  "team2": "Frederick Douglass",
  "date": "2026-10-17",
  "score1": 0,
  "score2": 56,
  "sourceUrl": "https://mdfootballscores.com/schools/douglass-pg/",
  "sourceTier": "Maryland High School Football Scores and MaxPreps",
  "confirmation": "Confirmed by Maryland High School Football Scores October17 final56-0 and MaxPreps final: https://www.maxpreps.com/md/football/game/frederick-douglass-upper-marlboro-vs-friendly-fort-washington/10-17-2026/?c=e7548d66-f8aa-41ca-95f4-2245436af552",
  "lastChecked": "2026-10-17"
}],
  ["md-fb-2026-10-17-duval-suitland", {
  "id": "md-fb-2026-10-17-duval-suitland",
  "team1": "DuVal",
  "team2": "Suitland",
  "date": "2026-10-17",
  "score1": 0,
  "score2": 55,
  "sourceUrl": "https://www.on3.com/high-school/duval-lanham-md-2237/football/scores/",
  "sourceTier": "Maryland High School Football Scores and On3",
  "confirmation": "Confirmed by @mdhsscores final graphic supplied in IMG_0796.jpeg and On3 55-0 final; MaxPreps game page also reports 55-0 while its team summary retains a conflicting 50-0. User requested addition after reviewing these sources.",
  "lastChecked": "2026-10-17"
}],
  ["md-fb-2026-10-17-northwestern-parkdale", {
  "id": "md-fb-2026-10-17-northwestern-parkdale",
  "team1": "Northwestern",
  "team2": "Parkdale",
  "date": "2026-10-17",
  "score1": 6,
  "score2": 53,
  "sourceUrl": "https://www.instagram.com/parkdalefootball/",
  "sourceTier": "Official team social account and MaxPreps",
  "confirmation": "Confirmed by Parkdale football's team story scoreboard at 0:00 fourth quarter, supplied in IMG_0792.jpeg, and MaxPreps October 17 Homecoming final: https://www.maxpreps.com/md/riverdale/parkdale-panthers/football/",
  "lastChecked": "2026-10-17"
}],
  ["md-fb-2026-10-16-flowers-oxon-hill", {
  "id": "md-fb-2026-10-16-flowers-oxon-hill",
  "team1": "Flowers",
  "team2": "Oxon Hill",
  "date": "2026-10-17",
  "expectedDate": "2026-10-16",
  "score1": 14,
  "score2": 12,
  "sourceUrl": "https://www.maxpreps.com/md/football/game/flowers-springdale-vs-oxon-hill/10-17-2026/?c=077c1281-d89f-4d87-a0e3-83e030f13f61",
  "sourceTier": "Maryland High School Football Scores and MaxPreps",
  "confirmation": "Confirmed by MaxPreps October17 final and @mdhsscores October17 final graphic supplied in IMG_0797.jpeg. Date corrected from October16 after user requested adding the reviewed results.",
  "lastChecked": "2026-10-17"
}],
  ["md-fb-2026-10-16-surrattsville-fairmont-heights", {
  "id": "md-fb-2026-10-16-surrattsville-fairmont-heights",
  "team1": "Surrattsville",
  "team2": "Fairmont Heights",
  "date": "2026-10-17",
  "expectedDate": "2026-10-16",
  "score1": 6,
  "score2": 29,
  "sourceUrl": "https://www.maxpreps.com/md/clinton/surrattsville-hornets/football/",
  "sourceTier": "Maryland High School Football Scores and MaxPreps",
  "confirmation": "Confirmed by MaxPreps October17 final and @mdhsscores October17 final graphic supplied in IMG_0795.jpeg. Date corrected from October16 after user requested adding the reviewed results.",
  "lastChecked": "2026-10-17"
}],
  ["md-fb-2026-10-17-central-largo", {
  "id": "md-fb-2026-10-17-central-largo",
  "team1": "Central",
  "team2": "Largo",
  "date": "2026-10-17",
  "score1": 2,
  "score2": 69,
  "sourceUrl": "https://www.instagram.com/largolionsfootball/",
  "sourceTier": "Official team social account",
  "confirmation": "Corrected to Largo69 Central2 using Largo football official team story @largolionsfootball, October17 dated FINAL SCORE graphic supplied in IMG_0791.jpeg. Official team result takes precedence over independent 68-2 reports.",
  "lastChecked": "2026-10-17"
}],
  ["fb-2026-10-16-st-johns-catholic-prep-st-stephens-st-agnes", {
  "id": "fb-2026-10-16-st-johns-catholic-prep-st-stephens-st-agnes",
  "team1": "St. John's Catholic Prep",
  "team2": "St. Stephen's & St. Agnes",
  "score1": 24,
  "score2": 18,
  "date": "2026-10-16",
  "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-16-2026-01m54thtv6yd",
  "sourceTier": "High School On SI and MaxPreps",
  "confirmation": "Confirmed by Gary Adornato's October 16 Maryland final-score roundup and the MaxPreps October 16 scoreboard: https://www.maxpreps.com/md/maryland/football/scores/?date=10/16/2026",
  "lastChecked": "2026-10-17"
}],
  ["fb-2026-10-16-riverdale-baptist-kipp-dc-legacy", {
  "id": "fb-2026-10-16-riverdale-baptist-kipp-dc-legacy",
  "team1": "Riverdale Baptist",
  "team2": "KIPP DC Legacy",
  "score1": 28,
  "score2": 6,
  "date": "2026-10-16",
  "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-16-2026-01m54thtv6yd",
  "sourceTier": "High School On SI and MaxPreps",
  "confirmation": "Confirmed by Gary Adornato's October 16 Maryland final-score roundup and the MaxPreps October 16 scoreboard: https://www.maxpreps.com/md/maryland/football/scores/?date=10/16/2026",
  "lastChecked": "2026-10-17"
}],
  ["fb-2026-10-16-st-johns-good-counsel", {
  "id": "fb-2026-10-16-st-johns-good-counsel",
  "team1": "St. John’s",
  "team2": "Good Counsel",
  "score1": 38,
  "score2": 7,
  "date": "2026-10-16",
  "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-16-2026-01m54thtv6yd",
  "sourceTier": "High School On SI and MaxPreps",
  "confirmation": "Confirmed by Gary Adornato's October 16 Maryland final-score roundup and the MaxPreps October 16 scoreboard: https://www.maxpreps.com/md/maryland/football/scores/?date=10/16/2026",
  "lastChecked": "2026-10-17"
}],
  ["md-fb-2026-10-16-crossland-gwynn-park", {
  "id": "md-fb-2026-10-16-crossland-gwynn-park",
  "team1": "Crossland",
  "team2": "Gwynn Park",
  "date": "2026-10-16",
  "score1": 0,
  "score2": 43,
  "sourceUrl": "https://www.maxpreps.com/news/Mdjpkn1ODk2Q1fbHVVpLXw/football-recap-gwynn-park-skates-past-crossland-with-ease--how-to-watch.htm",
  "sourceTier": "MaxPreps - user-approved conflict resolution",
  "confirmation": "MaxPreps reports 43-0; @mdhsscores graphic reports 42-0. User explicitly selected the MaxPreps result on October 17, 2026.",
  "lastChecked": "2026-10-17"
}],
  ["fb-2026-10-16-kipp-college-prep-friendship-collegiate-academy", {
  "id": "fb-2026-10-16-kipp-college-prep-friendship-collegiate-academy",
  "team1": "KIPP College Prep",
  "team2": "Friendship Collegiate Academy",
  "date": "2026-10-16",
  "score1": 0,
  "score2": 54,
  "sourceUrl": "https://www.maxpreps.com/dc/football/game/friendship-collegiate-academy-washington-vs-kipp-college-prep-washington/10-16-2026/?c=56775b0d-b1b5-4ad2-b452-26a1358cc6f9",
  "sourceTier": "MaxPreps and independent game attendee report",
  "confirmation": "Confirmed by MaxPreps final and @constancewalkerofficial game report supplied in IMG_0775.jpeg.",
  "lastChecked": "2026-10-17"
}],
  ["md-fb-2026-10-16-eleanor-roosevelt-bowie", {
  "id": "md-fb-2026-10-16-eleanor-roosevelt-bowie",
  "team1": "Eleanor Roosevelt",
  "team2": "Bowie",
  "date": "2026-10-16",
  "score1": 34,
  "score2": 20,
  "sourceUrl": "https://www.maxpreps.com/md/football/game/bowie-vs-eleanor-roosevelt-greenbelt/10-16-2026/?c=67402aab-93b5-4907-b446-d29d1d9361a8",
  "sourceTier": "Maryland High School Football Scores and MaxPreps",
  "confirmation": "Confirmed by @mdhsscores final graphic supplied in IMG_0774.jpeg and MaxPreps Eleanor Roosevelt-Bowie recap.",
  "lastChecked": "2026-10-17"
}],
  ["md-fb-2026-10-16-bladensburg-laurel", {
  "id": "md-fb-2026-10-16-bladensburg-laurel",
  "team1": "Bladensburg",
  "team2": "Laurel",
  "date": "2026-10-16",
  "score1": 0,
  "score2": 44,
  "sourceUrl": "https://www.maxpreps.com/md/football/game/bladensburg-vs-laurel/10-16-2026/?c=9ee04d98-c28a-4c7c-b13c-78b4cb239b3d",
  "sourceTier": "Maryland High School Football Scores and MaxPreps",
  "confirmation": "Confirmed by @mdhsscores final graphic supplied in IMG_0773.jpeg and MaxPreps game final.",
  "lastChecked": "2026-10-17"
}],
  [
    "md-fb-2026-10-16-potomac-wise",
    {
      "id": "md-fb-2026-10-16-potomac-wise",
      "team1": "Potomac",
      "team2": "Wise",
      "date": "2026-10-16",
      "score1": 14,
      "score2": 51,
      "sourceUrl": "https://www.instagram.com/wisepumasports/",
      "sourceTier": "Official school athletics",
      "confirmation": "Confirmed by Wise Athletics (@wisepumasports) final-score post, supplied in user screenshot IMG_0769.jpeg on October 16, 2026: Wise 51, Potomac 14.",
      "lastChecked": "2026-10-16"
    }
  ],
  [
    "fb-2026-10-16-eastern-dunbar",
    {
      "id": "fb-2026-10-16-eastern-dunbar",
      "team1": "Eastern",
      "team2": "Dunbar",
      "date": "2026-10-15",
      "score1": 14,
      "score2": 6,
      "sourceUrl": "https://www.si.com/high-school/stats/washington-dc/football/games/6704320-dunbar-vs-eastern",
      "sourceTier": "MaxPreps and High School On SI",
      "confirmation": "Confirmed by High School On SI, MaxPreps and On3: https://www.maxpreps.com/dc/washington/eastern-ramblers/football/ ; https://www.on3.com/high-school/scores/football/district-of-columbia/game/eastern-vs-dunbar-2026-10-15-2005213/"
    }
  ],
  [
    "fb-2026-10-15-ballou-roosevelt",
    {
      "id": "fb-2026-10-15-ballou-roosevelt",
      "team1": "Ballou",
      "team2": "Roosevelt",
      "date": "2026-10-15",
      "score1": 6,
      "score2": 20,
      "sourceUrl": "https://www.si.com/high-school/stats/washington-dc/football/games/6704321-roosevelt-vs-ballou",
      "sourceTier": "MaxPreps and High School On SI",
      "confirmation": "Confirmed by High School On SI and MaxPreps: https://www.maxpreps.com/news/o6JSHMXiPUSoTO3VN6bAqQ/football-recap-roosevelt-wins-high-profile-matchup-against-ballou--how-to-watch.htm"
    }
  ],
  [
    "fb-2026-10-03-haverford-school-georgetown-prep",
    {
      "id": "fb-2026-10-03-haverford-school-georgetown-prep",
      "team1": "Haverford School",
      "team2": "Georgetown Prep",
      "date": "2026-10-03",
      "score1": 42,
      "score2": 7,
      "sourceUrl": "https://www.haverford.org/athletics/teams/team-details/~athletics-team-id/143",
      "sourceTier": "Official school athletics",
      "confirmation": "Confirmed by The Haverford School's official varsity football results."
    }
  ],
  [
    "md-fb-2026-10-03-northwestern-bladensburg",
    {
      "id": "md-fb-2026-10-03-northwestern-bladensburg",
      "team1": "Northwestern",
      "team2": "Bladensburg",
      "date": "2026-10-03",
      "score1": 22,
      "score2": 20,
      "sourceUrl": "https://mdfootballscores.com/schools/northwestern/",
      "sourceTier": "Maryland High School Football Scores and MaxPreps",
      "confirmation": "Confirmed by Maryland High School Football Scores and MaxPreps: https://www.maxpreps.com/md/hyattsville/northwestern-wildcats/football/"
    }
  ],
  [
    "fb-2026-10-08-jackson-reed-mckinley-tech",
    {
      "id": "fb-2026-10-08-jackson-reed-mckinley-tech",
      "team1": "Jackson-Reed",
      "team2": "McKinley Tech",
      "date": "2026-10-08",
      "score1": 6,
      "score2": 16,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/dc/washington/mckinley-tech-trainers/football/"
    }
  ],
  [
    "fb-2026-10-09-ballou-bell",
    {
      "id": "fb-2026-10-09-ballou-bell",
      "team1": "Ballou",
      "team2": "Bell",
      "date": "2026-10-09",
      "score1": 14,
      "score2": 50,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/news/5MVmMy643kSQh_02QuLkxw/football-recap-bell-wins-high-profile-contest-against-ballou.htm"
    }
  ],
  [
    "fb-2026-10-09-cardozo-ron-brown",
    {
      "id": "fb-2026-10-09-cardozo-ron-brown",
      "team1": "Cardozo",
      "team2": "Ron Brown",
      "date": "2026-10-09",
      "score1": 6,
      "score2": 26,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/dc/football/game/cardozo-washington-vs-ron-brown-washington/10-9-2026/?c=42a50f48-68a5-489a-bbee-1f62cb13851e"
    }
  ],
  [
    "fb-2026-10-09-eastern-roosevelt",
    {
      "id": "fb-2026-10-09-eastern-roosevelt",
      "team1": "Eastern",
      "team2": "Roosevelt",
      "date": "2026-10-09",
      "score1": 20,
      "score2": 12,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/news/ouGw9Uf_lUCDeDnkCIrjBA/football-recap-eastern-takes-down-ranked-roosevelt.htm"
    }
  ],
  [
    "fb-2026-10-09-digital-pioneers-academy-kipp-college-prep",
    {
      "id": "fb-2026-10-09-digital-pioneers-academy-kipp-college-prep",
      "team1": "Digital Pioneers Academy",
      "team2": "KIPP College Prep",
      "date": "2026-10-09",
      "score1": 46,
      "score2": 0,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/dc/washington/digital-pioneers-academy-pythons/football/"
    }
  ],
  [
    "fb-2026-10-10-landon-archbishop-carroll",
    {
      "id": "fb-2026-10-10-landon-archbishop-carroll",
      "team1": "Landon",
      "team2": "Archbishop Carroll",
      "date": "2026-10-10",
      "score1": 13,
      "score2": 27,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/dc/washington/archbishop-carroll-lions/football/"
    }
  ],
  [
    "fb-2026-10-10-maret-potomac-school",
    {
      "id": "fb-2026-10-10-maret-potomac-school",
      "team1": "Maret",
      "team2": "Potomac School",
      "date": "2026-10-10",
      "score1": 36,
      "score2": 33,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/dc/washington/maret-frogs/football/"
    }
  ],
  [
    "fb-2026-10-10-bishop-mcnamara-gonzaga",
    {
      "id": "fb-2026-10-10-bishop-mcnamara-gonzaga",
      "team1": "Bishop McNamara",
      "team2": "Gonzaga",
      "date": "2026-10-10",
      "score1": 6,
      "score2": 38,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/dc/washington/gonzaga-eagles/football/"
    }
  ],
  [
    "fb-2026-10-10-woodberry-forest-georgetown-prep",
    {
      "id": "fb-2026-10-10-woodberry-forest-georgetown-prep",
      "team1": "Woodberry Forest",
      "team2": "Georgetown Prep",
      "date": "2026-10-10",
      "score1": 38,
      "score2": 16,
      "sourceUrl": "https://dcsportsfan.com/2026/10/11/football-scores/amp/",
      "sourceTier": "DCSportsFan and MaxPreps",
      "confirmation": "Confirmed by DCSportsFan and MaxPreps: https://www.maxpreps.com/va/woodberry-forest/woodberry-forest-tigers/football/"
    }
  ],
  [
    "md-fb-2026-10-10-crossland-fairmont-heights",
    {
      "id": "md-fb-2026-10-10-crossland-fairmont-heights",
      "team1": "Crossland",
      "team2": "Fairmont Heights",
      "date": "2026-10-10",
      "score1": 18,
      "score2": 19,
      "sourceUrl": "https://mdfootballscores.com/schools/crossland/",
      "sourceTier": "Maryland High School Football Scores and MaxPreps",
      "confirmation": "Confirmed by Maryland High School Football Scores and MaxPreps: https://www.maxpreps.com/md/temple-hills/crossland-cavaliers/football/"
    }
  ],
  [
    "fb-2026-10-10-long-island-lutheran-riverdale-baptist",
    {
      "id": "fb-2026-10-10-long-island-lutheran-riverdale-baptist",
      "team1": "Long Island Lutheran",
      "team2": "Riverdale Baptist",
      "date": "2026-10-10",
      "score1": 7,
      "score2": 57,
      "sourceUrl": "https://www.joeeitel.com/hsfoot/teams.jsp?teamID=15143&year=2026",
      "sourceTier": "Joe Eitel and MaxPreps",
      "confirmation": "Confirmed by Joe Eitel and MaxPreps: https://www.maxpreps.com/news/fGVyLykAuk6TPOdqrjb0bg/football-recap-riverdale-baptist-skates-past-long-island-lutheran-with-ease.htm"
    }
  ],
  [
    "fb-2026-10-09-kipp-dc-legacy-eastern-tech",
    {
      "id": "fb-2026-10-09-kipp-dc-legacy-eastern-tech",
      "team1": "KIPP DC Legacy",
      "team2": "Eastern Tech",
      "date": "2026-10-09",
      "score1": 47,
      "score2": 6,
      "sourceUrl": "https://www.maxpreps.com/inter-state/football/game/eastern-tech-baltimore-md-vs-kipp-dc-legacy-college-prep-washington-dc/10-9-2026/?c=b1d256d9-d776-402c-975f-28c341070fec",
      "sourceTier": "Official team / coach direct message",
      "confirmation": "Confirmed in a direct message provided by the user on October 10, 2026; the user confirmed the sender was the official team account or a coach. Screenshot: IMG_0731.jpeg. Public matchup link establishes the October 9 date."
    }
  ],
  [
    "md-fb-2026-10-10-friendly-surrattsville",
    {
      "id": "md-fb-2026-10-10-friendly-surrattsville",
      "team1": "Friendly",
      "team2": "Surrattsville",
      "date": "2026-10-10",
      "score1": 16,
      "score2": 26,
      "sourceUrl": "https://mdfootballscores.com/schools/friendly/",
      "sourceTier": "Maryland High School Football Scores and MaxPreps",
      "confirmation": "Confirmed by Maryland High School Football Scores and MaxPreps: https://www.maxpreps.com/md/clinton/surrattsville-hornets/football/"
    }
  ],
  [
    "md-fb-2026-10-10-wise-eleanor-roosevelt",
    {
      "id": "md-fb-2026-10-10-wise-eleanor-roosevelt",
      "team1": "Wise",
      "team2": "Eleanor Roosevelt",
      "date": "2026-10-10",
      "score1": 46,
      "score2": 21,
      "sourceUrl": "https://mdfootballscores.com/schools/wise/",
      "confirmation": "Confirmed by Maryland High School Football Scores and MaxPreps: https://www.maxpreps.com/md/upper-marlboro/wise-pumas/football/",
      "sourceTier": "Maryland High School Football Scores and MaxPreps"
    }
  ],
  [
    "md-fb-2026-10-10-oxon-hill-parkdale",
    {
      "id": "md-fb-2026-10-10-oxon-hill-parkdale",
      "team1": "Oxon Hill",
      "team2": "Parkdale",
      "date": "2026-10-10",
      "score1": 47,
      "score2": 0,
      "sourceUrl": "https://mdfootballscores.com/schools/parkdale/",
      "confirmation": "Confirmed by Maryland High School Football Scores and MaxPreps: https://www.maxpreps.com/md/oxon-hill/oxon-hill-clippers/football/",
      "sourceTier": "Maryland High School Football Scores and MaxPreps"
    }
  ],
  [
    "fb-2026-09-11-jackson-reed-flint-hill",
    {
      "id": "fb-2026-09-11-jackson-reed-flint-hill",
      "team1": "Jackson-Reed",
      "team2": "Flint Hill",
      "date": "2026-09-11",
      "score1": 7,
      "score2": 49,
      "sourceUrl": "https://flinthill.myschoolapp.com/page/test-athletic-teams-schedule-2024?BlockId=3353828&SeasonLabel=2026+-+2027&Team=99828&fromId=295525&siteId=708",
      "sourceTier": "Official school athletics",
      "confirmation": "Confirmed by Flint Hill's official 2026-27 varsity football results, linked from its football athletics page."
    }
  ],
  [
    "fb-2026-10-03-cornerstone-christian-st-johns",
    {
      "id": "fb-2026-10-03-cornerstone-christian-st-johns",
      "team1": "Cornerstone Christian",
      "team2": "St. John’s",
      "date": "2026-10-03",
      "score1": 28,
      "score2": 35,
      "sourceUrl": "https://www.stjohnschs.org/athletics/teams/team-page/~athletics-team-id/126",
      "sourceTier": "Official school athletics",
      "confirmation": "Confirmed by St. John's official varsity football results."
    }
  ],
  [
    "fb-2026-10-10-bishop-oconnell-bishop-ireton",
    {
      "id": "fb-2026-10-10-bishop-oconnell-bishop-ireton",
      "team1": "Bishop O'Connell",
      "team2": "Bishop Ireton",
      "date": "2026-10-10",
      "score1": 34,
      "score2": 7,
      "sourceUrl": "https://www.bishopoconnell.org/athletics/teams/football",
      "sourceTier": "Official school athletics",
      "confirmation": "Confirmed by Bishop O'Connell's official varsity football results."
    }
  ],
  [
    "fb-2026-10-09-dunbar-h-d-woodson",
    {
      "id": "fb-2026-10-09-dunbar-h-d-woodson",
      "team1": "Dunbar",
      "team2": "H.D. Woodson",
      "date": "2026-10-08",
      "score1": 48,
      "score2": 0,
      "sourceUrl": "https://www.si.com/high-school/stats/washington-dc/football/games/6853884-dunbar-vs-woodson",
      "confirmationUrl": "https://www.maxpreps.com/dc/washington/dunbar-crimson-tide/football/",
      "sourceTier": "MaxPreps and High School On SI"
    }
  ],
  [
    "fb-2026-10-08-episcopal-st-stephens-st-agnes",
    {
      "id": "fb-2026-10-08-episcopal-st-stephens-st-agnes",
      "score1": 42,
      "score2": 0,
      "team1": "Episcopal",
      "team2": "St. Stephen's & St. Agnes",
      "date": "2026-10-08",
      "sourceUrl": "https://www.sssas.org/fall-team-1/varsity-football",
      "sourceTier": "Official school athletics"
    }
  ],
  [
    "md-fb-2026-10-09-central-gwynn-park",
    {
      "id": "md-fb-2026-10-09-central-gwynn-park",
      "score1": 0,
      "score2": 39,
      "team1": "Central",
      "team2": "Gwynn Park",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "md-fb-2026-10-09-suitland-bowie",
    {
      "id": "md-fb-2026-10-09-suitland-bowie",
      "score1": 30,
      "score2": 0,
      "team1": "Suitland",
      "team2": "Bowie",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "fb-2026-10-09-friendship-collegiate-academy-mt-zion-prep-academy",
    {
      "id": "fb-2026-10-09-friendship-collegiate-academy-mt-zion-prep-academy",
      "score1": 20,
      "score2": 8,
      "team1": "Friendship Collegiate Academy",
      "team2": "Mt. Zion Prep Academy",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "md-fb-2026-10-09-duval-laurel",
    {
      "id": "md-fb-2026-10-09-duval-laurel",
      "score1": 7,
      "score2": 20,
      "team1": "DuVal",
      "team2": "Laurel",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "md-fb-2026-10-09-bladensburg-flowers",
    {
      "id": "md-fb-2026-10-09-bladensburg-flowers",
      "score1": 0,
      "score2": 63,
      "team1": "Bladensburg",
      "team2": "Flowers",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "md-fb-2026-10-09-potomac-northwestern",
    {
      "id": "md-fb-2026-10-09-potomac-northwestern",
      "score1": 55,
      "score2": 0,
      "team1": "Potomac",
      "team2": "Northwestern",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "fb-2026-10-09-bullis-st-james-school",
    {
      "id": "fb-2026-10-09-bullis-st-james-school",
      "score1": 8,
      "score2": 27,
      "team1": "Saint James",
      "team2": "Bullis",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "fb-2026-10-09-good-counsel-dematha",
    {
      "id": "fb-2026-10-09-good-counsel-dematha",
      "score1": 0,
      "score2": 35,
      "team1": "Good Counsel",
      "team2": "DeMatha",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "fb-2026-10-09-st-vincent-st-vincent-pallotti-john-carroll",
    {
      "id": "fb-2026-10-09-st-vincent-st-vincent-pallotti-john-carroll",
      "score1": 21,
      "score2": 28,
      "team1": "St. Vincent Pallotti",
      "team2": "John Carroll",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ],
  [
    "md-fb-2026-10-09-largo-frederick-douglass",
    {
      "id": "md-fb-2026-10-09-largo-frederick-douglass",
      "score1": 6,
      "score2": 0,
      "team1": "Largo",
      "team2": "Frederick Douglass",
      "date": "2026-10-09",
      "sourceUrl": "https://mdfootballscores.com/schools/douglass-pg/",
      "sourceTier": "Maryland High School Football Scores and High School On SI"
    }
  ],
  [
    "fb-2026-10-09-st-marys-ryken-paul-vi",
    {
      "id": "fb-2026-10-09-st-marys-ryken-paul-vi",
      "score1": 41,
      "score2": 6,
      "team1": "St. Mary's Ryken",
      "team2": "Paul VI",
      "date": "2026-10-09",
      "sourceUrl": "https://www.si.com/high-school/maryland/maryland-high-school-football-final-scores-friday-october-9-2026-01m4jkfexze5",
      "sourceTier": "High School On SI and MaxPreps"
    }
  ]
]);

export function applyFootballResultsOct9Finals(games = []) {
  return games.map((game) => {
    const result = FINAL_RESULTS.get(game.id);
    if (!result || game.date !== (result.expectedDate || result.date) || game.team1 !== result.team1 || game.team2 !== result.team2) return game;
    const { score1, score2, sourceUrl, sourceTier } = result;
    const confirmation = result.confirmation || (result.confirmationUrl
      ? `Confirmed by MaxPreps and High School On SI: ${result.confirmationUrl}`
      : sourceTier === "Official school athletics"
      ? "Confirmed by St. Stephen's & St. Agnes official varsity football results."
      : sourceTier === "Maryland High School Football Scores and High School On SI"
      ? `Confirmed by Maryland High School Football Scores and High School On SI: ${ROUNDUP_URL}`
      : `Confirmed by High School On SI and MaxPreps: ${SCOREBOARD_URL}`);
    return {
      ...game,
      date: result.date,
      ...(result.time ? { time: result.time } : {}),
      score1,
      score2,
      status: undefined,
      scheduleStatus: "Final",
      subjectToChange: false,
      verificationStatus: "Final",
      sourceTier,
      sourceUrl,
      notes: `Final: ${game.team1} ${score1}, ${game.team2} ${score2}. ${confirmation}`,
      lastChecked: result.lastChecked || "2026-10-10",
    };
  });
}


