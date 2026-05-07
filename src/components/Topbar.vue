<script setup>
import { computed } from "vue";
import { currentPage, menuItems } from "../composables/useNavigation.js";

// Cari item menu yang id-nya cocok dengan halaman aktif
const halamanAktif = computed(() =>
  menuItems.find((m) => m.id === currentPage.value),
);

// Tanggal hari ini dalam format Indonesia lengkap
const tanggalHariIni = new Date().toLocaleDateString("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
</script>

<template>
  <header
    class="bg-white border-b border-sage-100 px-6 py-4 flex items-center justify-between shrink-0"
  >
    <!-- Kiri: nama halaman + tanggal -->
    <div>
      <h2 class="text-base font-semibold text-charcoal flex items-center gap-2">
        <span>{{ halamanAktif?.ikon }}</span>
        <span>{{ halamanAktif?.nama }}</span>
      </h2>
      <p class="text-xs text-charcoal-muted mt-0.5">{{ tanggalHariIni }}</p>
    </div>

    <!-- Kanan: info toko -->
    <div class="text-right">
      <p class="text-sm font-semibold text-sage-600">Toko Segar Jaya</p>
      <p class="text-xs text-charcoal-muted">Sidoarjo, Jawa Timur</p>
    </div>
  </header>
</template>
