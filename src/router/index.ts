import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore.js';

import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';
import OverviewView from '../views/dashboard/OverviewView.vue';
import VerificationsView from '../views/dashboard/VerificationsView.vue';
import AuditLogsView from '../views/dashboard/AuditLogsView.vue';
import CustomerVerificationView from '../views/verification/CustomerVerificationView.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { guest: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: OverviewView,
    meta: { requiresAuth: true, roles: ['ADMIN', 'REVIEWER'] },
  },
  {
    path: '/verifications',
    name: 'Verifications',
    component: VerificationsView,
    meta: { requiresAuth: true, roles: ['ADMIN', 'REVIEWER'] },
  },
  {
    path: '/audit-logs',
    name: 'AuditLogs',
    component: AuditLogsView,
    meta: { requiresAuth: true, roles: ['ADMIN'] },
  },
  {
    path: '/verify',
    name: 'CustomerVerify',
    component: CustomerVerificationView,
    meta: { public: true },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

// RBAC Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login');
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    return next('/dashboard');
  }

  if (to.meta.roles && Array.isArray(to.meta.roles)) {
    if (!to.meta.roles.includes(authStore.role)) {
      return next('/dashboard');
    }
  }

  next();
});
