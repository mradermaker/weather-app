<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
  <svg style="display: none" aria-hidden="true">
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

    <section
      v-if="currentWeather"
      class="current-weather section"
      aria-labelledby="current-weather-title"
    >
      <h2 id="current-weather-title" class="current-weather__title">Aktuelles Wetter</h2>
      <WeatherCard v-if="currentWeather" :weather="currentWeather" :city="lastSearch" />
    </section>

    <section
      v-if="hourlyForecasts"
      class="hourly-forecasts section"
      aria-labelledby="hourly-forecasts-title"
    >
      <h2 id="hourly-forecasts-title" class="hourly-forecasts__title">Stündliche Vorhersage</h2>
      <div v-if="hourlyForecasts" class="hourly-forecasts__cards">
        <HourlyForecastList
          v-if="hourlyForecasts"
          :hourlyForecasts="hourlyForecasts"
          :city="lastSearch"
        />
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

.current-weather {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.daily-forecasts {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.daily-forecasts__title {
}
.daily-forecasts__subtitle {
}

.hourly-forecasts {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.hourly-forecasts__title {
}
.hourly-forecasts__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
}
@media (min-width: 768px) {
  .hourly-forecasts__cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (min-width: 1200px) {
  .hourly-forecasts__cards {
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
