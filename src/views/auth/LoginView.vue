<template>
  <div class="min-h-screen bg-[#070a12] flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Ambient Background Glows -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl relative z-10 space-y-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="inline-flex w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 items-center justify-center shadow-lg shadow-emerald-500/20 mb-2">
          <ShieldCheck class="w-7 h-7 text-slate-950 stroke-[2.5]" />
        </div>
        <h1 class="text-2xl font-bold text-white tracking-wider">PLAX ID</h1>
        <p class="text-xs text-slate-400">Digital Identity Verification & KYC Platform</p>
      </div>

      <!-- Quick Demo Credentials Box -->
      <div class="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-xs space-y-1">
        <div class="flex items-center justify-between text-emerald-400 font-bold">
          <span>⚡ Demo Seed Credentials</span>
          <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20">PRE-POPULATED</span>
        </div>
        <p class="text-slate-300">Admin: <code class="text-emerald-300">admin@plax.io</code> / <code class="text-emerald-300">password123</code></p>
        <p class="text-slate-300">Reviewer: <code class="text-emerald-300">reviewer@plax.io</code> / <code class="text-emerald-300">password123</code></p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div v-if="authStore.error" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
          {{ authStore.error }}
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full bg-slate-950/80 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full bg-slate-950/80 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Loader2 v-if="authStore.loading" class="w-4 h-4 animate-spin" />
          <span v-else>Sign In to Dashboard</span>
        </button>
      </form>

      <div class="text-center pt-2">
        <router-link to="/verify" class="text-xs text-cyan-400 hover:underline flex items-center justify-center gap-1">
          Open Customer Verification Flow Portal &rarr;
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore.js';
import { ShieldCheck, Loader2 } from 'lucide-vue-next';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('admin@plax.io');
const password = ref('password123');

async function handleLogin() {
  try {
    await authStore.login(email.value, password.value);
    router.push('/dashboard');
  } catch (err) {
    // Error handled in store
  }
}
</script>
