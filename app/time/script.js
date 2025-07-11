function twoDigit(num) {
    let ret;
    if (num < 10)
        ret = "0" + num;
    else
        ret = num;
    return ret;
}

function showClock() {
    let nowTime = new Date();
    let nowHour = nowTime.getHours();
    let nowMin = twoDigit(nowTime.getMinutes());
    let nowSec = twoDigit(nowTime.getSeconds());
    let ampm = "";
    let displayHour = nowHour;

    // 午前/午後の判定と表示時間の調整 (12時間表示)
    if (nowHour === 0) { // 午前0時
        ampm = "午前";
        displayHour = 12; // 0時は12時として表示
    } else if (nowHour === 12) { // 正午
        ampm = "午後";
        displayHour = 12; // そのまま12時
    } else if (nowHour > 12) { // 午後1時以降
        ampm = "午後";
        displayHour = nowHour - 12;
    } else { // 午前1時〜午前11時
        ampm = "午前";
    }

    let timeMsg = displayHour + ":" + nowMin + ":" + nowSec;
    document.getElementById("realtime").innerHTML = timeMsg;
    document.getElementById("ampm-display").innerHTML = ampm;

    // 日付の表示 (例: 7月2日(水))
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    let nowMonth = nowTime.getMonth() + 1; // 月は0から始まるため+1
    let nowDay = nowTime.getDate();
    let nowWeekday = weekdays[nowTime.getDay()];
    let dateMsg = nowMonth + "月" + nowDay + "日(" + nowWeekday + ")";
    document.getElementById("date-display").innerHTML = dateMsg;
}

// 1秒ごとにshowClock関数を実行
setInterval(showClock, 1000);

// ページロード時に一度実行して初期表示
showClock();
