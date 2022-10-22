import * as dotenv from 'dotenv';
import http from 'http';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

dotenv.config();

const context = yargs(hideBin(process.argv))
    .option('city', {
        required: true,
        alias: 'c',
        type: 'string'
    })
    .argv;

const formatTemperatureValue = value => `${value > 0 ? '+' : '-'}${value}°`;

async function init() {
    try {
        const { city } = context;
        const { current, location } = await getWeather(city);

        const temperature = formatTemperatureValue(current.temperature);
        const feelsLikeTerperature = formatTemperatureValue(current.feelslike);
        const windSpeed = Math.round(parseFloat(current.wind_speed) / 3.6);

        console.log(`
            Город: ${location.name}
            Температура: ${temperature}, ощущается как ${feelsLikeTerperature}
            Давление: ${current.pressure} мм рт. ст.
            Ветер: ${windSpeed} м/с
        `);

    } catch (e) {
        console.error(e);
    }
}

function getWeather(city) {
    return new Promise((resolve, reject) => {
        http.get(`${'http://api.weatherstack.com'}/current?access_key=${process.env.API_TOKEN}&query=${city}`, res => {
            if (res.statusCode !== 200) {
                reject(new Error('Weatherstack request error'));
                return;
            }

            res.setEncoding('utf8')
            let data = ''

            res
                .on('data', chunk => data += chunk)
                .on('end', () => resolve(JSON.parse(data)))
        }).on('error', e => reject(e));
    });
}

init();