// Global variables for timer functionality
let countdownInterval;
let totalSeconds = 0; // The total seconds for the timer
let remainingSeconds = 0; // The currently remaining seconds

/**
 * Ensures a number is always two digits by prepending a "0" if it's less than 10.
 * @param {number} num The number to format.
 * @returns {string} The two-digit formatted number.
 */
function twoDigit(num) {
    return num < 10 ? "0" + num : "" + num; // Convert to string for consistency
}

/**
 * Plays a series of beep sounds at a specific frequency.
 * @param {number} frequency The frequency of the beep in Hz.
 * @param {number} beepDuration The duration of each individual beep in milliseconds.
 * @param {number} intervalDuration The interval between beeps in milliseconds.
 * @param {number} count The number of beeps to play.
 */
function playBeepSeries(frequency = 1200, beepDuration = 100, intervalDuration = 250, count = 4) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
        console.warn("Web Audio API is not supported in this browser.");
        return;
    }

    let beepCount = 0;
    const seriesInterval = setInterval(() => {
        if (beepCount >= count) {
            clearInterval(seriesInterval);
            return;
        }

        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + beepDuration / 1000); // Stop after beepDuration

        beepCount++;
    }, intervalDuration); // Interval between the start of each beep
}


/**
 * Updates the display with the remaining time.
 */
function updateTimerDisplay() {
    if (remainingSeconds < 0) {
        remainingSeconds = 0; // Ensure it doesn't go negative
    }

    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    const timeMsg = `${twoDigit(hours)}:${twoDigit(minutes)}:${twoDigit(seconds)}`;
    document.getElementById("realtime").innerHTML = timeMsg;

    if (remainingSeconds <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null; // Clear interval reference
        document.getElementById("start-pause-button").textContent = "スタート";
        document.getElementById("start-pause-button").classList.remove("pause");
        document.getElementById("start-pause-button").classList.add("start");
        
        // タイマー終了時に1200Hzの方形波を1秒に4回鳴らす
        playBeepSeries(1200, 100, 250, 4); 
    }
}

/**
 * Calculates total seconds from hours, minutes, and seconds input.
 * @param {number} hours Hours value.
 * @param {number} minutes Minutes value.
 * @param {number} seconds Seconds value.
 * @returns {number} Total seconds.
 */
function calculateTotalSeconds(hours, minutes, seconds) {
    return (hours * 3600) + (minutes * 60) + seconds;
}

/**
 * Initializes the timer based on the current input values for hours, minutes, and seconds.
 */
function initializeTimer() {
    const hours = parseInt(document.getElementById("timer-input-hours").value, 10);
    const minutes = parseInt(document.getElementById("timer-input-minutes").value, 10);
    const seconds = parseInt(document.getElementById("timer-input-seconds").value, 10);

    totalSeconds = calculateTotalSeconds(hours, minutes, seconds);
    remainingSeconds = totalSeconds;
    updateTimerDisplay();
}

/**
 * Starts or pauses the timer.
 */
function toggleTimer() {
    const button = document.getElementById("start-pause-button");
    if (countdownInterval) { // If timer is running (interval exists)
        clearInterval(countdownInterval);
        countdownInterval = null;
        button.textContent = "スタート";
        button.classList.remove("pause");
        button.classList.add("start");
    } else { // If timer is paused or not started
        if (totalSeconds === 0 && remainingSeconds === 0) { // If timer is 0 initially or finished
            alert("タイマーを設定してください。");
            return;
        }
        if (remainingSeconds <= 0) { // If timer finished, restart with the set duration
            initializeTimer(); // Re-initialize from current input values
        }
        
        countdownInterval = setInterval(() => {
            remainingSeconds--;
            updateTimerDisplay();
        }, 1000);
        button.textContent = "ポーズ";
        button.classList.remove("start");
        button.classList.add("pause");
    }
}

/**
 * Resets the timer to the initial set duration.
 */
