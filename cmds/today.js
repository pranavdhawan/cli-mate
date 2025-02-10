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

        for (let i = 0; i < 1; i++) {
            console.log('\n=== Weather Report ===');
            console.log(`Date: ${weatherData.daily.time[i].toLocaleDateString()}`);
            console.log('\nDaily Forecast:');
            console.log(`🌡️  Max Temperature: ${weatherData.daily.temperature2mMax[i]}°C`);
            console.log(`🌡️  Min Temperature: ${weatherData.daily.temperature2mMin[i]}°C`);
        
            console.log('\nCurrent Conditions:');
            console.log(`🕒 Time: ${weatherData.current.time.toLocaleTimeString()}`);
            console.log(`🌡️  Temperature: ${weatherData.current.temperature2m}°C`);
            console.log(`💧 Humidity: ${weatherData.current.relativeHumidity2m}%`);
            console.log(`🌧️  Precipitation: ${weatherData.current.precipitation}mm`);
            console.log(`🌧️  Rain: ${weatherData.current.rain}mm`);
            console.log(`🌦️  Showers: ${weatherData.current.showers}mm`);
            console.log('===================\n');
          }

        spinner.stop()
    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}