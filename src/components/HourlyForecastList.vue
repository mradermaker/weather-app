<script setup lang="ts">
import type { HourlyForecasts } from '@/types/weather'
import { getWeatherLabel, getWeatherIcon } from '@/utils/weatherCode'
import WeatherIcon from './WeatherIcon.vue'

const { hourlyForecasts } = defineProps<{
  hourlyForecasts: HourlyForecasts
}>()

function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <article
    v-for="hourly in hourlyForecasts"
    :key="hourly.date"
    class="hourly-forecast-card card card--small"
  >
    <h3 class="hourly-forecast-card__time">{{ formatTime(hourly.date) }}</h3>
    <WeatherIcon
      :icon="getWeatherIcon(hourly.weatherCode)"
      :label="getWeatherLabel(hourly.weatherCode)"
      class="hourly-forecast-card__weather"
    />
    <dl class="hourly-forecast-card__stats">
      <div class="hourly-forecast-card__data">
        <dt class="hourly-forecast-card__label">
          <svg
            class="hourly-forecast-card__icon icon icon--xs icon--temperature"
            role="img"
            aria-hidden="true"
            focusable="false"
          >
            <use href="#icon-temperature" />
          </svg>
          <span class="sr-only">Temperatur</span>
        </dt>
        <dd class="hourly-forecast-card__value">{{ hourly.temperature }} °C</dd>
      </div>
      <div class="hourly-forecast-card__data">
        <dt class="hourly-forecast-card__label">
          <svg
            class="hourly-forecast-card__icon icon icon--xs icon--precipitation"
            role="img"
            aria-hidden="true"
            focusable="false"
          >
            <use href="#icon-precipitation" />
          </svg>
          <span class="sr-only">Niederschlag</span>
        </dt>
        <dd class="hourly-forecast-card__value">{{ hourly.precipitationProbability }} %</dd>
      </div>
    </dl>
  </article>
</template>

<style scoped>
.hourly-forecast-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  background-color: var(--weather-card);
}
.hourly-forecast-card__time {
  font-size: var(--font-size-h3);
  font-weight: 500;
  line-height: 1.2;
}
.hourly-forecast-card__weather {
}
.hourly-forecast-card__stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}
.hourly-forecast-card__data {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: var(--space-xs);
}
.hourly-forecast-card__label {
  display: flex;
  align-items: center;
  justify-content: center;
}
.hourly-forecast-card__icon {
}
.hourly-forecast-card__value {
}
</style>
