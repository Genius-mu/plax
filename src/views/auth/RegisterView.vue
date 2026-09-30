<template>
  <div class="min-h-screen bg-[#070a12] flex items-center justify-center p-4">
    <div class="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6">
      <div class="text-center space-y-2">
        <h1 class="text-2xl font-bold text-white">Create Account</h1>
        <p class="text-xs text-slate-400">Join Plax ID Compliance Platform</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
          <input v-model="fullName" type="text" required class="w-full bg-slate-950 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white" />
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Email</label>
          <input v-model="email" type="email" required class="w-full bg-slate-950 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white" />
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">Password</label>
          <input v-model="password" type="password" required class="w-full bg-slate-950 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white" />
        </div>

        <button type="submit" class="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm">
          Register
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore.js';

const authStore = useAuthStore();
const router = useRouter();

const fullName = ref('');
const email = ref('');
const password = ref('');

async function handleRegister() {
  try {
    await authStore.register({ fullName: fullName.value, email: email.value, password: password.value, role: 'REVIEWER' });
    router.push('/dashboard');
  } catch (err) {
    alert(err);
  }
}
</script>
