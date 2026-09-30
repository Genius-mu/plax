<template>
  <div v-if="verification" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
    <div class="glass-panel w-full max-w-4xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/90">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center font-semibold text-xs shadow-sm">
            ID
          </div>
          <div>
            <h3 class="text-base font-semibold text-white flex items-center gap-2 font-heading">
              Verification Case: <span class="font-mono text-cyan-400">#{{ verification.id.slice(0, 8) }}</span>
            </h3>
            <p class="text-xs text-slate-400 font-medium">Submitted on {{ formatDate(verification.createdAt) }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span
            class="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border flex items-center gap-1.5"
            :class="getStatusBadgeClass(verification.status)"
          >
            <span class="w-2 h-2 rounded-full bg-current"></span>
            {{ verification.status }}
          </span>

          <button @click="$emit('close')" class="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="p-6 overflow-y-auto space-y-6 flex-1 bg-black/40">
        <!-- Customer & Risk Overview Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Customer Info Card -->
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Customer Identity</span>
            <p class="text-sm font-semibold text-white">{{ verification.customer?.firstName }} {{ verification.customer?.lastName }}</p>
            <p class="text-xs text-slate-300 font-mono">{{ verification.customer?.email }}</p>
            <div class="flex items-center gap-2 pt-1">
              <span class="text-xs text-slate-400">Country:</span>
              <span class="text-xs font-semibold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-lg border border-cyan-500/30">
                {{ verification.customer?.country || 'US' }}
              </span>
            </div>
          </div>

          <!-- Risk Score Gauge Card -->
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Risk Analysis</span>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-2xl font-bold font-mono" :class="getRiskScoreColor(verification.riskScore)">
                  {{ verification.riskScore }} <span class="text-xs font-normal text-slate-400">/ 100</span>
                </span>
                <p class="text-xs font-semibold text-slate-400 mt-0.5">LEVEL: {{ verification.riskLevel }}</p>
              </div>
              <ShieldAlert class="w-8 h-8 opacity-90" :class="getRiskScoreColor(verification.riskScore)" />
            </div>
          </div>

          <!-- Processing Engine Info -->
          <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Engine Provider</span>
            <p class="text-xs font-semibold text-white">Sandbox Mock KYC Adapter</p>
            <p class="text-[11px] text-slate-300">OCR Scan: <span class="text-emerald-400 font-semibold">PASSED</span></p>
            <p class="text-[11px] text-slate-300">Liveness Biometric: <span class="text-emerald-400 font-semibold">CHECKED</span></p>
          </div>
        </div>

        <!-- Risk Signals Section -->
        <div class="space-y-3">
          <h4 class="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2 font-heading">
            <AlertTriangle class="w-4 h-4 text-amber-400" />
            Detected Risk Signals ({{ verification.riskSignals?.length || 0 }})
          </h4>

          <div v-if="verification.riskSignals && verification.riskSignals.length > 0" class="space-y-2">
            <div
              v-for="sig in verification.riskSignals"
              :key="sig.id"
              class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between"
            >
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold text-amber-300 font-mono">{{ sig.code }}</span>
                  <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/40">
                    SEVERITY: {{ sig.severity }}
                  </span>
                </div>
                <p class="text-xs text-slate-200 mt-1 font-medium">{{ sig.description }}</p>
              </div>
            </div>
          </div>

          <div v-else class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-medium flex items-center gap-2">
            <CheckCircle class="w-4 h-4 text-emerald-400" />
            No risk signals detected. Clean verification check.
          </div>
        </div>

        <!-- Documents Section -->
        <div class="space-y-3">
          <h4 class="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2 font-heading">
            <FileText class="w-4 h-4 text-cyan-400" />
            Submitted Documents ({{ verification.documents?.length || 0 }})
          </h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="doc in verification.documents"
              :key="doc.id"
              class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold text-white">{{ doc.type }}</span>
                  <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    OCR VERIFIED
                  </span>
                </div>
                <p class="text-xs text-slate-300 font-mono">Doc #: {{ doc.documentNumber || 'P9823412' }}</p>
                <p class="text-xs text-slate-400 font-medium">Issue Country: {{ doc.issueCountry }}</p>
              </div>

              <div class="w-16 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-slate-400">
                <Image class="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <!-- Rejection Reason if any -->
        <div v-if="verification.rejectionReason" class="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/30 space-y-1">
          <span class="text-xs font-semibold text-rose-300 uppercase tracking-wider">Rejection Reason</span>
          <p class="text-xs text-rose-200 font-medium">{{ verification.rejectionReason }}</p>
        </div>

        <!-- Manual Decision Review Form -->
        <div v-if="authStore.isReviewer && verification.status === 'MANUAL_REVIEW'" class="p-5 rounded-2xl bg-black/80 border border-blue-500/40 space-y-3 shadow-xl">
          <h4 class="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2 font-heading">
            <Gavel class="w-4 h-4" />
            Compliance Review Decision
          </h4>
          <p class="text-xs text-slate-300 font-medium">As a compliance reviewer, choose an explicit manual action for this verification case.</p>

          <div v-if="rejectMode" class="space-y-2">
            <label class="text-xs text-slate-200 font-semibold block">Reason for Rejection:</label>
            <input
              v-model="rejectionReasonInput"
              type="text"
              placeholder="e.g. Liveness biometric fail / Fraudulent ID document"
              class="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white font-medium"
            />
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button
              v-if="!rejectMode"
              @click="handleDecision('APPROVED')"
              :disabled="submitting"
              class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <CheckCircle class="w-4 h-4" />
              Approve Verification
            </button>

            <button
              v-if="!rejectMode"
              @click="rejectMode = true"
              class="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <XCircle class="w-4 h-4" />
              Reject Verification...
            </button>

            <button
              v-if="rejectMode"
              @click="handleDecision('REJECTED')"
              :disabled="submitting || !rejectionReasonInput.trim()"
              class="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              Confirm Rejection
            </button>

            <button
              v-if="rejectMode"
              @click="rejectMode = false"
              class="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useVerificationStore } from '../../stores/verificationStore.js';
import { useAuthStore } from '../../stores/authStore.js';
import { Verification } from '../../types/index.js';
import { X, ShieldAlert, AlertTriangle, CheckCircle, FileText, Image, Gavel, XCircle } from 'lucide-vue-next';

const props = defineProps<{
  verification: Verification | null;
}>();

const emit = defineEmits(['close', 'updated']);

const verificationStore = useVerificationStore();
const authStore = useAuthStore();

const rejectMode = ref(false);
const rejectionReasonInput = ref('');
const submitting = ref(false);

function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString();
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'badge-approved';
    case 'REJECTED':
      return 'badge-rejected';
    case 'MANUAL_REVIEW':
      return 'badge-manual';
    default:
      return 'badge-pending';
  }
}

function getRiskScoreColor(score: number) {
  if (score >= 75) return 'text-rose-400';
  if (score >= 40) return 'text-amber-400';
  return 'text-emerald-400';
}

async function handleDecision(decision: 'APPROVED' | 'REJECTED') {
  if (!props.verification) return;
  submitting.value = true;
  try {
    await verificationStore.makeManualDecision(
      props.verification.id,
      decision,
      decision === 'REJECTED' ? rejectionReasonInput.value : undefined
    );
    emit('updated');
    emit('close');
  } catch (err: any) {
    alert(err);
  } finally {
    submitting.value = false;
  }
}
</script>
