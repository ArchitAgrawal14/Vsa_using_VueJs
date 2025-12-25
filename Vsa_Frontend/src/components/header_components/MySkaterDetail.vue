<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 mt-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Skaters</h1>
        <p class="text-gray-600">View your skater profiles</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-black"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-semibold text-red-800 mb-2">{{ error }}</h3>
        <button @click="navigateTo('/login')" class="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
          Login
        </button>
      </div>

      <!-- Skaters List -->
      <div v-else-if="skaters.length > 0" class="space-y-6">
        <div v-for="skater in skaters" :key="skater.student_id" class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <!-- Skater Header -->
          <div class="bg-gradient-to-r from-gray-900 to-gray-800 p-6 sm:p-8">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center text-3xl sm:text-4xl font-bold text-gray-800 shadow-lg flex-shrink-0">
                {{ getInitials(skater.full_name) }}
              </div>
              <div class="flex-1">
                <h2 class="text-2xl sm:text-3xl font-bold text-white mb-2">{{ skater.full_name }}</h2>
                <div class="flex flex-wrap gap-2">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                    {{ skater.class }}
                  </span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                    {{ skater.skate_type }}
                  </span>
                  <span :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                    skater.status === 'active' ? 'bg-green-400 text-green-900' : 'bg-gray-400 text-gray-900'
                  ]">
                    {{ skater.status.charAt(0).toUpperCase() + skater.status.slice(1) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="border-b border-gray-200">
            <div class="flex overflow-x-auto">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="setActiveTab(skater.student_id, tab.id)"
                :class="[
                  'px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors',
                  activeTab[skater.student_id] === tab.id
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="p-6 sm:p-8">
            <!-- Personal Info Tab -->
            <div v-if="activeTab[skater.student_id] === 'personal'">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Student ID" :value="skater.student_id" />
                <InfoItem label="Email" :value="skater.email" />
                <InfoItem label="Mobile" :value="skater.mobile_number" />
                <InfoItem label="WhatsApp" :value="skater.whatsapp_number || 'N/A'" />
                <InfoItem label="Date of Birth" :value="formatDate(skater.dob)" />
                <InfoItem label="Gender" :value="skater.gender" />
                <InfoItem label="Father's Name" :value="skater.father_name || 'N/A'" />
                <InfoItem label="Mother's Name" :value="skater.mother_name || 'N/A'" />
                <InfoItem label="School" :value="skater.school_name || 'N/A'" />
                <InfoItem label="Hobbies" :value="skater.hobbies || 'N/A'" />
                <InfoItem label="Joined On" :value="formatDate(skater.date_of_joining)" />
                <InfoItem label="Group" :value="skater.student_group || 'N/A'" />
              </div>
            </div>

            <!-- Address Tab -->
            <div v-if="activeTab[skater.student_id] === 'address'">
              <div v-if="skater.address_line1" class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Residential Address</h3>
                <div class="space-y-2 text-gray-700">
                  <p>{{ skater.address_line1 }}</p>
                  <p v-if="skater.address_line2">{{ skater.address_line2 }}</p>
                  <p>{{ skater.city }}, {{ skater.state }} {{ skater.postal_code }}</p>
                  <p>{{ skater.country }}</p>
                </div>
              </div>
              <div v-else class="text-center py-12 text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p>No address information available</p>
              </div>
            </div>

            <!-- Fee Tab -->
            <div v-if="activeTab[skater.student_id] === 'fee'">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600 mb-1">Fee Structure</p>
                  <p class="text-2xl font-bold text-gray-900">₹{{ skater.fee_structure || 0 }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600 mb-1">Pending Fee</p>
                  <p class="text-2xl font-bold text-red-600">₹{{ skater.pending_fee || 0 }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600 mb-1">Next Payment</p>
                  <p class="text-lg font-semibold text-gray-900">{{ formatDate(skater.next_payment_date) }}</p>
                </div>
              </div>

              <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
              <div v-if="skater.fees && skater.fees.length > 0" class="space-y-3">
                <div v-for="fee in skater.fees" :key="fee.transaction_id" class="bg-gray-50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div class="flex-1">
                    <p class="font-semibold text-gray-900">₹{{ fee.amount_paid }}</p>
                    <p class="text-sm text-gray-600">{{ formatDate(fee.payment_date) }}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-sm text-gray-600 capitalize">{{ fee.payment_mode.replace('_', ' ') }}</span>
                    <span :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      fee.status === 'success' ? 'bg-green-100 text-green-800' : 
                      fee.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    ]">
                      {{ fee.status }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-12 text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p>No payment history available</p>
              </div>
            </div>

            <!-- Attendance Tab -->
            <div v-if="activeTab[skater.student_id] === 'attendance'">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">This Month's Attendance</h3>
              <div v-if="skater.attendance && skater.attendance.length > 0">
                <div class="mb-4 flex flex-wrap gap-4">
                  <div class="bg-green-50 rounded-lg p-4 flex-1 min-w-[150px]">
                    <p class="text-sm text-green-700 mb-1">Present</p>
                    <p class="text-2xl font-bold text-green-800">{{ getAttendanceCount(skater.attendance, 'Present') }}</p>
                  </div>
                  <div class="bg-red-50 rounded-lg p-4 flex-1 min-w-[150px]">
                    <p class="text-sm text-red-700 mb-1">Absent</p>
                    <p class="text-2xl font-bold text-red-800">{{ getAttendanceCount(skater.attendance, 'Absent') }}</p>
                  </div>
                  <div class="bg-yellow-50 rounded-lg p-4 flex-1 min-w-[150px]">
                    <p class="text-sm text-yellow-700 mb-1">Sick</p>
                    <p class="text-2xl font-bold text-yellow-800">{{ getAttendanceCount(skater.attendance, 'Sick') }}</p>
                  </div>
                </div>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                  <div v-for="record in skater.attendance" :key="record.attendance_date" class="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <span class="text-gray-700">{{ formatDate(record.attendance_date) }}</span>
                    <span :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      record.status === 'Present' ? 'bg-green-100 text-green-800' :
                      record.status === 'Absent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    ]">
                      {{ record.status }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-12 text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No attendance records for this month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-xl shadow-lg p-12 text-center">
        <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Skaters Found</h3>
        <p class="text-gray-600">Join us to start your skating journey!</p>
      </div>
    </div>
  </div>
</template>

<script>
import InfoItem from './InfoItem.vue';

export default {
  name: 'MySkaterDetail',
  components: {
    InfoItem
  },
  data() {
    return {
      skaters: [],
      loading: true,
      error: null,
      activeTab: {},
      tabs: [
        { id: 'personal', label: 'Personal Info' },
        { id: 'address', label: 'Address' },
        { id: 'fee', label: 'Fee Details' },
        { id: 'attendance', label: 'Attendance' }
      ]
    };
  },
  computed: {
    getActiveTab() {
      return (studentId) => this.activeTab[studentId] || 'personal';
    }
  },
  mounted() {
    this.fetchSkaterDetails();
  },
  methods: {
    async fetchSkaterDetails() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch('http://localhost:3000/vsa/my-skater-details', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch skater details');
        }

        if (data.success) {
          this.skaters = data.data;
          // Initialize active tabs
          const tabs = {};
          data.data.forEach(skater => {
            tabs[skater.student_id] = 'personal';
          });
          this.activeTab = tabs;
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    
    navigateTo(path) {
      this.$router.push(path);
    },
    
    setActiveTab(studentId, tabId) {
      this.activeTab = { ...this.activeTab, [studentId]: tabId };
    },
    
    getInitials(name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    },
    
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    
    getAttendanceCount(attendance, status) {
      return attendance.filter(a => a.status === status).length;
    }
  }
};
</script>