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
    <svg
      class="state-message__icon icon icon--xs icon--error"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <use href="#icon-circle-x" />
    </svg>
    <span class="state-message__text">{{ message }}</span>
  </p>
  <p v-else-if="loading" class="state-message state-message--info" role="status" aria-live="polite">
    <svg
      class="state-message__icon icon icon--xs icon--error"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <use href="#icon-circle-info" />
    </svg>
    <span class="state-message__text">Lade Wetterdaten...</span>
  </p>
</template>

<style scoped>
.state-message {
  font-weight: 500;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid currentColor;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
.state-message__icon {
}
.state-message__text {
}
.state-message--error {
  color: var(--color-error);
}
.state-message--success {
  color: var(--color-success);
}
</style>
