<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
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
import type { GeoLocation, CurrentWeather, DailyForecasts, HourlyForecasts } from '@/types/weather'
import type { Theme } from '@/types/theme'

const STORAGE_KEY = 'weather-app:last-city' // namespaced to avoid collisions with other apps
const DEFAULT_CITY = 'Berlin'
const THEME_KEY = 'weather-app:theme'

// Theme
function getInitialTheme(): Theme {
  const storedTheme = localStorage.getItem(THEME_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  // fallback to system preference
  const systemPreference = window.matchMedia('(prefers-color-scheme: light)').matches
  return systemPreference ? 'light' : 'dark'
}

const theme = ref<Theme>(getInitialTheme())

function applyTheme(value: Theme) {
  document.documentElement.dataset.theme = value
  localStorage.setItem(THEME_KEY, value)
}

// City / Location
function getInitialCity(): string {
  const storedCity = localStorage.getItem(STORAGE_KEY)
  if (!storedCity) return DEFAULT_CITY

  const trimmed = storedCity.trim()
  return trimmed || DEFAULT_CITY
}

const currentCity = ref<string>(getInitialCity())
const previousCity = ref<string | null>(null)
const searchInput = ref(currentCity.value)

const currentLocation = ref<GeoLocation | null>(null)

// Weather Data
const currentWeather = ref<CurrentWeather | null>(null)

const dailyForecasts = ref<DailyForecasts | null>(null)

const hourlyForecasts = ref<HourlyForecasts | null>(null)

const daysToShow = ref(7)

const isDay = computed(() => currentWeather.value?.isDay)

const isLoading = ref(false)

const errorMessage = ref<string | null>(null)

// Handle Search
async function handleSearch(city: string) {
  errorMessage.value = null
  isLoading.value = true

  try {
    const location = await searchCity(city)
    if (!location) {
      errorMessage.value = 'Ort nicht gefunden'
      return
    }

    // Save Location
    currentLocation.value = location

    if (currentCity.value && currentCity.value !== city) {
      previousCity.value = currentCity.value
    }

    currentCity.value = city
    searchInput.value = city
    localStorage.setItem(STORAGE_KEY, city)

    // Fetch
    currentWeather.value = await fetchCurrentWeather(location)
    dailyForecasts.value = await fetchDailyForecasts(location, daysToShow.value)
    hourlyForecasts.value = await fetchHourlyForecasts(location)
  } catch {
    errorMessage.value = 'Daten konnten nicht geladen werden'
  } finally {
    isLoading.value = false
  }
}

// Watchers
watch(theme, (value) => applyTheme(value), { immediate: true })

watch(daysToShow, async (newDays) => {
  if (!currentLocation.value) return
  dailyForecasts.value = await fetchDailyForecasts(currentLocation.value, newDays)
})

// On Mounted
onMounted(() => {
  // trigger initial search after first render
  handleSearch(currentCity.value)
})

// Logo
const base = import.meta.env.BASE_URL
const logoSrc = computed(() =>
  isDay.value === false ? `${base}/logos/logo-night.svg` : `${base}/logos/logo.svg`,
)
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
      <img class="header__logo" :src="logoSrc" width="80" height="80" alt="Logo" />
      <fieldset class="header__switch switch">
        <legend class="sr-only">Farbschema wählen</legend>
        <label class="switch__option">
          <input type="radio" name="theme" class="switch__input" value="light" v-model="theme" />
          <span class="switch__label">Light</span>
        </label>

        <label class="switch__option">
          <input type="radio" name="theme" class="switch__input" value="dark" v-model="theme" />
          <span class="switch__label">Dark</span>
        </label>
      </fieldset>
    </div>
  </header>
  <main id="main-content" class="main container" :class="isDay ? '--day' : '--night'">
    <section class="hero section">
      <h1 class="hero__title">Wie wird das Wetter?</h1>
      <p class="hero__text">Aktuelle Wetterdaten & Vorhersage</p>
    </section>

    <section class="search section">
      <SearchBar v-model:city="searchInput" :disabled="isLoading" @search="handleSearch" />
      <StateMessage :message="errorMessage" :loading="isLoading" />
      <div v-if="currentCity || previousCity" class="search__wrapper">
        <p v-if="currentCity" class="search__text">
          Aktueller Ort:
          <strong>{{ currentCity }}</strong>
        </p>
        <p v-if="previousCity" class="search__text">
          Zuletzt gesuchter Ort:
          <a href="#" @click.prevent="handleSearch(previousCity!)">
            <strong>{{ previousCity }}</strong>
          </a>
        </p>
      </div>
    </section>

    <section v-if="currentWeather || hourlyForecasts" class="weather card">
      <div v-if="currentWeather" class="weather__wrapper">
        <h2 class="weather__title">Aktuelles Wetter</h2>
        <WeatherCard :weather="currentWeather" :city="currentCity" />
      </div>
      <div v-if="hourlyForecasts" class="weather__wrapper">
        <h2 class="weather__title">Stündliche Vorhersage</h2>
        <div class="weather__cards">
          <HourlyForecastList :hourlyForecasts="hourlyForecasts" />
        </div>
      </div>
    </section>

    <section v-if="dailyForecasts" class="daily-forecasts section">
      <header class="daily-forecasts__header">
        <h2 class="daily-forecasts__title">
          <span class="daily-forecasts__subtitle"> Tägliche Vorhersage für</span>
          {{ currentCity }}
        </h2>
        <fieldset class="daily-forecasts__switch switch">
          <legend class="sr-only">Tage wählen</legend>
          <label class="switch__option">
            <input type="radio" name="days" class="switch__input" value="7" v-model="daysToShow" />
            <span class="switch__label">7 Tage</span>
          </label>

          <label class="switch__option">
            <input type="radio" name="days" class="switch__input" value="14" v-model="daysToShow" />
            <span class="switch__label">14 Tage</span>
          </label>
        </fieldset>
        <p class="daily-forecasts__status sr-only" aria-live="polite">
          Du hast {{ daysToShow }} Tage ausgewählt.
        </p>
      </header>
      <div class="daily-forecasts__cards">
        <DailyForecastList v-if="dailyForecasts" :dailyForecasts="dailyForecasts" />
      </div>
    </section>
  </main>
  <footer class="footer">
    <div class="footer__inner container">
      <p class="footer__text">
        Wetterdaten von
        <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a>
      </p>
      <p class="footer__text">
        <a
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
}
.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header__logo {
  width: 2.5rem;
  height: 2.5rem;
}
@media (min-width: 1200px) {
  .header__logo {
    width: 3.5rem;
    height: 3.5rem;
  }
}
.header__switch {
}

