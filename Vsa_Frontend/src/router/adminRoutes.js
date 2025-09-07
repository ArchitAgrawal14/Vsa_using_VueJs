import AttendancePage from "@/components/admin_components/AttendancePage.vue"
import CreateInvoice from "@/components/admin_components/CreateInvoice.vue"
import ManageAdmins from "@/components/admin_components/ManageAdmins.vue"
import RegisterNewStudent from "@/components/admin_components/RegisterNewStudent.vue"
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
  },
  {
    path: '/vsa/admin/register-new-student',
    name: 'RegisterNewStudent',
    component: RegisterNewStudent,
  },
  {
    path: '/vsa/admin/mark-attendance',
    name: 'AttendancePage',
    component: AttendancePage,
  }
]