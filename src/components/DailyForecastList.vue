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
    return `${hours} Std.`
  }

  return `${hours} Std., ${minutes} Min.`
}
</script>

<template>
  <article v-for="daily in dailyForecasts" :key="daily.date" class="daily-forecast-card card">
    <h3 class="daily-forecast-card__title">
      {{ formatWeekday(daily.date) }}
      <span class="daily-forecast-card__subtitle">{{ formatDate(daily.date) }}</span>
    </h3>
    <div class="daily-forecast-card__header">
      <WeatherIcon
        :icon="getWeatherIcon(daily.weatherCode)"
        :label="getWeatherLabel(daily.weatherCode)"
        class="daily-forecast-card__weather"
      />
      {{ getWeatherLabel(daily.weatherCode) }}
    </div>
    <div class="daily-forecast-card__temperature">
      <p class="daily-forecast-card__temperature-max">{{ daily.maxTemperature }} °C</p>
      <p class="daily-forecast-card__temperature-min">{{ daily.minTemperature }} °C</p>
    </div>
    <dl class="daily-forecast-card__stats">
      <div class="daily-forecast-card__data">
        <dt class="daily-forecast-card__label">Sonnenscheindauer</dt>
        <dd class="daily-forecast-card__value">{{ formatHour(daily.sunshineDuration) }}</dd>
      </div>
      <div class="daily-forecast-card__data">
        <dt class="daily-forecast-card__label">Niederschlag</dt>
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
@media (min-width: 768px) {
  .daily-forecast-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.daily-forecast-card__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  flex: 1;
}
@media (min-width: 768px) {
  .daily-forecast-card__header {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.daily-forecast-card__title {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  font-size: var(--font-size-h3);
  line-height: 1.2;
}
.daily-forecast-card__subtitle {
  font-size: var(--font-size-base);
  font-family: var(--font-text);
  font-weight: 300;
}
.daily-forecast-card__weather {
}
@media (min-width: 768px) {
  .daily-forecast-card__weather {
    justify-self: center;
  }
}
.daily-forecast-card__temperature {
  display: flex;
  gap: var(--space-sm);
}
.daily-forecast-card__temperature-max {
}
.daily-forecast-card__temperature-min {
  color: var(--color-text-muted);
}
.daily-forecast-card__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-sm);
}
@media (min-width: 768px) {
  .daily-forecast-card__stats {
    grid-template-columns: repeat(4, minmax(0, auto));
  }
}
.daily-forecast-card__data {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  align-items: flex-start;
}
.daily-forecast-card__label {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  hyphens: auto;
}
.daily-forecast-card__value {
  font-family: var(--font-text);
  font-weight: 500;
}
</style>
