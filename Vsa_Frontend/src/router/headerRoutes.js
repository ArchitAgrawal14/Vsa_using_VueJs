import ChangePassword from '@/components/header_components/ChangePassword.vue'
import Profile from '@/components/header_components/Profile.vue'

export default [
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/password-change',
    name: 'ChangePassword',
    component: ChangePassword
  },
]
