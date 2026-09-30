<template>
  <aside
    class="bg-slate-950/40 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between h-screen sticky top-0 z-20 shadow-xl transition-all duration-300 ease-in-out"
    :class="isCollapsed ? 'w-20' : 'w-64'"
  >
    <div>
      <!-- Brand Logo & Collapse Toggle -->
      <div class="px-4 py-5 flex items-center justify-between border-b border-white/10">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-10 h-10 rounded-2xl bg-white text-slate-950 flex items-center justify-center shadow-lg font-bold shrink-0">
            <ShieldCheck class="w-6 h-6 stroke-[2.5]" />
          </div>
          <div v-if="!isCollapsed" class="transition-opacity duration-200">
            <h1 class="font-black text-lg tracking-wider text-white flex items-center gap-1.5 font-heading">
              PLAX <span class="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-sans">ID</span>
            </h1>
            <p class="text-[10px] text-slate-400 font-mono tracking-tight font-medium">IDENTITY ENGINE v2.0</p>
          </div>
        </div>

        <button
          @click="toggleSidebar"
          class="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          :title="isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
        >
          <ChevronLeft v-if="!isCollapsed" class="w-5 h-5" />
          <ChevronRight v-else class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="p-3 space-y-1.5">
        <router-link
          to="/dashboard"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all relative group"
          :class="$route.path === '/dashboard' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-300 hover:text-white hover:bg-white/10'"
          :title="isCollapsed ? 'Overview' : ''"
        >
          <LayoutDashboard class="w-4 h-4 shrink-0" />
          <span v-if="!isCollapsed">Overview</span>
        </router-link>

        <router-link
          to="/verifications"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all relative group"
          :class="$route.path.startsWith('/verifications') ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-300 hover:text-white hover:bg-white/10'"
          :title="isCollapsed ? 'Verifications' : ''"
        >
          <CheckCircle2 class="w-4 h-4 shrink-0" />
          <span v-if="!isCollapsed">Verifications</span>
        </router-link>

        <router-link
          v-if="authStore.isAdmin"
          to="/audit-logs"
          class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all relative group"
          :class="$route.path === '/audit-logs' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-300 hover:text-white hover:bg-white/10'"
          :title="isCollapsed ? 'Audit Logs' : ''"
        >
          <FileText class="w-4 h-4 shrink-0" />
          <span v-if="!isCollapsed">Audit Logs</span>
        </router-link>

        <div v-if="!isCollapsed" class="pt-5 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">SANDBOX PORTAL</div>

        <router-link
          to="/verify"
          target="_blank"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all"
          :title="isCollapsed ? 'Customer Portal' : ''"
        >
          <div class="flex items-center gap-2.5">
            <UserCheck class="w-4 h-4 text-cyan-400 shrink-0" />
            <span v-if="!isCollapsed">Customer Portal</span>
          </div>
          <ExternalLink v-if="!isCollapsed" class="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        </router-link>
      </nav>
    </div>

    <!-- User Footer -->
    <div class="p-3 border-t border-white/10 bg-slate-950/60">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
            {{ userInitials }}
          </div>
          <div v-if="!isCollapsed" class="overflow-hidden">
            <p class="text-xs font-bold text-white truncate leading-tight">{{ authStore.user?.fullName }}</p>
            <span class="inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10 mt-0.5">
              {{ authStore.role }}
            </span>
          </div>
        </div>

        <button
          v-if="!isCollapsed"
          @click="handleLogout"
          title="Sign Out"
          class="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
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
import { useSidebar } from '../../composables/useSidebar.js';
import { ShieldCheck, LayoutDashboard, CheckCircle2, FileText, UserCheck, ExternalLink, LogOut, ChevronLeft, ChevronRight } from 'lucide-vue-next';

const authStore = useAuthStore();
const router = useRouter();
const { isCollapsed, toggleSidebar } = useSidebar();

const userInitials = computed(() => {
  const name = authStore.user?.fullName || 'User';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
});

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>
