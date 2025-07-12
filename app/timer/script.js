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
 * Converts the input value from selected unit to total seconds.
 * @param {number} value The numerical value from the input.
 * @param {string} unit The selected unit ('seconds', 'minutes', 'hours').
 * @returns {number} The total seconds.
 */
function convertToSeconds(value, unit) {
    switch (unit) {
        case 'seconds':
            return value;
        case 'minutes':
            return value * 60;
        case 'hours':
            return value * 3600;
        default:
            return 0; // Should not happen with proper unit selection
    }
}

/**
 * Initializes the timer based on the currently active slider/input value and selected unit.
 * This function is now simplified as updateTimerSetting handles the primary logic.
 */
function initializeTimer() {
    // ページロード時に、一番上の設定（timer-input-1とtimer-unit）を使って初期化
    const initialInputValue = parseInt(document.getElementById("timer-input-1").value, 10);
    const initialUnit = document.getElementById("timer-unit").value;
    updateTimerSetting(initialInputValue, initialUnit, 1); // 1番目のタイマー設定を初期値として反映
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
            remainingSeconds = totalSeconds;
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
    remainingSeconds = totalSeconds; // Reset to the initially set total seconds
    updateTimerDisplay();
    document.getElementById("start-pause-button").textContent = "スタート";
    document.getElementById("start-pause-button").classList.remove("pause");
    document.getElementById("start-pause-button").classList.add("start");
}

/**
 * Updates the input field and totalSeconds when the slider or unit is moved.
 * This function also updates the totalSeconds and remainingSeconds based on the new value and unit.
 * @param {number} value The current value from the slider or input.
 * @param {string} unit The currently selected unit ('seconds', 'minutes', 'hours').
 * @param {number} index The index of the timer row (1, 2, or 3).
 */
function updateTimerSetting(value, unit, index) {
    // 関連する要素のIDを動的に取得
    const inputElement = document.getElementById(`timer-input-${index}`);
    const sliderElement = document.getElementById(`timer-slider-${index}`);
    const displayElement = document.getElementById(`slider-value-display-${index}`);
    
    // UIを更新
    if (inputElement) inputElement.value = value;
    if (sliderElement) sliderElement.value = value;
    if (displayElement) {
        displayElement.textContent = `${value} ${
            unit === 'seconds' ? '秒' : unit === 'minutes' ? '分' : '時間'
        }`;
    }
    
    // ここで、**メインのタイマー（totalSeconds/remainingSeconds）は、
    // 現在操作された行の値を反映するようにします。
    // （複数の独立したタイマーではないため、最後の操作が全体のタイマーに影響します）**
    totalSeconds = convertToSeconds(value, unit);
    remainingSeconds = totalSeconds;
    updateTimerDisplay(); // Display immediately
    
    clearInterval(countdownInterval); // Stop timer if running
    countdownInterval = null;
    document.getElementById("start-pause-button").textContent = "スタート";
    document.getElementById("start-pause-button").classList.remove("pause");
    document.getElementById("start-pause-button").classList.add("start");
}

// Event listeners for slider, input field, and unit selector
document.addEventListener("DOMContentLoaded", () => {
    // 各タイマー行のイベントリスナーを設定
    for (let i = 1; i <= 3; i++) {
        const timerSlider = document.getElementById(`timer-slider-${i}`);
        const timerInput = document.getElementById(`timer-input-${i}`);
        const displayLabel = document.getElementById(`slider-value-display-${i}`);

        // 初期表示設定 (各行のラベル)
        const initialValue = parseInt(timerInput.value, 10);
        const unit = document.getElementById("timer-unit").value;
        if (displayLabel) {
            displayLabel.textContent = `${initialValue} ${
                unit === 'seconds' ? '秒' : unit === 'minutes' ? '分' : '時間'
            }`;
        }
        
        // スライダーのイベントリスナー
        timerSlider.addEventListener("input", (event) => {
            const value = parseInt(event.target.value, 10);
            const currentUnit = document.getElementById("timer-unit").value;
            updateTimerSetting(value, currentUnit, i);
        });

        // 入力フィールドのイベントリスナー
        timerInput.addEventListener("change", (event) => {
            let value = parseInt(event.target.value, 10);
            if (isNaN(value) || value < 0) {
                value = 0; // Default to 0 or a sensible minimum
            }
            event.target.value = value; // Update input field to clean value
            const currentUnit = document.getElementById("timer-unit").value;
            updateTimerSetting(value, currentUnit, i);
        });
    }

    const timerUnit = document.getElementById("timer-unit"); // Get unit selector
    const startPauseButton = document.getElementById("start-pause-button");
    const resetButton = document.getElementById("reset-button");

    // 単位セレクタのイベントリスナー (変更されたら、現在アクティブな設定を再適用)
    timerUnit.addEventListener("change", (event) => {
        // 現在一番上の入力欄の値を取得して、単位変更を適用
        const value = parseInt(document.getElementById("timer-input-1").value, 10); 
        const unit = event.target.value;
        // 全ての表示を更新
        for (let i = 1; i <= 3; i++) {
            updateTimerSetting(value, unit, i);
        }
    });

    startPauseButton.addEventListener("click", toggleTimer);
    resetButton.addEventListener("click", resetTimer);

    // Initial timer display setup
    initializeTimer();
});
