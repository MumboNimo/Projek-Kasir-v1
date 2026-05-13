<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "../components/Sidebar.vue";
import Topbar from "../components/Topbar.vue";

const route = useRoute();
const sidebarOpen = ref(false);

watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false;
  }
);
</script>

<template>
  <div class="flex h-screen bg-cream-100 font-sans overflow-hidden">
    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
      <Topbar @toggle-sidebar="sidebarOpen = true" />

      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
