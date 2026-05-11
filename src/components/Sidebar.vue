<script setup>
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "../composables/useAuth.js";

const router = useRouter();
const route = useRoute();
const { user, isAdmin, logout } = useAuth();

const menuItems = [
  { id: "beranda", nama: "Beranda", ikon: "🏠" },
  { id: "kasir", nama: "Kasir", ikon: "🛒" },
  { id: "transaksi", nama: "Transaksi", ikon: "🧾" },
  { id: "inventori", nama: "Inventori", ikon: "📦" },
  { id: "laporan", nama: "Laporan", ikon: "📊" },
];

const adminMenuItems = [
  { id: "produk", nama: "Manajemen Produk", ikon: "🗂️" },
  { id: "pengguna", nama: "Manajemen Pengguna", ikon: "👤" },
];

async function handleLogout() {
  await logout();
  router.push({ name: "login" });
}
</script>

<template>
  <aside class="w-56 bg-white border-r border-sage-100 flex flex-col shrink-0">
    <!-- Logo -->
    <div class="px-5 py-5 border-b border-sage-100">
      <h1 class="text-xl font-bold text-sage-600">🌿 KasirKu</h1>
      <p class="text-xs text-charcoal-muted mt-0.5">Dashboard UMKM · v1</p>
    </div>

    <nav class="flex-1 p-3 space-y-0.5 overflow-y-auto">
      <RouterLink
        v-for="item in menuItems"
        :key="item.id"
        :to="{ name: item.id }"
        :class="[
          'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
          route.name === item.id
            ? 'bg-sage-400 text-white shadow-sm'
            : 'text-charcoal-muted hover:bg-sage-50 hover:text-charcoal',
        ]"
      >
        <span class="text-base leading-none">{{ item.ikon }}</span>
        <span>{{ item.nama }}</span>
      </RouterLink>

      <!-- Admin-only routes -->
      <template v-if="isAdmin">
        <div class="pt-3 pb-1 px-4">
          <p class="text-[10px] font-semibold uppercase tracking-widest text-charcoal-muted">
            Admin
          </p>
        </div>
        <RouterLink
          v-for="item in adminMenuItems"
          :key="item.id"
          :to="{ name: item.id }"
          :class="[
            'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
            route.name === item.id
              ? 'bg-sage-400 text-white shadow-sm'
              : 'text-charcoal-muted hover:bg-sage-50 hover:text-charcoal',
          ]"
        >
          <span class="text-base leading-none">{{ item.ikon }}</span>
          <span>{{ item.nama }}</span>
        </RouterLink>
      </template>
    </nav>

    <!-- User info + Logout -->
    <div class="p-4 border-t border-sage-100 space-y-2">
      <div v-if="user" class="px-1">
        <p class="text-xs font-semibold text-charcoal truncate">{{ user.name }}</p>
        <p class="text-[11px] text-charcoal-muted capitalize">{{ user.role }}</p>
      </div>
      <button
        @click="handleLogout"
        class="w-full text-xs text-left px-3 py-2 rounded-xl text-charcoal-muted hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
      >
        🚪 Keluar
      </button>
    </div>
  </aside>
</template>
