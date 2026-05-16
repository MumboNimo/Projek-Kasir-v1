<script setup>
import { ref, computed, onMounted } from "vue";

import StokBar from "../components/StokBar.vue";
import { useProducts } from "../composables/useProducts.js";
import { formatRupiah } from "../utils/format.js";

const { products, loading, fetchProducts } = useProducts();
onMounted(fetchProducts);

const FILTERS = [
  { label: "Semua", value: "semua" },
  { label: "Tersedia", value: "tersedia" },
  { label: "Menipis", value: "menipis" },
  { label: "Habis", value: "habis" },
];

const filterAktif = ref("semua");

function statusStok(stok) {
  if (stok === 0) return "habis";
  if (stok <= 5) return "menipis";
  return "tersedia";
}

const produkTersaring = computed(() => {
  if (filterAktif.value === "semua") return products.value;
  return products.value.filter((p) => statusStok(p.stok) === filterAktif.value);
});
</script>

<template>
  <div>
    <div class="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-charcoal">Inventori</h1>
        <p class="text-sm text-charcoal-muted mt-0.5">
          {{ produkTersaring.length }} dari {{ products.length }} produk
        </p>
      </div>

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

    <div v-if="loading" class="text-center py-12 text-charcoal-muted text-sm">
      Memuat...
    </div>

    <div
      v-else-if="produkTersaring.length === 0"
      class="text-center py-12 text-charcoal-muted text-sm"
    >
      Tidak ada produk dengan status <strong>{{ filterAktif }}</strong
      >.
    </div>

    <div
      v-else
      class="bg-white rounded-2xl border border-sage-100 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr
              class="bg-sage-50 text-xs font-semibold uppercase text-charcoal-muted"
            >
              <th class="px-4 py-3 text-left">Kode</th>
              <th class="px-4 py-3 text-left">Nama</th>
              <th class="px-4 py-3 text-left">Kategori</th>
              <th class="px-4 py-3 text-left">Harga</th>
              <th class="px-4 py-3 text-left">Stok / Max</th>
              <th class="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in produkTersaring"
              :key="p.id"
              class="border-b border-sage-100 hover:bg-sage-50 transition-colors"
            >
              <td class="px-4 py-3 font-medium text-sage-600">{{ p.kode }}</td>
              <td class="px-4 py-3 font-medium text-charcoal">{{ p.nama }}</td>
              <td class="px-4 py-3 text-charcoal-muted">{{ p.kategori }}</td>
              <td class="px-4 py-3 font-semibold text-charcoal">
                {{ formatRupiah(p.harga) }}
              </td>
              <td class="px-4 py-3 text-charcoal-muted">
                <StokBar :stok="p.stok" :max-stok="p.maxStok" />
              </td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'text-xs font-medium px-2.5 py-1 rounded-full',
                    statusStok(p.stok) === 'tersedia'
                      ? 'bg-sage-100 text-sage-600'
                      : statusStok(p.stok) === 'menipis'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-500',
                  ]"
                >
                  {{ statusStok(p.stok) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
