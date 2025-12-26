<script setup lang="ts">
import type { CurrentWeather } from '@/types/weather'
import { getWeatherDescription } from '@/utils/weatherCode'

// Define props that this component receives from its parent.
// Example usage: <WeatherCard :weather="currentWeather" :city="lastSearch" />
const { weather, city } = defineProps<{
  weather: CurrentWeather
  city: string
}>()
</script>

<template>
  <article class="weather-card card">
    <div class="weather-card__info">
      <h3 class="weather-card__title">
        <span class="weather-card__subtitle">Aktuelles Wetter in</span> {{ city }}
      </h3>
      <p class="weather-card__weather">{{ getWeatherDescription(weather.weatherCode) }}</p>
      <p class="weather-card__temperature">{{ weather.temperature }} °C</p>
    </div>
    <dl class="weather-card__stats">
      <div class="weather-card__data">
        <dt class="weather-card__label">Gefühlte Temperatur</dt>
        <dd class="weather-card__value">{{ weather.apparentTemperature }} °C</dd>
      </div>
      <div class="weather-card__data">
        <dt class="weather-card__label">Luftfeuchtigkeit</dt>
        <dd class="weather-card__value">{{ weather.humidity }} %</dd>
      </div>
      <div class="weather-card__data">
        <dt class="weather-card__label">Windgeschwindigkeit</dt>
        <dd class="weather-card__value">{{ weather.windSpeed }} km/h</dd>
      </div>
    </dl>
  </article>
</template>

<style scoped>
.weather-card {
  background-color: var(--color-primary);
  color: var(--color-primary-text);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.weather-card__info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}
.weather-card__title {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  font-size: var(--font-size-h1);
  line-height: 1.2;
  flex: 1;
}
.weather-card__subtitle {
  font-size: var(--font-size-base);
  font-family: var(--font-text);
  font-weight: 500;
}
.weather-card__weather {
}
.weather-card__temperature {
  font-family: var(--font-headline);
  font-weight: 600;
  font-size: 60px;
  line-height: 1;
}
.weather-card__stats {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-md);
}
@media (min-width: 768px) {
  .weather-card__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1200px) {
  .weather-card__stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
.weather-card__data {
  border: 1px solid var(--color-primary-border);
  border-radius: var(--radius-sm);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  align-items: flex-start;
}
.weather-card__label {
  font-size: var(--font-size-small);
  font-family: var(--font-text);
  font-weight: 500;
  color: var(--color-primary-muted);
}
.weather-card__value {
  font-size: var(--font-size-h3);
  font-family: var(--font-headline);
  font-weight: 600;
}
</style>
