<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "../composables/useAuth.js";

const route = useRoute();
const { user } = useAuth();

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
        <span>{{ halamanAktif.ikon }}</span>
        <span>{{ halamanAktif.nama }}</span>
      </h2>
      <p class="text-xs text-charcoal-muted mt-0.5">{{ tanggalHariIni }}</p>
    </div>

    <!-- Kanan: info user -->
    <div class="text-right">
      <p class="text-sm font-semibold text-sage-600">{{ user?.name ?? 'KasirKu' }}</p>
      <p class="text-xs text-charcoal-muted capitalize">{{ user?.role ?? '' }}</p>
    </div>
  </header>
</template>
