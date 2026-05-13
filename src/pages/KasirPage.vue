<script setup>
import { ref, computed, onMounted } from "vue";

import { useProducts } from "../composables/useProducts.js";
import { useTransactions } from "../composables/useTransactions.js";
import { formatRupiah } from "../utils/format.js";
import { tampilNotif } from "../composables/useNotif.js";

const { products, loading: loadingProducts, fetchProducts } = useProducts();
const { createTransaction } = useTransactions();

const metodeBayarOptions = ["Cash", "Transfer", "QRIS"];
const metodeBayar = ref("Cash");
const cart = ref([]);
const search = ref("");
const submitting = ref(false);
const receipt = ref(null);

onMounted(fetchProducts);

const filteredProducts = computed(() => {
  const q = search.value.toLowerCase();
  return products.value.filter(
    (p) => p.nama.toLowerCase().includes(q) || p.kategori.toLowerCase().includes(q),
  );
});

const cartTotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.harga * item.qty, 0),
);

function addToCart(product) {
  const existing = cart.value.find((i) => i.id === product.id);
  if (existing) {
    if (existing.qty < product.stok) existing.qty++;
  } else {
    if (product.stok === 0) return;
    cart.value.push({ ...product, qty: 1 });
  }
}

function removeFromCart(id) {
  cart.value = cart.value.filter((i) => i.id !== id);
}

function changeQty(item, delta) {
  const product = products.value.find((p) => p.id === item.id);
  const maxStok = product?.stok ?? item.qty;
  item.qty = Math.max(1, Math.min(maxStok, item.qty + delta));
}

async function submitTransaction() {
  if (cart.value.length === 0) return;
  submitting.value = true;
  try {
    const payload = {
      items: cart.value.map((i) => ({ product_id: i.id, qty: i.qty })),
      metode_bayar: metodeBayar.value,
      status: "Lunas",
    };
    const trx = await createTransaction(payload);
    receipt.value = trx;
    cart.value = [];
    await fetchProducts(); // refresh stock
    tampilNotif(`Transaksi ${trx.kode} berhasil!`);
  } catch (err) {
    tampilNotif(err.response?.data?.message ?? "Transaksi gagal.");
  } finally {
    submitting.value = false;
  }
}

function closeReceipt() {
  receipt.value = null;
}
</script>

