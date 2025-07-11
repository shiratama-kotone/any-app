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
        document.getElementById("start-pause-button").textContent = "スタート";
        document.getElementById("start-pause-button").classList.remove("pause");
        document.getElementById("start-pause-button").classList.add("start");
        // Optionally, add a notification or sound when the timer finishes
    }
}

/**
 * Initializes the timer based on the slider/input value.
 * This function converts the input (minutes) to total seconds.
 */
function initializeTimer() {
    const minutes = parseInt(document.getElementById("timer-input").value, 10);
    totalSeconds = minutes * 60;
    remainingSeconds = totalSeconds;
    updateTimerDisplay();
    updateSlider(minutes); // Make sure the slider reflects the input
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
        if (remainingSeconds <= 0 && totalSeconds > 0) {
            // If timer finished, restart with the set duration
            remainingSeconds = totalSeconds;
        } else if (totalSeconds === 0) {
             // If timer is 0 initially, set a default or prompt user
             alert("タイマーを設定してください。");
             return;
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
 * Updates the input field when the slider is moved.
 * @param {number} value The current value of the slider (in minutes).
 */
function updateInput(value) {
    document.getElementById("timer-input").value = value;
    document.getElementById("slider-value-display").textContent = `${value} 分`;
    totalSeconds = value * 60; // Update totalSeconds when slider changes
    remainingSeconds = totalSeconds; // Reset remainingSeconds to new total
    updateTimerDisplay(); // Update display immediately
    clearInterval(countdownInterval); // Stop timer if running
    countdownInterval = null;
    document.getElementById("start-pause-button").textContent = "スタート";
    document.getElementById("start-pause-button").classList.remove("pause");
    document.getElementById("start-pause-button").classList.add("start");
}

/**
 * Updates the slider when the input field is changed.
 * @param {number} value The current value of the input field (in minutes).
 */
function updateSlider(value) {
    document.getElementById("timer-slider").value = value;
    document.getElementById("slider-value-display").textContent = `${value} 分`;
}

// Event listeners for slider and input field
document.addEventListener("DOMContentLoaded", () => {
    const timerSlider = document.getElementById("timer-slider");
    const timerInput = document.getElementById("timer-input");
    const startPauseButton = document.getElementById("start-pause-button");
    const resetButton = document.getElementById("reset-button");

    timerSlider.addEventListener("input", (event) => updateInput(parseInt(event.target.value, 10)));
    timerInput.addEventListener("change", (event) => {
        let value = parseInt(event.target.value, 10);
        if (isNaN(value) || value < 0) {
            value = 0; // Default to 0 or a sensible minimum
        }
        event.target.value = value; // Update input field to clean value
        updateSlider(value);
        initializeTimer(); // Re-initialize timer based on new input
    });
    startPauseButton.addEventListener("click", toggleTimer);
    resetButton.addEventListener("click", resetTimer);

    // Set initial timer value and display
    initializeTimer();
});
