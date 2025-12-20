import AddNewItemPage from "@/components/admin_components/AddNewItem.vue"
import AttendancePage from "@/components/admin_components/AttendancePage.vue"
import AttendanceRecords from "@/components/admin_components/AttendanceRecords.vue"
import CreateInvoice from "@/components/admin_components/CreateInvoice.vue"
import EditItem from "@/components/admin_components/EditItem.vue"
import EditShop from "@/components/admin_components/EditShop.vue"
import ManageAcademyAchievements from "@/components/admin_components/ManageAcademyAchievements.vue"
import ManageAchievements from "@/components/admin_components/ManageAchievements.vue"
import ManageAdmins from "@/components/admin_components/ManageAdmins.vue"
import ManageDashboard from "@/components/admin_components/ManageDashboard.vue"
import ManageExistingPolicies from "@/components/admin_components/ManageExistingPolicies.vue"
import ManageShop from "@/components/admin_components/ManageShop.vue"
import ManageStudents from "@/components/admin_components/ManageStudents.vue"
import RegisterNewStudent from "@/components/admin_components/RegisterNewStudent.vue"
import StudentAchievementDetail from "@/components/admin_components/StudentAchievementDetail.vue"
export default [
  {
    path: '/vsa/invoice',
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
  },
  {
    path: '/vsa/admin/manage-students',
    name: 'ManageStudents',
    component: ManageStudents,
  },
  {
    path: '/vsa/admin/manage-achievements',
    name: 'ManageAchievements',
    component: ManageAchievements,
  },
  {
    path: '/vsa/admin/student/:studentId/achievements',
    name: 'StudentAchievementDetail',
    component: StudentAchievementDetail,
  },
  {
    path: '/vsa/admin/monthly-attendance',
    name: 'AttendanceRecords',
    component: AttendanceRecords,
  },
  {
    path: '/vsa/admin/manage-dashboard',
    name: 'ManageDashboard',
    component: ManageDashboard,
  },
  {
    path: '/vsa/admin/manage-shop',
    name: 'ManageShop',
    component: ManageShop,
  },
  {
    path: '/vsa/admin/edit-shop',
    name: 'EditShop',
    component: EditShop,
  },
  {
    path: '/vsa/admin/edit-item',
    name: 'EditItem',
    component: EditItem,
  },
  {
    path: '/vsa/admin/add-new-item',
    name: 'AddNewItem',
    component: AddNewItemPage,
  },
  {
    path: '/vsa/admin/edit/academy-achievements',
    name: 'ManageAcademyAchievements',
    component: ManageAcademyAchievements,
  },
  {
    path: '/vsa/admin/update-existing-policy',
    name: 'ManageExistingPolicies',
    component: ManageExistingPolicies,
  }
]