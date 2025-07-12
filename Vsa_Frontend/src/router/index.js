import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/Dashboard.vue'
import Login from '@/components/Login.vue'
import ReturnPolicy from '@/components/ReturnPolicy.vue'
import PrivacyPolicy from '@/components/PrivacyPolicy.vue'
import CancellationRefunds from '@/components/CancellationRefunds.vue'
import ShippingPolicy from '@/components/ShippingPolicy.vue'
import TermsConditions from '@/components/TermsConditions.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path : '/login',
      name : 'login',
      component : Login
    },
    {
      path : '/return-policy',
      name : 'ReturnPolicy',
      component: ReturnPolicy
    },
    {
      path : '/terms-and-conditions',
      name : 'TermsConditions',
      component: TermsConditions
    },
    {
      path : '/privacy-policy',
      name : 'PrivacyPolicy',
      component: PrivacyPolicy
    },
    {
      path : '/shipping-policy',
      name : 'ShippingPolicy',
      component: ShippingPolicy
    },
    {
      path : '/cancellation-refunds',
      name : 'CancellationRefunds',
      component: CancellationRefunds
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
