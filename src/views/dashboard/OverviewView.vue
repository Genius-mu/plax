<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Metric Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Total Verifications Card -->
        <div class="glass-panel glass-panel-hover p-6 rounded-3xl relative overflow-hidden group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Cases</span>
            <div class="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black text-white font-mono tracking-tight font-heading">{{ store.stats?.total || 0 }}</span>
            <span class="text-xs font-bold text-emerald-400 flex items-center gap-0.5 bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-500/30">
              <TrendingUp class="w-3.5 h-3.5" /> +12.4%
            </span>
          </div>
          <p class="text-[11px] text-slate-400 font-medium mt-1.5">Processed across organization</p>
        </div>

        <!-- Approved Card -->
        <div class="glass-panel glass-panel-hover p-6 rounded-3xl relative overflow-hidden group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Auto Approved</span>
            <div class="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xs">
              <CheckCircle2 class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black text-emerald-400 font-mono tracking-tight font-heading">{{ store.stats?.approved || 0 }}</span>
            <span class="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-500/40">
              {{ store.stats?.approvalRate || 100 }}% Pass Rate
            </span>
          </div>
          <p class="text-[11px] text-slate-400 font-medium mt-1.5">Low risk (&lt; 25 risk score)</p>
        </div>

        <!-- Manual Review Queue Card -->
        <div class="glass-panel glass-panel-hover p-6 rounded-3xl relative overflow-hidden group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Manual Review</span>
            <div class="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-xs">
              <Clock class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black text-purple-300 font-mono tracking-tight font-heading">{{ store.stats?.manualReview || 0 }}</span>
            <span class="text-xs font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-lg border border-purple-500/40">Action Required</span>
          </div>
          <p class="text-[11px] text-slate-400 font-medium mt-1.5">Medium risk flagged cases</p>
        </div>

        <!-- Failed / Rejected Card -->
        <div class="glass-panel glass-panel-hover p-6 rounded-3xl relative overflow-hidden group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Rejected</span>
            <div class="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xs">
              <AlertOctagon class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-black text-rose-400 font-mono tracking-tight font-heading">{{ store.stats?.failed || 0 }}</span>
            <span class="text-xs font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-lg border border-rose-500/40">Critical Risk</span>
          </div>
          <p class="text-[11px] text-slate-400 font-medium mt-1.5">High risk signals flagged</p>
        </div>
      </div>

      <!-- Activity Ratio Bar Visualizer -->
      <div class="glass-panel p-6 rounded-3xl space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-heading">
              <Activity class="w-4 h-4 text-cyan-400" />
              Verification Status Ratio Breakdown
            </h3>
            <p class="text-xs text-slate-400 font-medium">Real-time status distribution across active customer submissions</p>
          </div>
          <span class="text-xs text-slate-400 font-mono">Updated {{ lastUpdatedTime }}</span>
        </div>

        <!-- Visual Progress Segments -->
        <div class="w-full h-4 rounded-full bg-black/40 overflow-hidden flex p-0.5 border border-white/10 gap-1 shadow-inner">
          <div
            class="h-full bg-emerald-400 rounded-full transition-all duration-500"
            :style="{ width: getPercentage(store.stats?.approved || 0) + '%' }"
            title="Approved"
          ></div>
          <div
            class="h-full bg-purple-400 rounded-full transition-all duration-500"
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
            <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
            <span class="text-slate-300">Approved: <strong class="text-white font-bold">{{ store.stats?.approved || 0 }}</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-purple-400"></span>
            <span class="text-slate-300">Manual Review: <strong class="text-white font-bold">{{ store.stats?.manualReview || 0 }}</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-amber-400"></span>
            <span class="text-slate-300">Pending: <strong class="text-white font-bold">{{ store.stats?.pending || 0 }}</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-rose-500"></span>
            <span class="text-slate-300">Rejected: <strong class="text-white font-bold">{{ store.stats?.failed || 0 }}</strong></span>
          </div>
        </div>
      </div>

      <!-- Recent Verifications Table (Scrollable & Un-cramped) -->
      <div class="glass-panel rounded-3xl overflow-hidden">
        <div class="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-heading">
              <FileText class="w-4 h-4 text-cyan-400" />
              Recent Verification Activity
            </h3>
            <p class="text-xs text-slate-400 font-medium">Inspected identity submissions and automated processing results</p>
          </div>

          <router-link
            to="/verifications"
            class="btn-glass-secondary px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1 transition-all"
          >
            View All Cases &rarr;
          </router-link>
        </div>

        <!-- Scrollable Table Container -->
        <div class="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table class="min-w-[900px] w-full text-left text-xs">
            <thead class="bg-black/50 text-slate-400 font-bold border-b border-white/10 uppercase tracking-wider sticky top-0 backdrop-blur-md z-10">
              <tr>
                <th class="px-6 py-4 w-1/5">Customer Name</th>
                <th class="px-6 py-4 w-1/6">Status</th>
                <th class="px-6 py-4 w-1/6">Risk Score</th>
                <th class="px-6 py-4 w-1/4">Risk Signals</th>
                <th class="px-6 py-4 w-1/6">Submitted</th>
                <th class="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-slate-200 font-medium">
              <tr
                v-for="item in store.verifications.slice(0, 10)"
                :key="item.id"
                class="hover:bg-white/10 transition-colors cursor-pointer"
                @click="openModal(item)"
              >
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
  if (score >= 75) return 'text-rose-400';
  if (score >= 40) return 'text-amber-400';
  return 'text-emerald-400';
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
</script>
