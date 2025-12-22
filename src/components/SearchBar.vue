<script setup lang="ts">
import { ref } from 'vue'

// Define custom event that this component emits to its parent.
// Example usage: emit('search', 'Berlin')
const emit = defineEmits<{
  (e: 'search', value: string): void
}>()

// Local state for the input field (reactive)
const city = ref('')

// Called when the form is submitted
function handleSubmit() {
  const trimmed = city.value.trim()
  if (!trimmed) return

  emit('search', trimmed)
}
</script>

<template>
  <form class="search-bar" @submit.prevent="handleSubmit">
    <div class="search-bar__field field">
      <label class="field__label" for="search-bar-city"> Stadt oder Ort </label>

      <div class="search-bar__controls field__control">
        <input
          id="search-bar-city"
          v-model="city"
          class="input search-bar__input"
          type="text"
          name="city"
          placeholder="z.B. Berlin, Hamburg, München"
          autocomplete="off"
        />

        <button type="submit" class="button search-bar__button">Suchen</button>
      </div>
    </div>
  </form>
</template>

<style scoped>
.search-bar {
}
.search-bar__field {
}
.search-bar__controls {
}
.search-bar__input {
}
.search-bar__button {
}
</style>