function resetTimer() {
    clearInterval(countdownInterval);
    countdownInterval = null;
    initializeTimer(); // Reset to the initially set total seconds
    document.getElementById("start-pause-button").textContent = "スタート";
    document.getElementById("start-pause-button").classList.remove("pause");
    document.getElementById("start-pause-button").classList.add("start");
}

/**
 * Updates the input field, slider, and display label for a specific unit (hours, minutes, or seconds).
 * Then recalculates and updates the main timer's total seconds.
 * @param {string} unitType The type of unit ('hours', 'minutes', 'seconds').
 * @param {number} value The current value from the slider or input.
 */
function updateUnitSetting(unitType, value) {
    const inputElement = document.getElementById(`timer-input-${unitType}`);
    const sliderElement = document.getElementById(`timer-slider-${unitType}`);
    const displayElement = document.getElementById(`slider-value-display-${unitType}`);
    
    // UIを更新
    if (inputElement) inputElement.value = value;
    if (sliderElement) sliderElement.value = value;
    if (displayElement) {
        let labelText = "";
        if (unitType === 'hours') labelText = "時間";
        else if (unitType === 'minutes') labelText = "分";
        else if (unitType === 'seconds') labelText = "秒";
        displayElement.textContent = `${value} ${labelText}`;
    }
    
    // 全ての入力値を取得してtotalSecondsを更新
    const currentHours = parseInt(document.getElementById("timer-input-hours").value, 10) || 0;
    const currentMinutes = parseInt(document.getElementById("timer-input-minutes").value, 10) || 0;
    const currentSeconds = parseInt(document.getElementById("timer-input-seconds").value, 10) || 0;

    totalSeconds = calculateTotalSeconds(currentHours, currentMinutes, currentSeconds);
    remainingSeconds = totalSeconds;
    updateTimerDisplay(); // Display immediately
    
    clearInterval(countdownInterval); // Stop timer if running
    countdownInterval = null;
    document.getElementById("start-pause-button").textContent = "スタート";
    document.getElementById("start-pause-button").classList.remove("pause");
    document.getElementById("start-pause-button").classList.add("start");
}

// Event listeners for slider and input fields
document.addEventListener("DOMContentLoaded", () => {
    const units = ['hours', 'minutes', 'seconds'];
    
    units.forEach(unitType => {
        const timerSlider = document.getElementById(`timer-slider-${unitType}`);
        const timerInput = document.getElementById(`timer-input-${unitType}`);
        const displayLabel = document.getElementById(`slider-value-display-${unitType}`);

        // 初期表示設定 (各行のラベル)
        const initialValue = parseInt(timerInput.value, 10);
        if (displayLabel) {
            let labelText = "";
            if (unitType === 'hours') labelText = "時間";
            else if (unitType === 'minutes') labelText = "分";
            else if (unitType === 'seconds') labelText = "秒";
            displayLabel.textContent = `${initialValue} ${labelText}`;
        }
        
        // スライダーのイベントリスナー
        timerSlider.addEventListener("input", (event) => {
            const value = parseInt(event.target.value, 10);
            updateUnitSetting(unitType, value);
        });

        // 入力フィールドのイベントリスナー
        timerInput.addEventListener("change", (event) => {
            let value = parseInt(event.target.value, 10);
            // 単位に応じた最大値チェック
            let maxVal = 0;
            if (unitType === 'hours') maxVal = 23;
            else if (unitType === 'minutes') maxVal = 59;
            else if (unitType === 'seconds') maxVal = 59;

            if (isNaN(value) || value < 0) {
                value = 0; // デフォルトを0に
            } else if (value > maxVal) {
                value = maxVal; // 最大値を超えたら最大値に制限
            }
            event.target.value = value; // 入力フィールドの値をクリーンアップされた値に更新
            updateUnitSetting(unitType, value);
        });
    });

    const startPauseButton = document.getElementById("start-pause-button");
    const resetButton = document.getElementById("reset-button");

    startPauseButton.addEventListener("click", toggleTimer);
    resetButton.addEventListener("click", resetTimer);

    // Initial timer display setup
    initializeTimer();
});
