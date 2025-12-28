<script setup lang="ts">
// Define props that this component receives from its parent.
// Example usage: <StateMessage :message="errorMessage" :loading="isLoading" />
const { message, loading } = defineProps<{
  message: string | null
  loading: boolean
}>()
</script>

<template>
  <p v-if="message" class="state-message state-message--error" role="alert" aria-live="assertive">
    {{ message }}
  </p>
  <p v-else-if="loading" class="state-message state-message--info" role="status" aria-live="polite">
    Lade Wetterdaten...
  </p>
</template>

<style scoped>
.state-message {
  padding: var(--space-md);
  border: 1px solid var(--color-border);
}
</style>
