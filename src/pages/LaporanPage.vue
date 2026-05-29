<script setup>
import { onMounted, ref, computed } from "vue";

import StatCard from "../components/StatCard.vue";
import StatusBadge from "../components/StatusBadge.vue";
import LaporanChart from "../components/LaporanChart.vue";

import { useReports } from "../composables/useReports.js";
import { useTransactions } from "../composables/useTransactions.js";
import { formatRupiah } from "../utils/format.js";
import { icons } from "../utils/icons.js";
import { downloadReport } from "../utils/exportCsv.js";
import { tampilNotif } from "../composables/useNotif.js";

const { summary, byPayment, loading: loadingReports, fetchAll } = useReports();
const {
  transactions,
  loading: loadingTrx,
  fetchTransactions,
} = useTransactions();

const activePeriod = ref("semua");

const periodOptions = [
  { key: "semua", label: "Semua" },
  { key: "bulanan", label: "Bulanan" },
  { key: "mingguan", label: "Mingguan" },
  { key: "harian", label: "Harian" },
];

const filteredTransactions = computed(() => {
  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7);

  if (activePeriod.value === "harian") {
    return transactions.value.filter((trx) => trx.tanggal === today);
  }
  if (activePeriod.value === "mingguan") {
    const now = new Date();
    const day = now.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const start = monday.toISOString().slice(0, 10);
    const end = sunday.toISOString().slice(0, 10);
    return transactions.value.filter(
      (trx) => trx.tanggal >= start && trx.tanggal <= end
    );
  }
  if (activePeriod.value === "bulanan") {
    return transactions.value.filter((trx) =>
      trx.tanggal.startsWith(currentMonth)
    );
  }
  return transactions.value;
});

const exporting = ref(false);

async function handleExport(format) {
  if (exporting.value) return;
  exporting.value = true;
  try {
    await downloadReport(activePeriod.value, format);
  } catch {
    tampilNotif("Gagal mengunduh laporan.");
  } finally {
    exporting.value = false;
  }
}

onMounted(() => {
  fetchAll();
  fetchTransactions();
});
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-xl sm:text-2xl font-bold text-charcoal">Laporan</h1>
      <p class="text-sm text-charcoal-muted mt-0.5">
        Ringkasan performa penjualan
      </p>
    </div>

    <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Pendapatan"
        :value="summary ? formatRupiah(summary.totalPendapatan) : '—'"
        :icon="icons.pendapatan"
        trend="dari transaksi Lunas"
      />
      <StatCard
        title="Transaksi Lunas"
        :value="summary ? summary.jumlahLunas.toString() : '—'"
        :icon="icons.sukses"
        :trend="summary ? `dari ${summary.totalTransaksi} total` : ''"
      />
      <StatCard
        title="Transaksi Pending"
        :value="summary ? summary.jumlahPending.toString() : '—'"
        :icon="icons.pending"
        trend="menunggu pembayaran"
      />
      <StatCard
        title="Rata-rata Nilai"
        :value="summary ? formatRupiah(summary.rataRata) : '—'"
        :icon="icons.tren"
        trend="per transaksi lunas"
      />
    </section>

    <LaporanChart :byPayment="byPayment" :transactions="transactions" />

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

    <div
      class="bg-white rounded-2xl border border-sage-100 shadow-sm overflow-hidden"
    >
      <div
        class="px-5 py-4 border-b border-sage-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <h3 class="font-semibold text-charcoal">Riwayat Transaksi</h3>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Filter periode -->
          <div class="flex items-center gap-1 bg-sage-50 p-1 rounded-xl">
            <button
              v-for="opt in periodOptions"
              :key="opt.key"
              @click="activePeriod = opt.key"
              :class="[
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                activePeriod === opt.key
                  ? 'bg-white text-sage-700 shadow-sm font-semibold'
                  : 'text-charcoal-muted hover:text-charcoal',
              ]"
            >
              {{ opt.label }}
            </button>
          </div>

          <!-- Tombol export -->
          <button
            @click="handleExport('csv')"
            :disabled="exporting"
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-sage-200 text-sage-700 hover:bg-sage-50 transition-all disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {{ exporting ? 'Mengunduh...' : 'CSV' }}
          </button>
          <button
            @click="handleExport('xlsx')"
            :disabled="exporting"
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-sage-200 text-sage-700 hover:bg-sage-50 transition-all disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {{ exporting ? 'Mengunduh...' : 'Excel' }}
          </button>
        </div>
      </div>
      <div
        v-if="loadingTrx"
        class="py-8 text-center text-sm text-charcoal-muted"
      >
        Memuat...
      </div>
      <div v-else-if="filteredTransactions.length === 0" class="py-10 text-center text-sm text-charcoal-muted">
        Tidak ada transaksi untuk periode ini.
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
              v-for="trx in filteredTransactions"
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
