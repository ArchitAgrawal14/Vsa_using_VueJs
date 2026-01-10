import SkatesAndBoots from '@/components/shop_components/SkatesAndBoots.vue'
import Helmets from '@/components/shop_components/Helmets.vue'
import Bearings from '@/components/shop_components/Bearings.vue'
import Wheels from '@/components/shop_components/Wheels.vue'
import Accessories from '@/components/shop_components/Accessories.vue'
import ProductDetail from '@/components/shop_components/ProductDetail.vue'

export default [
  {
    path: '/skates-and-boots',
    name: 'SkatesAndBoots',
    component: SkatesAndBoots
  },
  {
    path: '/helmets',
    name: 'Helmets',
    component: Helmets
  },
  {
    path: '/bearing',
    name: 'Bearings',
    component: Bearings
  },
  {
    path: '/wheels',
    name: 'Wheels',
    component: Wheels
  },
  {
    path: '/accessories',
    name: 'Accessories',
    component: Accessories
  },
  {
    path: '/product-detail/:itemVariationId/:itemType',
    name: 'ProductDetail',
    component: ProductDetail
  },
]
