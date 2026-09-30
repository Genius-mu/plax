<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Metric Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Total Verifications Card -->
        <div class="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/90 relative overflow-hidden group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Cases</span>
            <div class="w-10 h-10 rounded-2xl bg-white/80 border border-slate-200/80 flex items-center justify-center text-slate-800 shadow-2xs">
              <ShieldCheck class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black text-slate-900 font-mono tracking-tight">{{ store.stats?.total || 0 }}</span>
            <span class="text-xs font-bold text-emerald-700 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              <TrendingUp class="w-3.5 h-3.5" /> +12.4%
            </span>
          </div>
          <p class="text-[11px] text-slate-500 font-medium mt-1.5">Processed across organization</p>
        </div>

        <!-- Approved Card -->
        <div class="glass-panel glass-panel-hover p-6 rounded-3xl border border-emerald-200/80 relative overflow-hidden group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Auto Approved</span>
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
              <CheckCircle2 class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black text-emerald-700 font-mono tracking-tight">{{ store.stats?.approved || 0 }}</span>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-lg border border-emerald-300">
              {{ store.stats?.approvalRate || 100 }}% Pass Rate
            </span>
          </div>
          <p class="text-[11px] text-slate-500 font-medium mt-1.5">Low risk (&lt; 25 risk score)</p>
        </div>

        <!-- Manual Review Queue Card -->
        <div class="glass-panel glass-panel-hover p-6 rounded-3xl border border-purple-200/80 relative overflow-hidden group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Manual Review</span>
            <div class="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shadow-2xs">
              <Clock class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black text-purple-700 font-mono tracking-tight">{{ store.stats?.manualReview || 0 }}</span>
            <span class="text-xs font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-lg border border-purple-300">Action Required</span>
          </div>
          <p class="text-[11px] text-slate-500 font-medium mt-1.5">Medium risk flagged cases</p>
        </div>

        <!-- Failed / Rejected Card -->
        <div class="glass-panel glass-panel-hover p-6 rounded-3xl border border-rose-200/80 relative overflow-hidden group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Rejected</span>
            <div class="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shadow-2xs">
              <AlertOctagon class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black text-rose-700 font-mono tracking-tight">{{ store.stats?.failed || 0 }}</span>
            <span class="text-xs font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-lg border border-rose-300">Critical Risk</span>
          </div>
          <p class="text-[11px] text-slate-500 font-medium mt-1.5">High risk signals flagged</p>
        </div>
      </div>

      <!-- Activity Ratio Bar Visualizer -->
      <div class="glass-panel p-6 rounded-3xl border border-white/90 space-y-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Activity class="w-4 h-4 text-blue-600" />
              Verification Status Ratio Breakdown
            </h3>
            <p class="text-xs text-slate-500 font-medium">Real-time status distribution across active customer submissions</p>
          </div>
          <span class="text-xs text-slate-400 font-mono">Updated {{ lastUpdatedTime }}</span>
        </div>

        <!-- Visual Progress Segments -->
        <div class="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex p-0.5 border border-slate-200/80 gap-1 shadow-inner">
          <div
            class="h-full bg-emerald-500 rounded-full transition-all duration-500"
            :style="{ width: getPercentage(store.stats?.approved || 0) + '%' }"
            title="Approved"
          ></div>
          <div
            class="h-full bg-purple-500 rounded-full transition-all duration-500"
            :style="{ width: getPercentage(store.stats?.manualReview || 0) + '%' }"
            title="Manual Review"
          ></div>
          <div
            class="h-full bg-amber-400 rounded-full transition-all duration-500"
            :style="{ width: getPercentage(store.stats?.pending || 0) + '%' }"
            title="Pending"
          ></div>
          <div
            class="h-full bg-rose-500 rounded-full transition-all duration-500"
            :style="{ width: getPercentage(store.stats?.failed || 0) + '%' }"
            title="Rejected"
          ></div>
        </div>

        <div class="flex items-center gap-6 text-xs font-medium pt-1">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span class="text-slate-700">Approved: <strong class="text-slate-900">{{ store.stats?.approved || 0 }}</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-purple-500"></span>
            <span class="text-slate-700">Manual Review: <strong class="text-slate-900">{{ store.stats?.manualReview || 0 }}</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-amber-400"></span>
            <span class="text-slate-700">Pending: <strong class="text-slate-900">{{ store.stats?.pending || 0 }}</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-rose-500"></span>
            <span class="text-slate-700">Rejected: <strong class="text-slate-900">{{ store.stats?.failed || 0 }}</strong></span>
          </div>
        </div>
      </div>

      <!-- Recent Verifications Table -->
      <div class="glass-panel rounded-3xl border border-white/90 overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-200/60 flex items-center justify-between">
          <div>
            <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText class="w-4 h-4 text-blue-600" />
              Recent Verification Activity
            </h3>
            <p class="text-xs text-slate-500 font-medium">Inspected identity submissions and automated processing results</p>
          </div>

          <router-link
            to="/verifications"
            class="text-xs text-slate-900 hover:text-blue-600 font-bold flex items-center gap-1 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-2xs transition-all"
          >
            View All Cases &rarr;
          </router-link>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/60 uppercase tracking-wider">
              <tr>
                <th class="px-6 py-3.5">Customer Name</th>
                <th class="px-6 py-3.5">Status</th>
                <th class="px-6 py-3.5">Risk Score</th>
                <th class="px-6 py-3.5">Risk Signals</th>
                <th class="px-6 py-3.5">Submitted</th>
                <th class="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr
                v-for="item in store.verifications.slice(0, 6)"
                :key="item.id"
                class="hover:bg-white/80 transition-colors cursor-pointer"
                @click="openModal(item)"
              >
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
                    {{ item.riskScore }} <span class="text-[10px] font-normal text-slate-400">/ 100</span>
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
                  <span v-else class="text-emerald-600 font-bold text-[11px]">Clean</span>
                </td>
                <td class="px-6 py-4 text-slate-500 font-mono">
                  {{ formatDate(item.createdAt) }}
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    @click.stop="openModal(item)"
                    class="btn-glass-secondary px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                  >
                    Inspect Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Detail Inspection Modal -->
    <VerificationDetailModal
      :verification="store.selectedVerification"
      @close="store.selectedVerification = null"
      @updated="loadData"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DashboardLayout from '../../components/layout/DashboardLayout.vue';
import VerificationDetailModal from '../../components/dashboard/VerificationDetailModal.vue';
import { useVerificationStore } from '../../stores/verificationStore.js';
import { Verification } from '../../types/index.js';
import { ShieldCheck, TrendingUp, CheckCircle2, Clock, AlertOctagon, Activity, FileText } from 'lucide-vue-next';

const store = useVerificationStore();
const lastUpdatedTime = ref(new Date().toLocaleTimeString());

onMounted(() => {
  loadData();
});

async function loadData() {
  await store.fetchDashboardStats();
  await store.fetchVerifications();
  lastUpdatedTime.value = new Date().toLocaleTimeString();
}

function openModal(item: Verification) {
  store.selectedVerification = item;
}

function getPercentage(value: number) {
  const total = store.stats?.total || 1;
  return Math.round((value / total) * 100);
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
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
</script>
