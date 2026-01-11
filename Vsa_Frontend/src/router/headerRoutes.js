import Cart from '@/components/Cart.vue'
import ChangePassword from '@/components/header_components/ChangePassword.vue'
import JoinUs from '@/components/header_components/JoinUs.vue'
import MySkaterDetail from '@/components/header_components/MySkaterDetail.vue'
import Profile from '@/components/header_components/Profile.vue'
import Shop from '@/components/Shop.vue'

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
  {
    path: '/join-us',
    name: 'JoinUs',
    component: JoinUs
  },
  {
    path: '/shop',
    name: 'Shop',
    component: Shop
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
]
