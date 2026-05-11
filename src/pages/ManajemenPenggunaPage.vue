<script setup>
import { ref, onMounted } from "vue";

import { useUsers } from "../composables/useUsers.js";
import { tampilNotif } from "../composables/useNotif.js";

const { users, loading, fetchUsers, createUser, updateUser, deleteUser, changePassword } =
  useUsers();

onMounted(fetchUsers);

// ─── Modal state ─────────────────────────────────────────────
const showModal = ref(false);
const showPasswordModal = ref(false);
const isEditing = ref(false);
const modalLoading = ref(false);

const emptyForm = () => ({ name: "", email: "", password: "", role: "kasir" });

const form = ref(emptyForm());
const editId = ref(null);
const passwordTarget = ref(null);
const newPassword = ref("");

const roleOptions = ["admin", "kasir"];

function openCreate() {
  isEditing.value = false;
  form.value = emptyForm();
  editId.value = null;
  showModal.value = true;
}

function openEdit(user) {
  isEditing.value = true;
  editId.value = user.id;
  form.value = { name: user.name, email: user.email, password: "", role: user.role };
  showModal.value = true;
}

function openPasswordModal(user) {
  passwordTarget.value = user;
  newPassword.value = "";
  showPasswordModal.value = true;
}

async function submitForm() {
  modalLoading.value = true;
  try {
    if (isEditing.value) {
      await updateUser(editId.value, {
        name: form.value.name,
        email: form.value.email,
        role: form.value.role,
      });
      tampilNotif("User berhasil diperbarui.");
    } else {
      await createUser({
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
        role: form.value.role,
      });
      tampilNotif("User berhasil ditambahkan.");
    }
    showModal.value = false;
    await fetchUsers();
  } catch (err) {
    tampilNotif(err.response?.data?.message ?? "Terjadi kesalahan.");
  } finally {
    modalLoading.value = false;
  }
}

async function confirmDelete(user) {
  if (!confirm(`Hapus user "${user.name}"?`)) return;
  try {
    await deleteUser(user.id);
    tampilNotif("User berhasil dihapus.");
    await fetchUsers();
  } catch (err) {
    tampilNotif(err.response?.data?.message ?? "Gagal menghapus.");
  }
}

