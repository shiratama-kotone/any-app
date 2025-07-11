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
    "0010010", // ブロックの配置を微調整 (Optional: 1010101 -> 1001001)
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

// --- キャンバスサイズと比例定数を初期化する関数 ---
// PCとスマホで適切なサイズと比率を設定できるようにする
function initializeCanvasAndConstants() {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent); // ユーザーエージェントでモバイルを判定

  if (isMobile) {
    // スマホの場合（縦長を優先）
    const screenShortSide = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = screenShortSide * 0.9;
    canvas.height = canvas.width * 1.8; // 縦長比率を維持
  } else {
    // PCの場合（横長を優先）
    canvas.width = window.innerWidth * 0.7; // 画面幅の70%
    canvas.height = window.innerHeight * 0.7; // 画面高さの70%
    // 最大幅を設定して、巨大なモニターでも極端に大きくならないようにする (例: 800px)
    if (canvas.width > 800) canvas.width = 800;
    // 幅に合わせた高さの比率を調整
    if (canvas.height > canvas.width * 0.75) canvas.height = canvas.width * 0.75; // 4:3 または 16:9 くらいの比率
  }

  // グローバル変数として扱う
  WIDTH = canvas.width;
  HEIGHT = canvas.height;

  // 定数も新しいWIDTHとHEIGHTに基づいて再計算
  PADDLE_WIDTH = WIDTH * 0.15; // PCでは少し小さめに
  if (isMobile) PADDLE_WIDTH = WIDTH * 0.4; // スマホでは大きめに
  
  PADDLE_HEIGHT = HEIGHT * 0.02;
  BALL_RADIUS = WIDTH * 0.015;
  BLOCK_MARGIN = WIDTH * 0.015;
  BLOCK_HEIGHT = HEIGHT * 0.05;
  PADDLE_CENTER_WIDTH = PADDLE_WIDTH * 0.05;
}

// これらはletで宣言し、initializeCanvasAndConstantsで更新できるようにする
let WIDTH;
let HEIGHT;
let PADDLE_WIDTH;
let PADDLE_HEIGHT;
let BALL_RADIUS;
let BLOCK_MARGIN;
let BLOCK_HEIGHT;
let PADDLE_CENTER_WIDTH;


// --- ゲーム状態（変更なし） ---
let currentStage = 0;
let lives = 3;
let blocks = [];
let ball = { x:0, y:0, vx:0, vy:0 };
let paddle = { x:0 };
let gameState = "start"; // start, playing, clear, gameover
let info = document.getElementById("info");
let isPierceMode = false; // 貫通モード

// パドルを滑らかに動かすための目標位置
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
  paddle.x = (WIDTH - PADDLE_WIDTH)/2;
  targetPaddleX = paddle.x; // 目標位置も同じに設定

  ball.x = WIDTH/2;
  ball.y = HEIGHT - (PADDLE_HEIGHT + HEIGHT * 0.05);
  // 速度も相対的に調整
  ball.vx = 3 * (Math.random()<0.5?1:-1) * (WIDTH / 400);
  ball.vy = -4 * (HEIGHT / 600);
  isPierceMode = false;
  updateInfo();
}

function updateInfo() {
  info.innerHTML = `ステージ: ${currentStage+1}/${stages.length}　ライフ: ${lives}${isPierceMode ? "　<貫通モード！>" : ""}`;
}

// --- ゲームループ（変更なし） ---
function update() {
  if(gameState !== "playing") return;

  // パドルの動きを滑らかにするロジック
  paddle.x += (targetPaddleX - paddle.x) * PADDLE_SMOOTHING;
  paddle.x = Math.max(0, Math.min(WIDTH - PADDLE_WIDTH, paddle.x));


  // ボール移動
  ball.x += ball.vx;
  ball.y += ball.vy;
  // 壁反射
  if(ball.x < BALL_RADIUS){ ball.x = BALL_RADIUS; ball.vx *= -1; }
  if(ball.x > WIDTH-BALL_RADIUS){ ball.x = WIDTH-BALL_RADIUS; ball.vx *= -1; }
  if(ball.y < BALL_RADIUS){ ball.y = BALL_RADIUS; ball.vy *= -1; }

  // パドル反射
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
// マウスイベントを追加（PC用）
document.addEventListener("mousemove", e => {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (!isMobile) { // モバイルでない場合のみマウスを有効に
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    targetPaddleX = x - PADDLE_WIDTH/2;
  }
});

// タッチイベント（スマホ用）
document.addEventListener("touchstart", e => {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (isMobile) { // モバイルの場合のみタッチを有効に
    let rect = canvas.getBoundingClientRect();
    let x = e.touches[0].clientX - rect.left;
    targetPaddleX = x - PADDLE_WIDTH/2;
  }
}, { passive: false });

document.addEventListener("touchmove", e => {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (isMobile) { // モバイルの場合のみタッチを有効に
    let rect = canvas.getBoundingClientRect();
    let x = e.touches[0].clientX - rect.left;
    targetPaddleX = x - PADDLE_WIDTH/2;
  }
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

// --- ゲーム開始 ---
// 初期化関数を呼び出す
initializeCanvasAndConstants();
setupStage();
gameLoop();

// --- Handle window resize for responsiveness ---
window.addEventListener('resize', () => {
    // リサイズ時にキャンバスサイズと比例定数を再計算
    initializeCanvasAndConstants();
    setupStage(); // ステージとボール・パドルを再セットアップ
});
