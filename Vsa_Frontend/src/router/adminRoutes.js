import CreateInvoice from "@/components/admin_components/CreateInvoice.vue"
import ManageAdmins from "@/components/admin_components/ManageAdmins.vue"
export default [
  {
    path: '/vsa/create-invoice',
    name: 'CreateInvoice',
    component: CreateInvoice,
  },
  {
    path: '/vsa/manage-admins',
    name: 'ManageAdmins',
    component: ManageAdmins,
  }
]