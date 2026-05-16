<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String, default: "" },
  trend: { type: String, default: "" },
});
</script>

<template>
  <div
    class="bg-white rounded-2xl p-5 border border-sage-100/80 shadow-sm hover:shadow-md hover:border-sage-200 transition-all duration-200"
  >
    <!-- Judul + ikon -->
    <div class="flex items-start justify-between mb-2">
      <p class="text-xs font-medium text-charcoal-muted">{{ title }}</p>
      <div class="w-9 h-9 rounded-full bg-gradient-to-br from-sage-100 to-sage-50 flex items-center justify-center ring-1 ring-sage-200/60">
        <img :src="icon" class="w-5 h-5" alt="" />
      </div>
    </div>

    <p class="text-2xl font-bold text-charcoal">{{ value }}</p>
    <p v-if="trend" class="text-xs text-sage-600 font-medium mt-1">
      {{ trend }}
    </p>
  </div>
</template>
