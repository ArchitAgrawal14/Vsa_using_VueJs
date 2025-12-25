import ChangePassword from '@/components/header_components/ChangePassword.vue'
import MySkaterDetail from '@/components/header_components/MySkaterDetail.vue'
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
  {
    path: '/my-skater-detail',
    name: 'MySkaterDetail',
    component: MySkaterDetail
  },
]
