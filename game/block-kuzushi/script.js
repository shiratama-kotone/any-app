// --- ステージ定義（変更なし） ---
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

// --- 色リスト（上から順に）（変更なし） ---
const colorSets = [
  "#f44336", // 赤
  "#ff9800", // オレンジ
  "#ffeb3b", // 黄
  "#4caf50", // 緑
  "#2196f3", // 青
  "#3f51b5", // 藍
  "#9c27b0"  // 紫
];

// --- ステージ用に行数に応じて色セットを決定（変更なし） ---
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

// --- 縦長表示を強制するためのキャンバスサイズ調整 ---
// 画面の幅と高さを比較し、短い方を基準にする
// スマートフォンでは縦持ちが一般的で、幅が狭いことが多い
const screenShortSide = Math.min(window.innerWidth, window.innerHeight);

// キャンバスの幅を画面の短い方の辺の90%に設定
canvas.width = screenShortSide * 0.9;
// キャンバスの高さは、幅に対して約1.8倍（縦長の比率）に設定
canvas.height = canvas.width * 1.8; // 例: 幅が300pxなら高さは540px

let WIDTH = canvas.width; // let に変更してリサイズ時に更新可能に
let HEIGHT = canvas.height; // let に変更してリサイズ時に更新可能に

const PADDLE_WIDTH = WIDTH * 0.4; // パドルの幅を幅に対して大きめに調整
const PADDLE_HEIGHT = HEIGHT * 0.02;
const BALL_RADIUS = WIDTH * 0.03;
const BLOCK_MARGIN = WIDTH * 0.015;
const BLOCK_HEIGHT = HEIGHT * 0.05;
const PADDLE_CENTER_WIDTH = PADDLE_WIDTH * 0.05;

// --- ゲーム状態 ---
let currentStage = 0;
let lives = 3;
let blocks = [];
let ball = { x:0, y:0, vx:0, vy:0 };
let paddle = { x:0 };
let gameState = "start"; // start, playing, clear, gameover
let info = document.getElementById("info");
let isPierceMode = false; // 貫通モード

// ★追加：パドルを滑らかに動かすための目標位置
let targetPaddleX = 0;
const PADDLE_SMOOTHING = 0.2; // 0より大きく1より小さい値。大きいほど素早く、小さいほど滑らかに動く。

// --- ステージセットアップ（変更なし） ---
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
          y: HEIGHT * 0.1 + y*(BLOCK_HEIGHT+BLOCK_MARGIN),
          w: blockWidth,
          h: BLOCK_HEIGHT,
          color: colors[y]
        });
      }
    }
  }
  // パドル・ボール初期化
  resetBallAndPaddle();
  isPierceMode = false;
  gameState = "playing";
  updateInfo();
}

// --- Function to reset ball and paddle position ---
function resetBallAndPaddle() {
  // パドルは画面中央にリセット
  paddle.x = (WIDTH - PADDLE_WIDTH)/2;
  // 目標位置も同じに設定
  targetPaddleX = paddle.x;

  ball.x = WIDTH/2;
  ball.y = HEIGHT - (PADDLE_HEIGHT + HEIGHT * 0.05);
  ball.vx = 3 * (Math.random()<0.5?1:-1) * (WIDTH / 400);
  ball.vy = -4 * (HEIGHT / 600);
  isPierceMode = false;
  updateInfo();
}

function updateInfo() {
  info.innerHTML = `ステージ: ${currentStage+1}/${stages.length}　ライフ: ${lives}${isPierceMode ? "　<貫通モード！>" : ""}`;
}

