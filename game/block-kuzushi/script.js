// --- ステージ定義 ---
const stages = [
  [
    "1111111",
    "1111111",
    "1111111",
    "1111111",
    "1111111",
    "1111111"
  ],
  [
    "1000001",
    "0100010",
    "0010100",
    "0001000",
    "1111111"
  ],
  [
    "1111111",
    "1001001",
    "1101011",
    "1001001",
    "1111111"
  ]
];

// --- 色リスト（上から順に） ---
const colorSets = [
  "#f44336", // 赤
  "#ff9800", // オレンジ
  "#ffeb3b", // 黄
  "#4caf50", // 緑
  "#2196f3", // 青
  "#3f51b5", // 藍
  "#9c27b0"  // 紫
];

// --- ステージ用に行数に応じて色セットを決定 ---
function getColorList(rowCount) {
  if (rowCount <= colorSets.length) return colorSets.slice(0, rowCount);
  let colors = [];
  for(let i=0; i<rowCount; i++) {
    let idx = i * (colorSets.length-1) / (rowCount-1);
    let base = Math.floor(idx);
    let t = idx - base;
    let c1 = hexToRgb(colorSets[base]);
    let c2 = hexToRgb(colorSets[Math.min(base+1, colorSets.length-1)]);
    colors.push(rgbToHex(lerp(c1, c2, t)));
  }
  return colors;
}
function hexToRgb(hex) {
  hex = hex.replace("#","");
  return [
    parseInt(hex.substr(0,2),16),
    parseInt(hex.substr(2,2),16),
    parseInt(hex.substr(4,2),16)
  ];
}
function rgbToHex(rgb) {
  return "#" + rgb.map(x=>x.toString(16).padStart(2,"0")).join("");
}
function lerp(a,b,t) {
  return [0,1,2].map(i=>Math.round(a[i]*(1-t)+b[i]*t));
}

// --- ゲーム定数 ---
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_RADIUS = 8;
const BLOCK_MARGIN = 4;
const BLOCK_HEIGHT = 24;
const PADDLE_CENTER_WIDTH = 5; // 中央赤部分の幅

// --- ゲーム状態 ---
let currentStage = 0;
let lives = 3;
let blocks = [];
let ball = { x:0, y:0, vx:0, vy:0 };
let paddle = { x:0 };
let gameState = "start"; // start, playing, clear, gameover
let info = document.getElementById("info");
let isPierceMode = false; // 貫通モード

// --- ステージセットアップ ---
function setupStage() {
  // ステージ形状
  let stage = stages[currentStage];
  let rows = stage.length;
  let cols = stage[0].length;
  let colors = getColorList(rows);
  blocks = [];
  let blockWidth = (WIDTH - BLOCK_MARGIN * (cols+1)) / cols;
  for(let y=0; y<rows; y++) {
    for(let x=0; x<cols; x++) {
      if(stage[y][x] === "1") {
        blocks.push({
          x: BLOCK_MARGIN + x*(blockWidth+BLOCK_MARGIN),
          y: 60 + y*(BLOCK_HEIGHT+BLOCK_MARGIN),
          w: blockWidth,
          h: BLOCK_HEIGHT,
          color: colors[y]
        });
      }
    }
  }
  // パドル・ボール初期化
  paddle.x = (WIDTH - PADDLE_WIDTH)/2;
  ball.x = WIDTH/2;
  ball.y = HEIGHT - 100;
  ball.vx = 3 * (Math.random()<0.5?1:-1);
  ball.vy = -4;
  isPierceMode = false;
  gameState = "playing";
  updateInfo();
}
function updateInfo() {
  info.innerHTML = `ステージ: ${currentStage+1}/${stages.length}　ライフ: ${lives}${isPierceMode ? "　<貫通モード！>" : ""}`;
}

