document.addEventListener('DOMContentLoaded', () => {
    const startStopButton = document.getElementById('startStopButton');
    const slots = document.querySelectorAll('.slot');
    const results = ['🍒', '🍋', '🔔', '🍉', '⭐', '7️⃣'];
    const itemHeight = 100; // 各絵柄の高さ (CSSの.slotのheightと合わせる)

    let isSpinning = false;

    function startSpinning() {
        startStopButton.textContent = 'ストップ';
        slots.forEach(slot => {
            // 回転アニメーションを開始
            slot.classList.add('spinning');
        });
        isSpinning = true;
    }

    function stopSpinning() {
        startStopButton.textContent = 'スタート';
        slots.forEach((slot, index) => {
            setTimeout(() => {
                // 回転アニメーションを停止
                slot.classList.remove('spinning');

                // 最終結果をランダムに決定
                const finalResultIndex = Math.floor(Math.random() * results.length);
                const stopPosition = finalResultIndex * itemHeight;

                // スムーズな停止演出
                slot.style.transition = 'transform 1s cubic-bezier(0.25, 0.1, 0.25, 1)'; // 停止時のアニメーションを滑らかに
                slot.style.transform = `translateY(-${stopPosition}px)`;
            }, index * 500); // 0.5秒ずつずらして停止
        });
        isSpinning = false;
    }

    startStopButton.addEventListener('click', () => {
        if (!isSpinning) {
            startSpinning();
        } else {
            stopSpinning();
        }
    });
});
