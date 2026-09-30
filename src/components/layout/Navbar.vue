<template>
  <header class="h-16 border-b border-slate-200/70 bg-white/60 backdrop-blur-xl sticky top-0 z-30 px-6 flex items-center justify-between shadow-xs">
    <!-- Breadcrumb / Title -->
    <div class="flex items-center gap-3">
      <h2 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
        {{ pageTitle }}
      </h2>
      <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
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
          class="w-64 glass-input rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder-slate-400 font-medium"
        />
      </div>

      <!-- Quick Role Info -->
      <div class="hidden md:flex items-center gap-2 text-xs text-slate-600 bg-white/80 border border-slate-200/80 px-3.5 py-1.5 rounded-xl shadow-2xs font-medium">
        <Shield class="w-3.5 h-3.5 text-slate-700" />
        <span>Org: <strong class="text-slate-900 font-bold">Plax Global Compliance</strong></span>
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
