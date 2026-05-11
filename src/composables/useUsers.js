import { ref } from "vue";
import api from "./useApi.js";

export function useUsers() {
  const users = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchUsers() {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get("/users");
      users.value = res.data.data;
    } catch (err) {
      error.value = err.response?.data?.message ?? err.message;
    } finally {
      loading.value = false;
    }
  }

  async function createUser(data) {
    const res = await api.post("/users", data);
    return res.data.data;
  }

  async function updateUser(id, data) {
    const res = await api.put(`/users/${id}`, data);
    return res.data.data;
  }

  async function deleteUser(id) {
    await api.delete(`/users/${id}`);
  }

  async function changePassword(id, password) {
    await api.patch(`/users/${id}/password`, { password });
  }

  return { users, loading, error, fetchUsers, createUser, updateUser, deleteUser, changePassword };
}
