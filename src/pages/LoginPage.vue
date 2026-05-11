<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth.js";

const router = useRouter();
const { login } = useAuth();

const email = ref("");
const password = ref("");
const errorMsg = ref("");
const loading = ref(false);

async function handleLogin() {
  errorMsg.value = "";
  loading.value = true;
  try {
    await login(email.value, password.value);
    router.push({ name: "beranda" });
  } catch (err) {
    errorMsg.value =
      err.response?.data?.message ?? "Login gagal. Periksa koneksi Anda.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-cream-100 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-sm bg-white rounded-2xl border border-sage-100 shadow-sm p-8">
      <!-- Logo / Brand -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-sage-600">🌿 KasirKu</h1>
        <p class="text-sm text-charcoal-muted mt-1">Masuk ke akun Anda</p>
      </div>

      <!-- Error alert -->
      <div
        v-if="errorMsg"
        class="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl"
      >
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-charcoal-muted mb-1">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="admin@kasir.app"
            class="w-full px-4 py-2.5 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-charcoal-muted mb-1">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="••••••••"
            class="w-full px-4 py-2.5 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2.5 bg-sage-400 text-white rounded-xl text-sm font-semibold hover:bg-sage-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ loading ? "Memuat..." : "Masuk" }}
        </button>
      </form>
    </div>
  </div>
</template>
