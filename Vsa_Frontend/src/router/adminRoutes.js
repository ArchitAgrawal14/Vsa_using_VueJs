import AddNewItemPage from "@/components/admin_components/AddNewItem.vue"
import AttendancePage from "@/components/admin_components/AttendancePage.vue"
import AttendanceRecords from "@/components/admin_components/AttendanceRecords.vue"
import CreateInvoice from "@/components/admin_components/CreateInvoice.vue"
import EditInvoice from "@/components/admin_components/EditInvoice.vue"
import EditItem from "@/components/admin_components/EditItem.vue"
import EditShop from "@/components/admin_components/EditShop.vue"
import ManageAcademyAchievements from "@/components/admin_components/ManageAcademyAchievements.vue"
import ManageAchievements from "@/components/admin_components/ManageAchievements.vue"
import ManageAdmins from "@/components/admin_components/ManageAdmins.vue"
import ManageDashboard from "@/components/admin_components/ManageDashboard.vue"
import ManageExistingPolicies from "@/components/admin_components/ManageExistingPolicies.vue"
import ManageShop from "@/components/admin_components/ManageShop.vue"
import ManageSkatingDisciplines from "@/components/admin_components/ManageSkatingDisciplines.vue"
import ManageStudents from "@/components/admin_components/ManageStudents.vue"
import RegisterNewStudent from "@/components/admin_components/RegisterNewStudent.vue"
import StudentAchievementDetail from "@/components/admin_components/StudentAchievementDetail.vue"
import SendMail from "@/components/admin_components/SendMail.vue"

export default [
  {
    path: '/invoice',
    name: 'CreateInvoice',
    component: CreateInvoice,
  },
  {
    path: '/manage-admins',
    name: 'ManageAdmins',
    component: ManageAdmins,
  },
  {
    path: '/admin/register-new-student',
    name: 'RegisterNewStudent',
    component: RegisterNewStudent,
  },
  {
    path: '/admin/mark-attendance',
    name: 'AttendancePage',
    component: AttendancePage,
  },
  {
    path: '/admin/manage-students',
    name: 'ManageStudents',
    component: ManageStudents,
  },
  {
    path: '/admin/manage-achievements',
    name: 'ManageAchievements',
    component: ManageAchievements,
  },
  {
    path: '/admin/student/:studentId/achievements',
    name: 'StudentAchievementDetail',
    component: StudentAchievementDetail,
  },
  {
    path: '/admin/monthly-attendance',
    name: 'AttendanceRecords',
    component: AttendanceRecords,
  },
  {
    path: '/admin/manage-dashboard',
    name: 'ManageDashboard',
    component: ManageDashboard,
  },
  {
    path: '/admin/manage-shop',
    name: 'ManageShop',
    component: ManageShop,
  },
  {
    path: '/admin/edit-shop',
    name: 'EditShop',
    component: EditShop,
  },
  {
    path: '/admin/edit-item',
    name: 'EditItem',
    component: EditItem,
  },
  {
    path: '/admin/add-new-item',
    name: 'AddNewItem',
    component: AddNewItemPage,
  },
  {
    path: '/admin/edit/academy-achievements',
    name: 'ManageAcademyAchievements',
    component: ManageAcademyAchievements,
  },
  {
    path: '/admin/update-existing-policy',
    name: 'ManageExistingPolicies',
    component: ManageExistingPolicies,
  },
  {
    path: '/admin/manage-skating-disciplines',
    name: 'ManageSkatingDisciplines',
    component: ManageSkatingDisciplines,
  },
  {
    path: '/admin/edit-invoice',
    name: 'EditInvoice',
    component: EditInvoice,
  },
  {
    path: '/admin/send-mail',
    name: 'SendEmail',
    component: SendMail,
  }
]