<script setup lang="ts"></script>

<template>
  <header class="header">
    <div class="header__inner container">
      <h1 class="header__title">Weather App</h1>
      <p class="header__subtitle">Aktuelle Wetterdaten & Vorhersage.</p>
    </div>
  </header>
  <main id="main-content" class="main container"></main>
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
  padding-block: var(--space-lg) var(--space-xl);
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
