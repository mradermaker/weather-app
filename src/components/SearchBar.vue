<script setup lang="ts">
// Define props that this component receives from its parent.
// Example usage: <SearchBar :disabled="isLoading" @search="handleSearch" />
const { city, disabled } = defineProps<{
  city: string
  disabled?: boolean
}>()

// Define custom event that this component emits to its parent.
// Example usage: emit('search', 'Berlin')
const emit = defineEmits<{
  (e: 'update:city', value: string): void
  (e: 'search', value: string): void
}>()

// Called when the form is submitted
function handleSubmit() {
  if (disabled) return

  const trimmed = city.trim()
  if (!trimmed) return

  emit('search', trimmed)
}
</script>

<template>
  <form class="search-bar" @submit.prevent="handleSubmit">
    <div class="search-bar__field field">
      <label class="field__label" for="search-bar-city">Stadt oder Ort suchen</label>

      <div class="search-bar__controls field__control">
        <input
          id="search-bar-city"
          :value="city"
          @input="emit('update:city', ($event.target as HTMLInputElement).value)"
          class="input search-bar__input"
          type="text"
          name="city"
          placeholder="z.B. Berlin, Hamburg, München"
          autocomplete="off"
          :disabled="disabled"
        />

        <button type="submit" class="button search-bar__button" :disabled="disabled">Suchen</button>
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
