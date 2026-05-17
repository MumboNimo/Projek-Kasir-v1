<script setup>
import { computed, onMounted } from "vue";

import StatCard from "../components/StatCard.vue";
import StatusBadge from "../components/StatusBadge.vue";
import StokBar from "../components/StokBar.vue";

import { useDashboard } from "../composables/useDashboard.js";
import { formatRupiah } from "../utils/format.js";
import { icons } from "../utils/icons.js";

const { stats, recentTransactions, lowStock, loading, fetchAll } =
  useDashboard();

onMounted(fetchAll);

const statistik = computed(() => [
  {
    id: 1,
    title: "Total Pendapatan",
    value: stats.value ? formatRupiah(stats.value.totalPendapatan) : "—",
    icon: icons.pendapatan,
    trend: "↗ dari transaksi Lunas",
  },
  {
    id: 2,
    title: "Total Transaksi",
    value: stats.value ? stats.value.totalTransaksi.toString() : "—",
    icon: icons.transaction,
    trend: "↗ data aktif",
  },
  {
    id: 3,
    title: "Produk Tersedia",
    value: stats.value ? stats.value.totalProduk.toString() : "—",
    icon: icons.box,
    trend: "↗ semua aktif",
  },
  {
    id: 4,
    title: "Stok Menipis",
    value: stats.value ? stats.value.stokMenipis.toString() : "—",
    icon: icons.warning,
    trend: "perlu restock",
  },
]);
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-xl sm:text-2xl font-bold text-charcoal">Beranda</h1>
      <p class="text-sm text-charcoal-muted mt-0.5">
        Ringkasan aktivitas toko hari ini
      </p>
    </div>
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        v-for="stat in statistik"
        :key="stat.id"
        :title="stat.title"
        :value="stat.value"
        :icon="stat.icon"
        :trend="stat.trend"
      />
    </section>
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div
        class="lg:col-span-2 bg-white rounded-2xl border border-sage-100 shadow-sm overflow-hidden"
      >
        <div class="px-5 py-4 border-b border-sage-100">
          <h3 class="font-semibold text-charcoal">Transaksi Terakhir</h3>
          <p class="text-xs text-charcoal-muted mt-0.5">5 transaksi terbaru</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr
                class="bg-sage-50 text-xs font-semibold uppercase text-charcoal-muted"
              >
                <th class="px-4 py-3 text-left">ID</th>
                <th class="px-4 py-3 text-left">Tanggal</th>
                <th class="px-4 py-3 text-left">Total</th>
                <th class="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="trx in recentTransactions"
                :key="trx.id"
                class="border-b border-sage-100 hover:bg-sage-50 transition-colors"
              >
                <td class="px-4 py-3 font-medium text-sage-600">
                  {{ trx.kode }}
                </td>
                <td class="px-4 py-3 text-charcoal-muted">
                  {{ trx.tanggal }} · {{ trx.jam }}
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
      <div class="bg-white rounded-2xl border border-sage-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-semibold text-charcoal">Stok Menipis</h3>
            <p class="text-xs text-charcoal-muted mt-0.5">
              Perlu restock segera
            </p>
          </div>
          <img :src="icons.peringatan" class="w-5 h-5 opacity-60" alt="" />
        </div>
        <div
          v-if="lowStock.length === 0"
          class="py-6 text-center text-sm text-charcoal-muted"
        >
          Semua stok aman!
        </div>
        <div v-else class="space-y-4">
          <div v-for="item in lowStock" :key="item.id">
            <p class="text-sm font-medium text-charcoal mb-1.5">
              {{ item.nama }}
            </p>
            <StokBar :stok="item.stok" :max-stok="item.maxStok" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
