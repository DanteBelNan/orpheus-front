import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',             name: 'landing',  component: () => import('@/views/LandingView.vue') },
    { path: '/login',        name: 'login',    component: () => import('@/views/LoginView.vue') },
    { path: '/register',     name: 'register', component: () => import('@/views/RegisterView.vue') },
    { path: '/auth/callback',name: 'callback', component: () => import('@/views/CallbackView.vue') },
    { path: '/home',         name: 'home',     component: () => import('@/views/HomeView.vue'),    meta: { requiresAuth: true } },
    { path: '/library',      name: 'library',  component: () => import('@/views/LibraryView.vue'), meta: { requiresAuth: true } },
    { path: '/devices',      name: 'devices',  component: () => import('@/views/DevicesView.vue'), meta: { requiresAuth: true } },
  ]
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.restoreSession()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'landing' }
  }
  if (!to.meta.requiresAuth && auth.isAuthenticated && ['landing', 'login', 'register'].includes(to.name as string)) {
    return { name: 'home' }
  }
})

export default router
