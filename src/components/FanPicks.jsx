import React,{useEffect,useState,useRef} from "react";
import {logoPalette,palettePair} from "./fanColors.js";
import TeamMascot from "./TeamMascot";
import {pollState} from "../fanPicksPolicy.js";
import "./FanPicks.css";

function device(){
  const key="lshq-fan-picks-device-v1";
  let id=localStorage.getItem(key);
  if(!id){id=crypto.randomUUID();localStorage.setItem(key,id);}
  return id;
}
export default function FanPicks({game,onShare}){
  const [poll,setPoll]=useState(null),[error,setError]=useState(false),[busy,setBusy]=useState(false),[version,reload]=useState(0);
  useEffect(()=>{
    const ctrl=new AbortController();
    async function load(){
      try{
        const r=await fetch("/api/fan-picks?gameId="+encodeURIComponent(game.id),{headers:{"x-pick-device":device()},signal:ctrl.signal,cache:"no-store"});
        if(!r.ok)throw Error();
        setPoll(await r.json());setError(false);
      }catch{if(!ctrl.signal.aborted)setError(true);}
    }
    load();return ()=>ctrl.abort();
  },[game.id,version]);
  useEffect(()=>{
    if(poll?.state!=="open")return;
    const timer=setTimeout(()=>reload(v=>v+1),Math.min(2147483647,Math.max(1000,poll.start-Date.now()+100)));
    return ()=>clearTimeout(timer);
  },[poll]);
  async function pick(choice){
    if(busy)return;
    setBusy(true);setError(false);
    try{
      const r=await fetch("/api/fan-picks",{method:"POST",headers:{"Content-Type":"application/json","x-pick-device":device()},body:JSON.stringify({gameId:String(game.id),team:poll.teams[choice],choice})});
      if(!r.ok)throw Error();
      setPoll(await r.json());
    }catch{setError(true);}finally{setBusy(false);}
  }
  const total=poll?.counts?.reduce((a,b)=>a+b,0)||0;
  const closed=poll?.state==="closed"||pollState(game)==="closed";
  const center=useRef(null);
  const [colors,setColors]=useState(()=>palettePair([],[]));
  function updateColors(){
    const marks=center.current?.querySelectorAll(".team-mascot");
    if(!marks)return;
    const pair=palettePair(...[0,1].map(i=>logoPalette(marks[i]?.querySelector("img"))));
    setColors(old=>old.every((c,i)=>c===pair[i])?old:pair);
  }
  useEffect(()=>{if(total) updateColors();},[total,game.id]);
  if(closed&&!total)return null;
  const canPick=poll?.state==="open"&&!closed&&poll.selected===null&&!busy;
  const teams=poll?.teams||[game.team1,game.team2];
  const share=total ? poll.counts[0]*100/total : 0;
  const leading=total && poll.counts[0]!==poll.counts[1] ? teams[Number(poll.counts[1]>poll.counts[0])] : null;
  return <section className="fan-picks" aria-label="Fan Picks"><header><div><small>FAN PICKS</small><h2>{total ? "Fan vote results" : "Who will win?"}</h2></div><button type="button" onClick={onShare}>Share</button></header>
    {total>0 ? <figure className="fan-matchup" style={{"--first":colors[0],"--accent":colors[1]}}>
      {teams.map((team,i)=><div className={"fan-side side-"+i} key={i}>
        <strong>{Number((100*poll.counts[i]/total).toFixed(1))}%</strong>
        <span><i aria-hidden="true"/>{team}</span>{poll.selected===i && <small>Your pick</small>}
      </div>)}
      <div className="fan-ring" aria-hidden="true" style={{"--solid":(100-share)+"%"}}>
        <div className="fan-ring-center" ref={center} onLoadCapture={updateColors} onErrorCapture={updateColors}><TeamMascot teamName={teams[0]}/><em/><TeamMascot teamName={teams[1]}/></div>
      </div>
      <figcaption>{leading ? leading+" leads the fan vote" : "Fans are evenly split"}</figcaption>
    </figure> : teams.map((team,i)=><button key={i} type="button" className="fan-choice" disabled={!canPick} onClick={()=>pick(i)}>
      <span aria-hidden="true"><TeamMascot teamName={team}/></span><strong>{team}</strong>
      {poll?.selected===i&&<small>Your pick</small>}{total>0&&<b>{i===0?Math.round(100*poll.counts[0]/total):100-Math.round(100*poll.counts[0]/total)}%</b>}
    </button>)}
    <p role="status">{error?"Couldn’t load or save your pick.":busy?"Saving your pick…":!poll?"Loading fan picks…":closed?"Voting closed":poll.state==="pending"?"Voting opens when a start time is confirmed.":poll.selected!==null?"Pick saved":"Pick a team before the game starts."}{poll?.counts?" · "+total+" "+(total===1?"vote":"votes"):""}</p>
    {error&&<button type="button" onClick={()=>reload(v=>v+1)}>Retry</button>}
  </section>;
}
