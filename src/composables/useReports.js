import { ref } from "vue";
import api from "./useApi.js";

export function useReports() {
  const summary = ref(null);
  const byPayment = ref([]);
  const loading = ref(false);

  async function fetchAll() {
    loading.value = true;
    try {
      const [summaryRes, byPaymentRes] = await Promise.all([
        api.get("/reports/summary"),
        api.get("/reports/by-payment"),
      ]);
      summary.value = summaryRes.data.data;
      byPayment.value = byPaymentRes.data.data;
    } finally {
      loading.value = false;
    }
  }

  return { summary, byPayment, loading, fetchAll };
}
