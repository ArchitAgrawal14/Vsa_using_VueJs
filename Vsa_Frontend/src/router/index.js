import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/Dashboard.vue'
import authRoutes from './authRoutes'
import footerRoutes from './footerRoutes'
import shopRoutes from './shopRoutes'
import AdminDashboard from '@/components/AdminDashboard.vue'
import adminRoutes from './adminRoutes'
import RollerSpeedSkatingDiscipline from '@/components/RollerSpeedSkatingDiscipline.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard
  },
  {
    path: '/roller-speed-skating-discipline',
    name: 'RollerSpeedSkatingDiscipline',
    component: RollerSpeedSkatingDiscipline
  },
  ...authRoutes,
  ...footerRoutes,
  ...shopRoutes,
  ...adminRoutes
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
