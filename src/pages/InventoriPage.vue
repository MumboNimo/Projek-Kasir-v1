<script setup>
import { ref, computed, onMounted } from "vue";

import StokBar from "../components/StokBar.vue";
import { useProducts } from "../composables/useProducts.js";
import { formatRupiah } from "../utils/format.js";

const { products, loading, fetchProducts } = useProducts();
onMounted(fetchProducts);

const FILTERS = [
  { label: "Semua",   value: "semua" },
  { label: "Tersedia", value: "tersedia" },
  { label: "Menipis",  value: "menipis" },
  { label: "Habis",    value: "habis" },
];

const filterAktif = ref("semua");

function statusStok(stok) {
  if (stok === 0) return "habis";
  if (stok <= 5)  return "menipis";
  return "tersedia";
}

const produkTersaring = computed(() => {
  if (filterAktif.value === "semua") return products.value;
  return products.value.filter((p) => statusStok(p.stok) === filterAktif.value);
});
</script>

<template>
  <div>
    <!-- Header halaman -->
    <div class="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-charcoal">Inventori</h1>
        <p class="text-sm text-charcoal-muted mt-0.5">
          {{ produkTersaring.length }} dari {{ products.length }} produk
        </p>
      </div>

      <!-- Filter ketersediaan stok -->
      <div class="flex items-center gap-1.5 flex-wrap justify-end">
        <button
          v-for="f in FILTERS"
          :key="f.value"
          @click="filterAktif = f.value"
          :class="[
            'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
            filterAktif === f.value
              ? 'bg-sage-400 text-white shadow-sm'
              : 'bg-white border border-sage-100 text-charcoal-muted hover:border-sage-300 hover:text-charcoal',
          ]"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12 text-charcoal-muted text-sm">Memuat...</div>

    <!-- Kosong setelah filter -->
    <div
      v-else-if="produkTersaring.length === 0"
      class="text-center py-12 text-charcoal-muted text-sm"
    >
      Tidak ada produk dengan status <strong>{{ filterAktif }}</strong>.
    </div>

    <!-- Grid kartu produk -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="p in produkTersaring"
        :key="p.id"
        class="bg-white rounded-2xl border border-sage-100 shadow-sm p-5 flex flex-col gap-3"
      >
        <!-- Baris atas: nama + badge kategori -->
        <div class="flex items-start justify-between">
          <div>
            <p class="font-semibold text-charcoal text-sm">{{ p.nama }}</p>
            <p class="text-xs text-charcoal-muted mt-0.5">{{ p.kode }}</p>
          </div>
          <span
            class="text-xs bg-sage-100 text-sage-600 font-medium px-2.5 py-1 rounded-full shrink-0"
          >
            {{ p.kategori }}
          </span>
        </div>

        <!-- Harga -->
        <p class="text-lg font-bold text-sage-600">
          {{ formatRupiah(p.harga) }}
        </p>

        <!-- Progress bar stok -->
        <StokBar :stok="p.stok" :max-stok="p.maxStok" />
      </div>
    </div>
  </div>
</template>
