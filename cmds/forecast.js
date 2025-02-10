const ora = require('ora-classic')
const getWeather = require('../utils/weather.js')


module.exports = async (args) => {
    const spinner = ora('Fetching weather data...').start()

    try {
        const location = args.location || args.l
        if (!location) {
            throw new Error('Please provide a location using --l or --location')
        }
        const weatherData = await getWeather(location)
        console.log('\n📍 Current Weather in', location);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🌡️  ${weatherData.current.temperature2m}°C`);
        console.log(`💧 ${weatherData.current.relativeHumidity2m}% humidity`);
        if (weatherData.current.precipitation > 0) {
            console.log(`🌧️  ${weatherData.current.precipitation}mm precipitation`);
        }

        // 7-day forecast section
        console.log('\n📅 7-Day Forecast');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        weatherData.daily.time.forEach((date, i) => {
            const day = date.toLocaleDateString('en-US', { weekday: 'short' });
            const max = weatherData.daily.temperature2mMax[i];
            const min = weatherData.daily.temperature2mMin[i];
            console.log(`${day.padEnd(4)} │ 🌡️  ${max}°C ↑ ${min}°C ↓`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');


        spinner.stop()
    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}