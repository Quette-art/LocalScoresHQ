import test from "node:test";
import assert from "node:assert/strict";
import {makeHandler} from "../api/fan-picks.js";
import {kickoff,pollState} from "../src/fanPicksPolicy.js";
const game={date:"2099-11-20",time:"7:00 PM",team1:"A",team2:"B"};
test("Eastern kickoff handles daylight and standard time; closes at kickoff",()=>{
 for(const [date,h] of [["2026-11-20","00"],["2026-07-20","23"]])assert.equal(new Date(kickoff({...game,date})).getUTCHours(),+h);
 assert.equal(pollState(game,kickoff(game)-1),"open");assert.equal(pollState(game,kickoff(game)),"closed");
 assert.equal(pollState({...game,time:"TBD"}),"open");
});
test("counts are hidden before voting, repeat votes do not increment, and closed polls reject new picks",async()=>{
 const data=new Map([["games/test",{...game,date:"TBD",time:"TBD"}]]);
 const ref=path=>({path,collection:c=>({doc:id=>ref(path+"/"+c+"/"+id)})});
 const db={collection:c=>({doc:id=>ref(c+"/"+id)}),runTransaction:fn=>fn({
 getAll:(...refs)=>refs.map(r=>({exists:data.has(r.path),data:()=>structuredClone(data.get(r.path))})),
 set:(r,v)=>data.set(r.path,v),create:(r,v)=>{assert.ok(!data.has(r.path));data.set(r.path,v);}
 })};
 const handler=makeHandler(()=>({db}));
 async function call(choice,other=false){
 let result;
 await handler({method:choice===undefined?"GET":"POST",query:{gameId:"test"},headers:{"x-pick-device":(other?"a":"b")+"0000000-0000-0000-0000-000000000000"},body:{gameId:"test",choice,team:choice===0?"A":"B"}},{setHeader(){},status(n){assert.equal(n,200);return this},json(v){result=v}});
 return result;
 }
 assert.equal((await call()).counts,null);
 assert.deepEqual((await call(0)).counts,[1,0]);
 data.set("games/test",game);
 assert.equal((await call(1)).selected,0);
 assert.deepEqual((await call()).counts,[1,0]);
 data.set("gameStatus/test",{status:"live"});
 assert.deepEqual((await call(1,true)).counts,[1,0]);
});
