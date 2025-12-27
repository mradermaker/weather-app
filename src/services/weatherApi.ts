import type { GeoLocation, CurrentWeather, DailyForecasts } from '@/types/weather'

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search'

// search a city by name and return its coordinates
export async function searchCity(query: string): Promise<GeoLocation | null> {
  const trimmed = query.trim()

  // return if empty input
  if (!trimmed) return null

  // build URL with query params
  const url = new URL(GEOCODING_BASE_URL)
  url.searchParams.set('name', trimmed)
  url.searchParams.set('count', '1')
  url.searchParams.set('language', 'de')
  url.searchParams.set('format', 'json')

  // fetch data from api
  const response = await fetch(url.toString())

  // HTTP error
  if (!response.ok) {
    throw new Error('Geocoding request failed')
  }

  // parse JSON
  const data = (await response.json()) as {
    results?: Array<{
      id: number
      name: string
      country: string
      latitude: number
      longitude: number
    }>
  }

  // return if no results
  if (!data.results || data.results.length === 0) return null

  // use first result
  const first = data.results[0]

  const location: GeoLocation = {
    id: first.id,
    name: first.name,
    country: first.country,
    latitude: first.latitude,
    longitude: first.longitude,
  }

  return location
}

const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast'

// fetch current weather data for a given location
export async function fetchCurrentWeather(location: GeoLocation): Promise<CurrentWeather> {
  // build URL with query params
  const url = new URL(WEATHER_BASE_URL)
  url.searchParams.set('latitude', String(location.latitude))
  url.searchParams.set('longitude', String(location.longitude))
  url.searchParams.set(
    'current',
    'weather_code,temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,is_day',
  )
  url.searchParams.set('timezone', 'auto')

  // fetch data from api
  const response = await fetch(url.toString())

  // HTTP error
  if (!response.ok) {
    throw new Error('Weather request failed')
  }

  // parse JSON
  const data = (await response.json()) as {
    current?: {
      weather_code: number
      temperature_2m: number
      apparent_temperature: number
      relative_humidity_2m: number
      wind_speed_10m: number
      is_day: 0 | 1
    }
  }

  // error if no results
  if (!data.current) {
    throw new Error('No current weather data')
  }

  const current = data.current

  const weather: CurrentWeather = {
    weatherCode: current.weather_code,
    temperature: current.temperature_2m,
    apparentTemperature: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    isDay: current.is_day === 1,
  }

  return weather
}

// fetch daily forecast data for a given location
export async function fetchDailyForecasts(location: GeoLocation): Promise<DailyForecasts> {
  // build URL with query params
  const url = new URL(WEATHER_BASE_URL)
  url.searchParams.set('latitude', String(location.latitude))
  url.searchParams.set('longitude', String(location.longitude))
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_min,temperature_2m_max,sunshine_duration,precipitation_probability_max',
  )
  url.searchParams.set('timezone', 'auto')

  // fetch data from api
  const response = await fetch(url.toString())

  // HTTP error
  if (!response.ok) {
    throw new Error('Daily forecast request failed')
  }

  console.log(response)

  // parse JSON
  const data = (await response.json()) as {
    daily?: {
      time: string[]
      weather_code: number[]
      temperature_2m_min: number[]
      temperature_2m_max: number[]
      sunshine_duration: number[]
      precipitation_probability_max: number[]
    }
  }

  // error if no results
  if (!data.daily) {
    throw new Error('No daily forecast data')
  }

  const daily = data.daily

  const dailyForecasts: DailyForecasts = daily.time.map((date, i) => ({
    date,
    weatherCode: daily.weather_code[i],
    minTemperature: daily.temperature_2m_min[i],
    maxTemperature: daily.temperature_2m_max[i],
    sunshineDuration: daily.sunshine_duration[i],
    precipitationProbabilityMax: daily.precipitation_probability_max[i],
  }))

  return dailyForecasts
}
