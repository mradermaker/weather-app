<script setup lang="ts">
import type { DailyForecasts } from '@/types/weather'
import { getWeatherLabel, getWeatherIcon } from '@/utils/weatherCode'
import WeatherIcon from './WeatherIcon.vue'

const { dailyForecasts } = defineProps<{
  dailyForecasts: DailyForecasts
}>()

function formatWeekday(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('de-DE', {
    weekday: 'long',
  })
}
function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
  })
}
function formatHour(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (minutes === 0) {
    return `${hours}h`
  }

  if (hours === 0) {
    return `${minutes}min`
  }

  return `${hours}h ${minutes}min`
}
</script>

<template>
  <article v-for="daily in dailyForecasts" :key="daily.date" class="daily-forecast-card card">
    <h3 class="daily-forecast-card__title">
      {{ formatWeekday(daily.date) }}
      <span class="daily-forecast-card__subtitle">{{ formatDate(daily.date) }}</span>
    </h3>
    <dl class="daily-forecast-card__weather">
      <dt class="daily-forecast-card__weather-label">
        <WeatherIcon
          :icon="getWeatherIcon(daily.weatherCode)"
          :label="getWeatherLabel(daily.weatherCode)"
          class="daily-forecast-card__weather-icon"
        />
      </dt>
      <dd class="daily-forecast-card__weather-value">{{ getWeatherLabel(daily.weatherCode) }}</dd>
    </dl>
    <p class="daily-forecast-card__temperature">
      <span class="daily-forecast-card__temperature-max">{{ daily.maxTemperature }} °C</span>
      <span class="daily-forecast-card__temperature-min">{{ daily.minTemperature }} °C</span>
    </p>
    <dl class="daily-forecast-card__stats">
      <div class="daily-forecast-card__data">
        <dt class="daily-forecast-card__label">
          <svg
            class="daily-forecast-card__icon icon icon--xs icon--sunshine"
            role="img"
            aria-hidden="true"
            focusable="false"
          >
            <use href="#icon-sunshine" />
          </svg>
          <span class="sr-only">Sonnenscheindauer</span>
        </dt>
        <dd class="daily-forecast-card__value">{{ formatHour(daily.sunshineDuration) }}</dd>
      </div>
      <div class="daily-forecast-card__data">
        <dt class="daily-forecast-card__label">
          <svg
            class="daily-forecast-card__icon icon icon--xs icon--precipitation"
            role="img"
            aria-hidden="true"
            focusable="false"
          >
            <use href="#icon-precipitation" />
          </svg>
          <span class="sr-only">Niederschlag</span>
        </dt>
        <dd class="daily-forecast-card__value">{{ daily.precipitationProbabilityMax }} %</dd>
      </div>
    </dl>
  </article>
</template>

<style scoped>
.daily-forecast-card {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
@media (min-width: 576px) {
  .daily-forecast-card {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    align-items: center;
    gap: var(--space-lg);
  }
}
.daily-forecast-card__title {
  display: flex;
  flex-direction: row;
  gap: var(--space-xs);
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-h3);
  line-height: 1.2;
}
@media (min-width: 576px) {
  .daily-forecast-card__title {
    flex-direction: column;
    align-items: flex-start;
  }
}
@media (min-width: 768px) {
  .daily-forecast-card__title {
  }
}
.daily-forecast-card__subtitle {
  font-size: var(--font-size-base);
  font-family: var(--font-text);
  font-weight: 300;
}
.daily-forecast-card__weather {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
.daily-forecast-card__weather-icon {
}
.daily-forecast-card__weather-value {
}
.daily-forecast-card__temperature {
  display: flex;
  gap: var(--space-sm);
  justify-content: flex-start;
  font-family: var(--font-text);
  font-weight: 500;
}
@media (min-width: 576px) {
  .daily-forecast-card__temperature {
    justify-content: flex-end;
  }
}
@media (min-width: 1200px) {
  .daily-forecast-card__temperature {
    justify-content: flex-start;
  }
}
.daily-forecast-card__temperature-max {
}
.daily-forecast-card__temperature-min {
  color: var(--color-text-muted);
  font-weight: 300;
}
.daily-forecast-card__stats {
  display: none;
}
@media (min-width: 1200px) {
  .daily-forecast-card__stats {
    display: flex;
    gap: var(--space-md);
    justify-content: flex-end;
  }
}
.daily-forecast-card__data {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-xs);
}
.daily-forecast-card__label {
  display: flex;
  align-items: center;
  justify-content: center;
}
.daily-forecast-card__icon {
}
.daily-forecast-card__value {
}
</style>
