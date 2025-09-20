function twoDigit(n){ return n<10 ? "0"+n : n; }

function drawAnalogFavicon(date){
  const canvas=document.createElement('canvas');
  canvas.width=64; canvas.height=64;
  const ctx=canvas.getContext('2d');
  const cx=32, cy=32, r=28;

  // 背景
  ctx.fillStyle="#222";
  ctx.fillRect(0,0,64,64);

  // 外円
  ctx.strokeStyle="#fff";
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.arc(cx,cy,r,0,2*Math.PI);
  ctx.stroke();

  // 目盛り
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

  // 時針
  const hAng=h*Math.PI/6;
  ctx.strokeStyle="#fff";
  ctx.lineWidth=3;
  ctx.beginPath();
  ctx.moveTo(cx,cy);
  ctx.lineTo(cx+Math.sin(hAng)*r*0.5, cy-Math.cos(hAng)*r*0.5);
  ctx.stroke();

  // 分針
  const mAng=m*Math.PI/30;
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(cx,cy);
  ctx.lineTo(cx+Math.sin(mAng)*r*0.7, cy-Math.cos(mAng)*r*0.7);
  ctx.stroke();

  // 秒針
  const sAng=s*Math.PI/30;
  ctx.strokeStyle="red";
  ctx.lineWidth=1;
  ctx.beginPath();
  ctx.moveTo(cx,cy);
  ctx.lineTo(cx+Math.sin(sAng)*r*0.8, cy-Math.cos(sAng)*r*0.8);
  ctx.stroke();

  // 更新
  document.getElementById("dynamic-favicon").href=canvas.toDataURL();
}

function showClock(){
  const now=new Date();
  const h=now.getHours(), m=twoDigit(now.getMinutes()), s=twoDigit(now.getSeconds());
  let ampm="", displayHour=h;

  if(h===0){ ampm="午前"; displayHour=12; }
  else if(h===12){ ampm="午後"; displayHour=12; }
  else if(h>12){ ampm="午後"; displayHour=h-12; }
  else{ ampm="午前"; }

  document.getElementById("realtime").textContent=`${displayHour}:${m}:${s}`;
  document.getElementById("ampm-display").textContent=ampm;

  const weekdays=["日","月","火","水","木","金","土"];
  document.getElementById("date-display").textContent=
    `${now.getMonth()+1}月${now.getDate()}日(${weekdays[now.getDay()]})`;

  document.title=`時計 - ${twoDigit(h)}:${m}:${s}`;
  drawAnalogFavicon(now);
}

setInterval(showClock,1000);
showClock();
