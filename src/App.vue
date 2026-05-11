<script setup>
import { notif } from "./composables/useNotif.js";
</script>

<template>
  <RouterView />

  <Transition name="toast">
    <div
      v-if="notif.tampil"
      class="fixed bottom-6 right-6 z-50 bg-charcoal text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium"
    >
      {{ notif.pesan }}
    </div>
  </Transition>
</template>

<style>
/* Animasi untuk Transition "toast" */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
