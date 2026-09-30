<template>
  <DashboardLayout>
    <div class="space-y-3.5">
      <div class="glass-panel p-5 rounded-3xl border border-white/90 flex items-center justify-between shadow-sm">
        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 font-heading">
            <ShieldCheck class="w-4 h-4 text-cyan-400" />
            Immutable Audit Trail Logs
          </h3>
          <p class="text-xs text-slate-400 font-medium">Cryptographically ordered compliance events and reviewer decisions</p>
        </div>

        <button @click="store.fetchAuditLogs" class="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer">
          <RefreshCw class="w-4 h-4" />
        </button>
      </div>

      <!-- Audit Logs Table (Scrollable Container) -->
      <div class="glass-panel rounded-3xl border border-white/90 overflow-hidden shadow-sm">
        <div class="overflow-x-auto max-h-[580px] overflow-y-auto">
          <table class="min-w-[950px] w-full text-left text-xs">
            <thead class="bg-black/60 text-slate-300 font-bold border-b border-white/10 uppercase tracking-wider sticky top-0 backdrop-blur-md z-10 font-heading">
              <tr>
                <th class="px-6 py-4 w-1/5">Timestamp</th>
                <th class="px-6 py-4 w-1/5">Actor / Performer</th>
                <th class="px-6 py-4 w-1/6">Action Event</th>
                <th class="px-6 py-4 w-1/5">Target Resource</th>
                <th class="px-6 py-4 w-1/4">Payload Details</th>
                <th class="px-6 py-4">IP Address</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-slate-200 font-medium">
              <tr v-for="log in store.auditLogs" :key="log.id" class="hover:bg-white/10">
                <td class="px-6 py-4 font-mono text-slate-400 whitespace-nowrap">
                  {{ formatDate(log.createdAt) }}
                </td>
                <td class="px-6 py-4">
                  <div class="font-bold text-white text-sm">{{ log.actor?.fullName || 'SYSTEM ENGINE' }}</div>
                  <div class="text-[11px] text-slate-400 font-mono mt-0.5">{{ log.actor?.email || 'automated@plax.io' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 rounded-xl text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {{ log.action }}
                  </span>
                </td>
                <td class="px-6 py-4 font-mono text-slate-200 whitespace-nowrap">
                  {{ log.targetType }} <span class="text-slate-400">#{{ log.targetId.slice(0, 8) }}</span>
                </td>
                <td class="px-6 py-4 max-w-xs truncate font-mono text-[11px] text-slate-400">
                  {{ log.payload || '{}' }}
                </td>
                <td class="px-6 py-4 font-mono text-slate-400 whitespace-nowrap">
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
