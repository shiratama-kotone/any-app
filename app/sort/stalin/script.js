/* script.js 完全版 */

(function(){
var inputArea = document.getElementById('inputArray');
var renderBtn = document.getElementById('renderBtn');
var startBtn = document.getElementById('startBtn');
var resetBtn = document.getElementById('resetBtn');
var speedSlider = document.getElementById('speed');
var chart = document.getElementById('chart');
var ascCheckbox = document.getElementById('ascCheckbox');

var originalArray = [];
var isSorting = false;

function sleep(ms){ return new Promise(res=>setTimeout(res, ms)); }

function parseInput(text){
var items = text.trim().split(/[\t,\s\n\r]+/);
var nums = [];
for(var i=0;i<items.length;i++){
var n = Number(items[i]);
if(!isNaN(n)) nums.push(n);
}
return nums;
}

function clearChart(){ chart.innerHTML = ''; }

function renderBars(arr){
clearChart();
if(arr.length===0){
chart.innerHTML='<div style="opacity:0.6">配列が空です</div>';
return;
}
var max = Math.max.apply(null, arr.map(Math.abs));
if(max===0) max=1;
arr.forEach(v=>{
var bar=document.createElement('div');
bar.className='bar';
bar.dataset.value=String(v);
var h=Math.abs(v)/max*100;
if(h<4)h=4;
bar.style.height=h+'%';
var label=document.createElement('span');
label.textContent=v;
bar.appendChild(label);
chart.appendChild(bar);
});
}

async function stalinSortAnimate(ascending, delay){
isSorting=true;
startBtn.disabled=true; renderBtn.disabled=true; resetBtn.disabled=true;

```
var bars=chart.querySelectorAll('.bar');
if(!bars.length){ isSorting=false; return; }

bars[0].classList.add('keep');
var lastValue=Number(bars[0].dataset.value);
var i=1;

while(true){
  bars=chart.querySelectorAll('.bar');
  if(i>=bars.length) break;
  var bar=bars[i];
  bar.style.transform='translateY(-4px) scale(1.01)';
  await sleep(delay/3);
  var val=Number(bar.dataset.value);
  var cmp=ascending?(val>=lastValue):(val<=lastValue);

  if(cmp){
    bar.classList.add('keep');
    lastValue=val;
    bar.style.transform='translateY(-8px) scale(1.02)';
    await sleep(delay);
    i++;
  }else{
    bar.classList.add('remove');
    void bar.offsetWidth;
    bar.classList.add('removing');
    await sleep(delay);
    bar.remove();
  }
  chart.querySelectorAll('.bar').forEach(b=>b.style.transform='');
}

// 完了アニメ
var finalBars=chart.querySelectorAll('.bar.keep');
for(var j=0;j<finalBars.length;j++){
  finalBars[j].style.transform='translateY(-10px) scale(1.03)';
  await sleep(25);
}

isSorting=false;
startBtn.disabled=false; renderBtn.disabled=false; resetBtn.disabled=false;
```

}

renderBtn.addEventListener('click',()=>{
if(isSorting)return;
originalArray=parseInput(inputArea.value);
renderBars(originalArray);
});

startBtn.addEventListener('click',()=>{
if(isSorting)return;
if(!chart.querySelectorAll('.bar').length){
originalArray=parseInput(inputArea.value);
renderBars(originalArray);
}
stalinSortAnimate(ascCheckbox.checked, Number(speedSlider.value));
});

resetBtn.addEventListener('click',()=>{
if(isSorting)return;
renderBars(originalArray);
});

// 初期
inputArea.value='3,1,4,1,5,9,2,6,5';
renderBtn.click();
})();
