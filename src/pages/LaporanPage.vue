<script setup>
import { onMounted } from "vue";

import StatCard from "../components/StatCard.vue";
import StatusBadge from "../components/StatusBadge.vue";
import LaporanChart from "../components/LaporanChart.vue";

import { useReports } from "../composables/useReports.js";
import { useTransactions } from "../composables/useTransactions.js";
import { formatRupiah } from "../utils/format.js";

const { summary, byPayment, loading: loadingReports, fetchAll } = useReports();
const {
  transactions,
  loading: loadingTrx,
  fetchTransactions,
} = useTransactions();

onMounted(() => {
  fetchAll();
  fetchTransactions();
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
        :value="summary ? formatRupiah(summary.totalPendapatan) : '—'"
        icon="💰"
        trend="dari transaksi Lunas"
      />
      <StatCard
        title="Transaksi Lunas"
        :value="summary ? summary.jumlahLunas.toString() : '—'"
        icon="✅"
        :trend="summary ? `dari ${summary.totalTransaksi} total` : ''"
      />
      <StatCard
        title="Transaksi Pending"
        :value="summary ? summary.jumlahPending.toString() : '—'"
        icon="⏳"
        trend="menunggu pembayaran"
      />
      <StatCard
        title="Rata-rata Nilai"
        :value="summary ? formatRupiah(summary.rataRata) : '—'"
        icon="📈"
        trend="per transaksi lunas"
      />
    </section>

    <!-- ─── Grafik ───────────────────────────────────────────── -->
    <LaporanChart :byPayment="byPayment" :transactions="transactions" />

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
              v-for="rekap in byPayment"
              :key="rekap.metodeBayar"
              class="border-b border-sage-100 hover:bg-sage-50 transition-colors"
            >
              <td class="px-4 py-3 font-semibold text-charcoal">
                {{ rekap.metodeBayar }}
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
      <div
        v-if="loadingTrx"
        class="py-8 text-center text-sm text-charcoal-muted"
      >
        Memuat...
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr
              class="bg-sage-50 text-xs font-semibold uppercase text-charcoal-muted"
            >
              <th class="px-4 py-3 text-left">Kode</th>
              <th class="px-4 py-3 text-left">Tanggal</th>
              <th class="px-4 py-3 text-left">Metode</th>
              <th class="px-4 py-3 text-left">Total</th>
              <th class="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="trx in transactions"
              :key="trx.id"
              class="border-b border-sage-100 hover:bg-sage-50 transition-colors"
            >
              <td class="px-4 py-3 font-medium text-sage-600">
                {{ trx.kode }}
              </td>
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