// --- ゲームループ ---
function update() {
  if(gameState !== "playing") return;

  // ★追加：パドルの動きを滑らかにするロジック
  // 現在のパドル位置を目標位置に近づける
  paddle.x += (targetPaddleX - paddle.x) * PADDLE_SMOOTHING;
  // パドルがキャンバスからはみ出さないように制限
  paddle.x = Math.max(0, Math.min(WIDTH - PADDLE_WIDTH, paddle.x));


  // ボール移動（変更なし）
  ball.x += ball.vx;
  ball.y += ball.vy;
  // 壁反射（変更なし）
  if(ball.x < BALL_RADIUS){ ball.x = BALL_RADIUS; ball.vx *= -1; }
  if(ball.x > WIDTH-BALL_RADIUS){ ball.x = WIDTH-BALL_RADIUS; ball.vx *= -1; }
  if(ball.y < BALL_RADIUS){ ball.y = BALL_RADIUS; ball.vy *= -1; }

  // パドル反射（変更なし）
  let paddleTop = HEIGHT - (PADDLE_HEIGHT + HEIGHT * 0.03);
  if(
    ball.y + BALL_RADIUS > paddleTop &&
    ball.y - BALL_RADIUS < paddleTop + PADDLE_HEIGHT &&
    ball.x > paddle.x &&
    ball.x < paddle.x + PADDLE_WIDTH &&
    ball.vy > 0
  ) {
    let relX = (ball.x - (paddle.x + PADDLE_WIDTH / 2));
    let norm = relX / (PADDLE_WIDTH / 2);
    let maxAngle = Math.PI * 5 / 12;
    let angle = Math.PI/2 - norm * maxAngle;
    let speed = Math.sqrt(ball.vx*ball.vx + ball.vy*ball.vy);

    if(isPierceMode) isPierceMode = false;

    const centerLeft = paddle.x + PADDLE_WIDTH/2 - PADDLE_CENTER_WIDTH/2;
    const centerRight = paddle.x + PADDLE_WIDTH/2 + PADDLE_CENTER_WIDTH/2;
    if(ball.x >= centerLeft && ball.x <= centerRight) {
      isPierceMode = true;
      updateInfo();
    }

    ball.vx = speed * Math.cos(angle);
    ball.vy = -Math.abs(speed * Math.sin(angle));
    ball.y = paddleTop - BALL_RADIUS - 1;
  }

  // ブロック衝突（変更なし）
  for(let i=0; i<blocks.length; i++) {
    let b = blocks[i];
    if(
      ball.x + BALL_RADIUS > b.x &&
      ball.x - BALL_RADIUS < b.x+b.w &&
      ball.y + BALL_RADIUS > b.y &&
      ball.y - BALL_RADIUS < b.y+b.h
    ) {
      if(!isPierceMode) {
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

  // ステージクリア（変更なし）
  if(blocks.length === 0) {
    gameState = "clear";
    setTimeout(nextStage, 1000);
  }

  // 落下（変更なし）
  if(ball.y > HEIGHT + BALL_RADIUS) {
    lives--;
    if(lives > 0) {
      resetBallAndPaddle();
    } else {
      gameState = "gameover";
    }
  }
}

// --- draw 関数（変更なし） ---
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
  let paddleY = HEIGHT - (PADDLE_HEIGHT + HEIGHT * 0.03);
  // 左側
  ctx.fillStyle = "#fff";
  ctx.fillRect(paddle.x, paddleY, PADDLE_WIDTH/2-PADDLE_CENTER_WIDTH/2, PADDLE_HEIGHT);
  // 右側
  ctx.fillRect(paddle.x+PADDLE_WIDTH/2+PADDLE_CENTER_WIDTH/2, paddleY, PADDLE_WIDTH/2-PADDLE_CENTER_WIDTH/2, PADDLE_HEIGHT);
  // 中央(赤)
  ctx.fillStyle = "#f44336";
  ctx.fillRect(paddle.x+PADDLE_WIDTH/2-PADDLE_CENTER_WIDTH/2, paddleY, PADDLE_CENTER_WIDTH, PADDLE_HEIGHT);

  // ボール
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI*2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  // メッセージ
  if(gameState === "gameover") {
    ctx.font = `${WIDTH * 0.08}px sans-serif`;
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", WIDTH/2, HEIGHT/2);
    ctx.textAlign = "left";
  }
  if(gameState === "clear" && currentStage === stages.length-1) {
    ctx.font = `${WIDTH * 0.08}px sans-serif`;
    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.fillText("All Clear!!", WIDTH/2, HEIGHT/2);
    ctx.textAlign = "left";
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// --- 操作 ---
// ★変更：タッチイベントでパドルの目標位置を更新
document.addEventListener("touchstart", e => {
  let rect = canvas.getBoundingClientRect();
  targetPaddleX = e.touches[0].clientX - rect.left - PADDLE_WIDTH/2;
}, { passive: false });

document.addEventListener("touchmove", e => {
  let rect = canvas.getBoundingClientRect();
  targetPaddleX = e.touches[0].clientX - rect.left - PADDLE_WIDTH/2;
}, { passive: false });

document.addEventListener("click", e => {
  if(gameState==="gameover" || (gameState==="clear" && currentStage === stages.length-1)) {
    currentStage = 0;
    lives = 3;
    setupStage();
  }
});


// --- ステージ切り替え（変更なし） ---
function nextStage() {
  currentStage++;
  if(currentStage >= stages.length) {
    gameState = "clear";
  } else {
    lives = 3;
    setupStage();
  }
  updateInfo();
}

// --- ゲーム開始（変更なし） ---
setupStage();
gameLoop();

// --- Handle window resize for responsiveness ---
window.addEventListener('resize', () => {
    const screenShortSide = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = screenShortSide * 0.9;
    canvas.height = canvas.width * 1.8;

    // WIDTHとHEIGHTを更新
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    
    // 他の定数も新しいWIDTHとHEIGHTに基づいて再計算
    PADDLE_WIDTH = WIDTH * 0.4;
    PADDLE_HEIGHT = HEIGHT * 0.02;
    BALL_RADIUS = WIDTH * 0.03;
    BLOCK_MARGIN = WIDTH * 0.015;
    BLOCK_HEIGHT = HEIGHT * 0.05;
    PADDLE_CENTER_WIDTH = PADDLE_WIDTH * 0.05;

    setupStage();
});
