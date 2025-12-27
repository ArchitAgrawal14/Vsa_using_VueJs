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
import headerRoutes from './headerRoutes'

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
  ...headerRoutes,
  ...shopRoutes,
  ...adminRoutes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,  
  scrollBehavior(to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  }

  if (to.hash) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          el: to.hash,
          behavior: 'smooth'
        })
      }, 400) // allow DOM + images to render
    })
  }

  return { top: 0 }
}

})

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (token && isTokenExpired(token)) {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  if (to.name === 'login' && token && !isTokenExpired(token)) {
    return next({ name: 'dashboard' })
  }
  next()
})

export default router
