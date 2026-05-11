import { ref } from "vue";
import api from "./useApi.js";

const products = ref([]);
const loading = ref(false);
const error = ref(null);

async function fetchProducts(kategori = null) {
  loading.value = true;
  error.value = null;
  try {
    const params = kategori ? { kategori } : {};
    const res = await api.get("/products", { params });
    products.value = res.data.data;
  } catch (err) {
    error.value = err.response?.data?.message ?? err.message;
  } finally {
    loading.value = false;
  }
}

async function createProduct(data) {
  const res = await api.post("/products", data);
  return res.data.data;
}

async function updateProduct(id, data) {
  const res = await api.put(`/products/${id}`, data);
  return res.data.data;
}

async function deleteProduct(id) {
  await api.delete(`/products/${id}`);
}

async function adjustStock(id, jumlah) {
  const res = await api.patch(`/products/${id}/stock`, { jumlah });
  return res.data.data;
}

export function useProducts() {
  return { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct, adjustStock };
}
