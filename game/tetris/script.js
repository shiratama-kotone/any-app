const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const COLS = 10, ROWS = 20, SIZE = 30;
let board = Array.from({length: ROWS}, () => Array(COLS).fill(null));

const nextCanvases = [...Array(5)].map((_, i) => 
  document.getElementById("next"+i).getContext("2d")
);
const holdCtx = document.getElementById("hold").getContext("2d");

const tetrominoes = {
  I: [[1,1,1,1]],
  O: [[1,1],[1,1]],
  T: [[0,1,0],[1,1,1]],
  S: [[0,1,1],[1,1,0]],
  Z: [[1,1,0],[0,1,1]],
  J: [[1,0,0],[1,1,1]],
  L: [[0,0,1],[1,1,1]],
};

const colors = {
  I: "cyan", O: "yellow", T: "purple",
  S: "green", Z: "red", J: "blue", L: "orange"
};

let bag = [], nextQueue=[], current, currentType, x, y;
let holdType=null, holdUsed=false;
let score=0, gameOver=false;
let lastMove=null, isTSpin=false;
let oSpinRotations = []; // Oミノ高速回転用

function randTetromino(){
  if(bag.length===0) bag = Object.keys(tetrominoes).sort(()=>Math.random()-0.5);
  return bag.pop();
}

function spawn(){
  while(nextQueue.length<5) nextQueue.push(randTetromino());
  currentType = nextQueue.shift();
  current = tetrominoes[currentType].map(r=>[...r]);
  x=3; y=0;
  holdUsed=false;
  nextQueue.push(randTetromino());
  if(collide()) gameOver=true;
}

function drawBlock(px,py,color,ctx=ctx){
  ctx.fillStyle=color;
  ctx.fillRect(px*SIZE, py*SIZE, SIZE, SIZE);
  ctx.strokeStyle="#111";
  ctx.strokeRect(px*SIZE, py*SIZE, SIZE, SIZE);
}

function collide(){
  return current.some((r,dy)=>r.some((v,dx)=>{
    return v && (board[y+dy]?.[x+dx]!==null || x+dx<0 || x+dx>=COLS || y+dy>=ROWS);
  }));
}

function merge(){
  current.forEach((r,dy)=>r.forEach((v,dx)=>{
    if(v) board[y+dy][x+dx]=colors[currentType];
  }));
}

function rotate(dir){
  // Oミノ高速回転チェック
  if(currentType==="O"){
    const now=Date.now();
    oSpinRotations.push(now);
    oSpinRotations = oSpinRotations.filter(t=>now-t<=1000);
    if(oSpinRotations.length>=10){
      currentType="I";
      current=tetrominoes["I"].map(r=>[...r]);
      x=3; y=0;
      oSpinRotations=[];
      return;
    }
  }

  // 通常の回転処理
  const old=current.map(r=>[...r]);
  const m=current[0].map((_,i)=>current.map(r=>r[i])).reverse();
  if(dir>0) m.forEach(r=>r.reverse());
  else m.reverse();
  current=m;
  if(collide()) current=old;
  else lastMove="rotate";

  // Tスピン判定
  if(currentType==="T" && lastMove==="rotate"){
    const cx=x+1, cy=y+1;
    let corners=0;
    [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dx,dy])=>{
      if(!board[cy+dy] || board[cy+dy][cx+dx]) corners++;
    });
    isTSpin = corners>=3;
  }
}

function drop(){ y++; if(collide()){y--; merge(); clearLines(); spawn();}}
function hardDrop(){ while(!collide()) y++; y--; merge(); clearLines(); spawn();}
function move(dx){ x+=dx; if(collide()) x-=dx;}

function clearLines(){
  board=board.filter(r=>r.some(v=>!v));
  let cleared = ROWS - board.length;
  while(board.length<ROWS) board.unshift(Array(COLS).fill(null));

  if(isTSpin){
    score += cleared===1 ? 800 : cleared===2 ? 1200 : cleared===3 ? 1600 : 400;
    isTSpin=false;
  } else {
    score += cleared*100;
  }
  document.getElementById("score").textContent=score;
}

function hold(){
  if(holdUsed) return;
  if(holdType===null){
    holdType=currentType;
    spawn();
  }else{
    [holdType,currentType]=[currentType,holdType];
    current = tetrominoes[currentType].map(r=>[...r]);
    x=3; y=0;
    if(collide()) gameOver=true;
  }
  holdUsed=true;
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  board.forEach((r,y0)=>r.forEach((v,x0)=>v&&drawBlock(x0,y0,v)));
  current.forEach((r,dy)=>r.forEach((v,dx)=>{
    if(v) drawBlock(x+dx,y+dy,colors[currentType]);
  }));
  drawNext();
  drawHold();
}

function drawNext(){
  nextCanvases.forEach((ctxN,i)=>{
    ctxN.clearRect(0,0,ctxN.canvas.width,ctxN.canvas.height);
    const type = nextQueue[i];
    const shape=tetrominoes[type];
    shape.forEach((r,y)=>r.forEach((v,x)=>{
      if(v){
        const sz=Math.floor(ctxN.canvas.width/shape[0].length);
        ctxN.fillStyle=colors[type];
        ctxN.fillRect(x*sz,y*sz,sz,sz);
        ctxN.strokeStyle="#111";
        ctxN.strokeRect(x*sz,y*sz,sz,sz);
      }
    }));
  });
}

function drawHold(){
  holdCtx.clearRect(0,0,120,120);
  if(!holdType) return;
  const shape=tetrominoes[holdType];
  const sz=Math.floor(120/shape[0].length);
  shape.forEach((r,y)=>r.forEach((v,x)=>{
    if(v){
      holdCtx.fillStyle=colors[holdType];
      holdCtx.fillRect(x*sz,y*sz,sz,sz);
      holdCtx.strokeStyle="#111";
      holdCtx.strokeRect(x*sz,y*sz,sz,sz);
    }
  }));
}

document.addEventListener('keydown', e => {
  if(gameOver) return;
  if(e.key==="ArrowLeft") move(-1);
  else if(e.key==="ArrowRight") move(1);
  else if(e.key==="ArrowDown") drop();
  else if(e.key==="ArrowUp"||e.key==="x"||e.key==="X") rotate(1);
  else if(e.key==="z"||e.key==="Z") rotate(-1);
  else if(e.key===" ") hardDrop();
  else if(e.key==="Shift"||e.key==="c"||e.key==="C") hold();
  draw();
});

function loop(){
  if(!gameOver){ drop(); draw(); setTimeout(loop,500);}
}

spawn(); draw(); loop();
