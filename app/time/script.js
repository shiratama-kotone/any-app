var realtime = document.getElementById("realtime");
var dateDisplay = document.getElementById("date-display");
var ampmDisplay = document.getElementById("ampm-display");
var fontSelector = document.getElementById("font-select");
var analogCanvas = document.getElementById("analog-canvas");
var ctx = analogCanvas.getContext("2d");
var modeToggle = document.getElementById("toggle-mode");
var darkToggle = document.getElementById("toggle-dark");

var analogMode = false;

// フォント切替
fontSelector.addEventListener("change", function () {
  realtime.style.fontFamily = fontSelector.value;
  dateDisplay.style.fontFamily = fontSelector.value;
  ampmDisplay.style.fontFamily = fontSelector.value;
});

// モード切替（デジタル ↔ アナログ）
modeToggle.addEventListener("click", function () {
  analogMode = !analogMode;

  if (analogMode) {
    realtime.style.display = "none";
    document.getElementById("info-bottom").style.display = "none";
    analogCanvas.style.display = "block";

    // フォント選択を丸ごと非表示
    document.getElementById("font-wrapper").classList.add("hidden");

    modeToggle.textContent = "デジタルに変更";
  } else {
    realtime.style.display = "block";
    document.getElementById("info-bottom").style.display = "flex";
    analogCanvas.style.display = "none";

    // フォント選択復活
    document.getElementById("font-wrapper").classList.remove("hidden");

    modeToggle.textContent = "アナログに変更";
  }
});

// ダークモード切替（フェード付き）
darkToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");
});

// 時刻更新
function updateClock() {
  var now = new Date();
  var h = now.getHours();
  var m = now.getMinutes();
  var s = now.getSeconds();
  var ms = now.getMilliseconds();

  var displayH = h % 12 || 12;
  var ampm = h >= 12 ? "PM" : "AM";

  var timeStr =
    displayH.toString().padStart(2, "0") +
    ":" +
    m.toString().padStart(2, "0") +
    ":" +
    s.toString().padStart(2, "0");

  var dateStr =
    now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();

  if (!analogMode) {
    realtime.textContent = timeStr;
    dateDisplay.textContent = dateStr;
    ampmDisplay.textContent = ampm;
  }

  drawAnalog(h, m, s, ms);
  requestAnimationFrame(updateClock);
}

// アナログ時計描画
function drawAnalog(h, m, s, ms) {
  if (!analogMode) return;

  var width = (analogCanvas.width = analogCanvas.offsetWidth);
  var height = (analogCanvas.height = analogCanvas.offsetWidth);
  var r = width / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(r, r);

  // 外枠
  ctx.beginPath();
  ctx.arc(0, 0, r - 5, 0, Math.PI * 2);
  ctx.strokeStyle = getComputedStyle(document.body).color;
  ctx.lineWidth = 4;
  ctx.stroke();

  // 目盛（ズレ修正済）
  ctx.save();
  ctx.rotate(0);
  for (var i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.moveTo(0, -r + 5);
    ctx.lineTo(0, -r + (i % 5 === 0 ? 15 : 10));
    ctx.stroke();
    ctx.rotate(Math.PI / 30);
  }
  ctx.restore();

  // 時針・分針・秒針（スムーズ）
  var sec = (s + ms / 1000) * (Math.PI / 30);
  var min = (m + s / 60) * (Math.PI / 30);
  var hr = ((h % 12) + m / 60) * (Math.PI / 6);

  // 時針
  ctx.save();
  ctx.rotate(hr);
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, 10);
  ctx.lineTo(0, -r * 0.5);
  ctx.stroke();
  ctx.restore();

  // 分針
  ctx.save();
  ctx.rotate(min);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 15);
  ctx.lineTo(0, -r * 0.7);
  ctx.stroke();
  ctx.restore();

  // 秒針
  ctx.save();
  ctx.rotate(sec);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.lineTo(0, -r * 0.85);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

requestAnimationFrame(updateClock);
