<script setup>
import { ref, onMounted } from "vue";

import { useProducts } from "../composables/useProducts.js";
import { formatRupiah } from "../utils/format.js";
import { tampilNotif } from "../composables/useNotif.js";

const {
  products,
  loading,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
} = useProducts();

onMounted(fetchProducts);

const showModal = ref(false);
const showStockModal = ref(false);
const isEditing = ref(false);
const modalLoading = ref(false);

const emptyForm = () => ({
  nama: "",
  kategori: "",
  harga: "",
  stok: "",
  maxStok: "",
});

const form = ref(emptyForm());
const editId = ref(null);
const stockTarget = ref(null);
const stockAdjust = ref(0);

const kategoriOptions = [
  "Minuman",
  "Makanan",
  "Sembako",
  "Kebersihan",
  "Lainnya",
];

function openCreate() {
  isEditing.value = false;
  form.value = emptyForm();
  editId.value = null;
  showModal.value = true;
}

function openEdit(product) {
  isEditing.value = true;
  editId.value = product.id;
  form.value = {
    nama: product.nama,
    kategori: product.kategori,
    harga: product.harga,
    stok: product.stok,
    maxStok: product.maxStok,
  };
  showModal.value = true;
}

function openStockModal(product) {
  stockTarget.value = product;
  stockAdjust.value = 0;
  showStockModal.value = true;
}

async function submitForm() {
  modalLoading.value = true;
  try {
    const payload = {
      nama: form.value.nama,
      kategori: form.value.kategori,
      harga: Number(form.value.harga),
      stok: Number(form.value.stok),
      max_stok: Number(form.value.maxStok),
    };
    if (isEditing.value) {
      await updateProduct(editId.value, payload);
      tampilNotif("Produk berhasil diperbarui.");
    } else {
      await createProduct(payload);
      tampilNotif("Produk berhasil ditambahkan.");
    }
    showModal.value = false;
    await fetchProducts();
  } catch (err) {
    tampilNotif(err.response?.data?.message ?? "Terjadi kesalahan.");
  } finally {
    modalLoading.value = false;
  }
}

async function confirmDelete(product) {
  if (!confirm(`Hapus produk "${product.nama}"?`)) return;
  try {
    await deleteProduct(product.id);
    tampilNotif("Produk berhasil dihapus.");
    await fetchProducts();
  } catch (err) {
    tampilNotif(err.response?.data?.message ?? "Gagal menghapus.");
  }
}

