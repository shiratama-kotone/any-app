document.addEventListener('DOMContentLoaded', () => {
    const startStopButton = document.getElementById('startStopButton');
    const slots = document.querySelectorAll('.slot');
    const results = ['🍒', '🍋', '🔔', '🍉', '⭐', '7️⃣']; // ここに好きな結果を追加できます
    
    let isSpinning = false;

    // スロットの回転を開始する関数
    function startSpinning() {
        startStopButton.textContent = 'ストップ';
        slots.forEach(slot => {
            slot.classList.add('spinning');
            slot.classList.remove('stop-animation');
        });
        isSpinning = true;
    }

    // スロットの回転を止める関数
    function stopSpinning() {
        startStopButton.textContent = 'スタート';
        slots.forEach((slot, index) => {
            // スロットごとに停止タイミングをずらす
            setTimeout(() => {
                slot.classList.remove('spinning');
                
                // 最終的な結果をランダムに決定し、スロットの位置を調整
                const finalResultIndex = Math.floor(Math.random() * results.length);
                const itemHeight = 100; // スロット1つ分の高さ
                const totalHeight = results.length * itemHeight;

                // 停止位置を計算
                // 絵柄の位置を正確に合わせるための計算です
                const finalPosition = (finalResultIndex / results.length) * 100;
                
                // transformを使って位置を固定
                slot.style.transform = `translateY(-${finalPosition}%)`;

                slot.classList.add('stop-animation');
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
