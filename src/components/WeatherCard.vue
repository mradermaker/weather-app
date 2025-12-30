<script setup lang="ts">
import type { CurrentWeather } from '@/types/weather'
import { getWeatherLabel, getWeatherIcon } from '@/utils/weatherCode'
import WeatherIcon from './WeatherIcon.vue'

// Define props that this component receives from its parent.
// Example usage: <WeatherCard :weather="currentWeather" :city="lastSearch" />
const { weather, city } = defineProps<{
  weather: CurrentWeather
  city: string
}>()

const today = new Date()

const formattedToday = today.toLocaleDateString('de-DE', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
})

const isoDate = today.toISOString().split('T')[0]
</script>

<template>
  <article class="weather-card">
    <div class="weather-card__header">
      <h3 class="weather-card__title">{{ city }}</h3>
      <time :datetime="isoDate" class="weather-date">
        {{ formattedToday }}
      </time>
    </div>
    <WeatherIcon
      :icon="getWeatherIcon(weather.weatherCode)"
      :label="getWeatherLabel(weather.weatherCode)"
      class="weather-card__icon"
      size="lg"
    />
    <p class="weather-card__temperature">{{ weather.temperature }} °C</p>
    <div class="weather-card__infos">
      <p class="weather-card__weather">{{ getWeatherLabel(weather.weatherCode) }}°</p>
      <p class="weather-card__precipitation-temperature">
        H: <strong>{{ weather.maxTemperature }} °C</strong>, T:
        <strong>{{ weather.minTemperature }} °C</strong>
      </p>
    </div>
    <dl class="weather-card__stats card card--small">
      <div class="weather-card__data">
        <dt class="weather-card__icon">
          <svg
            class="icon icon--sm icon--temperature"
            role="img"
            aria-hidden="true"
            focusable="false"
          >
            <use href="#icon-temperature" />
          </svg>
        </dt>
        <dt class="weather-card__label">Gefühlte Temperatur</dt>
        <dd class="weather-card__value">{{ weather.apparentTemperature }}°</dd>
      </div>
      <div class="weather-card__data">
        <dt class="weather-card__icon">
          <svg class="icon icon--sm icon--humidity" role="img" aria-hidden="true" focusable="false">
            <use href="#icon-humidity" />
          </svg>
        </dt>
        <dt class="weather-card__label">Luftfeuchtigkeit</dt>
        <dd class="weather-card__value">{{ weather.humidity }} %</dd>
      </div>
      <div class="weather-card__data">
        <dt class="weather-card__icon">
          <svg class="icon icon--sm icon--wind" role="img" aria-hidden="true" focusable="false">
            <use href="#icon-wind" />
          </svg>
        </dt>
        <dt class="weather-card__label">Windgeschwindigkeit</dt>
        <dd class="weather-card__value">{{ weather.windSpeed }} km/h</dd>
      </div>
      <div class="weather-card__data">
        <dt class="weather-card__icon">
          <svg
            class="icon icon--sm icon--precipitation"
            role="img"
            aria-hidden="true"
            focusable="false"
          >
            <use href="#icon-precipitation" />
          </svg>
        </dt>
        <dt class="weather-card__label">Niederschlag</dt>
        <dd class="weather-card__value">{{ weather.precipitationProbabilityMax }} %</dd>
      </div>
    </dl>
  </article>
</template>

<style scoped>
.weather-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-lg);
}
.weather-card__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
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
.weather-card__icon {
}
.weather-card__temperature {
  font-family: var(--font-headline);
  font-weight: 600;
  font-size: 60px;
  line-height: 1;
}
.weather-card__infos {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}
.weather-card__weather {
  color: var(--weather-text-muted);
}
.weather-card__precipitation-temperature {
}
.weather-card__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
  align-self: stretch;
  border-color: var(--weather-border);
  background-color: var(--weather-card);
  color: var(--weather-text);
}
@media (min-width: 768px) {
  .weather-card__stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
.weather-card__data {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  align-items: center;
}
.weather-card__label {
  font-size: var(--font-size-small);
  font-family: var(--font-text);
  font-weight: 300;
  hyphens: auto;
  word-break: break-word;
  color: var(--weather-text-muted);
  order: 1;
  margin-top: calc(var(--space-xs) * -1);
}
.weather-card__icon {
}
.weather-card__value {
  font-size: var(--font-size-h3);
  font-family: var(--font-headline);
  font-weight: 500;
  line-height: 1.2;
}
</style>
