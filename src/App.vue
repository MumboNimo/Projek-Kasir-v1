<script setup>
// import { computed } = kita butuh computed property
import { computed } from "vue";

// Import komponen layout
import Sidebar from "./components/Sidebar.vue";
import Topbar from "./components/Topbar.vue";

// Import semua halaman
import BerandaPage from "./pages/BerandaPage.vue";
import TransaksiPage from "./pages/TransaksiPage.vue";
import InventoriPage from "./pages/InventoriPage.vue";
import LaporanPage from "./pages/LaporanPage.vue";

// Import state navigasi (shared — satu sumber kebenaran)
import { currentPage } from "./composables/useNavigation.js";
import { notif } from "./composables/useNotif.js";

// Peta nama halaman → komponen
const halamanMap = {
  beranda: BerandaPage,
  transaksi: TransaksiPage,
  inventori: InventoriPage,
  laporan: LaporanPage,
};

// Di sini: berubah saat currentPage berubah → komponen halaman ganti
const HalamanAktif = computed(
  () => halamanMap[currentPage.value] || BerandaPage,
);
</script>

<template>
  <div class="flex h-screen bg-cream-100 font-sans overflow-hidden">
    <!-- Sidebar navigasi kiri -->
    <Sidebar />

    <!-- Area kanan: topbar + konten halaman -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <Topbar />

      <main class="flex-1 overflow-y-auto p-6 lg:p-8">
        <component :is="HalamanAktif" />
      </main>
    </div>
  </div>

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
