// Prefer substantial chromatic areas of the mascot over outlines and background.
export function logoPalette(img) {
  if (!img?.naturalWidth) return [];
  try {
    const canvas=document.createElement("canvas");
    canvas.width=canvas.height=32;
    const ctx=canvas.getContext("2d");ctx.drawImage(img,0,0,32,32);
    const pixels=ctx.getImageData(0,0,32,32).data, bins=new Map();
    for(let i=0;i<pixels.length;i+=4){
      const [r,g,b,a]=pixels.subarray(i,i+4);
      if(a<180 || Math.max(r,g,b)-Math.min(r,g,b)<42 || Math.max(r,g,b)<65)continue;
      const key=[r,g,b].map(v=>v>>5).join(".");
      const bin=bins.get(key)||[0,0,0,0];
      bin[0]++;bin[1]+=r;bin[2]+=g;bin[3]+=b;bins.set(key,bin);
    }
    const sorted=[...bins.values()].sort((a,b)=>b[0]-a[0]);
    return sorted.filter(v=>v[0]>=sorted[0][0]*0.18).map(([n,...s])=>s.map(v=>Math.round(v/n)));
  }catch{return [];}
}
function distinct(a,b){
  const hue=c=>{const [r,g,b]=c,m=Math.max(...c),d=m-Math.min(...c);if(!d)return 0;return ((m===r?(g-b)/d:m===g?(b-r)/d+2:(r-g)/d+4)*60+360)%360;};
  const delta=Math.abs(hue(a)-hue(b));
  return Math.min(delta,360-delta)>27 && Math.hypot(...a.map((v,i)=>v-b[i]))>85;
}
export function palettePair(left,right){
  const a=left[0]||[87,179,240];
  const b=[...right,[255,193,92],[85,190,245],[221,104,196]].find(c=>distinct(a,c));
  return [a,b||[237,242,247]].map(c=>"rgb("+c.join(",")+")");
}
