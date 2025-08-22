document.addEventListener('DOMContentLoaded', () => {
    const startStopButton = document.getElementById('startStopButton');
    const slots = document.querySelectorAll('.slot');
    const results = ['🍒', '🍋', '🔔', '🍉', '⭐', '7️⃣']; // ここに好きな結果を追加できます
    
    let isSpinning = false;
    let intervals = [];

    // スロットを回転させる関数
    function spinSlot(slotElement) {
        return setInterval(() => {
            const randomIndex = Math.floor(Math.random() * results.length);
            slotElement.textContent = results[randomIndex];
        }, 100); // 100ミリ秒ごとに絵柄を切り替える
    }

    // スロットの回転を止める関数
    function stopSlot(slotElement, intervalId) {
        clearInterval(intervalId);
        // 最終的な結果をランダムに決定
        const finalResult = results[Math.floor(Math.random() * results.length)];
        slotElement.textContent = finalResult;
    }

    startStopButton.addEventListener('click', () => {
        if (!isSpinning) {
            // スロットを開始
            startStopButton.textContent = 'ストップ';
            slots.forEach(slot => {
                const intervalId = spinSlot(slot);
                intervals.push(intervalId);
            });
            isSpinning = true;
        } else {
            // スロットを停止
            startStopButton.textContent = 'スタート';
            intervals.forEach((intervalId, index) => {
                // スロットごとに停止タイミングをずらす
                setTimeout(() => {
                    stopSlot(slots[index], intervalId);
                }, index * 500); // 0.5秒ずつずらして停止
            });
            intervals = [];
            isSpinning = false;
        }
    });
});
