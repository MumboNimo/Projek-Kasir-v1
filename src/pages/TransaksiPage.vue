<script setup>
import { ref, watch, onMounted } from "vue";

import StatusBadge from "../components/StatusBadge.vue";

import { useTransactions } from "../composables/useTransactions.js";
import { formatRupiah } from "../utils/format.js";

const { transactions, loading, fetchTransactions, updateStatus } = useTransactions();

const filterAktif = ref("Semua");
const opsiFilter = ["Semua", "Lunas", "Pending"];

onMounted(() => fetchTransactions(filterAktif.value));
watch(filterAktif, (val) => fetchTransactions(val));

async function toggleStatus(trx) {
  const newStatus = trx.status === "Lunas" ? "Pending" : "Lunas";
  await updateStatus(trx.id, newStatus);
  await fetchTransactions(filterAktif.value);
}
</script>

<template>
  <div>
    <!-- Header halaman -->
    <div class="mb-6">
      <h1 class="text-xl sm:text-2xl font-bold text-charcoal">Transaksi</h1>
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
        {{ transactions.length }} transaksi
      </span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-charcoal-muted text-sm">Memuat...</div>

    <!-- Tabel transaksi -->
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
              <th class="px-4 py-3 text-left">Tanggal &amp; Jam</th>
              <th class="px-4 py-3 text-left">Item</th>
              <th class="px-4 py-3 text-left">Bayar</th>
              <th class="px-4 py-3 text-left">Total</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="trx in transactions"
              :key="trx.id"
              class="border-b border-sage-100 hover:bg-sage-50 transition-colors"
            >
              <td class="px-4 py-3 font-medium text-sage-600">{{ trx.kode }}</td>
              <td class="px-4 py-3 text-charcoal-muted">
                {{ trx.tanggal }} · {{ trx.jam }}
              </td>
              <td class="px-4 py-3 text-charcoal-muted">
                {{ trx.items?.length ?? 0 }} item
              </td>
              <td class="px-4 py-3 text-charcoal-muted">
                {{ trx.metodeBayar }}
              </td>
              <td class="px-4 py-3 font-semibold text-charcoal">
                {{ formatRupiah(trx.total) }}
              </td>
              <td class="px-4 py-3"><StatusBadge :status="trx.status" /></td>
              <td class="px-4 py-3">
                <button
                  @click="toggleStatus(trx)"
                  class="text-xs px-2.5 py-1 rounded-lg border border-sage-100 text-charcoal-muted hover:bg-sage-50 transition-colors"
                >
                  {{ trx.status === 'Lunas' ? 'Tandai Pending' : 'Tandai Lunas' }}
                </button>
              </td>
            </tr>
            <tr v-if="transactions.length === 0">
              <td colspan="7" class="px-4 py-8 text-center text-charcoal-muted text-sm">
                Tidak ada transaksi.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
