document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('image-upload');
    const maskedImage = document.querySelector('.masked-image');

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result;
                // マスク画像を適用
                maskedImage.style.webkitMaskImage = `url('${imageUrl}')`;
                maskedImage.style.maskImage = `url('${imageUrl}')`;
                maskedImage.style.maskSize = 'contain';
                maskedImage.style.maskRepeat = 'no-repeat';
                maskedImage.style.maskPosition = 'center';
            };
            reader.readAsDataURL(file);
        }
    });
});
