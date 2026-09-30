<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Top Action & Filter Bar -->
      <GlassSurface :borderRadius="24" className="p-5">
        <div class="w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Status Tabs -->
          <div class="flex items-center gap-1 overflow-x-auto bg-black/60 p-1 rounded-2xl border border-white/10">
            <button
              v-for="tab in statusTabs"
              :key="tab.value"
              @click="selectTab(tab.value)"
              class="px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
              :class="activeTab === tab.value ? 'bg-white text-black shadow-sm font-heading' : 'text-slate-300 hover:text-white hover:bg-white/10'"
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
                class="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs text-white font-medium"
              />
            </div>

            <button
              @click="loadVerifications"
              class="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': store.loading }" />
            </button>
          </div>
        </div>
      </GlassSurface>

      <!-- Verifications Table Container (Scrollable GlassSurface) -->
      <GlassSurface :borderRadius="24" className="overflow-hidden">
        <div class="w-full">
          <div class="overflow-x-auto max-h-[580px] overflow-y-auto">
            <table class="min-w-[950px] w-full text-left text-xs">
              <thead class="bg-black/80 text-slate-300 font-bold border-b border-white/10 uppercase tracking-wider sticky top-0 backdrop-blur-md z-10 font-heading">
                <tr>
                  <th class="px-6 py-4 w-1/6">Verification ID</th>
                  <th class="px-6 py-4 w-1/4">Customer</th>
                  <th class="px-6 py-4 w-1/6">Status</th>
                  <th class="px-6 py-4 w-1/6">Risk Score</th>
                  <th class="px-6 py-4 w-1/4">Risk Signals</th>
                  <th class="px-6 py-4 w-1/6">Submitted At</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5 text-slate-200 font-medium">
                <tr v-if="store.verifications.length === 0 && !store.loading">
                  <td colspan="7" class="px-6 py-12 text-center text-slate-400">
                    No verification cases found matching filters.
                  </td>
                </tr>

                <tr
                  v-for="item in store.verifications"
                  :key="item.id"
                  class="hover:bg-white/10 transition-colors cursor-pointer"
                  @click="openModal(item)"
                >
                  <td class="px-6 py-4 font-mono text-cyan-400 font-bold whitespace-nowrap">
                    #{{ item.id.slice(0, 8) }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="font-bold text-white text-sm">{{ item.customer?.firstName }} {{ item.customer?.lastName }}</div>
                    <div class="text-[11px] text-slate-400 font-mono mt-0.5">{{ item.customer?.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border inline-flex items-center gap-1.5"
                      :class="getStatusBadgeClass(item.status)"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="font-mono font-bold text-sm" :class="getRiskScoreColor(item.riskScore)">
                      {{ item.riskScore }} <span class="text-[10px] font-normal text-slate-400">/ 100</span>
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div v-if="item.riskSignals && item.riskSignals.length > 0" class="flex flex-wrap gap-1.5">
                      <span
                        v-for="sig in item.riskSignals"
                        :key="sig.id"
                        class="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold"
                      >
                        {{ sig.code }}
                      </span>
                    </div>
                    <span v-else class="text-emerald-400 font-bold text-xs">Clean</span>
                  </td>
                  <td class="px-6 py-4 text-slate-400 font-mono whitespace-nowrap">
                    {{ formatDate(item.createdAt) }}
                  </td>
                  <td class="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      @click.stop="openModal(item)"
                      class="btn-glass-secondary px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Inspect Case
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer -->
          <div class="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-slate-300 font-medium">
            <div>
              Showing <strong class="text-white">{{ store.verifications.length }}</strong> of <strong class="text-white">{{ store.pagination.total }}</strong> records
            </div>

            <div class="flex items-center gap-2">
              <button
                :disabled="store.pagination.page <= 1"
                @click="changePage(store.pagination.page - 1)"
                class="btn-glass-secondary px-3.5 py-1.5 rounded-xl disabled:opacity-50 font-bold"
              >
                Previous
              </button>

              <span class="px-2 font-mono text-slate-300 font-bold">Page {{ store.pagination.page }} / {{ store.pagination.totalPages }}</span>

              <button
                :disabled="store.pagination.page >= store.pagination.totalPages"
                @click="changePage(store.pagination.page + 1)"
                class="btn-glass-secondary px-3.5 py-1.5 rounded-xl disabled:opacity-50 font-bold"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </GlassSurface>
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
import GlassSurface from '../../components/common/GlassSurface.vue';
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
  if (score >= 75) return 'text-rose-400';
  if (score >= 40) return 'text-amber-400';
  return 'text-emerald-400';
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString();
}
</script>
