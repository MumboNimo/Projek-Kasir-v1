import { ref } from "vue";
import api from "./useApi.js";

export function useDashboard() {
  const stats = ref(null);
  const recentTransactions = ref([]);
  const lowStock = ref([]);
  const loading = ref(false);

  async function fetchAll() {
    loading.value = true;
    try {
      const [statsRes, recentRes, lowRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/dashboard/recent-transactions"),
        api.get("/dashboard/low-stock"),
      ]);
      stats.value = statsRes.data.data;
      recentTransactions.value = recentRes.data.data;
      lowStock.value = lowRes.data.data;
    } finally {
      loading.value = false;
    }
  }

  return { stats, recentTransactions, lowStock, loading, fetchAll };
}
