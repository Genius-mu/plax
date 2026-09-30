<template>
  <aside
    class="glass-panel border border-white/18 flex flex-col justify-between shadow-2xl transition-all duration-300 ease-in-out select-none rounded-3xl overflow-hidden"
    :class="isCollapsed ? 'w-16' : 'w-64'"
    style="position: fixed !important; top: 5vh !important; height: 90vh !important; left: 1rem !important; z-index: 50 !important;"
  >
    <div>
      <!-- Brand Logo Header & ChatGPT-style Hover Toggle -->
      <div
        class="px-4 py-4 flex items-center border-b border-white/10 min-h-[64px] relative group"
        :class="isCollapsed ? 'justify-center' : 'justify-between'"
      >
        <!-- Expanded Brand -->
        <div v-if="!isCollapsed" class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center shadow-md shrink-0"
          >
            <ShieldCheck class="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1
              class="font-bold text-base tracking-wide text-white flex items-center gap-1.5 font-heading"
            >
              PLAX
              <span
                class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-sans"
                >ID</span
              >
            </h1>
            <p class="text-[10px] text-slate-400 font-mono tracking-tight">
              IDENTITY ENGINE v2.0
            </p>
          </div>
        </div>

        <!-- Collapsed Brand Icon & Hover Expand Button (ChatGPT style) -->
        <div v-else class="relative flex items-center justify-center w-full">
          <!-- Logo shown normally -->
          <div
            class="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center shadow-md shrink-0 transition-opacity duration-200 group-hover:opacity-20"
            title="PLAX ID"
          >
            <ShieldCheck class="w-5 h-5 stroke-[2.5]" />
          </div>

          <!-- Hover expand button appears on hover over logo -->
          <button
            @click="toggleSidebar"
            class="absolute inset-0 m-auto w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 border border-white/30 cursor-pointer shadow-lg"
            title="Expand Sidebar"
          >
            <PanelLeftOpen class="w-4 h-4" />
          </button>
        </div>

        <!-- Expanded Collapse Button -->
        <button
          v-if="!isCollapsed"
          @click="toggleSidebar"
          class="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          title="Collapse Sidebar"
        >
          <PanelLeftClose class="w-4 h-4" />
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="p-2.5 space-y-1.5">
        <router-link
          to="/dashboard"
          class="flex items-center gap-3 rounded-xl text-xs font-medium transition-all relative group"
          :class="[
            $route.path === '/dashboard'
              ? 'bg-white text-black font-semibold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/10',
            isCollapsed ? 'w-11 h-11 justify-center mx-auto' : 'px-3.5 py-2.5',
          ]"
          :title="isCollapsed ? 'Overview' : ''"
        >
          <LayoutDashboard class="w-4 h-4 shrink-0" />
          <span v-if="!isCollapsed">Overview</span>
        </router-link>

        <router-link
          to="/verifications"
          class="flex items-center gap-3 rounded-xl text-xs font-medium transition-all relative group"
          :class="[
            $route.path.startsWith('/verifications')
              ? 'bg-white text-black font-semibold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/10',
            isCollapsed ? 'w-11 h-11 justify-center mx-auto' : 'px-3.5 py-2.5',
          ]"
          :title="isCollapsed ? 'Verifications' : ''"
        >
          <CheckCircle2 class="w-4 h-4 shrink-0" />
          <span v-if="!isCollapsed">Verifications</span>
        </router-link>

        <router-link
          v-if="authStore.isAdmin"
          to="/audit-logs"
          class="flex items-center gap-3 rounded-xl text-xs font-medium transition-all relative group"
          :class="[
            $route.path === '/audit-logs'
              ? 'bg-white text-black font-semibold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/10',
            isCollapsed ? 'w-11 h-11 justify-center mx-auto' : 'px-3.5 py-2.5',
          ]"
          :title="isCollapsed ? 'Audit Logs' : ''"
        >
          <FileText class="w-4 h-4 shrink-0" />
          <span v-if="!isCollapsed">Audit Logs</span>
        </router-link>

        <div
          v-if="!isCollapsed"
          class="pt-3 pb-1 px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest"
        >
          SANDBOX PORTAL
        </div>

        <router-link
          to="/verify"
          target="_blank"
          class="flex items-center rounded-xl text-xs font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all"
          :class="
            isCollapsed
              ? 'w-11 h-11 justify-center mx-auto'
              : 'justify-between px-3.5 py-2.5'
          "
          :title="isCollapsed ? 'Customer Portal' : ''"
        >
          <div class="flex items-center gap-2.5">
            <UserCheck class="w-4 h-4 text-cyan-400 shrink-0" />
            <span v-if="!isCollapsed">Customer Portal</span>
          </div>
          <ExternalLink
            v-if="!isCollapsed"
            class="w-3.5 h-3.5 text-cyan-400 shrink-0"
          />
        </router-link>
      </nav>
    </div>

    <!-- User Footer -->
    <div class="p-2.5 border-t border-white/10">
      <div
        class="flex items-center"
        :class="isCollapsed ? 'justify-center' : 'justify-between'"
      >
        <div class="flex items-center gap-3 overflow-hidden">
          <div
            class="w-8 h-8 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-xs flex items-center justify-center shrink-0"
          >
            {{ userInitials }}
          </div>
          <div v-if="!isCollapsed" class="overflow-hidden">
            <p class="text-xs font-medium text-white truncate leading-tight">
              {{ authStore.user?.fullName }}
            </p>
            <span
              class="inline-block text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-slate-400 border border-white/10 mt-0.5"
            >
              {{ authStore.role }}
            </span>
          </div>
        </div>

        <button
          v-if="!isCollapsed"
          @click="handleLogout"
          title="Sign Out"
          class="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore.js";
import { useSidebar } from "../../composables/useSidebar.js";
import {
  ShieldCheck,
  LayoutDashboard,
  CheckCircle2,
  FileText,
  UserCheck,
  ExternalLink,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-vue-next";

const authStore = useAuthStore();
const router = useRouter();
const { isCollapsed, toggleSidebar } = useSidebar();

const userInitials = computed(() => {
  const name = authStore.user?.fullName || "User";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

function handleLogout() {
  authStore.logout();
  router.push("/login");
}
</script>
