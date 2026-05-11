<script setup>
import Sidebar from "../components/Sidebar.vue";
import Topbar from "../components/Topbar.vue";
</script>

<template>
  <div class="flex h-screen bg-cream-100 font-sans overflow-hidden">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <Topbar />
      <main class="flex-1 overflow-y-auto p-6 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