// --- ゲームループ ---
function update() {
  if(gameState !== "playing") return;

  // ボール移動
  ball.x += ball.vx;
  ball.y += ball.vy;
  // 壁反射
  if(ball.x < BALL_RADIUS){ ball.x = BALL_RADIUS; ball.vx *= -1; }
  if(ball.x > WIDTH-BALL_RADIUS){ ball.x = WIDTH-BALL_RADIUS; ball.vx *= -1; }
  if(ball.y < BALL_RADIUS){ ball.y = BALL_RADIUS; ball.vy *= -1; }

  // パドル反射
  let paddleTop = HEIGHT - 60;
  if(
    ball.y + BALL_RADIUS > paddleTop &&
    ball.y - BALL_RADIUS < paddleTop + PADDLE_HEIGHT &&
    ball.x > paddle.x &&
    ball.x < paddle.x + PADDLE_WIDTH &&
    ball.vy > 0
  ) {
    // パドルのどこに当たったか（中心からの距離 -1〜1）
    let relX = (ball.x - (paddle.x + PADDLE_WIDTH / 2));
    let norm = relX / (PADDLE_WIDTH / 2);
    // パドル反発角度（外側に行くほど急、中心は真上）
    let maxAngle = Math.PI * 5 / 12; // 75度
    // 修正：右に当てたら右上、左に当てたら左上に
    let angle = Math.PI/2 - norm * maxAngle;
    let speed = Math.sqrt(ball.vx*ball.vx + ball.vy*ball.vy);

    // 貫通モードの解除
    if(isPierceMode) isPierceMode = false;

    // 真ん中5pxは赤色、当たったら貫通モード
    const centerLeft = paddle.x + PADDLE_WIDTH/2 - PADDLE_CENTER_WIDTH/2;
    const centerRight = paddle.x + PADDLE_WIDTH/2 + PADDLE_CENTER_WIDTH/2;
    if(ball.x >= centerLeft && ball.x <= centerRight) {
      isPierceMode = true;
      updateInfo();
    }

    // 反発ベクトル
    ball.vx = speed * Math.cos(angle);
    ball.vy = -Math.abs(speed * Math.sin(angle));
    // ボールをパドルの上に配置
    ball.y = paddleTop - BALL_RADIUS - 1;
  }

  // ブロック衝突
  for(let i=0; i<blocks.length; i++) {
    let b = blocks[i];
    if(
      ball.x + BALL_RADIUS > b.x &&
      ball.x - BALL_RADIUS < b.x+b.w &&
      ball.y + BALL_RADIUS > b.y &&
      ball.y - BALL_RADIUS < b.y+b.h
    ) {
      if(!isPierceMode) {
        // 衝突面によって反発方向を決定（より正確に）
        let overlapLeft = ball.x + BALL_RADIUS - b.x;
        let overlapRight = b.x + b.w - (ball.x - BALL_RADIUS);
        let overlapTop = ball.y + BALL_RADIUS - b.y;
        let overlapBottom = b.y + b.h - (ball.y - BALL_RADIUS);
        let minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if(minOverlap === overlapLeft) ball.vx = -Math.abs(ball.vx);
        else if(minOverlap === overlapRight) ball.vx = Math.abs(ball.vx);
        else if(minOverlap === overlapTop) ball.vy = -Math.abs(ball.vy);
        else if(minOverlap === overlapBottom) ball.vy = Math.abs(ball.vy);
      }
      blocks.splice(i,1);
      break;
    }
  }

  // ステージクリア
  if(blocks.length === 0) {
    gameState = "clear";
    setTimeout(nextStage, 1000);
  }

  // 落下
  if(ball.y > HEIGHT + BALL_RADIUS) {
    lives--;
    if(lives > 0) {
      setupStage();
    } else {
      gameState = "gameover";
    }
  }
}

function draw() {
  ctx.clearRect(0,0,WIDTH,HEIGHT);

  // ブロック
  for(let b of blocks) {
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.strokeStyle = "#222";
    ctx.strokeRect(b.x, b.y, b.w, b.h);
  }
  // パドル
  // 左側
  ctx.fillStyle = "#fff";
  ctx.fillRect(paddle.x, HEIGHT-60, PADDLE_WIDTH/2-PADDLE_CENTER_WIDTH/2, PADDLE_HEIGHT);
  // 右側
  ctx.fillRect(paddle.x+PADDLE_WIDTH/2+PADDLE_CENTER_WIDTH/2, HEIGHT-60, PADDLE_WIDTH/2-PADDLE_CENTER_WIDTH/2, PADDLE_HEIGHT);
  // 中央(赤)
  ctx.fillStyle = "#f44336";
  ctx.fillRect(paddle.x+PADDLE_WIDTH/2-PADDLE_CENTER_WIDTH/2, HEIGHT-60, PADDLE_CENTER_WIDTH, PADDLE_HEIGHT);

  // ボール
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI*2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  // メッセージ
  if(gameState === "gameover") {
    ctx.font = "32px sans-serif";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over", WIDTH/2-80, HEIGHT/2);
  }
  if(gameState === "clear" && currentStage === stages.length-1) {
    ctx.font = "32px sans-serif";
    ctx.fillStyle = "yellow";
    ctx.fillText("All Clear!!", WIDTH/2-90, HEIGHT/2);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// --- 操作 ---
document.addEventListener("mousemove", e=>{
  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  paddle.x = Math.max(0, Math.min(WIDTH - PADDLE_WIDTH, x - PADDLE_WIDTH/2));
});
document.addEventListener("keydown", e=>{
  if(e.key === "ArrowLeft") paddle.x = Math.max(0, paddle.x-24);
  if(e.key === "ArrowRight") paddle.x = Math.min(WIDTH-PADDLE_WIDTH, paddle.x+24);
  if(gameState==="gameover" || (gameState==="clear" && currentStage === stages.length-1)) {
    currentStage = 0;
    lives = 3;
    setupStage();
  }
});

// --- ステージ切り替え ---
function nextStage() {
  currentStage++;
  if(currentStage >= stages.length) {
    // 全クリア
    gameState = "clear";
  } else {
    lives = 3;
    setupStage();
  }
  updateInfo();
}

// --- ゲーム開始 ---
setupStage();
gameLoop();
