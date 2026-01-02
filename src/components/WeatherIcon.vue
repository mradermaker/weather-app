<script setup lang="ts">
import { computed } from 'vue'

// Define props with defaults that this component receives from its parent.
const {
  icon,
  label,
  size = 'md',
  isDay = true,
} = defineProps<{
  icon: string
  label: string
  size?: 'sm' | 'md' | 'lg'
  isDay?: boolean
}>()

// Use base icon for day, add "-night" for night.
// Keep "unknown" as-is for fallback rendering
const iconFile = computed(() => {
  if (icon === 'unknown') return 'unknown'
  return isDay ? icon : `${icon}-night`
})

// Build the file URL for Vite.
// Assets need to be resolved to a real URL at build time
const src = computed(
  () => new URL(`../assets/icons/weather/${iconFile.value}.svg`, import.meta.url).href,
)
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
  width: 2rem;
  height: 2rem;
}
.weather-icon--md {
  width: 3rem;
  height: 3rem;
}
.weather-icon--lg {
  width: 6rem;
  height: 6rem;
}
.weather-icon--fallback {
  font-size: var(--font-size-small);
}
</style>
