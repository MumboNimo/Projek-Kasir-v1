<script setup>
import { ref, computed } from "vue";

import StatusBadge from "../components/StatusBadge.vue";

import { transaksi, formatRupiah, getAllTrx } from "../data/transaksi.js";

// ─── Filter ──────────────────────────────────────────────────
// ref() untuk menyimpan filter yang sedang aktif
const filterAktif = ref("Semua");
const opsiFilter = ["Semua", "Lunas", "Pending"];

// computed() — dihitung ulang otomatis saat filterAktif berubah
const transaksiTampil = computed(() => {
  const semua = getAllTrx();
  if (filterAktif.value === "Semua") return semua;
  return semua.filter((t) => t.status === filterAktif.value);
});
</script>

<template>
  <div>
    <!-- Header halaman -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-charcoal">Transaksi</h1>
      <p class="text-sm text-charcoal-muted mt-0.5">
        Semua transaksi penjualan
      </p>
    </div>

    <!-- Filter tab -->
    <div class="flex gap-2 mb-5">
      <button
        v-for="opsi in opsiFilter"
        :key="opsi"
        @click="filterAktif = opsi"
        :class="[
          'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
          filterAktif === opsi
            ? 'bg-sage-400 text-white'
            : 'bg-white border border-sage-100 text-charcoal-muted hover:bg-sage-50',
        ]"
      >
        {{ opsi }}
      </button>
      <span class="ml-auto text-xs text-charcoal-muted self-center">
        {{ transaksiTampil.length }} transaksi
      </span>
    </div>

    <!-- Tabel transaksi -->
    <div
      class="bg-white rounded-2xl border border-sage-100 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr
              class="bg-sage-50 text-xs font-semibold uppercase text-charcoal-muted"
            >
              <th class="px-4 py-3 text-left">ID</th>
              <th class="px-4 py-3 text-left">Tanggal & Jam</th>
              <th class="px-4 py-3 text-left">Item</th>
              <th class="px-4 py-3 text-left">Bayar</th>
              <th class="px-4 py-3 text-left">Total</th>
              <th class="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="trx in transaksiTampil"
              :key="trx.id"
              class="border-b border-sage-100 hover:bg-sage-50 transition-colors"
            >
              <td class="px-4 py-3 font-medium text-sage-600">{{ trx.id }}</td>
              <td class="px-4 py-3 text-charcoal-muted">
                {{ trx.tanggal }} · {{ trx.jam }}
              </td>
              <td class="px-4 py-3 text-charcoal-muted">
                {{ trx.items.length }} item
              </td>
              <td class="px-4 py-3 text-charcoal-muted">
                {{ trx.metodeBayar }}
              </td>
              <td class="px-4 py-3 font-semibold text-charcoal">
                {{ formatRupiah(trx.total) }}
              </td>
              <td class="px-4 py-3"><StatusBadge :status="trx.status" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