.main {
  display: flex;
  flex-direction: column;
  gap: 0 var(--space-lg);
}
@media (min-width: 1200px) {
  .main {
  }
}

.hero {
  text-align: center;
}

.search {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.search__wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  flex-wrap: wrap;
}
.search__text {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
}
@media (min-width: 1200px) {
  .search__wrapper {
    flex-direction: row;
  }
  .search__text + .search__text::before {
    content: '•';
    display: inline-block;
    margin-right: var(--space-xs);
  }
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

.daily-forecasts {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.daily-forecasts__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  align-items: flex-start;
}
@media (min-width: 576px) {
  .daily-forecasts__header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}
.daily-forecasts__title {
  font-weight: 500;
  font-size: 1rem;
}
.daily-forecasts__switch {
  align-self: flex-end;
}
.daily-forecasts__status {
}
.daily-forecasts__cards {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
@media (min-width: 576px) {
  .daily-forecasts__cards {
    display: grid;
    grid-template-columns: minmax(15%, 1fr) minmax(30%, 1fr) auto;
  }
}
@media (min-width: 1200px) {
  .daily-forecasts__cards {
    grid-template-columns: minmax(20%, 1fr) minmax(25%, 1fr) auto auto;
  }
}

.footer {
  border-top: 1px solid var(--color-border);
  padding-block: var(--space-md);
}
.footer__inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  flex-wrap: wrap;
}
.footer__text {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
}
@media (min-width: 768px) {
  .footer__inner {
    flex-direction: row;
  }
  .footer__text + .footer__text::before {
    content: '•';
    display: inline-block;
    margin-right: var(--space-xs);
  }
}
</style>
