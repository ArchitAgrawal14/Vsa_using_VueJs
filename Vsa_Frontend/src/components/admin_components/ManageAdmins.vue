<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Manage Admins</h1>
        <p class="mt-2 text-gray-600">Manage admin access permissions and user roles</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Loading admins...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-red-800">{{ error }}</p>
        </div>
      </div>

      <!-- Admin Cards -->
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="user in users" 
          :key="user.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          <!-- User Header -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ user.full_name }}</h3>
                <p class="text-sm text-gray-600">{{ user.email }}</p>
                <span 
                  :class="user.is_admin ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2"
                >
                  {{ user.is_admin ? 'Admin' : 'User' }}
                </span>
              </div>
              <button
                v-if="user.is_admin"
                @click="toggleUserAdmin(user)"
                :disabled="updatingUsers.includes(user.id)"
                class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="updatingUsers.includes(user.id)">...</span>
                <span v-else>Remove Admin</span>
              </button>
              <button
                v-else
                @click="toggleUserAdmin(user)"
                :disabled="updatingUsers.includes(user.id)"
                class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="updatingUsers.includes(user.id)">...</span>
                <span v-else>Make Admin</span>
              </button>
            </div>
          </div>

          <!-- Permissions Section (only for admins) -->
          <div v-if="user.is_admin" class="p-6">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Permissions</h4>
            <div class="space-y-3">
              <div 
                v-for="permission in permissionsList" 
                :key="permission.key"
                class="flex items-center justify-between"
              >
                <span class="text-sm text-gray-700">{{ permission.label }}</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    :checked="user[permission.key] === 1"
                    @change="updatePermission(user, permission.key, $event.target.checked)"
                    :disabled="updatingPermissions.includes(`${user.id}-${permission.key}`)"
                    class="sr-only"
                  />
                  <div 
                    :class="[
                      'w-11 h-6 bg-gray-200 rounded-full peer transition-colors duration-200',
                      user[permission.key] === 1 ? 'bg-blue-600' : 'bg-gray-200',
                      updatingPermissions.includes(`${user.id}-${permission.key}`) ? 'opacity-50' : ''
                    ]"
                  >
                    <div 
                      :class="[
                        'absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200',
                        user[permission.key] === 1 ? 'translate-x-5' : 'translate-x-0'
                      ]"
                    ></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No users found -->
      <div v-if="!isLoading && !error && users.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
        <p class="mt-1 text-sm text-gray-500">No users are currently registered in the system.</p>
      </div>
    </div>

    <!-- Toast Notification -->
    <div 
      v-if="toast.show"
      :class="[
        'fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300',
        toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]"
    >
      <div class="flex items-center">
        <svg 
          v-if="toast.type === 'success'"
          class="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <svg 
          v-else
          class="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ManageAdmins',
  data() {
    return {
      users: [],
      isLoading: true,
      error: null,
      updatingUsers: [], // Track which users are being updated
      updatingPermissions: [], // Track which permissions are being updated
      apiBaseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000',
      toast: {
        show: false,
        message: '',
        type: 'success'
      },
      permissionsList: [
        { key: 'show_order_status', label: 'Order Status' },
        { key: 'show_edit_shop', label: 'Edit Shop' },
        { key: 'show_edit_achievements', label: 'Edit Achievements' },
        { key: 'show_invoice_generation', label: 'Invoice Generation' },
        { key: 'show_online_sales', label: 'Online Sales' },
        { key: 'show_offline_customers', label: 'Offline Customers' },
        { key: 'show_online_users', label: 'Online Users' },
        { key: 'show_available_stocks', label: 'Available Stocks' },
        { key: 'show_offline_sales', label: 'Offline Sales' },
        { key: 'show_send_mails', label: 'Send Mails' },
        { key: 'show_new_student', label: 'New Student' },
        { key: 'show_attendance', label: 'Attendance' },
        { key: 'show_manage_students', label: 'Manage Students' },
        { key: 'show_students_achievements', label: 'Students Achievements' },
        { key: 'show_attendance_records', label: 'Attendance Records' },
        { key: 'show_news_letter', label: 'Newsletter' },
        { key: 'show_manage_admins', label: 'Manage Admins' }
      ]
    }
  },
  async mounted() {
    await this.checkPermissions()
    if (this.hasAccess) {
      await this.fetchUsers()
    }
  },
  methods: {
    async checkPermissions() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          this.$router.push('/newLogin')
          return
        }

        const payload = JSON.parse(atob(token.split('.')[1]))
        
        // Check if user is admin and has manage_admins permission
        if (!payload.isAdmin || !payload.permissions?.show_manage_admins) {
          this.error = 'Access denied. You do not have permission to manage admins.'
          this.isLoading = false
          return
        }
        
        this.hasAccess = true
      } catch (error) {
        console.error('Error checking permissions:', error)
        this.$router.push('/newLogin')
      }
    },

    async fetchUsers() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${this.apiBaseURL}/vsa/admin/manage-admins`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.data.success) {
          this.users = response.data.users
        } else {
          this.error = response.data.message || 'Failed to fetch users'
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        if (error.response?.status === 401) {
          this.$router.push('/newLogin')
        } else {
          this.error = error.response?.data?.message || 'Failed to fetch users'
        }
      } finally {
        this.isLoading = false
      }
    },

    async toggleUserAdmin(user) {
      try {
        this.updatingUsers.push(user.id)
        const token = localStorage.getItem('token')
        
        const response = await axios.post(`${this.apiBaseURL}/vsa/admin/toggle-admin`, {
          userId: user.user_id,
          makeAdmin: !user.is_admin
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.data.success) {
          // Update local user data
          user.is_admin = !user.is_admin
          
          // If user is no longer admin, reset all permissions to 0
          if (!user.is_admin) {
            this.permissionsList.forEach(permission => {
              user[permission.key] = 0
            })
          }
          
          this.showToast('success', response.data.message || 'Admin status updated successfully')
        } else {
          this.showToast('error', response.data.message || 'Failed to update admin status')
        }
      } catch (error) {
        console.error('Error toggling admin status:', error)
        this.showToast('error', error.response?.data?.message || 'Failed to update admin status')
      } finally {
        this.updatingUsers = this.updatingUsers.filter(id => id !== user.id)
      }
    },

    async updatePermission(user, permissionKey, value) {
      try {
        const updateKey = `${user.id}-${permissionKey}`
        this.updatingPermissions.push(updateKey)
        
        const token = localStorage.getItem('token')
        
        const response = await axios.post(`${this.apiBaseURL}/vsa/admin/update-permission`, {
          userId: user.user_id,
          permissionKey: permissionKey,
          value: value ? 1 : 0
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.data.success) {
          // Update local user data
          user[permissionKey] = value ? 1 : 0
          
          const permissionLabel = this.permissionsList.find(p => p.key === permissionKey)?.label || permissionKey
          this.showToast('success', `${permissionLabel} permission updated for ${user.full_name}`)
        } else {
          // Revert the change if API call failed
          user[permissionKey] = value ? 0 : 1
          this.showToast('error', response.data.message || 'Failed to update permission')
        }
      } catch (error) {
        console.error('Error updating permission:', error)
        // Revert the change if API call failed
        user[permissionKey] = value ? 0 : 1
        this.showToast('error', error.response?.data?.message || 'Failed to update permission')
      } finally {
        this.updatingPermissions = this.updatingPermissions.filter(key => key !== updateKey)
      }
    },

    showToast(type, message) {
      this.toast = {
        show: true,
        type: type,
        message: message
      }
      
      setTimeout(() => {
        this.toast.show = false
      }, 4000)
    },

    goBack() {
      this.$router.push('/admin-dashboard')
    }
  }
}
</script>

<style scoped>
/* Custom styles for toggle switches */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #3b82f6;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

/* Animation for loading state */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>