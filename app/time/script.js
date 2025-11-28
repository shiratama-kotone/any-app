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
  var v = fontSelector.value;
  if (v === "default") {
    v = fontSelector.options[1].value; // 最初のフォント
  }

  realtime.style.fontFamily = v;
  dateDisplay.style.fontFamily = v;
  ampmDisplay.style.fontFamily = v;
});

// モード切替
modeToggle.addEventListener("click", function () {
  analogMode = !analogMode;

  if (analogMode) {
    realtime.style.display = "none";
    document.getElementById("info-bottom").style.display = "none";
    analogCanvas.style.display = "block";
    document.getElementById("font-wrapper").classList.add("hidden");
    modeToggle.textContent = "デジタルに変更";
  } else {
    realtime.style.display = "block";
    document.getElementById("info-bottom").style.display = "flex";
    analogCanvas.style.display = "none";
    document.getElementById("font-wrapper").classList.remove("hidden");
    modeToggle.textContent = "アナログに変更";
  }
});

// ダークモード
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

  // サイトタイトル更新
  document.title = "時計 - " + timeStr;

  drawAnalog(h, m, s, ms);
  requestAnimationFrame(updateClock);
}

// アナログ時計
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

  // 目盛
  ctx.save();
  ctx.rotate(0);
  for (var i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.moveTo(0, -r + 5);
    ctx.lineTo(0, -r + (i % 5 === 0 ? 15 : 10));
    ctx.strokeStyle = getComputedStyle(document.body).color;
    ctx.stroke();
    ctx.rotate(Math.PI / 30);
  }
  ctx.restore();

  // 針
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


// ファビコン時計
function updateFaviconClock() {
  var canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  var ctx = canvas.getContext("2d");

  var now = new Date();
  var sec = now.getSeconds();
  var min = now.getMinutes();
  var hour = now.getHours() % 12;

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, 64, 64);

  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(32, 32, 28, 0, Math.PI * 2);
  ctx.stroke();

  var hourAng = (hour + min / 60) * (Math.PI * 2 / 12);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(32, 32);
  ctx.lineTo(32 + Math.sin(hourAng) * 15, 32 - Math.cos(hourAng) * 15);
  ctx.stroke();

  var minAng = (min + sec / 60) * (Math.PI * 2 / 60);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(32, 32);
  ctx.lineTo(32 + Math.sin(minAng) * 22, 32 - Math.cos(minAng) * 22);
  ctx.stroke();

  var secAng = sec * (Math.PI * 2 / 60);
  ctx.strokeStyle = "#d00";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(32, 32);
  ctx.lineTo(32 + Math.sin(secAng) * 24, 32 - Math.cos(secAng) * 24);
  ctx.stroke();

  var url = canvas.toDataURL("image/png");
  var link = document.querySelector("link[rel='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = url;
}

setInterval(updateFaviconClock, 1000);
updateFaviconClock();

