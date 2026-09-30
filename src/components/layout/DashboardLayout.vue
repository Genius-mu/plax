<template>
  <div class="min-h-screen text-slate-900 font-sans antialiased flex bg-transparent">
    <!-- Fixed Floating Sidebar -->
    <Sidebar />

    <!-- Main Content Area with dynamic margin-left to prevent overlap with fixed sidebar -->
    <div
      class="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
      :class="isCollapsed ? 'ml-24' : 'ml-72'"
    >
      <Navbar />
      <main class="flex-1 p-3.5 md:p-4 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue';
import Navbar from './Navbar.vue';
import { useSidebar } from '../../composables/useSidebar.js';

const { isCollapsed } = useSidebar();
</script>
