import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { User, Role } from '../types/index.js';
import { api } from '../services/api.js';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('plax_user') || 'null'));
  const token = ref<string | null>(localStorage.getItem('plax_token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const role = computed(() => user.value?.role || 'CUSTOMER');
  const isAdmin = computed(() => user.value?.role === 'ADMIN');
  const isReviewer = computed(() => user.value?.role === 'REVIEWER' || user.value?.role === 'ADMIN');

  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.post('/auth/login', { email, password });
      user.value = res.data.data.user;
      token.value = res.data.data.token;
      localStorage.setItem('plax_user', JSON.stringify(user.value));
      localStorage.setItem('plax_token', token.value as string);
      return user.value;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Login failed. Check email & password.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(payload: { email: string; password: string; fullName: string; role?: Role }) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.post('/auth/register', payload);
      user.value = res.data.data.user;
      token.value = res.data.data.token;
      localStorage.setItem('plax_user', JSON.stringify(user.value));
      localStorage.setItem('plax_token', token.value as string);
      return user.value;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Registration failed.';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('plax_user');
    localStorage.removeItem('plax_token');
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    role,
    isAdmin,
    isReviewer,
    login,
    register,
    logout,
  };
});
