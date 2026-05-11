<script setup>
import { onMounted } from "vue";

import StokBar from "../components/StokBar.vue";
import { useProducts } from "../composables/useProducts.js";
import { formatRupiah } from "../utils/format.js";

const { products, loading, fetchProducts } = useProducts();
onMounted(fetchProducts);
</script>

<template>
  <div>
    <!-- Header halaman -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-charcoal">Inventori</h1>
      <p class="text-sm text-charcoal-muted mt-0.5">
        {{ products.length }} produk terdaftar
      </p>
    </div>

    <div v-if="loading" class="text-center py-12 text-charcoal-muted text-sm">Memuat...</div>

    <!-- Grid kartu produk -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="p in products"
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
