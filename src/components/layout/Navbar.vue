<template>
  <header class="glass-panel border border-white/18 sticky top-3.5 mt-3.5 mb-2.5 mx-auto w-full h-14 z-20 px-5 flex items-center justify-between rounded-2xl shadow-xl">
    <!-- Breadcrumb / Title -->
    <div class="flex items-center gap-3">
      <h2 class="text-base font-semibold text-white flex items-center gap-2 font-heading">
        {{ pageTitle }}
      </h2>
      <span class="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        SANDBOX ACTIVE
      </span>
    </div>

    <!-- Right Header Actions -->
    <div class="flex items-center gap-4">
      <!-- Search Input -->
      <div class="relative">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="Search customer or verification ID..."
          class="w-64 glass-input rounded-2xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 font-normal"
        />
      </div>

      <!-- Quick Role Info -->
      <div class="hidden md:flex items-center gap-2 text-xs text-slate-300 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-2xl font-normal shadow-sm">
        <Shield class="w-3.5 h-3.5 text-cyan-400" />
        <span>Org: <strong class="text-white font-semibold">Plax Global Compliance</strong></span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search, Shield } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const searchQuery = ref('');

const pageTitle = computed(() => {
  switch (route.path) {
    case '/dashboard':
      return 'Compliance Overview';
    case '/verifications':
      return 'Verification Cases';
    case '/audit-logs':
      return 'Immutable Audit Trail';
    default:
      return 'Dashboard';
  }
});

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/verifications', query: { search: searchQuery.value } });
  }
}
</script>
