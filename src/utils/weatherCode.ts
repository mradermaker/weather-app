// mapping table: weather code to readable description
const WEATHER_CODE_LABELS: Record<number, string> = {
  0: 'Klar / Sonnig',
  1: 'Überwiegend klar',
  2: 'Teilweise bewölkt',
  3: 'Bewölkt',
  45: 'Nebel',
  48: 'Reifnebel',
  51: 'Leichter Nieselregen',
  53: 'Mäßiger Nieselregen',
  55: 'Starker Nieselregen',
  61: 'Leichter Regen',
  63: 'Mäßiger Regen',
  65: 'Starker Regen',
  71: 'Leichter Schneefall',
  73: 'Mäßiger Schneefall',
  75: 'Starker Schneefall',
  95: 'Gewitter',
  96: 'Gewitter mit leichtem Hagel',
  99: 'Gewitter mit starkem Hagel',
}

export function getWeatherLabel(code: number): string {
  return WEATHER_CODE_LABELS[code] ?? 'Unbekanntes Wetter'
}

// mapping table: weather code to icon name
const WEATHER_CODE_ICONS: Record<number, string> = {
  0: 'clear-day',
  1: 'partly-cloudy',
  2: 'partly-cloudy',
  3: 'cloudy',
  45: 'fog',
  48: 'fog',
  51: 'rain',
  53: 'rain',
  55: 'rain',
  61: 'rain',
  63: 'rain',
  65: 'rain',
  71: 'snow',
  73: 'snow',
  75: 'snow',
  95: 'thunderstorm',
  96: 'thunderstorm',
  99: 'thunderstorm',
}

export function getWeatherIcon(code: number): string {
  return WEATHER_CODE_ICONS[code] ?? 'unknown'
}
