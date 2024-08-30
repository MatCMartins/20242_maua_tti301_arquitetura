const dotenv = require('dotenv');
const input = require('input');
dotenv.config();
const axios = require('axios');

(async () => {
    const { PROTOCOL, BASE_URL, APP_ID, CNT, UNITS, IDIOM } = process.env;

    const cidade = await input.text('Cidade: ');

    const url = `${PROTOCOL}://${BASE_URL}?q=${cidade}&appid=${APP_ID}&cnt=${CNT}&units=${UNITS}&lang=${IDIOM}`;

    await axios.get(url)
        .then(async res => {
            return res.data;
        })
        .then(res => {
            console.log(`CNT: ${res.cnt}`);
            return res;
        })
        .then(async res => {
            for (let previsao of res['list']) {
                let data = new Date(previsao.dt * 1000);
                let tempMin = previsao.main.temp_min;
                let tempMax = previsao.main.temp_max;
                let feelsLike = previsao.main.feels_like;
                let description = previsao.weather[0].description;
                console.log(`
                    data: ${data.toLocaleString()}
                    temp min: ${tempMin}\u00B0
                    temp max: ${tempMax}\u00B0
                    description: ${description}
                    feels like: ${feelsLike}
                `);
            }
            return res.list;
        })
        .then(res => {
            const totalFilter = res.filter((previsao) => +previsao.main.feels_like > 20).length;
            console.log(totalFilter);
        })
        .catch(error => {
            console.error('Erro:', error.data);
        });
})();
