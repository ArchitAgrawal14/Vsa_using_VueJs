<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12 mt-8">
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p class="text-gray-600">Manage your personal information and addresses</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
      </div>

      <!-- Content -->
      <div v-else class="space-y-8">
        <!-- Profile Section -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div class="bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-4">
            <h2 class="text-2xl font-bold text-white flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h2>
          </div>
          
          <div class="p-6 sm:p-8">
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Full Name -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    v-model="profile.full_name"
                    type="text"
                    :disabled="!editingProfile"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter your full name"
                  />
                </div>

                <!-- Mobile -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                  <input
                    v-model="profile.mobile"
                    type="tel"
                    :disabled="!editingProfile"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter mobile number"
                  />
                </div>

                <!-- Email (Read-only) -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    v-model="profile.email"
                    type="email"
                    disabled
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <!-- User ID (Read-only) -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
                  <input
                    v-model="profile.id"
                    type="text"
                    disabled
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 pt-4">
                <button
                  v-if="!editingProfile"
                  @click="editingProfile = true"
                  type="button"
                  class="flex-1 sm:flex-none bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transform hover:scale-105 transition duration-200 shadow-lg"
                >
                  Edit Profile
                </button>
                <template v-else>
                  <button
                    @click="updateProfile"
                    type="button"
                    :disabled="updatingProfile"
                    class="flex-1 sm:flex-none bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transform hover:scale-105 transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ updatingProfile ? 'Saving...' : 'Save Changes' }}
                  </button>
                  <button
                    @click="cancelProfileEdit"
                    type="button"
                    class="flex-1 sm:flex-none bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold border-2 border-gray-900 hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Addresses Section -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div class="bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-4 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-white flex items-center">
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              My Addresses
            </h2>
            <button
              @click="openAddAddressModal"
              class="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-200 flex items-center text-sm sm:text-base"
            >
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add New
            </button>
          </div>

          <div class="p-6 sm:p-8">
            <div v-if="addresses.length === 0" class="text-center py-12">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <p class="text-gray-600 text-lg">No addresses saved yet</p>
              <p class="text-gray-500 text-sm mt-2">Add your first address to get started</p>
            </div>

            <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                v-for="address in addresses"
                :key="address.id"
                class="border-2 border-gray-200 rounded-xl p-6 hover:border-gray-900 transition duration-200 relative group"
              >
                <!-- Default Badge -->
                <div v-if="address.is_default" class="absolute top-4 right-4">
                  <span class="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">DEFAULT</span>
                </div>

                <!-- Gift Badge -->
                <div v-if="address.is_gift" class="absolute top-4 right-4" :class="{'top-12': address.is_default}">
                  <span class="bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full">GIFT</span>
                </div>

                <div class="space-y-3">
                  <h3 class="font-bold text-lg text-gray-900">{{ address.full_name || profile.full_name }}</h3>
                  <p class="text-gray-700">{{ address.address_line1 }}</p>
                  <p v-if="address.address_line2" class="text-gray-700">{{ address.address_line2 }}</p>
                  <p class="text-gray-700">{{ address.city }}, {{ address.state }} - {{ address.postal_code }}</p>
                  <p class="text-gray-700">{{ address.country }}</p>
                  <p class="text-gray-600 font-semibold">📱 {{ address.mobile || profile.mobile }}</p>
                </div>

                <div class="mt-6 flex gap-3">
                  <button
                    @click="openEditAddressModal(address)"
                    class="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition duration-200 text-sm"
                  >
                    Update
                  </button>
                  <button
                    v-if="!address.is_default"
                    @click="setDefaultAddress(address.id)"
                    class="flex-1 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold border-2 border-gray-900 hover:bg-gray-50 transition duration-200 text-sm"
                  >
                    Set Default
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Address Modal -->
    <div v-if="showAddressModal" class="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-[9999] p-4 overflow-y-auto mt-10">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-8">
        <div class="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-4 flex justify-between items-center">
          <h3 class="text-2xl font-bold text-white">
            {{ editingAddress ? 'Update Address' : 'Add New Address' }}
          </h3>
          <button @click="closeAddressModal" class="text-white hover:text-gray-300 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                v-model="addressForm.full_name"
                type="text"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                placeholder="Recipient's full name"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
              <input
                v-model="addressForm.mobile"
                type="tel"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                placeholder="Contact number"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Address Line 1 *</label>
              <input
                v-model="addressForm.address_line1"
                type="text"
                required
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                placeholder="House/Flat No., Building Name"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Address Line 2</label>
              <input
                v-model="addressForm.address_line2"
                type="text"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                placeholder="Street, Area, Landmark"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">City *</label>
              <input
                v-model="addressForm.city"
                type="text"
                required
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                placeholder="City"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">State *</label>
              <input
                v-model="addressForm.state"
                type="text"
                required
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                placeholder="State"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Postal Code *</label>
              <input
                v-model="addressForm.postal_code"
                type="text"
                required
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                placeholder="PIN Code"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Country</label>
              <input
                v-model="addressForm.country"
                type="text"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                placeholder="Country"
              />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 pt-4 border-t-2 border-gray-200">
            <label class="flex items-center cursor-pointer">
              <input
                v-model="addressForm.is_default"
                type="checkbox"
                class="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <span class="ml-2 text-gray-700 font-semibold">Set as default address</span>
            </label>

            <label class="flex items-center cursor-pointer">
              <input
                v-model="addressForm.is_gift"
                type="checkbox"
                class="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <span class="ml-2 text-gray-700 font-semibold">Gift address</span>
            </label>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              @click="saveAddress"
              type="button"
              :disabled="savingAddress"
              class="flex-1 bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transform hover:scale-105 transition duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ savingAddress ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address') }}
            </button>
            <button
              @click="closeAddressModal"
              type="button"
              class="flex-1 bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold border-2 border-gray-900 hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show" class="fixed bottom-6 right-6 z-50 animate-bounce">
      <div
        :class="[
          'px-6 py-4 rounded-lg shadow-2xl border-2',
          toast.type === 'success' ? 'bg-gray-900 border-gray-900 text-white' : 'bg-red-500 border-red-500 text-white'
        ]"
      >
        <p class="font-semibold">{{ toast.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      loading: true,
      editingProfile: false,
      updatingProfile: false,
      showAddressModal: false,
      editingAddress: null,
      savingAddress: false,
      profile: {
        id: null,
        full_name: '',
        mobile: '',
        email: '',
        is_admin: false,
        is_verified: false,
        created_at: ''
      },
      originalProfile: {},
      addresses: [],
      addressForm: {
        addressId: null,
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        full_name: '',
        mobile: '',
        is_default: false,
        is_gift: false
      },
      toast: {
        show: false,
        message: '',
        type: 'success'
      }
    };
  },
  mounted() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      try {
        this.loading = true;
        const response = await fetch('http://localhost:3000/vsa/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          this.profile = data.profile;
          this.originalProfile = { ...data.profile };
          this.addresses = data.addresses;
        } else {
          this.showToast(data.message, 'error');
        }
      } catch (error) {
        this.showToast('Failed to fetch profile', 'error');
      } finally {
        this.loading = false;
      }
    },
    
    async updateProfile() {
      try {
        this.updatingProfile = true;
        const response = await fetch('http://localhost:3000/vsa/update-profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            fullName: this.profile.full_name,
            mobile: this.profile.mobile
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          this.showToast('Profile updated successfully', 'success');
          this.editingProfile = false;
          this.originalProfile = { ...this.profile };
        } else {
          this.showToast(data.message, 'error');
        }
      } catch (error) {
        this.showToast('Failed to update profile', 'error');
      } finally {
        this.updatingProfile = false;
      }
    },
    
    cancelProfileEdit() {
      this.profile = { ...this.originalProfile };
      this.editingProfile = false;
    },
    
    openAddAddressModal() {
      this.editingAddress = null;
      this.addressForm = {
        addressId: null,
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        full_name: '',
        mobile: '',
        is_default: false,
        is_gift: false
      };
      this.showAddressModal = true;
    },
    
    openEditAddressModal(address) {
      this.editingAddress = address;
      this.addressForm = {
        addressId: address.id,
        address_line1: address.address_line1,
        address_line2: address.address_line2 || '',
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
        full_name: address.full_name || '',
        mobile: address.mobile || '',
        is_default: address.is_default,
        is_gift: address.is_gift
      };
      this.showAddressModal = true;
    },
    
    closeAddressModal() {
      this.showAddressModal = false;
      this.editingAddress = null;
    },
    
    async saveAddress() {
      // Basic validation
      if (!this.addressForm.address_line1 || !this.addressForm.city || 
          !this.addressForm.state || !this.addressForm.postal_code) {
        this.showToast('Please fill all required fields', 'error');
        return;
      }

      try {
        this.savingAddress = true;
        const url = this.editingAddress ? 'http://localhost:3000/vsa/update-address' : 'http://localhost:3000/vsa/add-new-address';
        const method = this.editingAddress ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(this.addressForm)
        });
        
        const data = await response.json();
        
        if (data.success) {
          this.showToast(data.message, 'success');
          this.closeAddressModal();
          await this.fetchProfile();
        } else {
          this.showToast(data.message, 'error');
        }
      } catch (error) {
        this.showToast('Failed to save address', 'error');
      } finally {
        this.savingAddress = false;
      }
    },
    
    async setDefaultAddress(addressId) {
      try {
        const response = await fetch('http://localhost:3000/vsa/update-address', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            addressId: addressId,
            is_default: true
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          this.showToast('Default address updated', 'success');
          await this.fetchProfile();
        } else {
          this.showToast(data.message, 'error');
        }
      } catch (error) {
        this.showToast('Failed to set default address', 'error');
      }
    },
    
    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    }
  }
};
</script>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 1s ease-in-out;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>