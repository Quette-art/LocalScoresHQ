import { hasFinal } from "./dashboardUtils.js";
const eastern = new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",timeZoneName:"shortOffset"});
export function kickoff(game) {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(String(game.time || "").trim());
  if (!m || +m[1]<1 || +m[1]>12 || +m[2]>59 || !/^\d{4}-\d\d-\d\d$/.test(game.date)) return null;
  const wall = Date.parse(game.date+"T"+String(+m[1]%12 + (m[3].toUpperCase()==="PM"?12:0)).padStart(2,"0")+":"+m[2]+":00Z");
  if (!Number.isFinite(wall)) return null;
  const offset = t => Number(eastern.formatToParts(t).find(p=>p.type==="timeZoneName").value.replace("GMT",""));
  const guess = wall-offset(wall)*3600000;
  return wall-offset(guess)*3600000;
}
export function pollState(game,now=Date.now()) {
  const start=kickoff(game);
  if(hasFinal(game) || /^(final|live|in progress|in-progress|cancelled|canceled|postponed|forfeit)$/i.test(game.status||"")) return "closed";
  return start===null?"pending":now>=start?"closed":"open";
}
