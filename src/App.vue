<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SearchBar from './components/SearchBar.vue'
import WeatherCard from './components/WeatherCard.vue'
import DailyForecastList from './components/DailyForecastList.vue'
import HourlyForecastList from './components/HourlyForecastList.vue'
import StateMessage from './components/StateMessage.vue'
import {
  searchCity,
  fetchCurrentWeather,
  fetchDailyForecasts,
  fetchHourlyForecasts,
} from '@/services/weatherApi'
import type { CurrentWeather, DailyForecasts, HourlyForecasts } from '@/types/weather'

const STORAGE_KEY = 'weather-app:last-city' // namespaced to avoid collisions with other apps
const DEFAULT_CITY = 'Berlin'

// initial city (localStorage or fallback)
function getInitialCity(): string {
  const storedCity = localStorage.getItem(STORAGE_KEY)
  if (!storedCity) return DEFAULT_CITY

  const trimmed = storedCity.trim()
  return trimmed || DEFAULT_CITY
}

const lastSearch = ref<string>(getInitialCity())

const currentWeather = ref<CurrentWeather | null>(null)

const dailyForecasts = ref<DailyForecasts | null>(null)

const hourlyForecasts = ref<HourlyForecasts | null>(null)

const isDay = computed(() => currentWeather.value?.isDay)

const isLoading = ref(false)

const errorMessage = ref<string | null>(null)

async function handleSearch(city: string) {
  errorMessage.value = null
  isLoading.value = true

  try {
    const location = await searchCity(city)
    if (!location) {
      errorMessage.value = 'Ort nicht gefunden'
      return
    }

    lastSearch.value = city
    localStorage.setItem(STORAGE_KEY, city)

    currentWeather.value = await fetchCurrentWeather(location)
    dailyForecasts.value = await fetchDailyForecasts(location)
    hourlyForecasts.value = await fetchHourlyForecasts(location)
  } catch {
    errorMessage.value = 'Daten konnten nicht geladen werden'
  } finally {
    isLoading.value = false
  }
}

// trigger initial search after first render
onMounted(() => {
  handleSearch(lastSearch.value)
})
</script>

<template>
  <svg style="display: none" aria-hidden="true" focusable="false">
    <symbol
      id="icon-circle-info"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </symbol>
    <symbol
      id="icon-circle-x"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </symbol>
    <symbol
      id="icon-circle-check"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </symbol>
    <symbol
      id="icon-temperature"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </symbol>
    <symbol
      id="icon-precipitation"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 13v7a2 2 0 0 0 4 0" />
      <path d="M12 2v2" />
      <path d="M20.992 13a1 1 0 0 0 .97-1.274 10.284 10.284 0 0 0-19.923 0A1 1 0 0 0 3 13z" />
    </symbol>
    <symbol
      id="icon-humidity"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"
      />
    </symbol>
    <symbol
      id="icon-wind"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12.8 19.6A2 2 0 1 0 14 16H2" />
      <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" />
      <path d="M9.8 4.4A2 2 0 1 1 11 8H2" />
    </symbol>
    <symbol
      id="icon-sunshine"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </symbol>
  </svg>
  <header class="header">
    <div class="header__inner container">
      <h1 class="header__title">Weather App</h1>
      <p class="header__subtitle">Aktuelle Wetterdaten & Vorhersage.</p>
    </div>
  </header>
  <main id="main-content" class="main container">
    <section class="search section" aria-labelledby="search-title">
      <h2 id="search-title" class="search__title">Ort suchen</h2>
      <SearchBar :disabled="isLoading" @search="handleSearch" />
      <StateMessage :message="errorMessage" :loading="isLoading" />
      <p v-if="lastSearch" class="search__text">
        Zuletzt gesuchter Ort:
        <strong>{{ lastSearch }}</strong>
      </p>
    </section>

    <section v-if="currentWeather || hourlyForecasts" class="weather card">
      <div v-if="currentWeather" class="weather__wrapper">
        <h2 class="weather__title">Aktuelles Wetter</h2>
        <WeatherCard :weather="currentWeather" :city="lastSearch" />
      </div>
      <div v-if="hourlyForecasts" class="weather__wrapper">
        <h2 class="weather__title">Stündliche Vorhersage</h2>
        <div class="weather__cards">
          <HourlyForecastList :hourlyForecasts="hourlyForecasts" :city="lastSearch" />
        </div>
      </div>
    </section>

    <section
      v-if="dailyForecasts"
      class="daily-forecasts section"
      aria-labelledby="daily-forecasts-title"
    >
      <h2 id="daily-forecasts-title" class="daily-forecasts__title">
        <span class="daily-forecasts__subtitle">7-Tage-Vorhersage für</span> {{ lastSearch }}
      </h2>
      <DailyForecastList
        v-if="dailyForecasts"
        :dailyForecasts="dailyForecasts"
        :city="lastSearch"
      />
    </section>
  </main>
  <footer class="footer">
    <div class="footer__inner container">
      <p class="footer__text">
        Wetterdaten von
        <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a
        ><span class="separator">•</span
        ><a
          href="https://github.com/mradermaker/weather-app"
          target="_blank"
          rel="noopener noreferrer"
          >GitHub</a
        >
      </p>
    </div>
  </footer>
</template>

<style scoped>
.header {
  border-bottom: 1px solid var(--color-border);
  padding-block: var(--space-md);
  /* backdrop-filter: blur(10px); */
}
.header__inner {
}
.header__title {
}
.header__subtitle {
}

.main {
}

.search {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.weather {
  display: flex;
  flex-direction: column;
  gap: var(--space-xxl);
  background: linear-gradient(180deg, var(--weather-primary), var(--weather-secondary));
  color: var(--weather-text);
}
.weather__title {
  font-weight: 500;
  font-size: 1rem;
}
.weather__wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.weather__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
}
@media (min-width: 576px) {
  .weather__cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (min-width: 1200px) {
  .weather__cards {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

.footer {
  border-top: 1px solid var(--color-border);
  padding-block: var(--space-md);
}
.footer__inner {
}
.footer__text {
}
</style>
