<script setup>
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "../composables/useAuth.js";
import { icons } from "../utils/icons.js";

defineProps({ open: { type: Boolean, default: false } });
const emit = defineEmits(["close"]);

const router = useRouter();
const route = useRoute();
const { user, isAdmin, logout } = useAuth();

const menuItems = [
  { id: "beranda",   nama: "Beranda",   ikon: icons.beranda },
  { id: "kasir",     nama: "Kasir",     ikon: icons.kasir },
  { id: "transaksi", nama: "Transaksi", ikon: icons.transaksi },
  { id: "inventori", nama: "Inventori", ikon: icons.inventori },
  { id: "laporan",   nama: "Laporan",   ikon: icons.laporan },
];

const adminMenuItems = [
  { id: "produk",   nama: "Manajemen Produk",   ikon: icons.produk },
  { id: "pengguna", nama: "Manajemen Pengguna", ikon: icons.pengguna },
];

function handleNav() {
  emit("close");
}

async function handleLogout() {
  await logout();
  emit("close");
  router.push({ name: "login" });
}
</script>

<template>
  <aside
    :class="[
      'fixed lg:static inset-y-0 left-0 z-30',
      'w-64 lg:w-56',
      'bg-sage-50 border-r border-sage-100 flex flex-col shrink-0',
      'transition-transform duration-300 ease-in-out',
      open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <!-- Logo -->
    <div class="px-5 py-5 border-b border-sage-100 flex items-center justify-between bg-white/60">
      <div class="flex items-start gap-2">
        <img :src="icons.logo" class="w-[38px] h-[38px]" alt="KasirKu" />
        <div>
          <h1 class="text-xl font-bold text-sage-600 leading-none">KasirKu</h1>
          <p class="text-xs text-charcoal-muted mt-0.5">Dashboard UMKM · v1</p>
        </div>
      </div>
      <!-- Tombol tutup hanya di mobile -->
      <button
        class="lg:hidden p-1.5 rounded-xl hover:bg-sage-100 transition-colors"
        @click="emit('close')"
        aria-label="Tutup menu"
      >
        <img :src="icons.tutup" class="w-4 h-4 opacity-50" alt="" />
      </button>
    </div>

    <nav class="flex-1 p-3 space-y-0.5 overflow-y-auto">
      <RouterLink
        v-for="item in menuItems"
        :key="item.id"
        :to="{ name: item.id }"
        @click="handleNav"
        :class="[
          'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
          route.name === item.id
            ? 'bg-sage-400 text-white shadow-sm'
            : 'text-charcoal-muted hover:bg-sage-50 hover:text-charcoal',
        ]"
      >
        <img
          :src="item.ikon"
          class="w-4 h-4 shrink-0"
          :style="route.name === item.id ? { filter: 'brightness(0) invert(1)' } : { opacity: '0.55' }"
          alt=""
        />
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
          @click="handleNav"
          :class="[
            'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
            route.name === item.id
              ? 'bg-sage-400 text-white shadow-sm'
              : 'text-charcoal-muted hover:bg-sage-50 hover:text-charcoal',
          ]"
        >
          <img
            :src="item.ikon"
            class="w-4 h-4 shrink-0"
            :style="route.name === item.id ? { filter: 'brightness(0) invert(1)' } : { opacity: '0.55' }"
            alt=""
          />
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
        class="w-full text-xs text-left px-3 py-2 rounded-xl text-charcoal-muted hover:bg-red-50 hover:text-red-600 transition-colors font-medium flex items-center gap-2"
      >
        <img :src="icons.keluar" class="w-3.5 h-3.5 opacity-60" alt="" />
        Keluar
      </button>
    </div>
  </aside>
</template>
