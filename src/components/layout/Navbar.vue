<template>
  <header class="h-16 border-b border-white/10 bg-[#090d16]/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
    <!-- Breadcrumb / Title -->
    <div class="flex items-center gap-3">
      <h2 class="text-lg font-semibold text-white flex items-center gap-2">
        {{ pageTitle }}
      </h2>
      <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        SANDBOX ACTIVE
      </span>
    </div>

    <!-- Right Header Actions -->
    <div class="flex items-center gap-4">
      <!-- Search Input -->
      <div class="relative">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="Search by customer, email or ID..."
          class="w-64 bg-slate-900/90 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
      </div>

      <!-- Quick Role Info -->
      <div class="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 border border-white/5 px-3 py-1.5 rounded-lg">
        <Shield class="w-3.5 h-3.5 text-emerald-400" />
        <span>Org: <strong class="text-slate-200">Plax Global Compliance</strong></span>
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
