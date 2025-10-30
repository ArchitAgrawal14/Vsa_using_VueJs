import AttendancePage from "@/components/admin_components/AttendancePage.vue"
import AttendanceRecords from "@/components/admin_components/AttendanceRecords.vue"
import CreateInvoice from "@/components/admin_components/CreateInvoice.vue"
import ManageAchievements from "@/components/admin_components/ManageAchievements.vue"
import ManageAdmins from "@/components/admin_components/ManageAdmins.vue"
import ManageStudents from "@/components/admin_components/ManageStudents.vue"
import RegisterNewStudent from "@/components/admin_components/RegisterNewStudent.vue"
import StudentAchievementDetail from "@/components/admin_components/StudentAchievementDetail.vue"
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
  }
]