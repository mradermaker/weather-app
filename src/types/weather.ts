export interface GeoLocation {
  id: number
  name: string
  country: string
  latitude: number
  longitude: number
}

export interface CurrentWeather {
  // Open-Meteo weather code
  weatherCode: number

  // Air temperature in °C
  temperature: number

  // Feels-like temperature in °C
  apparentTemperature: number

  // Relative humidity in %
  humidity: number

  // Wind speed in km/h
  windSpeed: number

  // True if it is currently day, false if night
  isDay: boolean

  // Precipitation probability (%)
  precipitationProbability?: number
}

export interface DailyForecast {
  // date (YYYY-mm-dd)
  date: string

  // Open-Meteo weather code
  weatherCode: number

  // Maximum temperature in °C
  maxTemperature: number

  // Minimum temperature in °C
  minTemperature: number

  // Sunshine per day in seconds
  sunshineDuration: number

  // Precipitation probability maximum (%)
  precipitationProbabilityMax: number
}

export type DailyForecasts = DailyForecast[]
