<template>
  <aside class="w-64 bg-slate-950/40 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between h-screen sticky top-0 z-20 shadow-xl">
    <div>
      <!-- Brand Logo -->
      <div class="px-6 py-5 flex items-center gap-3 border-b border-white/10">
        <div class="w-10 h-10 rounded-2xl bg-white text-slate-950 flex items-center justify-center shadow-lg font-bold">
          <ShieldCheck class="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h1 class="font-black text-lg tracking-wider text-white flex items-center gap-1.5">
            PLAX <span class="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">ID</span>
          </h1>
          <p class="text-[10px] text-slate-400 font-mono tracking-tight font-medium">IDENTITY ENGINE v2.0</p>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="p-4 space-y-1.5">
        <router-link
          to="/dashboard"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all"
          :class="$route.path === '/dashboard' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-300 hover:text-white hover:bg-white/10'"
        >
          <LayoutDashboard class="w-4 h-4" />
          <span>Overview</span>
        </router-link>

        <router-link
          to="/verifications"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all"
          :class="$route.path.startsWith('/verifications') ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-300 hover:text-white hover:bg-white/10'"
        >
          <CheckCircle2 class="w-4 h-4" />
          <span>Verifications</span>
        </router-link>

        <router-link
          v-if="authStore.isAdmin"
          to="/audit-logs"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all"
          :class="$route.path === '/audit-logs' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-300 hover:text-white hover:bg-white/10'"
        >
          <FileText class="w-4 h-4" />
          <span>Audit Logs</span>
        </router-link>

        <div class="pt-5 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">SANDBOX PORTAL</div>

        <router-link
          to="/verify"
          target="_blank"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all"
        >
          <div class="flex items-center gap-2.5">
            <UserCheck class="w-4 h-4 text-cyan-400" />
            <span>Customer Portal</span>
          </div>
          <ExternalLink class="w-3.5 h-3.5 text-cyan-400" />
        </router-link>
      </nav>
    </div>

    <!-- User Footer -->
    <div class="p-4 border-t border-white/10 bg-slate-950/60">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {{ userInitials }}
          </div>
          <div class="overflow-hidden">
            <p class="text-xs font-bold text-white truncate leading-tight">{{ authStore.user?.fullName }}</p>
            <span class="inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10 mt-0.5">
              {{ authStore.role }}
            </span>
          </div>
        </div>
        <button
          @click="handleLogout"
          title="Sign Out"
          class="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
