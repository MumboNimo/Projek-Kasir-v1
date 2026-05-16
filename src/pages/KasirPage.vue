<script setup>
import { ref, computed, onMounted } from "vue";

import { useProducts } from "../composables/useProducts.js";
import { useTransactions } from "../composables/useTransactions.js";
import { formatRupiah } from "../utils/format.js";
import { tampilNotif } from "../composables/useNotif.js";
import { icons } from "../utils/icons.js";

const { products, loading: loadingProducts, fetchProducts } = useProducts();
const { createTransaction } = useTransactions();

const metodeBayarOptions = ["Cash", "Transfer", "QRIS"];
const metodeBayar = ref("Cash");
const cart = ref([]);
const search = ref("");
const submitting = ref(false);
const receipt = ref(null);
const cartSheetOpen = ref(false);

onMounted(fetchProducts);

const filteredProducts = computed(() => {
  const q = search.value.toLowerCase();
  return products.value.filter(
    (p) =>
      p.nama.toLowerCase().includes(q) || p.kategori.toLowerCase().includes(q),
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
    cartSheetOpen.value = false;
    await fetchProducts();
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
  <div class="flex flex-col lg:flex-row gap-0 lg:gap-5 h-full">
    <div class="flex-1 flex flex-col min-w-0 pb-24 lg:pb-0">
      <div class="mb-4">
        <h1 class="text-xl sm:text-2xl font-bold text-charcoal">Kasir</h1>
        <p class="text-sm text-charcoal-muted mt-0.5">Buat transaksi baru</p>
      </div>

      <input
        v-model="search"
        type="text"
        placeholder="Cari produk..."
        class="w-full mb-4 px-4 py-2.5 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
      />

      <div
        v-if="loadingProducts"
        class="text-center py-12 text-charcoal-muted text-sm"
      >
        Memuat...
      </div>

      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 overflow-y-auto"
      >
        <button
          v-for="p in filteredProducts"
          :key="p.id"
          @click="addToCart(p)"
          :disabled="p.stok === 0"
          class="text-left bg-white rounded-2xl border border-sage-100 shadow-sm p-3 sm:p-4 hover:border-sage-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div class="flex items-start justify-between mb-2 gap-1">
            <span
              class="text-[10px] bg-sage-100 text-sage-600 font-medium px-2 py-0.5 rounded-full truncate"
            >
              {{ p.kategori }}
            </span>
            <span class="text-xs text-charcoal-muted shrink-0">{{
              p.stok
            }}</span>
          </div>
          <p
            class="font-semibold text-charcoal text-sm leading-snug mb-1 line-clamp-2"
          >
            {{ p.nama }}
          </p>
          <p class="text-sm font-bold text-sage-600">
            {{ formatRupiah(p.harga) }}
          </p>
        </button>
      </div>
    </div>

    <div
      class="hidden lg:flex w-72 shrink-0 flex-col bg-white rounded-2xl border border-sage-100 shadow-sm"
    >
      <div class="px-5 py-4 border-b border-sage-100">
        <h3 class="font-semibold text-charcoal">Keranjang</h3>
        <p class="text-xs text-charcoal-muted mt-0.5">{{ cart.length }} item</p>
      </div>

      <div class="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <div
          v-if="cart.length === 0"
          class="py-10 text-center text-charcoal-muted text-sm"
        >
          Pilih produk untuk ditambahkan
        </div>
        <div
          v-for="item in cart"
          :key="item.id"
          class="flex items-center gap-2"
        >
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-charcoal truncate">
              {{ item.nama }}
            </p>
            <p class="text-xs text-charcoal-muted">
              {{ formatRupiah(item.harga) }}
            </p>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button
              @click="changeQty(item, -1)"
              class="w-6 h-6 rounded-lg bg-sage-50 text-sage-600 font-bold text-sm hover:bg-sage-100"
            >
              −
            </button>
            <span class="text-sm font-semibold w-5 text-center">{{
              item.qty
            }}</span>
            <button
              @click="changeQty(item, 1)"
              class="w-6 h-6 rounded-lg bg-sage-50 text-sage-600 font-bold text-sm hover:bg-sage-100"
            >
              +
            </button>
          </div>
          <button
            @click="removeFromCart(item.id)"
            class="text-red-400 hover:text-red-600 shrink-0 p-0.5"
          >
            <img
              :src="icons.tutup"
              class="w-3.5 h-3.5"
              style="
                filter: invert(48%) sepia(50%) saturate(500%) hue-rotate(314deg)
                  brightness(90%);
              "
              alt="Hapus"
            />
          </button>
        </div>
      </div>

      <div class="px-4 py-4 border-t border-sage-100 space-y-3">
        <div class="flex justify-between text-sm font-semibold">
          <span class="text-charcoal-muted">Total</span>
          <span class="text-charcoal">{{ formatRupiah(cartTotal) }}</span>
        </div>
        <select
          v-model="metodeBayar"
          class="w-full px-3 py-2 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
        >
          <option v-for="m in metodeBayarOptions" :key="m" :value="m">
            {{ m }}
          </option>
        </select>
        <button
          @click="submitTransaction"
          :disabled="cart.length === 0 || submitting"
          class="w-full py-2.5 bg-sage-400 text-white rounded-xl text-sm font-semibold hover:bg-sage-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitting ? "Memproses..." : "Bayar Sekarang" }}
        </button>
      </div>
    </div>
  </div>

  <div class="fixed bottom-5 right-5 z-20 lg:hidden">
    <button
      @click="cartSheetOpen = true"
      class="relative w-14 h-14 bg-sage-400 text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-sage-500 transition-colors active:scale-95"
    >
      <img
        :src="icons.kasir"
        class="w-6 h-6"
        style="filter: brightness(0) invert(1)"
        alt="Keranjang"
      />
      <span
        v-if="cart.length > 0"
        class="absolute -top-2 -right-2 bg-red-400 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >{{ cart.length }}</span
      >
    </button>
  </div>

  <Transition name="sheet-backdrop">
    <div
      v-if="cartSheetOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="cartSheetOpen = false"
    />
  </Transition>

  <Transition name="sheet-slide">
    <div
      v-if="cartSheetOpen"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl lg:hidden"
      style="max-height: 85dvh; display: flex; flex-direction: column"
    >
      <div class="flex justify-center pt-3 pb-1">
        <div class="w-10 h-1 bg-sage-200 rounded-full"></div>
      </div>

      <div
        class="px-5 py-3 border-b border-sage-100 flex items-center justify-between"
      >
        <div>
          <h3 class="font-semibold text-charcoal">Keranjang</h3>
          <p class="text-xs text-charcoal-muted mt-0.5">
            {{ cart.length }} item · {{ formatRupiah(cartTotal) }}
          </p>
        </div>
        <button
          @click="cartSheetOpen = false"
          class="p-1.5 rounded-xl hover:bg-sage-50"
        >
          <img :src="icons.tutup" class="w-4 h-4 opacity-50" alt="Tutup" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <div
          v-if="cart.length === 0"
          class="py-10 text-center text-charcoal-muted text-sm"
        >
          Belum ada produk dipilih
        </div>
        <div
          v-for="item in cart"
          :key="item.id"
          class="flex items-center gap-3"
        >
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-charcoal truncate">
              {{ item.nama }}
            </p>
            <p class="text-xs text-charcoal-muted">
              {{ formatRupiah(item.harga) }}
            </p>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <button
              @click="changeQty(item, -1)"
              class="w-7 h-7 rounded-lg bg-sage-50 text-sage-600 font-bold hover:bg-sage-100"
            >
              −
            </button>
            <span class="text-sm font-semibold w-6 text-center">{{
              item.qty
            }}</span>
            <button
              @click="changeQty(item, 1)"
              class="w-7 h-7 rounded-lg bg-sage-50 text-sage-600 font-bold hover:bg-sage-100"
            >
              +
            </button>
          </div>
          <button
            @click="removeFromCart(item.id)"
            class="text-red-400 hover:text-red-600 p-1"
          >
            <img
              :src="icons.tutup"
              class="w-3.5 h-3.5"
              style="
                filter: invert(48%) sepia(50%) saturate(500%) hue-rotate(314deg)
                  brightness(90%);
              "
              alt="Hapus"
            />
          </button>
        </div>
      </div>

      <div class="px-4 py-4 border-t border-sage-100 space-y-3">
        <div class="flex justify-between font-semibold">
          <span class="text-charcoal-muted text-sm">Total</span>
          <span class="text-charcoal">{{ formatRupiah(cartTotal) }}</span>
        </div>
        <select
          v-model="metodeBayar"
          class="w-full px-3 py-2.5 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
        >
          <option v-for="m in metodeBayarOptions" :key="m" :value="m">
            {{ m }}
          </option>
        </select>
        <button
          @click="submitTransaction"
          :disabled="cart.length === 0 || submitting"
          class="w-full py-3 bg-sage-400 text-white rounded-xl text-sm font-semibold hover:bg-sage-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitting ? "Memproses..." : "Bayar Sekarang" }}
        </button>
      </div>
    </div>
  </Transition>

  <Transition name="toast">
    <div
      v-if="receipt"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 p-0 sm:p-4"
    >
      <div
        class="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 w-full sm:max-w-sm"
      >
        <div class="text-center mb-4">
          <div class="flex justify-center mb-2">
            <img
              :src="icons.sukses"
              class="w-10 h-10"
              style="
                filter: invert(52%) sepia(40%) saturate(400%) hue-rotate(100deg)
                  brightness(95%);
              "
              alt="Berhasil"
            />
          </div>
          <h3 class="text-lg font-bold text-charcoal">Transaksi Berhasil</h3>
          <p class="text-sm text-charcoal-muted">{{ receipt.kode }}</p>
        </div>
        <div class="space-y-1 mb-4">
          <div
            v-for="item in receipt.items"
            :key="item.id"
            class="flex justify-between text-sm"
          >
            <span class="text-charcoal-muted"
              >{{ item.product?.nama ?? "Produk" }} ×{{ item.qty }}</span
            >
            <span class="font-medium text-charcoal">{{
              formatRupiah(item.subtotal)
            }}</span>
          </div>
        </div>
        <div
          class="border-t border-sage-100 pt-3 flex justify-between font-bold"
        >
          <span>Total</span>
          <span class="text-sage-600">{{ formatRupiah(receipt.total) }}</span>
        </div>
        <p class="text-xs text-center text-charcoal-muted mt-2">
          {{ receipt.metodeBayar }}
        </p>
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

<style scoped>
.sheet-backdrop-enter-active,
.sheet-backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.sheet-backdrop-enter-from,
.sheet-backdrop-leave-to {
  opacity: 0;
}

.sheet-slide-enter-active,
.sheet-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-slide-enter-from,
.sheet-slide-leave-to {
  transform: translateY(100%);
}
</style>