async function submitPassword() {
  if (!newPassword.value) return;
  modalLoading.value = true;
  try {
    await changePassword(passwordTarget.value.id, newPassword.value);
    tampilNotif("Password berhasil diubah.");
    showPasswordModal.value = false;
  } catch (err) {
    tampilNotif(err.response?.data?.message ?? "Gagal mengubah password.");
  } finally {
    modalLoading.value = false;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-charcoal">Manajemen Pengguna</h1>
        <p class="text-sm text-charcoal-muted mt-0.5">{{ users.length }} pengguna terdaftar</p>
      </div>
      <button
        @click="openCreate"
        class="px-4 py-2 bg-sage-400 text-white rounded-xl text-sm font-semibold hover:bg-sage-500 transition-colors"
      >
        + Tambah Pengguna
      </button>
    </div>

    <div v-if="loading" class="text-center py-12 text-charcoal-muted text-sm">Memuat...</div>

    <!-- Tabel -->
    <div v-else class="bg-white rounded-2xl border border-sage-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-sage-50 text-xs font-semibold uppercase text-charcoal-muted">
              <th class="px-4 py-3 text-left">Nama</th>
              <th class="px-4 py-3 text-left">Email</th>
              <th class="px-4 py-3 text-left">Role</th>
              <th class="px-4 py-3 text-left">Dibuat</th>
              <th class="px-4 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="u in users"
              :key="u.id"
              class="border-b border-sage-100 hover:bg-sage-50 transition-colors"
            >
              <td class="px-4 py-3 font-medium text-charcoal">{{ u.name }}</td>
              <td class="px-4 py-3 text-charcoal-muted">{{ u.email }}</td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'inline-flex text-xs font-semibold px-2.5 py-1 rounded-full',
                    u.role === 'admin'
                      ? 'bg-sage-100 text-sage-700'
                      : 'bg-gray-100 text-gray-600',
                  ]"
                >{{ u.role }}</span>
              </td>
              <td class="px-4 py-3 text-charcoal-muted">{{ formatDate(u.createdAt) }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    @click="openPasswordModal(u)"
                    class="text-xs px-2.5 py-1 rounded-lg border border-sage-100 text-charcoal-muted hover:bg-sage-50 transition-colors"
                  >Password</button>
                  <button
                    @click="openEdit(u)"
                    class="text-xs px-2.5 py-1 rounded-lg border border-sage-100 text-charcoal-muted hover:bg-sage-50 transition-colors"
                  >Edit</button>
                  <button
                    @click="confirmDelete(u)"
                    class="text-xs px-2.5 py-1 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                  >Hapus</button>
                </div>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-charcoal-muted text-sm">Belum ada pengguna.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ─── Modal Tambah/Edit User ───────────────────────────── -->
  <Transition name="toast">
    <div
      v-if="showModal"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <h3 class="text-lg font-bold text-charcoal mb-4">
          {{ isEditing ? "Edit Pengguna" : "Tambah Pengguna" }}
        </h3>

        <form @submit.prevent="submitForm" class="space-y-3">
          <div>
            <label for="user-nama" class="block text-xs font-medium text-charcoal-muted mb-1">Nama</label>
            <input id="user-nama" v-model="form.name" required class="w-full px-3 py-2 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400" />
          </div>
          <div>
            <label for="user-email" class="block text-xs font-medium text-charcoal-muted mb-1">Email</label>
            <input id="user-email" v-model="form.email" type="email" required class="w-full px-3 py-2 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400" />
          </div>
          <div v-if="!isEditing">
            <label for="user-password" class="block text-xs font-medium text-charcoal-muted mb-1">Password</label>
            <input id="user-password" v-model="form.password" type="password" required minlength="6" class="w-full px-3 py-2 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400" />
          </div>
          <div>
            <label for="user-role" class="block text-xs font-medium text-charcoal-muted mb-1">Role</label>
            <select id="user-role" v-model="form.role" required class="w-full px-3 py-2 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400">
              <option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="showModal = false"
              class="flex-1 py-2 rounded-xl border border-sage-100 text-sm font-medium text-charcoal-muted hover:bg-sage-50 transition-colors"
            >Batal</button>
            <button
              type="submit"
              :disabled="modalLoading"
              class="flex-1 py-2 rounded-xl bg-sage-400 text-white text-sm font-semibold hover:bg-sage-500 transition-colors disabled:opacity-60"
            >{{ modalLoading ? "Menyimpan..." : "Simpan" }}</button>
          </div>
        </form>
      </div>
    </div>
  </Transition>

  <!-- ─── Modal Ganti Password ─────────────────────────────── -->
  <Transition name="toast">
    <div
      v-if="showPasswordModal"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs">
        <h3 class="text-lg font-bold text-charcoal mb-1">Ganti Password</h3>
        <p class="text-sm text-charcoal-muted mb-4">{{ passwordTarget?.name }}</p>
        <div>
          <label for="new-password" class="block text-xs font-medium text-charcoal-muted mb-1">Password Baru</label>
          <input
            id="new-password"
            v-model="newPassword"
            type="password"
            minlength="6"
            required
            class="w-full px-3 py-2 rounded-xl border border-sage-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>
        <div class="flex gap-3 mt-4">
          <button
            @click="showPasswordModal = false"
            class="flex-1 py-2 rounded-xl border border-sage-100 text-sm font-medium text-charcoal-muted hover:bg-sage-50 transition-colors"
          >Batal</button>
          <button
            @click="submitPassword"
            :disabled="modalLoading || !newPassword"
            class="flex-1 py-2 rounded-xl bg-sage-400 text-white text-sm font-semibold hover:bg-sage-500 transition-colors disabled:opacity-60"
          >{{ modalLoading ? "Menyimpan..." : "Simpan" }}</button>
        </div>
      </div>
    </div>
  </Transition>
</template>
