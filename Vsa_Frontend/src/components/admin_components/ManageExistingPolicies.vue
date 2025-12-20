<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 mt-8">
        <h1 class="text-3xl font-bold text-gray-900">Manage Existing Policies</h1>
        <p class="mt-2 text-sm text-gray-600">Update and manage all policy documents</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <p class="text-green-800">{{ successMessage }}</p>
      </div>

      <!-- Policies Sections -->
      <div v-if="!loading" class="space-y-6">
        <!-- Privacy Policies -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-blue-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Privacy Policies</h2>
          </div>
          <div class="p-6 space-y-4">
            <div v-for="policy in policies.privacyPolicies" :key="policy.id" class="border border-gray-200 rounded-lg p-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <input
                  v-model="policy.heading"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="updatingId === policy.id"
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  v-model="policy.content"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="updatingId === policy.id"
                ></textarea>
              </div>
              <button
                @click="updatePolicy('privacy_policies', policy.id, { heading: policy.heading, content: policy.content })"
                :disabled="updatingId === policy.id"
                class="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {{ updatingId === policy.id ? 'Updating...' : 'Update Policy' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Refund Policies -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-green-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Refund Policies</h2>
          </div>
          <div class="p-6 space-y-4">
            <div v-for="policy in policies.refundPolicies" :key="policy.id" class="border border-gray-200 rounded-lg p-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <input
                  v-model="policy.heading"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  :disabled="updatingId === policy.id"
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  v-model="policy.description"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  :disabled="updatingId === policy.id"
                ></textarea>
              </div>
              <button
                @click="updatePolicy('refund_policies', policy.id, { heading: policy.heading, description: policy.description })"
                :disabled="updatingId === policy.id"
                class="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {{ updatingId === policy.id ? 'Updating...' : 'Update Policy' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Return Policies -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-purple-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Return Policies</h2>
          </div>
          <div class="p-6 space-y-4">
            <div v-for="policy in policies.returnPolicies" :key="policy.id" class="border border-gray-200 rounded-lg p-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Step Number</label>
                <input
                  v-model.number="policy.step_number"
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  :disabled="updatingId === policy.id"
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  v-model="policy.description"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  :disabled="updatingId === policy.id"
                ></textarea>
              </div>
              <button
                @click="updatePolicy('return_policies', policy.id, { step_number: policy.step_number, description: policy.description })"
                :disabled="updatingId === policy.id"
                class="w-full sm:w-auto px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {{ updatingId === policy.id ? 'Updating...' : 'Update Policy' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Shipping Policies -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-orange-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Shipping Policies</h2>
          </div>
          <div class="p-6 space-y-4">
            <div v-for="policy in policies.shippingPolicies" :key="policy.id" class="border border-gray-200 rounded-lg p-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  v-model="policy.content"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  :disabled="updatingId === policy.id"
                ></textarea>
              </div>
              <button
                @click="updatePolicy('shipping_policies', policy.id, { content: policy.content })"
                :disabled="updatingId === policy.id"
                class="w-full sm:w-auto px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {{ updatingId === policy.id ? 'Updating...' : 'Update Policy' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-indigo-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Terms and Conditions</h2>
          </div>
          <div class="p-6 space-y-4">
            <div v-for="policy in policies.termsAndConditions" :key="policy.id" class="border border-gray-200 rounded-lg p-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  v-model="policy.title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  :disabled="updatingId === policy.id"
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Content Points
                  <span class="text-xs text-gray-500 ml-2">(Enter each point on a new line)</span>
                </label>
                <textarea
                  v-model="policy.editableContent"
                  rows="6"
                  placeholder="Enter each point on a new line&#10;Point 1&#10;Point 2&#10;Point 3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  :disabled="updatingId === policy.id"
                ></textarea>
                <p class="mt-2 text-xs text-gray-500">
                  Preview: This will be formatted as a bulleted list automatically
                </p>
              </div>
              <button
                @click="updateTermsAndConditions(policy.id, policy.title, policy.editableContent)"
                :disabled="updatingId === policy.id"
                class="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {{ updatingId === policy.id ? 'Updating...' : 'Update Policy' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Cancellation Refunds -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-red-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Cancellation & Refunds</h2>
          </div>
          <div class="p-6 space-y-4">
            <div v-for="policy in policies.cancellationRefunds" :key="policy.id" class="border border-gray-200 rounded-lg p-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  v-model="policy.title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  :disabled="updatingId === policy.id"
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  v-model="policy.content"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  :disabled="updatingId === policy.id"
                ></textarea>
              </div>
              <button
                @click="updatePolicy('cancellation_refunds', policy.id, { title: policy.title, content: policy.content })"
                :disabled="updatingId === policy.id"
                class="w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {{ updatingId === policy.id ? 'Updating...' : 'Update Policy' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ManageExistingPolicies',
  data() {
    return {
      policies: {
        privacyPolicies: [],
        refundPolicies: [],
        returnPolicies: [],
        shippingPolicies: [],
        termsAndConditions: [],
        cancellationRefunds: []
      },
      loading: false,
      updatingId: null,
      error: null,
      successMessage: null,
      apiBaseUrl: 'http://localhost:3000' // Replace with your actual API base URL
    };
  },
  mounted() {
    this.fetchPolicies();
  },
  methods: {
    // Convert HTML to plain text for editing
    htmlToPlainText(html) {
      if (!html) return '';
      
      // Remove <ul> and </ul> tags
      let text = html.replace(/<\/?ul>/gi, '');
      
      // Replace <li> tags with newlines and remove </li>
      text = text.replace(/<li>/gi, '').replace(/<\/li>/gi, '\n');
      
      // Trim whitespace and remove extra newlines
      text = text.trim().replace(/\n\n+/g, '\n');
      
      return text;
    },

    // Convert plain text to HTML
    plainTextToHtml(text) {
      if (!text) return '';
      
      // Split by newlines and filter out empty lines
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) return '';
      
      // Wrap each line in <li> tags
      const listItems = lines.map(line => `<li>${line.trim()}</li>`).join('');
      
      // Wrap in <ul> tags
      return `<ul>${listItems}</ul>`;
    },

    async fetchPolicies() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          this.error = 'Authentication token not found. Please login again.';
          this.loading = false;
          return;
        }

        const response = await fetch(`${this.apiBaseUrl}/vsa/admin/get-all-policies-data`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch policies');
        }

        if (data.success) {
          // Convert HTML to plain text for Terms and Conditions
          const termsWithEditableContent = (data.termsAndConditions || []).map(term => ({
            ...term,
            editableContent: this.htmlToPlainText(term.content)
          }));

          this.policies = {
            privacyPolicies: data.privacyPolicies || [],
            refundPolicies: data.refundPolicies || [],
            returnPolicies: data.returnPolicies || [],
            shippingPolicies: data.shippingPolicies || [],
            termsAndConditions: termsWithEditableContent,
            cancellationRefunds: data.cancellationRefunds || []
          };
        } else {
          this.error = data.message || 'Failed to fetch policies';
        }
      } catch (err) {
        this.error = err.message || 'An error occurred while fetching policies';
        console.error('Error fetching policies:', err);
      } finally {
        this.loading = false;
      }
    },

    async updateTermsAndConditions(id, title, plainText) {
      this.updatingId = id;
      this.error = null;
      this.successMessage = null;

      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          this.error = 'Authentication token not found. Please login again.';
          this.updatingId = null;
          return;
        }

        // Convert plain text to HTML
        const htmlContent = this.plainTextToHtml(plainText);

        const payload = {
          policyType: 'terms_and_conditions',
          id,
          title,
          content: htmlContent
        };

        const response = await fetch(`${this.apiBaseUrl}/vsa/admin/update-existing-policy`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to update policy');
        }

        if (result.success) {
          this.successMessage = `Terms and Conditions updated successfully!`;
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        } else {
          this.error = result.message || 'Failed to update policy';
        }
      } catch (err) {
        this.error = err.message || 'An error occurred while updating the policy';
        console.error('Error updating policy:', err);
      } finally {
        this.updatingId = null;
      }
    },

    async updatePolicy(policyType, id, data) {
      this.updatingId = id;
      this.error = null;
      this.successMessage = null;

      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          this.error = 'Authentication token not found. Please login again.';
          this.updatingId = null;
          return;
        }

        const payload = {
          policyType,
          id,
          ...data
        };

        const response = await fetch(`${this.apiBaseUrl}/vsa/admin/update-existing-policy`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to update policy');
        }

        if (result.success) {
          this.successMessage = `Policy updated successfully!`;
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        } else {
          this.error = result.message || 'Failed to update policy';
        }
      } catch (err) {
        this.error = err.message || 'An error occurred while updating the policy';
        console.error('Error updating policy:', err);
      } finally {
        this.updatingId = null;
      }
    }
  }
};
</script>

<style scoped>
/* Additional custom styles if needed */
textarea {
  resize: vertical;
  min-height: 100px;
}
</style>