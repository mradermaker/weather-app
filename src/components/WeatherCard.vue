<script setup lang="ts">
import type { CurrentWeather } from '@/types/weather'

// Define props that this component receives from its parent.
// Example usage: <WeatherCard :weather="currentWeather" :city="lastSearch" />
const { weather, city } = defineProps<{
  weather: CurrentWeather
  city: string
}>()
</script>

<template>
  <article class="weather-card card">
    <h3 class="weather-card__title">Aktuelles Wetter in {{ city }}</h3>
    <ul class="weather-card__data">
      <li class="weather-card__item">Temperatur: {{ weather.temperature }} °C</li>
      <li class="weather-card__item">Gefühlte Temperatur: {{ weather.apparentTemperature }} °C</li>
      <li class="weather-card__item">Luftfeuchtigkeit: {{ weather.humidity }} %</li>
      <li class="weather-card__item">Windgeschwindigkeit: {{ weather.windSpeed }} km/h</li>
    </ul>
  </article>
</template>

<style scoped>
.weather-card {
}
</style>
