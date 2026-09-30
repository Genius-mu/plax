<template>
  <aside class="w-64 bg-white/70 backdrop-blur-2xl border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 z-20 shadow-sm">
    <div>
      <!-- Brand Logo -->
      <div class="px-6 py-5 flex items-center gap-3 border-b border-slate-200/60">
        <div class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
          <ShieldCheck class="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h1 class="font-extrabold text-lg tracking-wider text-slate-900 flex items-center gap-1.5">
            PLAX <span class="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">ID</span>
          </h1>
          <p class="text-[10px] text-slate-500 font-mono tracking-tight font-medium">IDENTITY ENGINE v2.0</p>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="p-4 space-y-1.5">
        <router-link
          to="/dashboard"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
          :class="$route.path === '/dashboard' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'"
        >
          <LayoutDashboard class="w-4 h-4" />
          <span>Overview</span>
        </router-link>

        <router-link
          to="/verifications"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
          :class="$route.path.startsWith('/verifications') ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'"
        >
          <CheckCircle2 class="w-4 h-4" />
          <span>Verifications</span>
        </router-link>

        <router-link
          v-if="authStore.isAdmin"
          to="/audit-logs"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
          :class="$route.path === '/audit-logs' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'"
        >
          <FileText class="w-4 h-4" />
          <span>Audit Logs</span>
        </router-link>

        <div class="pt-5 pb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">SANDBOX PORTAL</div>

        <router-link
          to="/verify"
          target="_blank"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50/80 border border-blue-200/80 hover:bg-blue-100/80 transition-all"
        >
          <div class="flex items-center gap-2.5">
            <UserCheck class="w-4 h-4 text-blue-600" />
            <span>Customer Portal</span>
          </div>
          <ExternalLink class="w-3.5 h-3.5 text-blue-500" />
        </router-link>
      </nav>
    </div>

    <!-- User Footer -->
    <div class="p-4 border-t border-slate-200/60 bg-white/50">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {{ userInitials }}
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-bold text-slate-900 truncate leading-tight">{{ authStore.user?.fullName }}</p>
            <span class="inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 mt-0.5">
              {{ authStore.role }}
            </span>
          </div>
        </div>
        <button
          @click="handleLogout"
          title="Sign Out"
          class="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore.js';
import { ShieldCheck, LayoutDashboard, CheckCircle2, FileText, UserCheck, ExternalLink, LogOut } from 'lucide-vue-next';

const authStore = useAuthStore();
const router = useRouter();

const userInitials = computed(() => {
  const name = authStore.user?.fullName || 'User';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
});

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>
