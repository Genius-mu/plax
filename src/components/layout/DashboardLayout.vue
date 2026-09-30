<template>
  <div class="flex min-h-screen bg-[#070a12] text-slate-100 font-sans antialiased">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <Navbar />
      <main class="flex-1 p-6 md:p-8 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue';
import Navbar from './Navbar.vue';
</script>
