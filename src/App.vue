<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SearchBar from './components/SearchBar.vue'
import WeatherCard from './components/WeatherCard.vue'
import DailyForecastList from './components/DailyForecastList.vue'
import { searchCity, fetchCurrentWeather, fetchDailyForecasts } from '@/services/weatherApi'
import type { CurrentWeather, DailyForecasts } from '@/types/weather'

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

async function handleSearch(city: string) {
  const location = await searchCity(city)
  if (!location) return

  lastSearch.value = city
  localStorage.setItem(STORAGE_KEY, city)

  currentWeather.value = await fetchCurrentWeather(location)

  dailyForecasts.value = await fetchDailyForecasts(location)
}

// trigger initial search after first render
onMounted(() => {
  handleSearch(lastSearch.value)
})
</script>

<template>
  <header class="header">
    <div class="header__inner container">
      <h1 class="header__title">Weather App</h1>
      <p class="header__subtitle">Aktuelle Wetterdaten & Vorhersage.</p>
    </div>
  </header>
  <main id="main-content" class="main container">
    <section class="search section" aria-labelledby="search-title">
      <h2 id="search-title" class="search__title">Ort suchen</h2>
      <SearchBar @search="handleSearch" />
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

.footer {
  border-top: 1px solid var(--color-border);
  padding-block: var(--space-md);
}
.footer__inner {
}
.footer__text {
}
</style>
