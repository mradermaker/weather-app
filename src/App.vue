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
import type { CurrentWeather, DailyForecasts, HourlyForecasts } from '@/types/weather'
import type { Theme } from '@/types/theme'

const STORAGE_KEY = 'weather-app:last-city' // namespaced to avoid collisions with other apps
const DEFAULT_CITY = 'Berlin'
const THEME_KEY = 'weather-app:theme'

// initial theme (localStorage or fallback)
function getInitialTheme(): Theme {
  const storedTheme = localStorage.getItem(THEME_KEY)
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  // fallback to system preference
  const sytemPreference = window.matchMedia('(prefers-color-scheme: light)').matches
  return sytemPreference ? 'light' : 'dark'
}

const theme = ref<Theme>(getInitialTheme())

function applyTheme(value: 'light' | 'dark') {
  document.documentElement.dataset.theme = value
  localStorage.setItem(THEME_KEY, value)
}

// initial city (localStorage or fallback)
function getInitialCity(): string {
  const storedCity = localStorage.getItem(STORAGE_KEY)
  if (!storedCity) return DEFAULT_CITY

  const trimmed = storedCity.trim()
  return trimmed || DEFAULT_CITY
}

const currentCity = ref<string>(getInitialCity())
const previousCity = ref<string | null>(null)
const searchInput = ref(currentCity.value)

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

    if (currentCity.value && currentCity.value !== city) {
      previousCity.value = currentCity.value
    }

    currentCity.value = city
    searchInput.value = city
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

watch(
  theme,
  (value) => {
    applyTheme(value)
  },
  { immediate: true },
)

// trigger initial search and theme after first render
onMounted(() => {
  handleSearch(currentCity.value)
})

const logoSrc = computed(() =>
  isDay.value === false ? '/logos/logo-night.svg' : '/logos/logo.svg',
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
      <div class="header__switcher">
        <fieldset class="theme-switch">
          <legend class="sr-only">Farbschema wählen</legend>
          <label class="theme-switch__option">
            <input
              type="radio"
              name="theme"
              value="light"
              class="theme-switch__input"
              :checked="theme === 'light'"
              @change="theme = 'light'"
            />
            <span class="theme-switch__label">Light</span>
          </label>

          <label class="theme-switch__option">
            <input
              type="radio"
              name="theme"
              value="dark"
              class="theme-switch__input"
              :checked="theme === 'dark'"
              @change="theme = 'dark'"
            />
            <span class="theme-switch__label">Dark</span>
          </label>
        </fieldset>
      </div>
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
      <h2 class="daily-forecasts__title">
        <span class="daily-forecasts__subtitle">7-Tage-Vorhersage für</span> {{ currentCity }}
      </h2>
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
.header__switcher {
}

.theme-switch {
  border: 0;
  padding: 0;
  margin: 0;
  display: inline-flex;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: var(--space-xs);
  gap: var(--space-xs);
}
.theme-switch__option {
  position: relative;
  cursor: pointer;
}
.theme-switch__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.theme-switch__label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-round);
  font-size: var(--font-size-small);
  font-weight: 500;
  color: var(--color-text);
  background: transparent;
  transition:
    background-color 0.25s ease-in-out,
    color 0.25s ease-in-out;
}
.theme-switch__label:hover {
  background-color: var(--color-bg);
}
.theme-switch__option .theme-switch__input:checked + .theme-switch__label {
  background: var(--color-primary);
  color: var(--color-primary-text);
}
.theme-switch__option .theme-switch__input:focus-visible + .theme-switch__label {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
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
.daily-forecasts__title {
  font-weight: 500;
  font-size: 1rem;
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
