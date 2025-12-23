<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SearchBar from './components/SearchBar.vue'
import { searchCity } from '@/services/weatherApi'

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

async function handleSearch(city: string) {
  const location = await searchCity(city)
  if (!location) return

  console.log(location)
  lastSearch.value = city
  localStorage.setItem(STORAGE_KEY, city)
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

.footer {
  border-top: 1px solid var(--color-border);
  padding-block: var(--space-md);
}
.footer__inner {
}
.footer__text {
}
</style>
