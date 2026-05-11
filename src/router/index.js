import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../composables/useAuth.js";

import LoginPage from "../pages/LoginPage.vue";
import AuthLayout from "../layouts/AuthLayout.vue";
import BerandaPage from "../pages/BerandaPage.vue";
import TransaksiPage from "../pages/TransaksiPage.vue";
import InventoriPage from "../pages/InventoriPage.vue";
import LaporanPage from "../pages/LaporanPage.vue";
import KasirPage from "../pages/KasirPage.vue";
import ManajemenProdukPage from "../pages/ManajemenProdukPage.vue";
import ManajemenPenggunaPage from "../pages/ManajemenPenggunaPage.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/",
    component: AuthLayout,
    meta: { requiresAuth: true },
    redirect: "/beranda",
    children: [
      { path: "beranda", name: "beranda", component: BerandaPage },
      { path: "transaksi", name: "transaksi", component: TransaksiPage },
      { path: "inventori", name: "inventori", component: InventoriPage },
      { path: "laporan", name: "laporan", component: LaporanPage },
      { path: "kasir", name: "kasir", component: KasirPage },
      {
        path: "produk",
        name: "produk",
        component: ManajemenProdukPage,
        meta: { requiresAdmin: true },
      },
      {
        path: "pengguna",
        name: "pengguna",
        component: ManajemenPenggunaPage,
        meta: { requiresAdmin: true },
      },
    ],
  },
  // Catch-all redirect
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to) => {
  const { isAuthenticated, isAdmin, fetchMe } = useAuth();

  if (to.meta.requiresAuth) {
    if (!isAuthenticated.value) {
      const ok = await fetchMe();
      if (!ok) return { name: "login" };
    }
    if (to.meta.requiresAdmin && !isAdmin.value) {
      return { name: "beranda" };
    }
  }

  // If already authenticated and going to /login, redirect to dashboard
  if (to.name === "login" && isAuthenticated.value) {
    return { name: "beranda" };
  }
});

export default router;
