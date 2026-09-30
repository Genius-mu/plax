<template>
  <DashboardLayout>
    <div class="space-y-6">
      <div class="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-emerald-400" />
            Immutable Audit Trail Logs
          </h3>
          <p class="text-xs text-slate-400">Cryptographically ordered compliance events and reviewer decisions</p>
        </div>

        <button @click="store.fetchAuditLogs" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10">
          <RefreshCw class="w-4 h-4" />
        </button>
      </div>

      <!-- Audit Logs Table -->
      <div class="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/90 text-slate-400 font-semibold border-b border-white/10 uppercase tracking-wider">
              <tr>
                <th class="px-6 py-4">Timestamp</th>
                <th class="px-6 py-4">Actor / Performer</th>
                <th class="px-6 py-4">Action Event</th>
                <th class="px-6 py-4">Target Resource</th>
                <th class="px-6 py-4">Payload Details</th>
                <th class="px-6 py-4">IP Address</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-slate-300">
              <tr v-for="log in store.auditLogs" :key="log.id" class="hover:bg-white/5">
                <td class="px-6 py-4 font-mono text-slate-400">
                  {{ formatDate(log.createdAt) }}
                </td>
                <td class="px-6 py-4">
                  <div class="font-bold text-white">{{ log.actor?.fullName || 'SYSTEM ENGINE' }}</div>
                  <div class="text-[10px] text-slate-400 font-mono">{{ log.actor?.email || 'automated@plax.io' }}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-slate-800 text-emerald-400 border border-emerald-500/20">
                    {{ log.action }}
                  </span>
                </td>
                <td class="px-6 py-4 font-mono text-slate-300">
                  {{ log.targetType }} <span class="text-slate-500">#{{ log.targetId.slice(0, 8) }}</span>
                </td>
                <td class="px-6 py-4 max-w-xs truncate font-mono text-[11px] text-slate-400">
                  {{ log.payload || '{}' }}
                </td>
                <td class="px-6 py-4 font-mono text-slate-400">
                  {{ log.ipAddress || '127.0.0.1' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import DashboardLayout from '../../components/layout/DashboardLayout.vue';
import { useVerificationStore } from '../../stores/verificationStore.js';
import { ShieldCheck, RefreshCw } from 'lucide-vue-next';

const store = useVerificationStore();

onMounted(() => {
  store.fetchAuditLogs();
});

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString();
}
</script>
