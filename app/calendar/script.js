const HOLIDAY_API_URL = "https://holidays-jp.github.io/api/v1/date.json";
const anniversaries = [
  { month: 6, day: 3, label: "反省の誕生日" },
  { month: 6, day: 7, label: "七夕" },       // 7月7日
  { month: 6, day: 7, label: "作成日" },     // 7月7日
  { month: 1, day: 14, label: "バレンタインデー" },
  { month: 2, day: 3, label: "ひなまつり" },
  { month: 9, day: 30, label: "プロセカ周年"},
  { month: 10, day: 22, label: "いい夫婦の日" },
  { month: 11, day: 24, label: "クリスマス・イブ" },
  { month: 11, day: 25, label: "クリスマス" },
  { month: 11, day: 26, label: "ゆゆゆの誕生日"},
  // 必要に応じ追加
];

let holidays = {};
let holidaysLoaded = false;

function pad(n) { return n < 10 ? "0" + n : n; }
function dateKey(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }
function getAnniversaries(year, month, day) {
  return anniversaries.filter(a => a.month === month && a.day === day);
}
async function fetchHolidays() {
  if (holidaysLoaded) return holidays;
  const res = await fetch(HOLIDAY_API_URL);
  holidays = await res.json();
  holidaysLoaded = true;
  return holidays;
}

// URLから年月日を取得
function parseUrlDate() {
  const path = window.location.pathname;
  // /calendar直後の部分を抽出
  const match = path.match(/\/calendar(?:\/([\d]{4})(?:-([\d]{1,2})(?:-([\d]{1,2}))?)?)?/);
  if (!match) return {};
  const year = match[1] ? parseInt(match[1], 10) : undefined;
  const month = match[2] ? parseInt(match[2], 10) : undefined;
  const day = match[3] ? parseInt(match[3], 10) : undefined;
  if (year && month && day) {
    return { year, month: month - 1, day };
  } else if (year && month) {
    return { year, month: month - 1 };
  } else if (year) {
    return { year, month: 0 };
  }
  return {};
}
const urlDate = parseUrlDate();
let viewYear, viewMonth;
if (urlDate.year && typeof urlDate.month === "number") {
  viewYear = urlDate.year;
  viewMonth = urlDate.month;
} else {
  const current = new Date();
  viewYear = current.getFullYear();
  viewMonth = current.getMonth();
}

async function renderCalendar(year, month) {
  await fetchHolidays();
  const today = new Date();
  const tbody = document.getElementById("calendarBody");
  tbody.innerHTML = "";

  document.getElementById("calendarTitle").textContent = `${year}年${month + 1}月`;

  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 前月
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

  // 翌月
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  let day = 1 - startDay;
  for (let w = 0; w < 6; w++) {
    let tr = document.createElement("tr");
    for (let d = 0; d < 7; d++, day++) {
      let td = document.createElement("td");
      let cellYear, cellMonth, cellDay;
      let isCurrentMonth = false;

      if (day < 1) {
        // 前月
        cellYear = prevYear;
        cellMonth = prevMonth;
        cellDay = daysInPrevMonth + day;
        td.classList.add('outside-month');
      } else if (day > daysInMonth) {
        // 翌月
        cellYear = nextYear;
        cellMonth = nextMonth;
        cellDay = day - daysInMonth;
        td.classList.add('outside-month');
      } else {
        // 今月
        cellYear = year;
        cellMonth = month;
        cellDay = day;
        isCurrentMonth = true;
      }

      // 日付情報
      const isToday =
        cellYear === today.getFullYear() &&
        cellMonth === today.getMonth() &&
        cellDay === today.getDate();

      const dateStr = dateKey(cellYear, cellMonth, cellDay);
      const holidayLabel = holidays[dateStr];
      const annivs = getAnniversaries(cellYear, cellMonth, cellDay);

      // 色分け
      if (isCurrentMonth) {
        if (isToday) {
          td.classList.add("cell-today");
        } else if (holidayLabel) {
          td.classList.add("cell-holiday", "holiday");
        } else if (d === 0) {
          td.classList.add("cell-sunday", "sunday");
        } else if (d === 6) {
          td.classList.add("cell-saturday", "saturday");
        } else if (annivs.length) {
          td.classList.add("cell-anniversary", "anniversary");
        }
      }

      // 数字右上
      td.innerHTML = `<span class="day-number">${cellDay}</span>`;

      // ラベル（小さく左下、複数行対応）
      let labelHtml = `<div class="label-container">`;
      if (holidayLabel) {
        labelHtml += `<span class="holiday-label">${holidayLabel}</span>`;
      }
      if (annivs.length) {
        labelHtml += annivs.map(a =>
          `<span class="anniversary-label">${a.label}</span>`
        ).join('');
      }
      labelHtml += `</div>`;
      if (holidayLabel || annivs.length) td.innerHTML += labelHtml;

      // ポップアップラベル（中央、複数行対応）
      if (holidayLabel || annivs.length) {
        let popupHtml = `<div class="popup-label-container">`;
        if (holidayLabel) {
          popupHtml += `<span class="popup-label-holiday">${holidayLabel}</span>`;
        }
        if (annivs.length) {
          popupHtml += annivs.map(a =>
            `<span class="popup-label-anniversary">${a.label}</span>`
          ).join('');
        }
        popupHtml += `</div>`;
        td.innerHTML += popupHtml;
      }

      // ラベルがあるセルだけイベント付与
      if (holidayLabel || annivs.length) {
        td.classList.add('has-label');
        td.tabIndex = 0;
      }

      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  setupPopupEvents();
}

function setupPopupEvents() {
  // すべてのセルからactiveを外す
  function clearActive() {
    document.querySelectorAll("td.active").forEach(td => td.classList.remove("active"));
  }

  document.querySelectorAll("td.has-label").forEach(td => {
    // タップ/クリックで拡大
    td.onclick = e => {
      if (td.classList.contains("active")) {
        td.classList.remove("active");
        return;
      }
      clearActive();
      td.classList.add("active");
    };
    // キーボード対応
    td.onkeydown = e => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        td.click();
      }
    };
    // PCマウスホバー時はactiveを使わない
    td.onmouseenter = e => {
      if (window.matchMedia('(hover: hover)').matches) {
        td.classList.add("hovering");
      }
    };
    td.onmouseleave = e => {
      if (window.matchMedia('(hover: hover)').matches) {
        td.classList.remove("hovering");
        td.classList.remove("active");
      }
    };
  });
  // カレンダー外クリックでactive解除
  document.addEventListener("click", function (e) {
    if (!e.target.closest("td.has-label")) {
      document.querySelectorAll("td.active").forEach(td => td.classList.remove("active"));
    }
  });
}

document.getElementById("prevBtn").onclick = () => {
  if (viewMonth === 0) {
    viewYear--;
    viewMonth = 11;
  } else {
    viewMonth--;
  }
  renderCalendar(viewYear, viewMonth);
};
document.getElementById("nextBtn").onclick = () => {
  if (viewMonth === 11) {
    viewYear++;
    viewMonth = 0;
  } else {
    viewMonth++;
  }
  renderCalendar(viewYear, viewMonth);
};

renderCalendar(viewYear, viewMonth);
