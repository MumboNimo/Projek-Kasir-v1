<script setup>
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "../composables/useAuth.js";

const router = useRouter();
const route = useRoute();
const { user, isAdmin, logout } = useAuth();
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["close"]);

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
  emit("close");
  await logout();
  router.push({ name: "login" });
}
</script>

<template>
  <Transition name="sidebar-backdrop">
    <button
      v-if="props.open"
      type="button"
      class="fixed inset-0 z-30 bg-charcoal/40 lg:hidden"
      aria-label="Tutup menu"
      @click="emit('close')"
    />
  </Transition>

  <aside
    :class="[
      props.open ? 'translate-x-0' : '-translate-x-full',
      'fixed inset-y-0 left-0 z-40 w-72 max-w-[calc(100vw-2rem)] bg-white border-r border-sage-100 flex flex-col shrink-0 shadow-2xl transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-60 lg:max-w-none lg:translate-x-0 lg:shadow-none',
    ]"
  >
    <!-- Logo -->
    <div class="h-[72px] px-5 border-b border-sage-100 flex items-center justify-between gap-3">
      <div class="min-w-0">
        <h1 class="text-xl font-bold text-sage-600 truncate">🌿 KasirKu</h1>
        <p class="text-xs text-charcoal-muted mt-0.5 truncate">Dashboard UMKM · v1</p>
      </div>

      <button
        type="button"
        class="lg:hidden inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-charcoal-muted transition-colors hover:bg-sage-50 hover:text-charcoal focus:outline-none focus:ring-2 focus:ring-sage-400"
        aria-label="Tutup menu"
        @click="emit('close')"
      >
        <span class="text-xl leading-none">×</span>
      </button>
    </div>

    <nav class="flex-1 p-3 space-y-0.5 overflow-y-auto">
      <RouterLink
        v-for="item in menuItems"
        :key="item.id"
        :to="{ name: item.id }"
        @click="emit('close')"
        :class="[
          'w-full flex items-center gap-3 px-4 py-3 lg:py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
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
          @click="emit('close')"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 lg:py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
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

    <!-- Logout -->
    <div class="p-4 border-t border-sage-100">
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-4 py-3 lg:py-2.5 rounded-xl text-sm font-medium transition-colors text-left text-charcoal-muted hover:bg-red-50 hover:text-red-600"
      >
        <span class="text-base leading-none">⏻</span>
        <span>Keluar</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-backdrop-enter-active,
.sidebar-backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.sidebar-backdrop-enter-from,
.sidebar-backdrop-leave-to {
  opacity: 0;
}
</style>
