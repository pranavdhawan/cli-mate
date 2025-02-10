import axios from 'axios';
import { fetchWeatherApi } from 'openmeteo';

async function getLocation() {
    const results = await axios({
        method: 'get',
        url: 'https://geocoding-api.open-meteo.com/v1/search',
        params: {
            name: 'Vellore',
            count: 1,
            format: 'json'
        },
    });

    const { latitude, longitude } = results.data.results[0];
    return { latitude, longitude };
}

async function getForecast(params) {
    const p = {
        "latitude": params.latitude,
        "longitude": params.longitude,
        "current": ["temperature_2m", "relative_humidity_2m", "precipitation", "rain", "showers"],
        "daily": ["temperature_2m_max", "temperature_2m_min"],
        "forecast_days": 1
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, p);
    
    // Helper function to form time ranges
    const range = (start, stop, step) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
    

    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const current = response.current();
    const daily = response.daily();
    
    const weatherData = {
    
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature2m: current.variables(0).value(),
            relativeHumidity2m: current.variables(1).value(),
            precipitation: current.variables(2).value(),
            rain: current.variables(3).value(),
            showers: current.variables(4).value(),
        },
        daily: {
            time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            temperature2mMax: daily.variables(0).valuesArray(),
            temperature2mMin: daily.variables(1).valuesArray(),
        },
    
    };
    
    for (let i = 0; i < weatherData.daily.time.length; i++) {
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
    
    
}

async function getL() {
    const results = await axios({
        method: 'get',
        url: 'https://api.ipdata.co',
      })
    
      const { city, region } = results.data
      return `${city}, ${region}`
}

async function main() {
    await getL();
}
main().catch(console.error);

