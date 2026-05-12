<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const props = defineProps({
  byPayment: { type: Array, default: () => [] },
  transactions: { type: Array, default: () => [] },
});

const barRef = ref(null);
const lineRef = ref(null);
let barChart = null;
let lineChart = null;

const SAGE_600 = "#557155";
const SAGE_400 = "#87a487";
const SAGE_200 = "#cdd9cd";
const CHARCOAL_MUTED = "#7a8585";

const PAYMENT_COLORS = [SAGE_600, SAGE_400, SAGE_200, "#a8c5a8", "#c8dac8"];

const dailyData = computed(() => {
  const map = {};
  for (const trx of props.transactions) {
    if (trx.status === "Lunas") {
      map[trx.tanggal] = (map[trx.tanggal] || 0) + trx.total;
    }
  }
  const labels = Object.keys(map).sort();
  return { labels, values: labels.map((d) => map[d]) };
});

const tickCallback = (v) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}jt`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}rb`;
  return v;
};

const tooltipLabel = (ctx) =>
  ` Rp ${ctx.parsed.y.toLocaleString("id-ID")}`;

function buildBarChart() {
  if (barChart) barChart.destroy();
  if (!barRef.value || !props.byPayment.length) return;

  barChart = new Chart(barRef.value, {
    type: "bar",
    data: {
      labels: props.byPayment.map((p) => p.metodeBayar),
      datasets: [
        {
          label: "Total",
          data: props.byPayment.map((p) => p.total),
          backgroundColor: props.byPayment.map((_, i) => PAYMENT_COLORS[i % PAYMENT_COLORS.length]),
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: tooltipLabel } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: CHARCOAL_MUTED } },
        y: {
          grid: { color: "#e6ede6" },
          ticks: { color: CHARCOAL_MUTED, callback: tickCallback },
        },
      },
    },
  });
}

function buildLineChart() {
  if (lineChart) lineChart.destroy();
  if (!lineRef.value || !dailyData.value.labels.length) return;

  lineChart = new Chart(lineRef.value, {
    type: "line",
    data: {
      labels: dailyData.value.labels,
      datasets: [
        {
          label: "Pendapatan",
          data: dailyData.value.values,
          borderColor: SAGE_600,
          backgroundColor: "rgba(85,113,85,0.12)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: SAGE_600,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: tooltipLabel } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: CHARCOAL_MUTED } },
        y: {
          grid: { color: "#e6ede6" },
          ticks: { color: CHARCOAL_MUTED, callback: tickCallback },
        },
      },
    },
  });
}

function initCharts() {
  buildBarChart();
  buildLineChart();
}

watch([() => props.byPayment, dailyData], initCharts, { deep: true });
onMounted(initCharts);
onBeforeUnmount(() => {
  barChart?.destroy();
  lineChart?.destroy();
});
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
    <!-- Bar chart: per metode bayar -->
    <div class="bg-white rounded-2xl border border-sage-100 shadow-sm p-5">
      <h3 class="font-semibold text-charcoal">Total per Metode Bayar</h3>
      <p class="text-xs text-charcoal-muted mt-0.5 mb-4">
        Pendapatan dari transaksi Lunas
      </p>
      <div class="h-52">
        <canvas ref="barRef"></canvas>
      </div>
    </div>

    <!-- Line chart: tren harian -->
    <div class="bg-white rounded-2xl border border-sage-100 shadow-sm p-5">
      <h3 class="font-semibold text-charcoal">Tren Pendapatan Harian</h3>
      <p class="text-xs text-charcoal-muted mt-0.5 mb-4">
        Akumulasi transaksi Lunas per hari
      </p>
      <div class="h-52">
        <canvas ref="lineRef"></canvas>
      </div>
    </div>
  </div>
</template>
