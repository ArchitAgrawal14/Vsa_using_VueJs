import ReturnPolicy from '@/components/footer_components/ReturnPolicy.vue'
import PrivacyPolicy from '@/components/footer_components/PrivacyPolicy.vue'
import CancellationRefunds from '@/components/footer_components/CancellationRefunds.vue'
import ShippingPolicy from '@/components/footer_components/ShippingPolicy.vue'
import TermsConditions from '@/components/footer_components/TermsConditions.vue'
import RefundPolicy from '@/components/footer_components/RefundPolicy.vue'
import FAQ from '@/components/footer_components/FAQ.vue'

export default [
  {
    path: '/return-policy',
    name: 'ReturnPolicy',
    component: ReturnPolicy
  },
  {
    path: '/terms-and-conditions',
    name: 'TermsConditions',
    component: TermsConditions
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy
  },
  {
    path: '/shipping-policy',
    name: 'ShippingPolicy',
    component: ShippingPolicy
  },
  {
    path: '/refund-policy',
    name: 'RefundPolicy',
    component: RefundPolicy
  },
  {
    path: '/cancellation-refunds',
    name: 'CancellationRefunds',
    component: CancellationRefunds
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: FAQ
  }
]
