<script setup>
import { computed } from "vue";

const props = defineProps({
  stok: { type: Number, required: true },
  maxStok: { type: Number, required: true },
});

// Persentase stok dalam rentang 0–100
const persen = computed(() => Math.round((props.stok / props.maxStok) * 100));

// Warna bar berdasarkan persentase
const warnaBar = computed(() => {
  if (persen.value < 15) return "bg-red-400";
  if (persen.value < 30) return "bg-yellow-400";
  return "bg-sage-400";
});
</script>

<template>
  <div>
    <!-- Teks persentase & angka stok -->
    <div class="flex justify-between text-xs mb-1">
      <span class="text-charcoal-muted">Stok</span>
      <span class="font-medium text-charcoal">{{ stok }} / {{ maxStok }}</span>
    </div>

    <!-- Track (latar abu) -->
    <div class="w-full bg-sage-100 rounded-full h-1.5 overflow-hidden">
      <div
        :class="['h-full rounded-full transition-all duration-500', warnaBar]"
        :style="{ width: persen + '%' }"
      />
    </div>
  </div>
</template>
