import axios from "axios";

// Recursively convert all object keys from snake_case to camelCase
function toCamel(str) {
  return str.replaceAll(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function transformKeys(value) {
  if (Array.isArray(value)) {
    return value.map(transformKeys);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [toCamel(k), transformKeys(v)]),
    );
  }
  return value;
}

const base = import.meta?.env?.VITE_BASE_URL || "http://localhost:8000";
const api = axios.create({
  baseURL: `${base.replace(/\/$/, "")}/api`,
  headers: { Accept: "application/json" },
});

// Attach Bearer token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("kasir_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Transform snake_case → camelCase on every response (skip binary/blob responses)
api.interceptors.response.use(
  (response) => {
    if (response.config.responseType !== "blob") {
      response.data = transformKeys(response.data);
    }
    return response;
  },
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("kasir_token");
      // Redirect to login (works with history-mode router)
      globalThis.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
