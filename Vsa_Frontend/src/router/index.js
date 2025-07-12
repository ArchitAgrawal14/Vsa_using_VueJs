import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/Dashboard.vue'
import Login from '@/components/Login.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path : '/login',
      name : 'login',
      component : Login,
    }
  ],
})

// Navigation guard to not allow the user to go to Login page after successfull login
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.name === 'login' && token) {
    return next({ name: 'dashboard' });
  }
  next();
});


export default router
