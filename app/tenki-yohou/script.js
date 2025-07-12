document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const getWeatherBtn = document.getElementById('get-weather-btn');
    const weatherInfoDiv = document.getElementById('weather-info');
    const errorMessageDiv = document.getElementById('error-message');

    // 地域コードのマップを保持する変数
    let areaCodes = {};

    // primary_area.xml から地域コードを読み込む
    function loadAreaCodes() {
        return fetch('https://weather.tsukumijima.net/primary_area.xml')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(str => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(str, "application/xml");
                const areas = xmlDoc.getElementsByTagName('area');
                for (let i = 0; i < areas.length; i++) {
                    const id = areas[i].getAttribute('id');
                    const title = areas[i].getAttribute('title');
                    // title の '地方' や '県' を取り除いて、地域名とコードを紐付ける
                    const cleanedTitle = title.replace(/地方$/, '').replace(/県$/, '');
                    areaCodes[cleanedTitle] = id;
                }
                console.log("地域コードが読み込まれました:", areaCodes);
            })
            .catch(error => {
                console.error("地域コードの読み込みに失敗しました:", error);
                errorMessageDiv.textContent = "地域データの読み込みに失敗しました。";
            });
    }

    // 天気情報を取得して表示する関数
    function fetchWeather(cityCode) {
        const API_URL = `https://weather.tsukumijima.net/api/forecast/city/${cityCode}`;
        weatherInfoDiv.innerHTML = '<p>天気情報を読み込み中...</p>';
        errorMessageDiv.textContent = ''; // エラーメッセージをクリア

        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data); // 取得したデータをコンソールで確認

                let htmlContent = `
                    <h2>${data.title}</h2>
                    <p><strong>発表時刻:</strong> ${data.publicTimeFormatted}</p>
                    <p><strong>発表機関:</strong> ${data.publishingOffice}</p>
                    <p class="description-text">${data.description.bodyText.replace(/\n/g, '<br>')}</p>
                    <h3>週間予報</h3>
                `;

                data.forecasts.forEach(forecast => {
                    let minTemp = forecast.temperature.min.celsius ? `${forecast.temperature.min.celsius}°C` : '--';
                    let maxTemp = forecast.temperature.max.celsius ? `${forecast.temperature.max.celsius}°C` : '--';

                    let chanceOfRainHtml = '';
                    if (forecast.chanceOfRain) {
                        chanceOfRainHtml += '<p class="chance-of-rain"><strong>降水確率:</strong> ';
                        const rainTimes = [];
                        for (const timeKey in forecast.chanceOfRain) {
                            const period = timeKey.replace('T00_06', '00-06時')
                                                  .replace('T06_12', '06-12時')
                                                  .replace('T12_18', '12-18時')
                                                  .replace('T18_24', '18-24時');
                            rainTimes.push(`<span class="rain-time">${period}: ${forecast.chanceOfRain[timeKey]}</span>`);
                        }
                        chanceOfRainHtml += rainTimes.join(' ');
                        chanceOfRainHtml += '</p>';
                    }

                    htmlContent += `
                        <div class="forecast-day">
                            <img src="${forecast.image.url}" alt="${forecast.image.title}">
                            <div class="forecast-details">
                                <h2>${forecast.dateLabel} (${forecast.date})</h2>
                                <p><strong>天気:</strong> ${forecast.telop}</p>
                                <p><strong>詳細:</strong> ${forecast.detail.weather}</p>
                                <p><strong>風:</strong> ${forecast.detail.wind}</p>
                                <p><strong>波:</strong> ${forecast.detail.wave}</p>
                                <p><strong>気温:</strong> <span class="min-temp">${minTemp}</span> / <span class="temperature">${maxTemp}</span></p>
                                ${chanceOfRainHtml}
                            </div>
                        </div>
                    `;
                });

                weatherInfoDiv.innerHTML = htmlContent;
            })
            .catch(error => {
                console.error('天気情報の取得中にエラーが発生しました:', error);
                weatherInfoDiv.innerHTML = '<p>天気情報を取得できませんでした。時間をおいて再度お試しください。</p>';
                errorMessageDiv.textContent = '天気情報の取得に失敗しました。';
            });
    }

    // 「天気を取得」ボタンのクリックイベント
    getWeatherBtn.addEventListener('click', () => {
        const inputCity = cityInput.value.trim(); // 前後の空白を削除
        if (!inputCity) {
            errorMessageDiv.textContent = '　　地　　域　　名　　を　　入　　力　　し　　て　　く　　だ　　さ　　い　　';
            weatherInfoDiv.innerHTML = '';
            return;
        }

        const cityCode = areaCodes[inputCity]; // 入力された地域名に対応するコードを検索

        if (cityCode) {
            fetchWeather(cityCode);
        } else {
            errorMessageDiv.textContent = '　　存　　在　　し　　ま　　せ　　ん　　';
            weatherInfoDiv.innerHTML = ''; // 既存の天気情報をクリア
        }
    });

    // ページロード時に地域コードを読み込む
    loadAreaCodes().then(() => {
        // 初期表示として、福岡の天気を表示することも可能 (オプション)
        // const fukuokaCode = areaCodes['福岡'];
        // if (fukuokaCode) {
        //     fetchWeather(fukuokaCode);
        // }
    });
});
