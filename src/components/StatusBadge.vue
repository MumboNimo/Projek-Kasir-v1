<script setup>
import { computed } from "vue";

const props = defineProps({
  status: { type: String, required: true },
});

// computed property — dihitung ulang saat props.status berubah
const warna = computed(() => {
  const map = {
    Lunas: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Gagal: "bg-red-100 text-red-600",
  };
  // Fallback: warna abu jika status tidak dikenal
  return map[props.status] || "bg-gray-100 text-gray-600";
});
</script>

<template>
  <span
    :class="[
      'inline-flex text-xs font-semibold px-2.5 py-1 rounded-full',
      warna,
    ]"
  >
    {{ status }}
  </span>
</template>