<template>
  <div class="flex min-h-full flex-col gap-4 pb-[24rem] md:h-full md:flex-row md:gap-5 md:pb-0">
    <!-- ─── Panel Kiri: Produk ─────────────────────────────── -->
    <div class="flex-1 flex flex-col min-w-0 md:min-h-0">
      <div class="mb-3 sm:mb-4">
        <h1 class="text-xl sm:text-2xl font-bold text-charcoal">Kasir</h1>
        <p class="text-sm text-charcoal-muted mt-0.5">Buat transaksi baru</p>
      </div>

      <!-- Search -->
      <input
        v-model="search"
        type="text"
        placeholder="Cari produk..."
        class="w-full mb-3 sm:mb-4 px-4 py-3 sm:py-2.5 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
      />

      <div v-if="loadingProducts" class="text-center py-12 text-charcoal-muted text-sm">Memuat...</div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:overflow-y-auto md:pr-1"
      >
        <button
          v-for="p in filteredProducts"
          :key="p.id"
          @click="addToCart(p)"
          :disabled="p.stok === 0"
          class="text-left bg-white rounded-2xl border border-sage-100 shadow-sm p-4 hover:border-sage-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div class="flex items-start justify-between gap-2 mb-2">
            <span
              class="min-w-0 truncate text-[10px] bg-sage-100 text-sage-600 font-medium px-2 py-0.5 rounded-full"
            >
              {{ p.kategori }}
            </span>
            <span class="text-xs text-charcoal-muted shrink-0">Stok: {{ p.stok }}</span>
          </div>
          <p class="font-semibold text-charcoal text-sm leading-snug mb-1">{{ p.nama }}</p>
          <p class="text-sm font-bold text-sage-600">{{ formatRupiah(p.harga) }}</p>
        </button>
      </div>
    </div>

    <!-- ─── Panel Kanan: Keranjang ─────────────────────────── -->
    <div
      class="fixed inset-x-4 bottom-4 z-20 flex max-h-[60vh] min-h-0 flex-col bg-white rounded-2xl border border-sage-100 shadow-2xl md:static md:z-auto md:w-72 md:max-h-full md:shrink-0 md:shadow-sm"
    >
      <div class="px-4 py-3 sm:px-5 sm:py-4 border-b border-sage-100">
        <div>
          <h3 class="font-semibold text-charcoal">Keranjang</h3>
          <p class="text-xs text-charcoal-muted mt-0.5">{{ cart.length }} item</p>
        </div>
      </div>

      <!-- Items -->
      <div class="min-h-0 flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <div
          v-if="cart.length === 0"
          class="py-5 md:py-10 text-center text-charcoal-muted text-sm"
        >
          Pilih produk untuk ditambahkan
        </div>
        <div
          v-for="item in cart"
          :key="item.id"
          class="flex items-center gap-2 sm:gap-3"
        >
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-charcoal truncate">{{ item.nama }}</p>
            <p class="text-xs text-charcoal-muted">{{ formatRupiah(item.harga) }}</p>
          </div>
          <!-- Qty controls -->
          <div class="flex items-center gap-1 shrink-0">
            <button
              @click="changeQty(item, -1)"
              class="w-8 h-8 md:w-6 md:h-6 rounded-lg bg-sage-50 text-sage-600 font-bold text-sm hover:bg-sage-100"
            >−</button>
            <span class="text-sm font-semibold w-6 md:w-5 text-center">{{ item.qty }}</span>
            <button
              @click="changeQty(item, 1)"
              class="w-8 h-8 md:w-6 md:h-6 rounded-lg bg-sage-50 text-sage-600 font-bold text-sm hover:bg-sage-100"
            >+</button>
          </div>
          <button
            @click="removeFromCart(item.id)"
            class="h-8 w-8 md:h-auto md:w-auto text-red-400 hover:text-red-600 text-sm shrink-0"
          >✕</button>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 sm:py-4 border-t border-sage-100 space-y-3 bg-white rounded-b-2xl">
        <!-- Total -->
        <div class="flex justify-between text-sm font-semibold">
          <span class="text-charcoal-muted">Total</span>
          <span class="text-base md:text-sm text-charcoal">{{ formatRupiah(cartTotal) }}</span>
        </div>

        <!-- Metode bayar -->
        <select
          v-model="metodeBayar"
          class="w-full px-3 py-3 md:py-2 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
        >
          <option v-for="m in metodeBayarOptions" :key="m" :value="m">{{ m }}</option>
        </select>

        <!-- Submit -->
        <button
          @click="submitTransaction"
          :disabled="cart.length === 0 || submitting"
          class="w-full py-3 md:py-2.5 bg-sage-400 text-white rounded-xl text-sm font-semibold hover:bg-sage-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitting ? "Memproses..." : "Bayar Sekarang" }}
        </button>
      </div>
    </div>
  </div>

  <!-- ─── Receipt Modal ─────────────────────────────────── -->
  <Transition name="toast">
    <div
      v-if="receipt"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <div class="text-center mb-4">
          <p class="text-3xl mb-1">✅</p>
          <h3 class="text-lg font-bold text-charcoal">Transaksi Berhasil</h3>
          <p class="text-sm text-charcoal-muted">{{ receipt.kode }}</p>
        </div>
        <div class="space-y-1 mb-4">
          <div
            v-for="item in receipt.items"
            :key="item.id"
            class="flex justify-between text-sm"
          >
            <span class="text-charcoal-muted">{{ item.product?.nama ?? 'Produk' }} ×{{ item.qty }}</span>
            <span class="font-medium text-charcoal">{{ formatRupiah(item.subtotal) }}</span>
          </div>
        </div>
        <div class="border-t border-sage-100 pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span class="text-sage-600">{{ formatRupiah(receipt.total) }}</span>
        </div>
        <p class="text-xs text-center text-charcoal-muted mt-2">{{ receipt.metodeBayar }}</p>
        <button
          @click="closeReceipt"
          class="mt-4 w-full py-2.5 bg-sage-400 text-white rounded-xl text-sm font-semibold hover:bg-sage-500 transition-colors"
        >
          Selesai
        </button>
      </div>
    </div>
  </Transition>
</template>
