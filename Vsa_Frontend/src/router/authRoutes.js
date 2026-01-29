import Login from '@/components/Login.vue'
import GoogleAuthSuccess from '@/components/GoogleAuthSuccess.vue'
export default [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/auth/google/success',
    name: 'GoogleAuthSuccess',
    component: GoogleAuthSuccess,  
  },
]
