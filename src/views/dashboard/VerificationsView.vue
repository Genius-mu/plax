<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Top Action & Filter Bar -->
      <div class="glass-panel p-5 rounded-3xl border border-white/90 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <!-- Status Tabs -->
        <div class="flex items-center gap-1 overflow-x-auto bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            @click="selectTab(tab.value)"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
            :class="activeTab === tab.value ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Search Input & Refresh -->
        <div class="flex items-center gap-3">
          <div class="relative flex-1 md:w-64">
            <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Search customer or email..."
              class="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-medium"
            />
          </div>

          <button
            @click="loadVerifications"
            class="p-2.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-2xs transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': store.loading }" />
          </button>
        </div>
      </div>

      <!-- Verifications Table -->
      <div class="glass-panel rounded-3xl border border-white/90 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/60 uppercase tracking-wider">
              <tr>
                <th class="px-6 py-4">Verification ID</th>
                <th class="px-6 py-4">Customer</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4">Risk Score</th>
                <th class="px-6 py-4">Risk Signals</th>
                <th class="px-6 py-4">Submitted At</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr v-if="store.verifications.length === 0 && !store.loading">
                <td colspan="7" class="px-6 py-12 text-center text-slate-400">
                  No verification cases found matching filters.
                </td>
              </tr>

              <tr
                v-for="item in store.verifications"
                :key="item.id"
                class="hover:bg-white/80 transition-colors cursor-pointer"
                @click="openModal(item)"
              >
                <td class="px-6 py-4 font-mono text-blue-700 font-bold">
                  #{{ item.id.slice(0, 8) }}
                </td>
                <td class="px-6 py-4">
                  <div class="font-bold text-slate-900">{{ item.customer?.firstName }} {{ item.customer?.lastName }}</div>
                  <div class="text-[11px] text-slate-500 font-mono">{{ item.customer?.email }}</div>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border inline-flex items-center gap-1.5"
                    :class="getStatusBadgeClass(item.status)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="font-mono font-bold" :class="getRiskScoreColor(item.riskScore)">
                    {{ item.riskScore }} <span class="text-[10px] text-slate-400 font-normal">/ 100</span>
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div v-if="item.riskSignals && item.riskSignals.length > 0" class="flex flex-wrap gap-1">
                    <span
                      v-for="sig in item.riskSignals"
                      :key="sig.id"
                      class="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-mono font-bold"
                    >
                      {{ sig.code }}
                    </span>
                  </div>
                  <span v-else class="text-emerald-700 font-bold text-[11px]">Clean</span>
                </td>
                <td class="px-6 py-4 text-slate-500 font-mono">
                  {{ formatDate(item.createdAt) }}
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    @click.stop="openModal(item)"
                    class="btn-glass-secondary px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Inspect Case
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Footer -->
        <div class="p-4 border-t border-slate-200/60 bg-white/50 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div>
            Showing <strong class="text-slate-900">{{ store.verifications.length }}</strong> of <strong class="text-slate-900">{{ store.pagination.total }}</strong> records
          </div>

          <div class="flex items-center gap-2">
            <button
              :disabled="store.pagination.page <= 1"
              @click="changePage(store.pagination.page - 1)"
              class="btn-glass-secondary px-3 py-1.5 rounded-xl disabled:opacity-50 font-bold"
            >
              Previous
            </button>

            <span class="px-2 font-mono text-slate-700 font-bold">Page {{ store.pagination.page }} / {{ store.pagination.totalPages }}</span>

            <button
              :disabled="store.pagination.page >= store.pagination.totalPages"
              @click="changePage(store.pagination.page + 1)"
              class="btn-glass-secondary px-3 py-1.5 rounded-xl disabled:opacity-50 font-bold"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Inspection Modal -->
    <VerificationDetailModal
      :verification="store.selectedVerification"
      @close="store.selectedVerification = null"
      @updated="loadVerifications"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DashboardLayout from '../../components/layout/DashboardLayout.vue';
import VerificationDetailModal from '../../components/dashboard/VerificationDetailModal.vue';
import { useVerificationStore } from '../../stores/verificationStore.js';
import { Verification } from '../../types/index.js';
import { Search, RefreshCw } from 'lucide-vue-next';

const route = useRoute();
const store = useVerificationStore();

const activeTab = ref('ALL');
const searchQuery = ref((route.query.search as string) || '');

const statusTabs = [
  { label: 'All Cases', value: 'ALL' },
  { label: 'Manual Review Queue', value: 'MANUAL_REVIEW' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Processing', value: 'PROCESSING' },
];

onMounted(() => {
  loadVerifications();
});

function selectTab(val: string) {
  activeTab.value = val;
  loadVerifications();
}

function handleSearch() {
  loadVerifications();
}

function changePage(page: number) {
  loadVerifications(page);
}

async function loadVerifications(page = 1) {
  const params: any = { page };
  if (activeTab.value !== 'ALL') {
    params.status = activeTab.value;
  }
  if (searchQuery.value.trim()) {
    params.search = searchQuery.value.trim();
  }
  await store.fetchVerifications(params);
}

function openModal(item: Verification) {
  store.selectedVerification = item;
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'badge-approved';
    case 'REJECTED':
      return 'badge-rejected';
    case 'MANUAL_REVIEW':
      return 'badge-manual';
    default:
      return 'badge-pending';
  }
}

function getRiskScoreColor(score: number) {
  if (score >= 75) return 'text-rose-700';
  if (score >= 40) return 'text-amber-700';
  return 'text-emerald-700';
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString();
}
</script>
