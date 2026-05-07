<script setup>
import StokBar from "../components/StokBar.vue";

import { produk } from "../data/produk.js";
</script>

<template>
  <div>
    <!-- Header halaman -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-charcoal">Inventori</h1>
      <p class="text-sm text-charcoal-muted mt-0.5">
        {{ produk.length }} produk terdaftar
      </p>
    </div>

    <!-- Grid kartu produk -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="p in produk"
        :key="p.id"
        class="bg-white rounded-2xl border border-sage-100 shadow-sm p-5 flex flex-col gap-3"
      >
        <!-- Baris atas: nama + badge kategori -->
        <div class="flex items-start justify-between">
          <div>
            <p class="font-semibold text-charcoal text-sm">{{ p.nama }}</p>
            <p class="text-xs text-charcoal-muted mt-0.5">{{ p.id }}</p>
          </div>
          <span
            class="text-xs bg-sage-100 text-sage-600 font-medium px-2.5 py-1 rounded-full shrink-0"
          >
            {{ p.kategori }}
          </span>
        </div>

        <!-- Harga -->
        <p class="text-lg font-bold text-sage-600">
          Rp {{ p.harga.toLocaleString("id-ID") }}
        </p>

        <!-- Progress bar stok -->
        <StokBar :stok="p.stok" :max-stok="p.maxStok" />
      </div>
    </div>
  </div>
</template>
