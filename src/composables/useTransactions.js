import { ref } from "vue";
import api from "./useApi.js";

const transactions = ref([]);
const loading = ref(false);
const error = ref(null);

async function fetchTransactions(status = null) {
  loading.value = true;
  error.value = null;
  try {
    const params = status && status !== "Semua" ? { status } : {};
    const res = await api.get("/transactions", { params });
    transactions.value = res.data.data;
  } catch (err) {
    error.value = err.response?.data?.message ?? err.message;
  } finally {
    loading.value = false;
  }
}

async function createTransaction(data) {
  const res = await api.post("/transactions", data);
  return res.data.data;
}

async function updateStatus(id, status) {
  const res = await api.patch(`/transactions/${id}/status`, { status });
  return res.data.data;
}

export function useTransactions() {
  return { transactions, loading, error, fetchTransactions, createTransaction, updateStatus };
}
