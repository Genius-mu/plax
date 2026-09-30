<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Liquid Soft Light Background Blobs -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/20 shadow-2xl relative z-10 space-y-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="inline-flex w-12 h-12 rounded-2xl bg-white text-slate-950 items-center justify-center shadow-xl mb-1">
          <ShieldCheck class="w-7 h-7 stroke-[2.5]" />
        </div>
        <h1 class="text-2xl font-black text-white tracking-wider">PLAX ID</h1>
        <p class="text-xs text-slate-400 font-medium">Digital Identity Verification & KYC Compliance</p>
      </div>

      <!-- Quick Demo Credentials Box -->
      <div class="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-1.5">
        <div class="flex items-center justify-between text-white font-bold">
          <span>⚡ Demo Credentials</span>
          <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">PRE-POPULATED</span>
        </div>
        <p class="text-slate-300">Admin: <code class="text-white font-bold">admin@plax.io</code> / <code class="text-white font-bold">password123</code></p>
        <p class="text-slate-300">Reviewer: <code class="text-white font-bold">reviewer@plax.io</code> / <code class="text-white font-bold">password123</code></p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div v-if="authStore.error" class="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 font-medium">
          {{ authStore.error }}
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full glass-input rounded-2xl px-4 py-2.5 text-xs text-white font-medium"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full glass-input rounded-2xl px-4 py-2.5 text-xs text-white font-medium"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-3.5 rounded-2xl btn-glass-primary font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Loader2 v-if="authStore.loading" class="w-4 h-4 animate-spin" />
          <span v-else>Sign In to Dashboard</span>
        </button>
      </form>

      <div class="text-center pt-2 border-t border-white/10">
        <router-link to="/verify" class="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center justify-center gap-1">
          Open Customer Verification Portal &rarr;
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
