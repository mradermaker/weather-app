<script setup lang="ts">
// Define props with defaults that this component receives from its parent.
const { icon, label, size } = withDefaults(
  defineProps<{
    icon: string
    label: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    size: 'md',
  },
)

// Build the file URL for Vite.
// Assets need to be resolved to a real URL at build time.
const src = new URL(`../assets/icons/weather/${icon}.png`, import.meta.url).href
</script>

<template>
  <img
    v-if="icon !== 'unknown'"
    class="weather-icon"
    :class="[`weather-icon--${size}`, `weather-icon--${icon}`]"
    :src="src"
    :alt="label"
  />
  <span v-else class="weather-icon weather-icon--fallback">
    {{ label }}
  </span>
</template>

<style scoped>
.weather-icon {
  display: block;
}
.weather-icon--sm {
  width: 1.5rem;
  height: 1.5rem;
}
.weather-icon--md {
  width: 2rem;
  height: 2rem;
}
.weather-icon--lg {
  width: 3rem;
  height: 3rem;
}
.weather-icon--fallback {
  font-size: var(--font-size-small);
}
</style>
