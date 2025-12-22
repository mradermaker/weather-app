import type { GeoLocation, CurrentWeather } from '@/types/weather'

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search'

// Search a city by name and return its coordinates
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

// Fetch current weather data for a given location
export async function fetchCurrentWeather(location: GeoLocation): Promise<CurrentWeather> {
  // TODO: weather request

  // throw on network or API errors
  throw new Error('Weather data could not be loaded')
}
