function setCookie(name,value,days=365){
  document.cookie=`${name}=${encodeURIComponent(value)};max-age=${days*86400};path=/`;
}
function getCookie(name){
  const m=document.cookie.match(new RegExp("(^| )"+name+"=([^;]+)"));
  return m?decodeURIComponent(m[2]):null;
}

let offset=0; // NTP補正
async function syncTime(){
  try{
    const res=await fetch("https://worldtimeapi.org/api/ip");
    const data=await res.json();
    const serverTime=new Date(data.datetime).getTime();
    offset=serverTime-Date.now();
  }catch(e){ offset=0; }
}
syncTime();

function twoDigit(n){ return n<10 ? "0"+n : n; }

function drawAnalogFavicon(date){
  const canvas=document.createElement('canvas');
  canvas.width=64;canvas.height=64;
  const ctx=canvas.getContext('2d');
  const cx=32,cy=32,r=28;

  ctx.fillStyle="#222";ctx.fillRect(0,0,64,64);
  ctx.strokeStyle="#fff";ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(cx,cy,r,0,2*Math.PI);ctx.stroke();

  ctx.fillStyle="#fff";
  for(let i=0;i<12;i++){
    const ang=i*Math.PI/6;
    const x=cx+Math.sin(ang)*r*0.85;
    const y=cy-Math.cos(ang)*r*0.85;
    ctx.beginPath();
    ctx.arc(x,y,(i%3===0)?2:1,0,2*Math.PI);
    ctx.fill();
  }
  const h=(date.getHours()%12)+date.getMinutes()/60;
  const m=date.getMinutes()+date.getSeconds()/60;
  const s=date.getSeconds();

  const hAng=h*Math.PI/6;
  ctx.strokeStyle="#fff";ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(cx,cy);
  ctx.lineTo(cx+Math.sin(hAng)*r*0.5, cy-Math.cos(hAng)*r*0.5);ctx.stroke();

  const mAng=m*Math.PI/30;
  ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy);
  ctx.lineTo(cx+Math.sin(mAng)*r*0.7, cy-Math.cos(mAng)*r*0.7);ctx.stroke();

  const sAng=s*Math.PI/30;
  ctx.strokeStyle="red";ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(cx,cy);
  ctx.lineTo(cx+Math.sin(sAng)*r*0.8, cy-Math.cos(sAng)*r*0.8);ctx.stroke();

  document.getElementById("dynamic-favicon").href=canvas.toDataURL();
}

let isAnalog=false;
function showClock(){
  const now=new Date(Date.now()+offset);
  const h=now.getHours(),m=twoDigit(now.getMinutes()),s=twoDigit(now.getSeconds());
  let ampm="",displayHour=h;
  if(h===0){ampm="午前";displayHour=12;}
  else if(h===12){ampm="午後";displayHour=12;}
  else if(h>12){ampm="午後";displayHour=h-12;}
  else{ampm="午前";}

  const realtime=document.getElementById("realtime");
  const analog=document.getElementById("analog-canvas");
  if(isAnalog){
    realtime.style.display="none";
    analog.style.display="inline";
    drawAnalogClock(now);
  }else{
    realtime.style.display="block";
    analog.style.display="none";
    realtime.textContent=`${displayHour}:${m}:${s}`;
  }
  document.getElementById("ampm-display").textContent=ampm;
  const weekdays=["日","月","火","水","木","金","土"];
  document.getElementById("date-display").textContent=
    `${now.getMonth()+1}月${now.getDate()}日(${weekdays[now.getDay()]})`;
  document.title=`時計 - ${twoDigit(h)}:${m}:${s}`;
  drawAnalogFavicon(now);
}

function drawAnalogClock(date){
  const canvas=document.getElementById("analog-canvas");
  const ctx=canvas.getContext("2d");
  ctx.clearRect(0,0,200,200);
  const cx=100,cy=100,r=80;

  ctx.beginPath();ctx.arc(cx,cy,r,0,2*Math.PI);
  ctx.fillStyle="#333";ctx.fill();
  ctx.strokeStyle="#fff";ctx.stroke();

  for(let i=0;i<12;i++){
    const ang=i*Math.PI/6;
    const x=cx+Math.sin(ang)*r*0.85;
    const y=cy-Math.cos(ang)*r*0.85;
    ctx.beginPath();ctx.arc(x,y,3,0,2*Math.PI);
    ctx.fillStyle="#fff";ctx.fill();
  }
  const h=(date.getHours()%12)+date.getMinutes()/60;
  const m=date.getMinutes()+date.getSeconds()/60;
  const s=date.getSeconds();

  ctx.strokeStyle="#fff";ctx.lineWidth=5;
  ctx.beginPath();ctx.moveTo(cx,cy);
  ctx.lineTo(cx+Math.sin(h*Math.PI/6)*r*0.5, cy-Math.cos(h*Math.PI/6)*r*0.5);ctx.stroke();

  ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(cx,cy);
  ctx.lineTo(cx+Math.sin(m*Math.PI/30)*r*0.7, cy-Math.cos(m*Math.PI/30)*r*0.7);ctx.stroke();

  ctx.strokeStyle="red";ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(cx,cy);
  ctx.lineTo(cx+Math.sin(s*Math.PI/30)*r*0.8, cy-Math.cos(s*Math.PI/30)*r*0.8);ctx.stroke();
}

document.getElementById("toggle-mode").onclick=()=>{
  isAnalog=!isAnalog;
  document.getElementById("toggle-mode").textContent=isAnalog?"デジタルに変更":"アナログに変更";
};

document.getElementById("font-select").onchange=(e)=>{
  document.documentElement.style.fontFamily=e.target.value;
  setCookie("fonts",e.target.value);
};

const savedFont=getCookie("fonts");
if(savedFont){
  document.getElementById("font-select").value=savedFont;
  document.documentElement.style.fontFamily=savedFont;
}

document.getElementById("toggle-dark").onclick=()=>{
  document.body.classList.toggle("dark");
  setCookie("dark",document.body.classList.contains("dark"));
};
if(getCookie("dark")==="true")document.body.classList.add("dark");

setInterval(showClock,1000);
showClock();
