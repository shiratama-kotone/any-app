// 保存キー
const STORAGE_KEY = "clicker_game_save3";
// サンプル画像
const SAMPLE_IMAGE = "https://github.com/shiratama-kotone/iroiro/blob/main/assets/sddefault.jpg";
// マウスカーソル画像
const CURSOR_IMAGE = "https://github.com/shiratama-kotone/iroiro/blob/main/assets/mouse_cursor_600.png";

// データ
let count = 0;
let clickValue = 1;
let clickUpgradeCost = 50;     // ←初期値50に変更
let supporterCount = 0;
let supporterCost = 100;       // ←初期値100に変更
let supporterAutoClick = 0; // 1秒ごとに増えるクリック数

// アニメーション用
let cursorRotationAngle = 0; // 現在の回転角度[rad]
let lastTimestamp = null;

// 要素取得
const scoreElem = document.getElementById("score");
const upgradeBtn = document.getElementById("upgrade-btn");
const supporterBtn = document.getElementById("supporter-btn");
const resetBtn = document.getElementById("reset-btn");
const clickImg = document.getElementById("click-img");
const gameArea = document.getElementById("game-area");

// 表示する追加テキスト要素
let infoElem = document.getElementById("info");
if (!infoElem) {
  infoElem = document.createElement("div");
  infoElem.id = "info";
  infoElem.className = "info";
  scoreElem.after(infoElem);
}

// 右クリック無効化
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

// 保存・読込
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    count, clickValue, clickUpgradeCost, supporterCount, supporterCost, supporterAutoClick
  }));
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (d) {
      count = d.count ?? 0;
      clickValue = d.clickValue ?? 1;
      clickUpgradeCost = d.clickUpgradeCost ?? 50; // 初期値50
      supporterCount = d.supporterCount ?? 0;
      supporterCost = d.supporterCost ?? 100;      // 初期値100
      supporterAutoClick = d.supporterAutoClick ?? supporterCount;
    }
  } catch {}
}

// 描画
function render() {
  scoreElem.textContent = `${count} Clicks`;
  upgradeBtn.textContent = `1click +1（強化する: ${clickUpgradeCost}）`;
  upgradeBtn.disabled = count < clickUpgradeCost;
  supporterBtn.innerHTML = `Click supporter 購入（${supporterCost}）<br><span style="font-size:16px;color:#fff9;font-weight:400;">カーソル: ${supporterCount}</span>`;
  supporterBtn.disabled = count < supporterCost;

  // 一クリックで増える数・一秒間に増える数の表示
  infoElem.innerHTML = `
    <span>1クリックで増える数：<b>${clickValue}</b></span><br>
    <span>1秒間に増える数：<b>${supporterAutoClick}</b></span>
  `;

  // カーソル描画
  [...gameArea.querySelectorAll(".cursor")].forEach(e => e.remove());
  if (supporterCount > 0) {
    const cx = 150, cy = 150, R = 162;
    for(let i=0;i<supporterCount&&i<50;i++){
      const baseAngle = 2 * Math.PI * i / 50 - Math.PI/2;
      const angle = baseAngle + cursorRotationAngle;
      const x = cx + R * Math.cos(angle) - 12;
      const y = cy + R * Math.sin(angle) - 12;
      const img = document.createElement("img");
      img.src = CURSOR_IMAGE;
      img.className = "cursor";
      img.style.left = x+"px";
      img.style.top = y+"px";
      img.width = img.height = 24;
      gameArea.appendChild(img);
    }
  }
}

// クリック
clickImg.onclick = ()=>{
  count += clickValue;
  save();
  render();
};

// アップグレード
upgradeBtn.onclick = ()=>{
  if(count >= clickUpgradeCost){
    count -= clickUpgradeCost;
    clickValue += 1;
    clickUpgradeCost += 50; // 50ずつ増える
    save();
    render();
  }
};

// サポーター
supporterBtn.onclick = ()=>{
  if(count >= supporterCost){
    count -= supporterCost;
    supporterCount += 1;
    supporterCost += 100; // 100ずつ増える
    supporterAutoClick = supporterCount; // supporterCount個分、1秒ごとに+1ずつ
    save();
    render();
  }
};

// リセット
resetBtn.onclick = ()=>{
  if(confirm("ゲームデータをリセットしますか？")){
    count = 0;
    clickValue = 1;
    clickUpgradeCost = 50; // リセット時も50
    supporterCount = 0;
    supporterCost = 100;   // リセット時も100
    supporterAutoClick = 0;
    save(); render();
  }
};

// 1秒ごとにサポーター分自動加算
setInterval(()=>{
  if(supporterAutoClick > 0){
    count += supporterAutoClick;
    save();
    render();
  }
}, 1000);

// カーソル回転アニメーション: 50秒で1周回転
function animateCursor(ts) {
  if (!lastTimestamp) lastTimestamp = ts;
  const elapsed = (ts - lastTimestamp) / 1000; // 経過秒数
  lastTimestamp = ts;
  // 50秒で2π回転なので
  const deltaAngle = (2 * Math.PI) / 50 * elapsed;
  cursorRotationAngle += deltaAngle;
  // 0～2πの範囲で管理
  if (cursorRotationAngle > 2 * Math.PI) cursorRotationAngle -= 2 * Math.PI;
  // カーソル再描画
  render();
  requestAnimationFrame(animateCursor);
}

// 初期化
load();
render();
requestAnimationFrame(animateCursor);
