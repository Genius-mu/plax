<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Metric Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Verifications Card -->
        <div class="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Verifications</span>
            <div class="w-9 h-9 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-emerald-400">
              <ShieldCheck class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-black text-white font-mono">{{ store.stats?.total || 0 }}</span>
            <span class="text-xs text-emerald-400 flex items-center gap-0.5">
              <TrendingUp class="w-3.5 h-3.5" /> +12.4%
            </span>
          </div>
          <p class="text-[11px] text-slate-500 mt-1">Processed across organization</p>
        </div>

        <!-- Approved Card -->
        <div class="glass-panel p-5 rounded-2xl border border-emerald-500/20 relative overflow-hidden group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Auto Approved</span>
            <div class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-black text-emerald-400 font-mono">{{ store.stats?.approved || 0 }}</span>
            <span class="text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
              {{ store.stats?.approvalRate || 100 }}% Pass Rate
            </span>
          </div>
          <p class="text-[11px] text-slate-500 mt-1">Low risk (< 25 risk score)</p>
        </div>

        <!-- Manual Review Queue Card -->
        <div class="glass-panel p-5 rounded-2xl border border-purple-500/20 relative overflow-hidden group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Manual Review</span>
            <div class="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Clock class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-black text-purple-400 font-mono">{{ store.stats?.manualReview || 0 }}</span>
            <span class="text-xs text-purple-300">Requires Reviewer Action</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-1">Medium risk flagged cases</p>
        </div>

        <!-- Failed / Rejected Card -->
        <div class="glass-panel p-5 rounded-2xl border border-red-500/20 relative overflow-hidden group">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rejected / Failed</span>
            <div class="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertOctagon class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-black text-red-400 font-mono">{{ store.stats?.failed || 0 }}</span>
            <span class="text-xs text-red-400">Critical Risk / Spoof</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-1">High risk signals flagged</p>
        </div>
      </div>

      <!-- Activity Ratio Bar Visualizer -->
      <div class="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity class="w-4 h-4 text-emerald-400" />
              Verification Status Ratio Breakdown
            </h3>
            <p class="text-xs text-slate-400">Real-time status distribution across active customer submissions</p>
          </div>
          <span class="text-xs text-slate-400 font-mono">Updated {{ lastUpdatedTime }}</span>
        </div>

        <!-- Visual Progress Segments -->
        <div class="w-full h-4 rounded-full bg-slate-900 overflow-hidden flex p-0.5 border border-white/10 gap-1">
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
            class="h-full bg-amber-500 rounded-full transition-all duration-500"
            :style="{ width: getPercentage(store.stats?.pending || 0) + '%' }"
            title="Pending"
          ></div>
          <div
            class="h-full bg-red-500 rounded-full transition-all duration-500"
            :style="{ width: getPercentage(store.stats?.failed || 0) + '%' }"
            title="Rejected"
          ></div>
        </div>

        <div class="flex items-center gap-6 text-xs pt-1">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span class="text-slate-300">Approved: <strong>{{ store.stats?.approved || 0 }}</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-purple-500"></span>
            <span class="text-slate-300">Manual Review: <strong>{{ store.stats?.manualReview || 0 }}</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-amber-500"></span>
            <span class="text-slate-300">Pending: <strong>{{ store.stats?.pending || 0 }}</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-red-500"></span>
            <span class="text-slate-300">Rejected: <strong>{{ store.stats?.failed || 0 }}</strong></span>
          </div>
        </div>
      </div>

      <!-- Recent Verifications Table -->
      <div class="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div class="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText class="w-4 h-4 text-emerald-400" />
              Recent Verification Activity
            </h3>
            <p class="text-xs text-slate-400">Inspected identity submissions and automated processing results</p>
          </div>

          <router-link
            to="/verifications"
            class="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-all"
          >
            View All Verifications &rarr;
          </router-link>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 text-slate-400 font-semibold border-b border-white/10 uppercase tracking-wider">
              <tr>
                <th class="px-6 py-3.5">Customer Name</th>
                <th class="px-6 py-3.5">Status</th>
                <th class="px-6 py-3.5">Risk Score</th>
                <th class="px-6 py-3.5">Risk Signals</th>
                <th class="px-6 py-3.5">Submitted</th>
                <th class="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-slate-300">
              <tr
                v-for="item in store.verifications.slice(0, 6)"
                :key="item.id"
                class="hover:bg-white/5 transition-colors cursor-pointer"
                @click="openModal(item)"
              >
                <td class="px-6 py-4">
                  <div class="font-bold text-white">{{ item.customer?.firstName }} {{ item.customer?.lastName }}</div>
                  <div class="text-[11px] text-slate-400 font-mono">{{ item.customer?.email }}</div>
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
                      class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono"
                    >
                      {{ sig.code }}
                    </span>
                  </div>
                  <span v-else class="text-emerald-400 text-[11px]">Clean</span>
                </td>
                <td class="px-6 py-4 text-slate-400 font-mono">
                  {{ formatDate(item.createdAt) }}
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    @click.stop="openModal(item)"
                    class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10 transition-colors"
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
  if (score >= 75) return 'text-red-400';
  if (score >= 40) return 'text-amber-400';
  return 'text-emerald-400';
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
</script>
