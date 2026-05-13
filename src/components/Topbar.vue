<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "../composables/useAuth.js";

const route = useRoute();
const { user } = useAuth();
const emit = defineEmits(["toggle-sidebar"]);

const menuMeta = {
  beranda:   { nama: "Beranda",           ikon: "🏠" },
  kasir:     { nama: "Kasir",             ikon: "🛒" },
  transaksi: { nama: "Transaksi",         ikon: "🧾" },
  inventori: { nama: "Inventori",         ikon: "📦" },
  laporan:   { nama: "Laporan",           ikon: "📊" },
  produk:    { nama: "Manajemen Produk",  ikon: "🗂️" },
  pengguna:  { nama: "Manajemen Pengguna",ikon: "👤" },
};

const halamanAktif = computed(() => menuMeta[route.name] ?? { nama: "", ikon: "" });
const userName = computed(() => user.value?.name ?? "KasirKu");
const userRole = computed(() => user.value?.role ?? "");
const userInitials = computed(() => {
  const words = userName.value.trim().split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
});

const tanggalHariIni = new Date().toLocaleDateString("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
</script>

<template>
  <header
    class="h-[72px] bg-white border-b border-sage-100 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0"
  >
    <!-- Kiri: nama halaman + tanggal -->
    <div class="min-w-0 flex items-center gap-3">
      <button
        type="button"
        class="lg:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sage-100 bg-white text-charcoal shadow-sm transition-colors hover:bg-sage-50 focus:outline-none focus:ring-2 focus:ring-sage-400"
        aria-label="Buka menu"
        @click="emit('toggle-sidebar')"
      >
        <span class="text-xl leading-none">☰</span>
      </button>

      <div class="min-w-0">
        <h2 class="text-sm sm:text-base font-semibold text-charcoal flex items-center gap-2 truncate">
          <span>{{ halamanAktif.ikon }}</span>
          <span class="truncate">{{ halamanAktif.nama }}</span>
        </h2>
        <p class="text-[11px] sm:text-xs text-charcoal-muted mt-0.5 truncate">{{ tanggalHariIni }}</p>
      </div>
    </div>

    <!-- Kanan: info user -->
    <div
      class="min-w-0 max-w-[11rem] sm:max-w-[16rem] flex items-center gap-2 rounded-lg border border-sage-100 bg-sage-50/70 px-2.5 py-2 shadow-sm"
    >
      <div
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-400 text-xs font-bold text-white shadow-sm"
      >
        {{ userInitials }}
      </div>
      <div class="min-w-0 text-left">
        <p class="truncate text-xs sm:text-sm font-semibold text-charcoal">{{ userName }}</p>
        <p class="hidden sm:block truncate text-[11px] font-medium uppercase tracking-wide text-sage-600">
          {{ userRole }}
        </p>
      </div>
    </div>
  </header>
</template>
