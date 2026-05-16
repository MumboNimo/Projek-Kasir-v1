<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "../composables/useAuth.js";
import { icons } from "../utils/icons.js";

defineEmits(["toggle-sidebar"]);

const route = useRoute();
const { user } = useAuth();

const menuMeta = {
  beranda: { nama: "Beranda", ikon: icons.beranda },
  kasir: { nama: "Kasir", ikon: icons.kasir },
  transaksi: { nama: "Transaksi", ikon: icons.transaksi },
  inventori: { nama: "Inventori", ikon: icons.inventori },
  laporan: { nama: "Laporan", ikon: icons.laporan },
  produk: { nama: "Manajemen Produk", ikon: icons.produk },
  pengguna: { nama: "Manajemen Pengguna", ikon: icons.pengguna },
};

const halamanAktif = computed(
  () => menuMeta[route.name] ?? { nama: "", ikon: null },
);

const tanggalHariIni = new Date().toLocaleDateString("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
</script>

<template>
  <header
    class="bg-white border-b border-sage-100 px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between shrink-0 gap-3"
  >
    <div class="flex items-center gap-3 min-w-0">
      <button
        class="lg:hidden p-2 rounded-xl hover:bg-sage-50 transition-colors shrink-0"
        @click="$emit('toggle-sidebar')"
        aria-label="Buka menu"
      >
        <img :src="icons.menu" class="w-5 h-5 opacity-60" alt="" />
      </button>

      <div class="min-w-0">
        <h2
          class="text-sm sm:text-base font-semibold text-charcoal flex items-center gap-2 truncate"
        >
          <img
            v-if="halamanAktif.ikon"
            :src="halamanAktif.ikon"
            class="w-4 h-4 opacity-70 shrink-0"
            alt=""
          />
          <span class="truncate">{{ halamanAktif.nama }}</span>
        </h2>
        <p class="text-xs text-charcoal-muted mt-0.5 hidden sm:block">
          {{ tanggalHariIni }}
        </p>
      </div>
    </div>

    <div class="text-right shrink-0">
      <p
        class="text-sm font-semibold text-sage-600 truncate max-w-[120px] sm:max-w-none"
      >
        {{ user?.name ?? "KasirKu" }}
      </p>
      <p class="text-xs text-charcoal-muted capitalize hidden sm:block">
        {{ user?.role ?? "" }}
      </p>
    </div>
  </header>
</template>
