import { ref, computed } from "vue";
import api from "./useApi.js";

// Disimpan di luar fungsi agar semua komponen berbagi satu instance user yang sama
const user = ref(null);

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  async function login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    const data = response.data.data;
    localStorage.setItem("kasir_token", data.token);
    user.value = data.user;
    return data;
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // Swallow error — token may already be invalid
    } finally {
      localStorage.removeItem("kasir_token");
      user.value = null;
    }
  }

  async function fetchMe() {
    try {
      const token = localStorage.getItem("kasir_token");
      if (!token) return false;
      const response = await api.get("/auth/me");
      user.value = response.data.data;
      return true;
    } catch {
      localStorage.removeItem("kasir_token");
      user.value = null;
      return false;
    }
  }

  return { user, isAuthenticated, isAdmin, login, logout, fetchMe };
}
