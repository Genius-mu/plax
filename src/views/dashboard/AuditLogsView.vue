<template>
  <DashboardLayout>
    <div class="space-y-6">
      <div class="glass-panel p-5 rounded-3xl border border-white/90 flex items-center justify-between shadow-sm">
        <div>
          <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-blue-600" />
            Immutable Audit Trail Logs
          </h3>
          <p class="text-xs text-slate-500 font-medium">Cryptographically ordered compliance events and reviewer decisions</p>
        </div>

        <button @click="store.fetchAuditLogs" class="p-2.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 shadow-2xs">
          <RefreshCw class="w-4 h-4" />
        </button>
      </div>

      <!-- Audit Logs Table -->
      <div class="glass-panel rounded-3xl border border-white/90 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/60 uppercase tracking-wider">
              <tr>
                <th class="px-6 py-4">Timestamp</th>
                <th class="px-6 py-4">Actor / Performer</th>
                <th class="px-6 py-4">Action Event</th>
                <th class="px-6 py-4">Target Resource</th>
                <th class="px-6 py-4">Payload Details</th>
                <th class="px-6 py-4">IP Address</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr v-for="log in store.auditLogs" :key="log.id" class="hover:bg-white/80">
                <td class="px-6 py-4 font-mono text-slate-500">
                  {{ formatDate(log.createdAt) }}
                </td>
                <td class="px-6 py-4">
                  <div class="font-bold text-slate-900">{{ log.actor?.fullName || 'SYSTEM ENGINE' }}</div>
                  <div class="text-[10px] text-slate-500 font-mono">{{ log.actor?.email || 'automated@plax.io' }}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                    {{ log.action }}
                  </span>
                </td>
                <td class="px-6 py-4 font-mono text-slate-800">
                  {{ log.targetType }} <span class="text-slate-400">#{{ log.targetId.slice(0, 8) }}</span>
                </td>
                <td class="px-6 py-4 max-w-xs truncate font-mono text-[11px] text-slate-500">
                  {{ log.payload || '{}' }}
                </td>
                <td class="px-6 py-4 font-mono text-slate-500">
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
