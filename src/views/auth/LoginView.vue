<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Liquid Soft Light Background Blobs -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/90 shadow-2xl relative z-10 space-y-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="inline-flex w-12 h-12 rounded-2xl bg-slate-900 text-white items-center justify-center shadow-lg mb-1">
          <ShieldCheck class="w-7 h-7 stroke-[2.5]" />
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-wider">PLAX ID</h1>
        <p class="text-xs text-slate-500 font-medium">Digital Identity Verification & KYC Compliance</p>
      </div>

      <!-- Quick Demo Credentials Box -->
      <div class="p-4 rounded-2xl bg-white/70 border border-slate-200/80 text-xs space-y-1.5 shadow-2xs">
        <div class="flex items-center justify-between text-slate-900 font-bold">
          <span>⚡ Demo Credentials</span>
          <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">PRE-POPULATED</span>
        </div>
        <p class="text-slate-600">Admin: <code class="text-slate-900 font-bold">admin@plax.io</code> / <code class="text-slate-900 font-bold">password123</code></p>
        <p class="text-slate-600">Reviewer: <code class="text-slate-900 font-bold">reviewer@plax.io</code> / <code class="text-slate-900 font-bold">password123</code></p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div v-if="authStore.error" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
          {{ authStore.error }}
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full glass-input rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full glass-input rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-3.5 rounded-xl btn-glass-primary font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Loader2 v-if="authStore.loading" class="w-4 h-4 animate-spin" />
          <span v-else>Sign In to Dashboard</span>
        </button>
      </form>

      <div class="text-center pt-2 border-t border-slate-200/60">
        <router-link to="/verify" class="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center justify-center gap-1">
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
