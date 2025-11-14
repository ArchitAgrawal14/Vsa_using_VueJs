import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/Dashboard.vue'
import authRoutes from './authRoutes'
import footerRoutes from './footerRoutes'
import shopRoutes from './shopRoutes'
import AdminDashboard from '@/components/AdminDashboard.vue'
import adminRoutes from './adminRoutes'
import RollerSpeedSkatingDiscipline from '@/components/RollerSpeedSkatingDiscipline.vue'
import IceSkatingDiscipline from '@/components/IceSkatingDiscipline.vue'
import MeetOurCoaches from '@/components/MeetOurCoaches.vue'
import AcademyAchievements from '@/components/AcademyAchievements.vue'
import StudentsAchievements from '@/components/StudentsAchievements.vue'

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
  {
    path: '/ice-skating-discipline',
    name: 'IceSkatingDiscipline',
    component: IceSkatingDiscipline
  },
  {
    path: '/meet-our-coaches',
    name: 'MeetOurCoaches',
    component: MeetOurCoaches
  },
  {
    path: '/academy-achievements',
    name: 'AcademyAchievements',
    component: AcademyAchievements
  },
  {
    path: '/students-achievements',
    name: 'StudentsAchievements',
    component: StudentsAchievements
  },
  ...authRoutes,
  ...footerRoutes,
  ...shopRoutes,
  ...adminRoutes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // ✅ Scroll to top on every route change
  scrollBehavior(to, from, savedPosition) {
    // if browser's back/forward navigation, use saved position
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
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