async function submitStockAdjust() {
  if (stockAdjust.value === 0) return;
  modalLoading.value = true;
  try {
    await adjustStock(stockTarget.value.id, Number(stockAdjust.value));
    tampilNotif("Stok berhasil disesuaikan.");
    showStockModal.value = false;
    await fetchProducts();
  } catch (err) {
    tampilNotif(err.response?.data?.message ?? "Gagal menyesuaikan stok.");
  } finally {
    modalLoading.value = false;
  }
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-charcoal">
          Manajemen Produk
        </h1>
        <p class="text-sm text-charcoal-muted mt-0.5">
          {{ products.length }} produk terdaftar
        </p>
      </div>
      <button
        @click="openCreate"
        class="px-4 py-2 bg-sage-400 text-white rounded-xl text-sm font-semibold hover:bg-sage-500 transition-colors shrink-0"
      >
        + Tambah Produk
      </button>
    </div>

    <div v-if="loading" class="text-center py-12 text-charcoal-muted text-sm">
      Memuat...
    </div>

    <div
      v-else
      class="bg-white rounded-2xl border border-sage-100 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr
              class="bg-sage-50 text-xs font-semibold uppercase text-charcoal-muted"
            >
              <th class="px-4 py-3 text-left">Kode</th>
              <th class="px-4 py-3 text-left">Nama</th>
              <th class="px-4 py-3 text-left">Kategori</th>
              <th class="px-4 py-3 text-left">Harga</th>
              <th class="px-4 py-3 text-left">Stok / Max</th>
              <th class="px-4 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in products"
              :key="p.id"
              class="border-b border-sage-100 hover:bg-sage-50 transition-colors"
            >
              <td class="px-4 py-3 font-medium text-sage-600">{{ p.kode }}</td>
              <td class="px-4 py-3 font-medium text-charcoal">{{ p.nama }}</td>
              <td class="px-4 py-3 text-charcoal-muted">{{ p.kategori }}</td>
              <td class="px-4 py-3 font-semibold text-charcoal">
                {{ formatRupiah(p.harga) }}
              </td>
              <td class="px-4 py-3 text-charcoal-muted">
                {{ p.stok }} / {{ p.maxStok }}
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    @click="openStockModal(p)"
                    class="text-xs px-2.5 py-1 rounded-lg border border-sage-100 text-charcoal-muted hover:bg-sage-50 transition-colors"
                  >
                    Stok
                  </button>
                  <button
                    @click="openEdit(p)"
                    class="text-xs px-2.5 py-1 rounded-lg border border-sage-100 text-charcoal-muted hover:bg-sage-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(p)"
                    class="text-xs px-2.5 py-1 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="products.length === 0">
              <td
                colspan="6"
                class="px-4 py-8 text-center text-charcoal-muted text-sm"
              >
                Belum ada produk.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <Transition name="toast">
    <div
      v-if="showModal"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <h3 class="text-lg font-bold text-charcoal mb-4">
          {{ isEditing ? "Edit Produk" : "Tambah Produk" }}
        </h3>

        <form @submit.prevent="submitForm" class="space-y-3">
          <div>
            <label
              for="prod-nama"
              class="block text-xs font-medium text-charcoal-muted mb-1"
              >Nama</label
            >
            <input
              id="prod-nama"
              v-model="form.nama"
              required
              class="w-full px-3 py-2 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>
          <div>
            <label
              for="prod-kategori"
              class="block text-xs font-medium text-charcoal-muted mb-1"
              >Kategori</label
            >
            <select
              id="prod-kategori"
              v-model="form.kategori"
              required
              class="w-full px-3 py-2 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
            >
              <option value="" disabled>Pilih kategori</option>
              <option v-for="k in kategoriOptions" :key="k" :value="k">
                {{ k }}
              </option>
            </select>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label
                for="prod-harga"
                class="block text-xs font-medium text-charcoal-muted mb-1"
                >Harga (Rp)</label
              >
              <input
                id="prod-harga"
                v-model="form.harga"
                type="number"
                min="0"
                required
                class="w-full px-3 py-2 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>
            <div>
              <label
                for="prod-stok"
                class="block text-xs font-medium text-charcoal-muted mb-1"
                >Stok</label
              >
              <input
                id="prod-stok"
                v-model="form.stok"
                type="number"
                min="0"
                required
                class="w-full px-3 py-2 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>
            <div>
              <label
                for="prod-maxstok"
                class="block text-xs font-medium text-charcoal-muted mb-1"
                >Max Stok</label
              >
              <input
                id="prod-maxstok"
                v-model="form.maxStok"
                type="number"
                min="1"
                required
                class="w-full px-3 py-2 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="showModal = false"
              class="flex-1 py-2 rounded-xl border border-sage-100 text-sm font-medium text-charcoal-muted hover:bg-sage-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="modalLoading"
              class="flex-1 py-2 rounded-xl bg-sage-400 text-white text-sm font-semibold hover:bg-sage-500 transition-colors disabled:opacity-60"
            >
              {{ modalLoading ? "Menyimpan..." : "Simpan" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>

  <Transition name="toast">
    <div
      v-if="showStockModal"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs">
        <h3 class="text-lg font-bold text-charcoal mb-1">Sesuaikan Stok</h3>
        <p class="text-sm text-charcoal-muted mb-4">{{ stockTarget?.nama }}</p>
        <p class="text-xs text-charcoal-muted mb-1">
          Stok saat ini: <strong>{{ stockTarget?.stok }}</strong>
        </p>
        <div>
          <label
            for="stock-adjust"
            class="block text-xs font-medium text-charcoal-muted mb-1"
          >
            Jumlah perubahan (positif = tambah, negatif = kurang)
          </label>
          <input
            id="stock-adjust"
            v-model.number="stockAdjust"
            type="number"
            class="w-full px-3 py-2 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>
        <div class="flex gap-3 mt-4">
          <button
            @click="showStockModal = false"
            class="flex-1 py-2 rounded-xl border border-sage-100 text-sm font-medium text-charcoal-muted hover:bg-sage-50 transition-colors"
          >
            Batal
          </button>
          <button
            @click="submitStockAdjust"
            :disabled="modalLoading || stockAdjust === 0"
            class="flex-1 py-2 rounded-xl bg-sage-400 text-white text-sm font-semibold hover:bg-sage-500 transition-colors disabled:opacity-60"
          >
            {{ modalLoading ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
