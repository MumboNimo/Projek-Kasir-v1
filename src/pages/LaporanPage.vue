<script setup>
import { computed } from "vue";

import StatCard from "../components/StatCard.vue";
import StatusBadge from "../components/StatusBadge.vue";

import {
  transaksi,
  formatRupiah,
  getAllTrx,
  getTotalPendapatan,
} from "../data/transaksi.js";

const totalPendapatan = computed(() => getTotalPendapatan());

const jumlahLunas = computed(
  () => transaksi.filter((t) => t.status === "Lunas").length,
);

const jumlahPending = computed(
  () => transaksi.filter((t) => t.status === "Pending").length,
);

// Rata-rata nilai transaksi yang lunas
const rataRata = computed(() => {
  const lunas = transaksi.filter((t) => t.status === "Lunas");
  if (lunas.length === 0) return 0;
  return lunas.reduce((s, t) => s + t.total, 0) / lunas.length;
});

// Hanya hitung dari transaksi Lunas
const rekapMetode = computed(() => {
  const map = {};

  transaksi
    .filter((t) => t.status === "Lunas")
    .forEach((t) => {
      if (!map[t.metodeBayar]) {
        map[t.metodeBayar] = { metode: t.metodeBayar, jumlah: 0, total: 0 };
      }
      map[t.metodeBayar].jumlah++;
      map[t.metodeBayar].total += t.total;
    });

  // Object.values() = ambil semua value dari object map
  // sort descending berdasarkan total
  return Object.values(map).sort((a, b) => b.total - a.total);
});
</script>

<template>
  <div>
    <!-- Header halaman -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-charcoal">Laporan</h1>
      <p class="text-sm text-charcoal-muted mt-0.5">
        Ringkasan performa penjualan
      </p>
    </div>

    <!-- ─── Kartu Statistik ─────────────────────────────────── -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Pendapatan"
        :value="formatRupiah(totalPendapatan)"
        icon="💰"
        trend="dari transaksi Lunas"
      />
      <StatCard
        title="Transaksi Lunas"
        :value="jumlahLunas.toString()"
        icon="✅"
        :trend="`dari ${transaksi.length} total`"
      />
      <StatCard
        title="Transaksi Pending"
        :value="jumlahPending.toString()"
        icon="⏳"
        trend="menunggu pembayaran"
      />
      <StatCard
        title="Rata-rata Nilai"
        :value="formatRupiah(Math.round(rataRata))"
        icon="📈"
        trend="per transaksi lunas"
      />
    </section>

    <!-- ─── Rekap per Metode Bayar ──────────────────────────── -->
    <div
      class="bg-white rounded-2xl border border-sage-100 shadow-sm overflow-hidden mb-6"
    >
      <div class="px-5 py-4 border-b border-sage-100">
        <h3 class="font-semibold text-charcoal">
          Rekapitulasi per Metode Bayar
        </h3>
        <p class="text-xs text-charcoal-muted mt-0.5">
          Hanya dari transaksi yang sudah Lunas
        </p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr
              class="bg-sage-50 text-xs font-semibold uppercase text-charcoal-muted"
            >
              <th class="px-4 py-3 text-left">Metode</th>
              <th class="px-4 py-3 text-left">Jumlah Transaksi</th>
              <th class="px-4 py-3 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="rekap in rekapMetode"
              :key="rekap.metode"
              class="border-b border-sage-100 hover:bg-sage-50 transition-colors"
            >
              <td class="px-4 py-3 font-semibold text-charcoal">
                {{ rekap.metode }}
              </td>
              <td class="px-4 py-3 text-charcoal-muted">
                {{ rekap.jumlah }} transaksi
              </td>
              <td class="px-4 py-3 font-bold text-sage-600">
                {{ formatRupiah(rekap.total) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ─── Semua Transaksi ─────────────────────────────────── -->
    <div
      class="bg-white rounded-2xl border border-sage-100 shadow-sm overflow-hidden"
    >
      <div class="px-5 py-4 border-b border-sage-100">
        <h3 class="font-semibold text-charcoal">Riwayat Semua Transaksi</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr
              class="bg-sage-50 text-xs font-semibold uppercase text-charcoal-muted"
            >
              <th class="px-4 py-3 text-left">ID</th>
              <th class="px-4 py-3 text-left">Tanggal</th>
              <th class="px-4 py-3 text-left">Metode</th>
              <th class="px-4 py-3 text-left">Total</th>
              <th class="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="trx in getAllTrx()"
              :key="trx.id"
              class="border-b border-sage-100 hover:bg-sage-50 transition-colors"
            >
              <td class="px-4 py-3 font-medium text-sage-600">{{ trx.id }}</td>
              <td class="px-4 py-3 text-charcoal-muted">
                {{ trx.tanggal }} · {{ trx.jam }}
              </td>
              <td class="px-4 py-3 text-charcoal-muted">
                {{ trx.metodeBayar }}
              </td>
              <td class="px-4 py-3 font-semibold text-charcoal">
                {{ formatRupiah(trx.total) }}
              </td>
              <td class="px-4 py-3">
                <StatusBadge :status="trx.status" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
