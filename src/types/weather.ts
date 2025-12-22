export interface GeoLocation {
  id: number
  name: string
  country: string
  latitude: number
  longitude: number
}

export interface CurrentWeather {
  // Air temperature in °C
  temperature: number

  // Feels-like temperature in °C
  apparentTemperature: number

  // Relative humidity in %
  humidity: number

  // Wind speed in km/h
  windSpeed: number

  // Precipitation probability (%)
  precipitationProbability: number

  // Open-Meteo weather code
  weatherCode: number

  // True if it is currently day, false if night
  isDay: boolean
}
