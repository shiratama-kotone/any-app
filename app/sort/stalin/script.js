/* script.js */
/* 使い方（簡潔）

1. スプレッドシートから列をコピーしてテキストエリアにペースト（またはカンマ区切りで入力）
2. 「表示」を押すと棒グラフを描画
3. 「ソート開始」でスターリンソートのアニメーションが始まる
4. 速度はスライダーで調整（小さいほど速い）
   */

(function(){
// DOM
var inputArea = document.getElementById('inputArray');
var renderBtn = document.getElementById('renderBtn');
var startBtn = document.getElementById('startBtn');
var resetBtn = document.getElementById('resetBtn');
var speedSlider = document.getElementById('speed');
var chart = document.getElementById('chart');
var ascCheckbox = document.getElementById('ascCheckbox');

// State
var originalArray = [];
var currentArray = [];
var isSorting = false;

// ヘルパー
function sleep(ms){ return new Promise(function(res){ setTimeout(res, ms); }); }

function parseInput(text){
// スプレッドシートのコピペやカンマ・スペース・改行を許可
var items = text.trim().split(/[\t,\s\n\r]+/);
var nums = [];
for(var i=0;i<items.length;i++){
var s = items[i].replace(/,/g,'').trim();
if(s === '') continue;
var n = Number(s);
if(!isNaN(n)) nums.push(n);
}
return nums;
}

function clearChart(){
chart.innerHTML = '';
}

function renderBars(arr){
clearChart();
if(arr.length === 0){
chart.innerHTML = '<div style="opacity:0.6">配列が空です。数値を入力して「表示」してね。</div>';
return;
}
// scale by max
var max = Math.max.apply(null, arr.map(Math.abs));
if(max === 0) max = 1;
for(var i=0;i<arr.length;i++){
var v = arr[i];
var bar = document.createElement('div');
bar.className = 'bar';
bar.dataset.value = String(v);
// 高さ: 比率で設定（最大 100% に合わせる）
var heightPercent = Math.abs(v) / max * 100;
// 最低高さを確保
if(heightPercent < 4) heightPercent = 4;
bar.style.height = heightPercent + '%';
var label = document.createElement('span');
label.textContent = v;
bar.appendChild(label);
chart.appendChild(bar);
}
}

function snapshotCurrent(){
// DOM から currentArray を構築（値そのまま）
var bars = chart.querySelectorAll('.bar');
var arr = [];
for(var i=0;i<bars.length;i++){
arr.push(Number(bars[i].dataset.value));
}
return arr;
}

async function stalinSortAnimate(ascending, delay){
isSorting = true;
startBtn.disabled = true;
renderBtn.disabled = true;
resetBtn.disabled = true;

```
var bars = chart.querySelectorAll('.bar');
if(bars.length === 0){ isSorting = false; startBtn.disabled=false; renderBtn.disabled=false; resetBtn.disabled=false; return; }

// We'll operate on bars NodeList snapshot; but remove DOM nodes as needed.
var lastIndex = 0;
// mark first as kept
bars[0].classList.add('keep');

// lastValue for comparison
var lastValue = Number(bars[0].dataset.value);

// iterate from i=1 to end. Because we remove elements, use a while with index
var i = 1;
while(true){
  bars = chart.querySelectorAll('.bar');
  if(i >= bars.length) break;
  var bar = bars[i];
  bar.classList.add('active'); // optional visual (we'll rely on transitions)
  // tiny highlight
  bar.style.transform = 'translateY(-4px) scale(1.01)';
  await sleep(Math.max(20, delay/3));

  var val = Number(bar.dataset.value);
  var cmp = ascending ? (val >= lastValue) : (val <= lastValue);

  if(cmp){
    // keep
    bar.classList.remove('active');
    bar.classList.add('keep');
    lastValue = val;
    // small bounce to show kept
    bar.style.transform = 'translateY(-8px) scale(1.02)';
    await sleep(delay);
    i++; // move forward
  } else {
    // remove this element (スターリン: 排除)
    bar.classList.remove('active');
    bar.classList.add('remove');
    // animate removal by setting .removing which collapses height & fade
    // first force reflow to ensure CSS transition applies
    void bar.offsetWidth;
    bar.classList.add('removing');
    // wait for transition end (use delay * 0.9 as fallback)
    await sleep(Math.max(80, Math.min(delay + 120, 600)));
    // remove from DOM
    if(bar.parentNode) bar.parentNode.removeChild(bar);
    // do NOT increment i, because after removal next element shifts into index i
    // keep lastValue unchanged
    // small pause to show deletion
    await sleep(Math.max(30, delay/4));
  }
  // reset transforms on remaining bars for neatness
  var bs = chart.querySelectorAll('.bar');
  for(var k=0;k<bs.length;k++){
    bs[k].style.transform = '';
  }
}

// 完了時にちょっと演出
var finalBars = chart.querySelectorAll('.bar.keep');
for(var j=0;j<finalBars.length;j++){
  finalBars[j].style.transform = 'translateY(-10px) scale(1.03)';
  await sleep(25);
}

isSorting = false;
startBtn.disabled = false;
renderBtn.disabled = false;
resetBtn.disabled = false;
```

}

// イベント
renderBtn.addEventListener('click', function(){
if(isSorting) return;
var nums = parseInput(inputArea.value);
originalArray = nums.slice();
currentArray = nums.slice();
renderBars(nums);
});

startBtn.addEventListener('click', function(){
if(isSorting) return;
// if chart empty, try parse & render first
if(!chart.querySelectorAll('.bar').length){
var nums = parseInput(inputArea.value);
originalArray = nums.slice();
currentArray = nums.slice();
renderBars(nums);
}
var delay = Number(speedSlider.value) || 400;
var asc = !!ascCheckbox.checked;
stalinSortAnimate(asc, delay);
});

resetBtn.addEventListener('click', function(){
if(isSorting) return;
// restore original array in input if available
currentArray = originalArray.slice();
renderBars(currentArray);
});

// 初期データサンプル
inputArea.value = '3, 1, 4, 1, 5, 9, 2, 6, 5';
// 自動レンダリング（ロード時）
renderBtn.click();

})();
