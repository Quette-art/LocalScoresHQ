import {createHash} from "node:crypto";
import {games} from "../src/data/games.js";
import {getFirebaseAdmin} from "../server/firebaseAdmin.js";
import {kickoff,pollState} from "../src/fanPicksPolicy.js";

const seeds=new Map(games.map(g=>[String(g.id),g]));
const hash=s=>createHash("sha256").update(s).digest("hex");
export const makeHandler=(admin=getFirebaseAdmin)=>async function handler(req,res){
  res.setHeader("Cache-Control","private, no-store");
  if(!["GET","POST"].includes(req.method)) return res.status(405).end();
  if(req.headers["sec-fetch-site"]==="cross-site") return res.status(403).end();
  const vote=req.method==="POST";
  const id=vote?req.body?.gameId:req.query.gameId;
  const device=req.headers["x-pick-device"];
  const choice=req.body?.choice;
  const remove=vote && req.body?.remove === true;
  if(typeof id!=="string" || !id || id.length>240 || /[/\x00-\x1f]/.test(id) || /^\.{1,2}$/.test(id) || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(device||"") || (vote && !remove && ![0,1].includes(choice))) return res.status(400).end();
  try {
    const {db}=admin();
    const result=await db.runTransaction(async tx=>{
      const [stored,scores,status]=await tx.getAll(...["games","scores","gameStatus"].map(c=>db.collection(c).doc(id)));
      if(!stored.exists&&!seeds.has(id)) return {code:404};
      const game={...seeds.get(id),...stored.data(),...scores.data()};
      game.status=status.data()?.status||game.status;
      const teams=[game.team1,game.team2];
      const ref=db.collection("fanPicks").doc(hash(JSON.stringify([id,...teams])));
      const voter=ref.collection("picks").doc(hash(device));
      const [poll,previous]=await tx.getAll(ref,voter);
      const counts=poll.data()?.counts||[0,0];
      let selected=previous.data()?.choice??null;
      const state=pollState(game);
      if(vote && state==="open"){
        if(remove){
          if(selected===null) return {code:200,state,start:kickoff(game),teams,selected:null,counts:counts.some(c=>c>0)?counts:null};
          if(counts[selected]>0) counts[selected]--;
          tx.set(ref,{gameId:id,teams,counts});
          tx.delete(voter);
          selected=null;
        } else if(selected===null){
          if(req.body.team!==teams[choice]) return {code:409};
          counts[choice]++;
          tx.set(ref,{gameId:id,teams,counts});
          tx.create(voter,{choice});
          selected=choice;
        }
      }
      return {code:200,state,start:kickoff(game),teams,selected,counts:selected!==null||state==="closed"||counts.some(c=>c>0)?counts:null};
    });
    const {code,...data}=result;
    return res.status(code).json(data);
  }catch(error){console.error("Fan Picks unavailable",error.code||error.name);return res.status(503).json({error:"Fan Picks unavailable"});}
}
export default makeHandler();
