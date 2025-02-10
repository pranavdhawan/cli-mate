const axios = require('axios');
const {fetchWeatherApi} = require('openmeteo');
 

async function getLocation(location) {
  const results = await axios({
    method: 'get',
    url: 'https://geocoding-api.open-meteo.com/v1/search',
    params: {
      name: location,
      count: 1,
      format: 'json'
    },
  });

  if(!results.data.results || results.data.results.length === 0) {
    throw new Error('No results found')
  }

  const { latitude, longitude } = results.data.results[0];
  return { latitude, longitude };
  // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
}

async function getForecast(params) {
  const p = {
    "latitude": params.latitude,
    "longitude": params.longitude,
    "current": ["temperature_2m", "relative_humidity_2m", "precipitation", "rain", "showers"],
    "daily": ["temperature_2m_max", "temperature_2m_min"],
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
  }

  return weatherData
}


module.exports = async (location) => {
  const coords = await getLocation(location)
  const weatherData = await getForecast(coords)

  return weatherData

}