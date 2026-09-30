<template>
  <div class="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-between p-4 md:p-8">
    <!-- Header -->
    <header class="max-w-3xl mx-auto w-full flex items-center justify-between py-4 border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <ShieldCheck class="w-5 h-5 text-slate-950 stroke-[2.5]" />
        </div>
        <span class="font-bold text-lg text-white tracking-wider">PLAX <span class="text-xs text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/20">VERIFY</span></span>
      </div>

      <div class="text-xs text-slate-400 font-mono">
        SECURE 256-BIT ENCRYPTED SESSION
      </div>
    </header>

    <!-- Main Card Flow -->
    <main class="max-w-xl mx-auto w-full my-8">
      <div class="glass-panel p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">

        <!-- Progress Steps Header -->
        <div class="flex items-center justify-between text-xs font-semibold text-slate-400 pb-4 border-b border-white/10">
          <span :class="{ 'text-emerald-400': step >= 1 }">1. Personal Info</span>
          <span :class="{ 'text-emerald-400': step >= 2 }">2. Document</span>
          <span :class="{ 'text-emerald-400': step >= 3 }">3. Selfie Check</span>
          <span :class="{ 'text-emerald-400': step >= 4 }">4. Result</span>
        </div>

        <!-- STEP 1: Personal Info -->
        <div v-if="step === 1" class="space-y-4">
          <div>
            <h2 class="text-xl font-bold text-white">Start Verification</h2>
            <p class="text-xs text-slate-400">Please provide your official legal identity information.</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">First Name</label>
              <input v-model="form.firstName" type="text" class="w-full bg-slate-950 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Last Name</label>
              <input v-model="form.lastName" type="text" class="w-full bg-slate-950 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <input v-model="form.email" type="email" class="w-full bg-slate-950 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white" />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Country of Residence</label>
            <select v-model="form.country" class="w-full bg-slate-950 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white">
              <option value="US">United States (US)</option>
              <option value="GB">United Kingdom (GB)</option>
              <option value="CA">Canada (CA)</option>
              <option value="ES">Spain (ES)</option>
              <option value="DE">Germany (DE)</option>
            </select>
          </div>

          <button @click="step = 2" class="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2">
            Continue to Document Upload &rarr;
          </button>
        </div>

        <!-- STEP 2: Document Selection & Test Scenario Picker -->
        <div v-if="step === 2" class="space-y-4">
          <div>
            <h2 class="text-xl font-bold text-white">Identity Document</h2>
            <p class="text-xs text-slate-400">Select document type and test scenario simulation.</p>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Document Type</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="dt in docTypes"
                :key="dt.value"
                @click="form.documentType = dt.value"
                type="button"
                class="p-3 rounded-xl border text-xs font-semibold text-left transition-all"
                :class="form.documentType === dt.value ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-white/10 text-slate-400'"
              >
                {{ dt.label }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Document Number</label>
            <input v-model="form.documentNumber" type="text" class="w-full bg-slate-950 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white font-mono" />
          </div>

          <!-- Sandbox Scenario Selector for Portfolio Testing -->
          <div class="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
            <div class="flex items-center justify-between text-cyan-400 font-bold text-xs">
              <span>🧪 Sandbox Test Scenario Simulator</span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20">TEST ENGINE</span>
            </div>
            <select v-model="form.simulatedScenario" class="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white">
              <option value="SUCCESS">🟢 Clean Verification (Auto Approved)</option>
              <option value="NAME_MISMATCH">🟡 Name Mismatch (Triggers Manual Review Queue)</option>
              <option value="EXPIRED_DOC">🔴 Expired Document (High Risk Signal)</option>
              <option value="LIVENESS_FAIL">🔴 Liveness Selfie Fail (Critical Rejection)</option>
              <option value="HIGH_RISK_IP">🟠 High Risk IP / Tor Exit Node Flag</option>
            </select>
          </div>

          <div class="flex gap-3">
            <button @click="step = 1" class="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs">
              Back
            </button>
            <button @click="step = 3" class="w-2/3 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs">
              Continue to Selfie Check &rarr;
            </button>
          </div>
        </div>

        <!-- STEP 3: Liveness Selfie Capture -->
        <div v-if="step === 3" class="space-y-4 text-center">
          <div>
            <h2 class="text-xl font-bold text-white">Liveness Selfie Check</h2>
            <p class="text-xs text-slate-400">Position your face within the frame to confirm live presence.</p>
          </div>

          <div class="w-48 h-48 mx-auto rounded-full bg-slate-900 border-2 border-dashed border-emerald-500/50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <UserCheck class="w-16 h-16 text-emerald-400 animate-pulse" />
            <span class="text-[10px] font-mono text-emerald-300 mt-2">BIOMETRIC FRAME ACTIVE</span>
          </div>

          <div class="flex gap-3 pt-4">
            <button @click="step = 2" class="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs">
              Back
            </button>
            <button @click="handleSubmit" :disabled="submitting" class="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
              <Loader2 v-if="submitting" class="w-4 h-4 animate-spin" />
              <span v-else>Submit Verification Request</span>
            </button>
          </div>
        </div>

        <!-- STEP 4: Asynchronous Processing & Result View -->
        <div v-if="step === 4" class="space-y-6 text-center">
          <div v-if="processing" class="py-8 space-y-4">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Loader2 class="w-8 h-8 animate-spin" />
            </div>
            <h2 class="text-xl font-bold text-white">Processing Verification Pipeline...</h2>
            <p class="text-xs text-slate-400">Executing OCR document extraction, biometric liveness check, and risk engine scoring.</p>

            <div class="max-w-xs mx-auto text-left space-y-2 text-xs font-mono text-slate-400 pt-2">
              <div class="flex items-center gap-2 text-emerald-400">
                <CheckCircle class="w-4 h-4" /> 1. Verification Record Created
              </div>
              <div class="flex items-center gap-2 text-emerald-400">
                <CheckCircle class="w-4 h-4" /> 2. Job Queued for Worker Processing
              </div>
              <div class="flex items-center gap-2 text-amber-400 animate-pulse">
                <Clock class="w-4 h-4" /> 3. OCR & Risk Engine Scoring...
              </div>
            </div>
          </div>

          <div v-else-if="result" class="py-6 space-y-4">
            <div
              class="w-16 h-16 mx-auto rounded-full flex items-center justify-center border"
              :class="result.status === 'APPROVED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : result.status === 'MANUAL_REVIEW' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-red-500/10 border-red-500/30 text-red-400'"
            >
              <CheckCircle v-if="result.status === 'APPROVED'" class="w-8 h-8" />
              <Clock v-else-if="result.status === 'MANUAL_REVIEW'" class="w-8 h-8" />
              <AlertTriangle v-else class="w-8 h-8" />
            </div>

            <h2 class="text-2xl font-bold text-white">
              Status: <span class="font-mono text-emerald-400">{{ result.status }}</span>
            </h2>

            <p class="text-xs text-slate-300 max-w-sm mx-auto">
              {{ getStatusMessage(result.status) }}
            </p>

            <div class="pt-4 flex justify-center gap-3">
              <router-link to="/dashboard" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-white/10">
                Open Compliance Dashboard &rarr;
              </router-link>

              <button @click="resetForm" class="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950">
                Submit Another Verification
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- Footer -->
    <footer class="max-w-3xl mx-auto w-full text-center text-[11px] text-slate-500 py-4 border-t border-white/10">
      Plax ID &copy; 2026 — Digital Identity Verification Platform. Built with Vue 3, Express REST API, Prisma & PostgreSQL.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useVerificationStore } from '../../stores/verificationStore.js';
