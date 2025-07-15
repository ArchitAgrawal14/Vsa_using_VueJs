import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/Dashboard.vue'
import authRoutes from './authRoutes'
import footerRoutes from './footerRoutes'
import shopRoutes from './shopRoutes'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard
  },
  ...authRoutes,
  ...footerRoutes,
  ...shopRoutes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.name === 'login' && token) {
    return next({ name: 'dashboard' })
  }
  next()
})

export default router
