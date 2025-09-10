const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const ROWS = 20, COLS = 10, BLOCK = 30;
let board = Array.from({length:ROWS},()=>Array(COLS).fill(''));
let score = 0, gameOver=false;

const colors = {
  I:'cyan', O:'yellow', S:'green', Z:'red',
  J:'blue', L:'orange', T:'purple'
};
const shapes = {
  I:[[1,1,1,1]],
  O:[[1,1],[1,1]],
  S:[[0,1,1],[1,1,0]],
  Z:[[1,1,0],[0,1,1]],
  J:[[1,0,0],[1,1,1]],
  L:[[0,0,1],[1,1,1]],
  T:[[0,1,0],[1,1,1]]
};

let bag = [], nextQueue=[], current, x, y;

function randTetromino(){
  if(!bag.length) bag = Object.keys(shapes).sort(()=>Math.random()-0.5);
  return bag.pop();
}
function spawn(){
  while(nextQueue.length<5) nextQueue.push(randTetromino());
  const type = nextQueue.shift();
  current = shapes[type].map(r=>[...r]);
  x=3; y=0;
  nextQueue.push(randTetromino());
}
function collide(px,py,shape=current){
  return shape.some((r,dy)=>r.some((v,dx)=>v && 
    (board[py+dy]?.[px+dx]===undefined || board[py+dy][px+dx])));
}
function merge(){
  current.forEach((r,dy)=>r.forEach((v,dx)=>{
    if(v) board[y+dy][x+dx]=getColor();
  }));
}
function clearLines(){
  let cleared=0;
  board=board.filter(r=>r.some(c=>!c));
  cleared = ROWS-board.length;
  while(board.length<ROWS) board.unshift(Array(COLS).fill(''));
  score+=cleared*100;
  document.getElementById('score').textContent=score;
}
function drawBlock(cx,cy,color,size=BLOCK,context=ctx){
  context.fillStyle=color;
  context.fillRect(cx*size,cy*size,size,size);
  context.strokeStyle='#111';
  context.strokeRect(cx*size,cy*size,size,size);
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  board.forEach((r,y)=>r.forEach((v,x)=>v&&drawBlock(x,y,v)));
  current.forEach((r,dy)=>r.forEach((v,dx)=>v&&drawBlock(x+dx,y+dy,getColor())));
  drawNext();
}
function drawNext(){
  nextQueue.forEach((type,i)=>{
    const c=document.getElementById('next'+i);
    const cctx=c.getContext('2d');
    cctx.clearRect(0,0,c.width,c.height);
    const shape=shapes[type];
    const blockSize = c.width/shape[0].length/1.2;
    shape.forEach((r,dy)=>r.forEach((v,dx)=>{
      if(v) drawBlock(dx,dy,colors[type],blockSize,cctx);
    }));
  });
}
function move(dir){
  if(!collide(x+dir,y)) x+=dir;
}
function drop(){
  if(!collide(x,y+1)) y++;
  else { merge(); clearLines(); spawn(); if(collide(x,y)) gameOver=true; }
}
function hardDrop(){
  while(!collide(x,y+1)) y++;
  drop();
}
function rotate(dir){
  const rotated = current[0].map((_,i)=>current.map(r=>r[i])).reverse();
  if(!collide(x,y,rotated)) current=rotated;
}
function getColor(){
  return Object.keys(shapes).find(k=>shapes[k].length===current.length && shapes[k][0].length===current[0].length && 
    shapes[k].every((r,ri)=>r.every((v,ci)=>v===current[ri][ci]))) || 'white';
}

document.addEventListener('keydown',e=>{
  if(gameOver) return;
  const k=e.key;
  if(k==='ArrowLeft'||k.toLowerCase()==='a'){move(-1);}
  else if(k==='ArrowRight'||k.toLowerCase()==='d'){move(1);}
  else if(k==='ArrowDown'||k.toLowerCase()==='s'){drop();}
  else if(k==='ArrowUp'||k.toLowerCase()==='w'){hardDrop();}
  else if(k.toLowerCase()==='q'||k==='/'||k==='?'){rotate(-1);}
  else if(k.toLowerCase()==='e'||k==='Shift'){rotate(1);}
  draw();
});

spawn();
setInterval(()=>{
  if(!gameOver){drop();draw();}
},500);
