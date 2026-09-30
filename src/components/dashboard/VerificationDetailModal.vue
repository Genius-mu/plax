<template>
  <div v-if="verification" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
    <div class="glass-panel w-full max-w-4xl rounded-3xl border border-white/90 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-slate-200/60 flex items-center justify-between bg-white/70">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            ID
          </div>
          <div>
            <h3 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
              Verification Case: <span class="font-mono text-blue-600">#{{ verification.id.slice(0, 8) }}</span>
            </h3>
            <p class="text-xs text-slate-500 font-medium">Submitted on {{ formatDate(verification.createdAt) }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span
            class="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border flex items-center gap-1.5"
            :class="getStatusBadgeClass(verification.status)"
          >
            <span class="w-2 h-2 rounded-full bg-current"></span>
            {{ verification.status }}
          </span>

          <button @click="$emit('close')" class="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
        <!-- Customer & Risk Overview Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Customer Info Card -->
          <div class="p-4 rounded-2xl bg-white/80 border border-slate-200/80 space-y-2 shadow-2xs">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer Identity</span>
            <p class="text-sm font-bold text-slate-900">{{ verification.customer?.firstName }} {{ verification.customer?.lastName }}</p>
            <p class="text-xs text-slate-600 font-mono">{{ verification.customer?.email }}</p>
            <div class="flex items-center gap-2 pt-1">
              <span class="text-xs text-slate-500">Country:</span>
              <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                {{ verification.customer?.country || 'US' }}
              </span>
            </div>
          </div>

          <!-- Risk Score Gauge Card -->
          <div class="p-4 rounded-2xl bg-white/80 border border-slate-200/80 space-y-2 shadow-2xs">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Risk Analysis</span>
            <div class="flex items-center justify-between">
              <div>
                <span class="text-2xl font-black" :class="getRiskScoreColor(verification.riskScore)">
                  {{ verification.riskScore }} <span class="text-xs font-normal text-slate-400">/ 100</span>
                </span>
                <p class="text-xs font-bold text-slate-500 mt-0.5">LEVEL: {{ verification.riskLevel }}</p>
              </div>
              <ShieldAlert class="w-8 h-8" :class="getRiskScoreColor(verification.riskScore)" />
            </div>
          </div>

          <!-- Processing Engine Info -->
          <div class="p-4 rounded-2xl bg-white/80 border border-slate-200/80 space-y-2 shadow-2xs">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Engine Provider</span>
            <p class="text-xs font-bold text-slate-900">Sandbox Mock KYC Adapter</p>
            <p class="text-[11px] text-slate-600">OCR Scan: <span class="text-emerald-700 font-bold">PASSED</span></p>
            <p class="text-[11px] text-slate-600">Liveness Biometric: <span class="text-emerald-700 font-bold">CHECKED</span></p>
          </div>
        </div>

        <!-- Risk Signals Section -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle class="w-4 h-4 text-amber-600" />
            Detected Risk Signals ({{ verification.riskSignals?.length || 0 }})
          </h4>

          <div v-if="verification.riskSignals && verification.riskSignals.length > 0" class="space-y-2">
            <div
              v-for="sig in verification.riskSignals"
              :key="sig.id"
              class="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start justify-between"
            >
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-amber-800 font-mono">{{ sig.code }}</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    SEVERITY: {{ sig.severity }}
                  </span>
                </div>
                <p class="text-xs text-amber-900 mt-1 font-medium">{{ sig.description }}</p>
              </div>
            </div>
          </div>

          <div v-else class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
            <CheckCircle class="w-4 h-4 text-emerald-600" />
            No risk signals detected. Clean verification check.
          </div>
        </div>

        <!-- Documents Section -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <FileText class="w-4 h-4 text-blue-600" />
            Submitted Documents ({{ verification.documents?.length || 0 }})
          </h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="doc in verification.documents"
              :key="doc.id"
              class="p-4 rounded-2xl bg-white/80 border border-slate-200/80 flex items-center justify-between shadow-2xs"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-slate-900">{{ doc.type }}</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    OCR VERIFIED
                  </span>
                </div>
                <p class="text-xs text-slate-600 font-mono">Doc #: {{ doc.documentNumber || 'P9823412' }}</p>
                <p class="text-xs text-slate-500 font-medium">Issue Country: {{ doc.issueCountry }}</p>
              </div>

              <div class="w-16 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                <Image class="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <!-- Rejection Reason if any -->
        <div v-if="verification.rejectionReason" class="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
          <span class="text-xs font-bold text-rose-800 uppercase tracking-wider">Rejection Reason</span>
          <p class="text-xs text-rose-900 font-medium">{{ verification.rejectionReason }}</p>
        </div>

        <!-- Manual Decision Review Form -->
        <div v-if="authStore.isReviewer && verification.status === 'MANUAL_REVIEW'" class="p-5 rounded-2xl bg-white border border-blue-200 space-y-3 shadow-md">
          <h4 class="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
            <Gavel class="w-4 h-4" />
            Compliance Review Decision
          </h4>
          <p class="text-xs text-slate-600 font-medium">As a compliance reviewer, choose an explicit manual action for this verification case.</p>

          <div v-if="rejectMode" class="space-y-2">
            <label class="text-xs text-slate-700 font-bold block">Reason for Rejection:</label>
            <input
              v-model="rejectionReasonInput"
              type="text"
              placeholder="e.g. Liveness biometric fail / Fraudulent ID document"
              class="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium"
            />
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button
              v-if="!rejectMode"
              @click="handleDecision('APPROVED')"
              :disabled="submitting"
              class="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <CheckCircle class="w-4 h-4" />
              Approve Verification
            </button>

            <button
              v-if="!rejectMode"
              @click="rejectMode = true"
              class="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <XCircle class="w-4 h-4" />
              Reject Verification...
            </button>

            <button
              v-if="rejectMode"
              @click="handleDecision('REJECTED')"
              :disabled="submitting || !rejectionReasonInput.trim()"
              class="px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              Confirm Rejection
            </button>

            <button
              v-if="rejectMode"
              @click="rejectMode = false"
              class="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
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
  if (score >= 75) return 'text-rose-700';
  if (score >= 40) return 'text-amber-700';
  return 'text-emerald-700';
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
