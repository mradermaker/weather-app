<script setup lang="ts">
import type { Forecasts } from '@/types/weather'

const { forecasts } = defineProps<{
  forecasts: Forecasts
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
  <article v-for="daily in forecasts" class="forecast-card card">
    <h3 class="forecast-card__title">
      {{ formatWeekday(daily.date) }}
      <span class="forecast-card__subtitle">{{ formatDate(daily.date) }}</span>
    </h3>
    <dl class="forecast-card__stats">
      <div class="forecast-card__data">
        <dt class="forecast-card__label">Temperatur von</dt>
        <dd class="forecast-card__value">{{ daily.minTemperature }} °C</dd>
      </div>
      <div class="forecast-card__data">
        <dt class="forecast-card__label">Temperatur bis</dt>
        <dd class="forecast-card__value">{{ daily.maxTemperature }} °C</dd>
      </div>
      <div class="forecast-card__data">
        <dt class="forecast-card__label">Tageslichtdauer</dt>
        <dd class="forecast-card__value">{{ formatHour(daily.daylightDuration) }}</dd>
      </div>
      <div class="forecast-card__data">
        <dt class="forecast-card__label">Niederschlag</dt>
        <dd class="forecast-card__value">{{ daily.precipitationProbabilityMax }} %</dd>
      </div>
    </dl>
  </article>
</template>

<style scoped>
.forecast-card {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
@media (min-width: 1200px) {
  .forecast-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.forecast-card__title {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  font-size: var(--font-size-h3);
  line-height: 1.2;
  flex: 1;
}
.forecast-card__subtitle {
  font-size: var(--font-size-base);
  font-family: var(--font-text);
  font-weight: 300;
}
.forecast-card__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-sm);
}
@media (min-width: 1200px) {
  .forecast-card__stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
.forecast-card__data {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  align-items: flex-start;
}
.forecast-card__label {
  font-size: var(--font-size-small);
  color: var(--color-text-muted);
  hyphens: auto;
}
.forecast-card__value {
  font-family: var(--font-text);
  font-weight: 500;
}
</style>
