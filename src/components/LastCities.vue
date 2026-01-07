<script setup lang="ts">
import { getWeatherLabel, getWeatherIcon } from '@/utils/weatherCode'
import WeatherIcon from './WeatherIcon.vue'

const { cities, currentCity, weatherMap } = defineProps<{
  cities: string[]
  currentCity: string
  weatherMap: Record<string, { weatherCode: number; temperature: number; isDay: boolean }>
}>()

const emit = defineEmits<{
  (e: 'selectCity', value: string): void
}>()
</script>

<template>
  <button
    v-for="city in cities"
    :key="city"
    :aria-current="city === currentCity ? 'true' : undefined"
    class="last-cities-card card card--small"
    :class="[
      city === currentCity ? 'last-cities-card--current' : '',
      weatherMap[city]
        ? weatherMap[city].isDay
          ? 'last-cities-card--day'
          : 'last-cities-card--night'
        : '',
    ]"
    @click="emit('selectCity', city)"
  >
    <div v-if="weatherMap[city]" class="last-cities-card__infos">
      <h3 class="last-cities-card__title">{{ city }}</h3>
      <p class="last-cities-card__temperature">{{ weatherMap[city].temperature }} °C</p>
    </div>
    <WeatherIcon
      v-if="weatherMap[city]"
      :icon="getWeatherIcon(weatherMap[city].weatherCode)"
      :label="getWeatherLabel(weatherMap[city].weatherCode)"
      class="last-cities-card__weather-icon"
      :is-day="weatherMap[city].isDay"
    />
  </button>
</template>

<style scoped>
.last-cities-card {
  display: flex;
  justify-content: space-between;
  gap: var(--space-md);
  background-color: var(--color-bg-card);
  color: var(--weather-text);
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.25s ease-in-out;
}
.last-cities-card--day {
  background: linear-gradient(180deg, var(--weather-day-primary), var(--weather-day-secondary));
}
.last-cities-card--day:hover {
  box-shadow: 0 0 0 4px var(--weather-day-primary);
}
.last-cities-card--night {
  background: linear-gradient(180deg, var(--weather-night-primary), var(--weather-night-secondary));
}
.last-cities-card--night:hover {
  box-shadow: 0 0 0 4px var(--weather-night-primary);
}
.last-cities-card--current {
  box-shadow: 0 0 0 4px var(--color-text);
}
.last-cities-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
.last-cities-card__infos {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-sm);
}
.last-cities-card__title {
  font-size: var(--font-size-h3);
  font-weight: 500;
  line-height: 1.2;
  text-align: left;
}
.last-cities-card__weather-icon {
}
.last-cities-card__temperature {
}
</style>