import { ShieldCheck, UserCheck, Loader2, CheckCircle, Clock, AlertTriangle } from 'lucide-vue-next';

const store = useVerificationStore();

const step = ref(1);
const submitting = ref(false);
const processing = ref(false);
const result = ref<any>(null);

const form = reactive({
  firstName: 'Sarah',
  lastName: 'Jenkins',
  email: 'sarah.j@example.com',
  country: 'US',
  documentType: 'PASSPORT',
  documentNumber: 'P9928104',
  issueCountry: 'US',
  simulatedScenario: 'SUCCESS',
});

const docTypes = [
  { label: 'Passport', value: 'PASSPORT' },
  { label: 'Driver License', value: 'DRIVERS_LICENSE' },
  { label: 'National ID', value: 'NATIONAL_ID' },
  { label: 'Proof of Address', value: 'PROOF_OF_ADDRESS' },
];

async function handleSubmit() {
  submitting.value = true;
  try {
    const res = await store.submitVerification({ ...form });
    submitting.value = false;
    step.value = 4;
    processing.value = true;

    // Simulate real-time polling delay for background worker job completion
    setTimeout(async () => {
      const fetched = await store.fetchVerificationById(res.id);
      result.value = fetched;
      processing.value = false;
    }, 2000);
  } catch (err: any) {
    alert(err);
    submitting.value = false;
  }
}

function getStatusMessage(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'Your identity has been verified successfully. No risk signals detected.';
    case 'MANUAL_REVIEW':
      return 'Your verification has entered manual review. A compliance officer is inspecting your case.';
    case 'REJECTED':
      return 'Verification rejected due to biometric liveness check failure or high risk signals.';
    default:
      return 'Verification processing in background.';
  }
}

function resetForm() {
  step.value = 1;
  result.value = null;
}
</script>
