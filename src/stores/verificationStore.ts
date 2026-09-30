import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Verification, DashboardStats, AuditLog, VerificationStatus } from '../types/index.js';
import { api } from '../services/api.js';

export const useVerificationStore = defineStore('verification', () => {
  const verifications = ref<Verification[]>([]);
  const selectedVerification = ref<Verification | null>(null);
  const stats = ref<DashboardStats | null>(null);
  const auditLogs = ref<AuditLog[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({ page: 1, totalPages: 1, total: 0 });

  async function fetchDashboardStats() {
    try {
      const res = await api.get('/dashboard/stats');
      stats.value = res.data.data.stats;
    } catch (err: any) {
      console.error('Failed to fetch dashboard stats', err);
    }
  }

  async function fetchVerifications(params: { status?: string; search?: string; page?: number } = {}) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get('/verifications', { params });
      verifications.value = res.data.data;
      pagination.value = res.data.pagination;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch verifications.';
    } finally {
      loading.value = false;
    }
  }

  async function fetchVerificationById(id: string) {
    loading.value = true;
    try {
      const res = await api.get(`/verifications/${id}`);
      selectedVerification.value = res.data.data;
      return res.data.data;
    } catch (err: any) {
      error.value = 'Verification not found.';
    } finally {
      loading.value = false;
    }
  }

  async function submitVerification(payload: any) {
    loading.value = true;
    try {
      const res = await api.post('/verifications', payload);
      return res.data.data;
    } catch (err: any) {
      throw err.response?.data?.error?.message || 'Submission failed.';
    } finally {
      loading.value = false;
    }
  }

  async function makeManualDecision(verificationId: string, decision: 'APPROVED' | 'REJECTED', reason?: string) {
    loading.value = true;
    try {
      const res = await api.patch(`/verifications/${verificationId}/decision`, { decision, reason });
      // Update local state item
      if (selectedVerification.value?.id === verificationId) {
        selectedVerification.value.status = decision;
        selectedVerification.value.rejectionReason = reason;
      }
      await fetchVerifications();
      await fetchDashboardStats();
      return res.data.data;
    } catch (err: any) {
      throw err.response?.data?.error?.message || 'Decision submission failed.';
    } finally {
      loading.value = false;
    }
  }

  async function fetchAuditLogs() {
    try {
      const res = await api.get('/audit-logs');
      auditLogs.value = res.data.data;
    } catch (err: any) {
      console.error('Failed to fetch audit logs', err);
    }
  }

  return {
    verifications,
    selectedVerification,
    stats,
    auditLogs,
    loading,
    error,
    pagination,
    fetchDashboardStats,
    fetchVerifications,
    fetchVerificationById,
    submitVerification,
    makeManualDecision,
    fetchAuditLogs,
  };
});
