<script setup>
import {
  currentPage,
  navigateTo,
  menuItems,
} from "../composables/useNavigation.js";
</script>

<template>
  <aside class="w-56 bg-white border-r border-sage-100 flex flex-col shrink-0">
    <!-- Logo -->
    <div class="px-5 py-5 border-b border-sage-100">
      <h1 class="text-xl font-bold text-sage-600">🌿 KasirKu</h1>
      <p class="text-xs text-charcoal-muted mt-0.5">Dashboard UMKM · v1</p>
    </div>

    <nav class="flex-1 p-3 space-y-0.5">
      <button
        v-for="item in menuItems"
        :key="item.id"
        @click="navigateTo(item.id)"
        :class="[
          'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
          currentPage === item.id
            ? 'bg-sage-400 text-white shadow-sm'
            : 'text-charcoal-muted hover:bg-sage-50 hover:text-charcoal',
        ]"
      >
        <span class="text-base leading-none">{{ item.ikon }}</span>
        <span>{{ item.nama }}</span>
      </button>
    </nav>

    <!-- Footer sidebar -->
    <div class="p-4 border-t border-sage-100">
      <p class="text-xs text-center text-charcoal-muted">© 2026 KasirKu</p>
    </div>
  </aside>
</template>
