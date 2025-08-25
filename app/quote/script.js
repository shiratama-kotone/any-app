let userImage = null;

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('quoteCanvas');
    const ctx = canvas.getContext('2d');
    const imageUpload = document.getElementById('imageUpload');
    const imageURLInput = document.getElementById('imageURL');
    const quoteText = document.getElementById('quoteText');
    const authorText = document.getElementById('authorText');
    const downloadButton = document.getElementById('downloadButton');
    const dropArea = document.getElementById('dropArea');

    // キャンバスサイズ 幅4000, 高さ2000
    const CANVAS_WIDTH = 4000;
    const CANVAS_HEIGHT = 2000;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // 左半分サイズ（正方形 2000x2000）
    const HALF_SIZE = 2000;

    // 画像ファイル読込
    const loadImageFromFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                userImage = new Image();
                userImage.src = event.target.result;
                userImage.onload = () => drawCanvas();
                userImage.onerror = () => {
                    userImage = null;
                    drawCanvas();
                    alert('ファイルの読み込みに失敗しました。');
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const loadImageFromURL = (url) => {
        userImage = new Image();
        userImage.crossOrigin = 'anonymous';
        userImage.src = url;
        userImage.onload = () => drawCanvas();
        userImage.onerror = () => {
            userImage = null;
            drawCanvas();
            alert('画像の読み込みに失敗しました。URLが正しいか、CORSの問題がないか確認してください。');
        };
    };

    imageUpload.addEventListener('change', (e) => {
        loadImageFromFile(e.target.files[0]);
    });
    imageURLInput.addEventListener('input', (e) => {
        if (imageURLInput.value) {
            loadImageFromURL(imageURLInput.value);
        }
    });
    imageURLInput.addEventListener('paste', (e) => {
        const url = e.clipboardData.getData('text');
        if (url) {
            e.preventDefault();
            imageURLInput.value = url;
            loadImageFromURL(url);
        }
    });
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('active');
    });
    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('active');
    });
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('active');
        const file = e.dataTransfer.files[0];
        loadImageFromFile(file);
    });
    quoteText.addEventListener('input', drawCanvas);
    authorText.addEventListener('input', drawCanvas);

    function drawCanvas() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 右半分（正方形2000x2000）を黒で塗りつぶし
        ctx.fillStyle = "#000";
        ctx.fillRect(HALF_SIZE, 0, HALF_SIZE, CANVAS_HEIGHT);

        // 左半分（正方形2000x2000）に画像を最大限収めて描画（縦横比維持、右端が中央に合う）
        if (userImage && userImage.complete && userImage.naturalWidth > 0) {
            const imgW = userImage.naturalWidth;
            const imgH = userImage.naturalHeight;
            // スケールを計算（正方形に収める）
            const scale = Math.min(HALF_SIZE / imgW, CANVAS_HEIGHT / imgH);
            const drawWidth = imgW * scale;
            const drawHeight = imgH * scale;
            // 画像右端を中央（x=2000）に合わせる
            const xOffset = HALF_SIZE - drawWidth;
            // 上下中央
            const yOffset = (CANVAS_HEIGHT - drawHeight) / 2;
            ctx.drawImage(userImage, xOffset, yOffset, drawWidth, drawHeight);
        }

        // 左半分に横方向グラデーション（右端が黒、左端が透明、縦は全体）
        const gradient = ctx.createLinearGradient(
            HALF_SIZE, 0, // 右端（中央）から
            0, 0          // 左端へ
        );
        gradient.addColorStop(0, "rgba(0,0,0,1)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, HALF_SIZE, CANVAS_HEIGHT);
        ctx.restore();

        // テキスト（右半分中央）
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const quote = quoteText.value;
        const author = authorText.value;
        const quoteFontSize = Math.round(HALF_SIZE * 0.08);
        const authorFontSize = Math.round(HALF_SIZE * 0.04);
        ctx.font = `normal ${quoteFontSize}px 'Noto Sans JP', 'Yu Gothic', Arial, sans-serif`;
        const maxTextWidth = HALF_SIZE - 200;
        const textX = HALF_SIZE + HALF_SIZE / 2;
        let quoteLines = splitTextIntoLines(ctx, quote, maxTextWidth);
        let totalQuoteHeight = quoteLines.length * quoteFontSize;
        let quoteY = CANVAS_HEIGHT / 2 - (totalQuoteHeight / 2) + (author ? -authorFontSize : 0);

        quoteLines.forEach(line => {
            ctx.fillText(line, textX, quoteY);
            quoteY += quoteFontSize;
        });

        if (author) {
            ctx.font = `lighter ${authorFontSize}px 'Noto Sans JP', 'Yu Gothic', Arial, sans-serif`;
            const authorY = quoteY + authorFontSize;
            ctx.fillText(`- ${author}`, textX, authorY);
        }
    }

    function splitTextIntoLines(ctx, text, maxWidth) {
        if (!text) return [];
        const lines = [];
        let currentLine = '';
        for (let char of text) {
            let testLine = currentLine + char;
            let metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine.length > 0) {
                lines.push(currentLine);
                currentLine = char;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
    }

    downloadButton.addEventListener('click', () => {
        const link = document.createElement('a');
        let filename = quoteText.value.trim() || 'quote';
        filename = filename.replace(/[\\/:*?"<>|]/g, '');
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    drawCanvas();
});
