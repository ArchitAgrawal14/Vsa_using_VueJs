<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6 mt-8">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Create Invoice</h1>
            <p class="text-gray-600 mt-1">Generate invoices for offline sales</p>
          </div>
          <button 
            @click="navigateTo('/admin/edit-invoice')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Invoice
          </button>
        </div>
      </div>
      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Section - Item Selection (2/3 width on large screens) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Category Tabs -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="flex overflow-x-auto space-x-2 pb-2">
              <button
                v-for="category in categories"
                :key="category.key"
                @click="selectedCategory = category.key"
                :class="[
                  'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
                  selectedCategory === category.key
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ category.label }}
              </button>
            </div>
          </div>

          <!-- Items Grid -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <div v-if="loading" class="text-center py-12">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p class="mt-2 text-gray-600">Loading items...</p>
            </div>

            <div v-else-if="filteredItems.length === 0" class="text-center py-12">
              <p class="text-gray-500">No items available in this category</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <div
                v-for="item in filteredItems"
                :key="`${item.item_id}-${item.item_variation_id}`"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <img
                  v-if="item.base_image_path"
                  :src="'http://localhost:3000' + item.base_image_path"
                  :alt="item.name"
                  class="w-full h-40 object-cover rounded-md mb-3"
                />
                <div v-else class="w-full h-40 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                  <span class="text-gray-400">No Image</span>
                </div>

                <h3 class="font-semibold text-gray-900 truncate">{{ item.name }}</h3>
                <div class="mt-2 space-y-1 text-sm">
                  <!-- Color only for non-bearings -->
                  <p v-if="item.category !== 'bearings'" class="text-gray-600">
                    <span class="font-medium">Color:</span> {{ item.color }}
                  </p>

                  <!-- Bearings specific fields -->
                  <p v-else class="text-gray-600">
                    <span class="font-medium">Pack Size:</span> {{ item.pack_size }}
                  </p>
                  <p v-else class="text-gray-600">
                    <span class="font-medium">Material:</span> {{ item.material }}
                  </p>

                  <!-- Common fields -->
                  <p class="text-gray-600">
                    <span class="font-medium">Size:</span> {{ item.size }}
                  </p>
                  <p class="text-gray-600">
                    <span class="font-medium">Stock:</span> {{ item.quantity }}
                  </p>
                  <p class="text-lg font-bold text-gray-900 mt-2">
                    ₹{{ item.current_price }}
                  </p>
                </div>

                <button
                  @click="addItemToInvoice(item)"
                  class="mt-3 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Add to Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Section - Invoice Summary (1/3 width on large screens) -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Invoice Summary</h2>

            <!-- Customer Details -->
            <div class="mb-6">
              <h3 class="font-semibold text-gray-900 mb-3">Customer Details</h3>
              <div class="space-y-3">
                <input
                  v-model="customer.fullName"
                  type="text"
                  placeholder="Full Name *"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <input
                  v-model="customer.mobile"
                  type="tel"
                  placeholder="Mobile *"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <input
                  v-model="customer.whatsappNumber"
                  type="tel"
                  placeholder="WhatsApp Number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <input
                  v-model="customer.email"
                  type="email"
                  placeholder="Email *"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Selected Items -->
            <div class="mb-6">
              <h3 class="font-semibold text-gray-900 mb-3">Selected Items</h3>
              <div v-if="selectedItems.length === 0" class="text-gray-500 text-sm text-center py-4">
                No items selected
              </div>
              <div v-else class="space-y-3 max-h-64 overflow-y-auto">
                <div
                  v-for="(item, index) in selectedItems"
                  :key="index"
                  class="border border-gray-200 rounded-lg p-3"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex-1 pr-2">
                      <p class="font-medium text-sm text-gray-900 truncate">{{ item.name }}</p>
                      <p class="text-xs text-gray-600">{{ item.color }} | {{ item.size }}</p>
                    </div>
                    <button
                      @click="removeItem(index)"
                      class="text-red-600 hover:text-red-800"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <button
                        @click="updateQuantity(index, -1)"
                        class="w-7 h-7 bg-gray-200 rounded hover:bg-gray-300"
                      >-</button>
                      <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                      <button
                        @click="updateQuantity(index, 1)"
                        class="w-7 h-7 bg-gray-200 rounded hover:bg-gray-300"
                      >+</button>
                    </div>
                    <p class="font-bold text-gray-900">₹{{ (item.priceAtSale * item.quantity).toFixed(2) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Details -->
            <div class="border-t pt-4 space-y-3">
              <div class="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span class="font-semibold">₹{{ payment.totalAmount.toFixed(2) }}</span>
              </div>

              <div class="flex items-center space-x-2">
                <label>Discount</label>
                <input
                  v-model.number="payment.discountApplied"
                  type="number"
                  min="0"
                  :max="payment.totalAmount"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div class="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Payable Amount:</span>
                <span>₹{{ payableAmount.toFixed(2) }}</span>
              </div>

              <div class="flex items-center space-x-2">
                <label> Amount paid</label>
                <input
                  v-model.number="payment.amountPaid"
                  type="number"
                  min="0"
                  :max="payableAmount"
                  placeholder="Amount Paid *"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div class="flex justify-between text-gray-700">
                <span>Pending:</span>
                <span class="font-semibold text-red-600">₹{{ pendingAmount.toFixed(2) }}</span>
              </div>

              <select
                v-model="payment.paymentType"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">Select Payment Type *</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="Others">Others</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 space-y-3">
              <button
                @click="confirmSale"
                :disabled="processing || !isFormValid"
                class="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {{ processing ? 'Processing...' : 'Confirm Sale & Generate Invoice' }}
              </button>

              <button
                @click="generateEstimate"
                :disabled="processing || selectedItems.length === 0"
                class="w-full bg-white text-gray-900 border-2 border-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Generate Estimate (No Stock Deduction)
              </button>

              <button
                @click="resetForm"
                class="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
            </div>

            <!-- Error/Success Messages -->
            <div v-if="message" :class="[
              'mt-4 p-3 rounded-lg text-sm',
              message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            ]">
              {{ message.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateInvoice',
  data() {
    return {
      categories: [
        { key: 'skates_and_boots', label: 'Skates & Boots' },
        { key: 'wheels', label: 'Wheels' },
        { key: 'helmets', label: 'Helmets' },
        { key: 'bearings', label: 'Bearings' },
        { key: 'accessories', label: 'Accessories' }
      ],
      selectedCategory: 'skates_and_boots',
      allItems: {
        skates_and_boots: [],
        wheels: [],
        helmets: [],
        bearings: [],
        accessories: []
      },
      selectedItems: [],
      customer: {
        fullName: '',
        mobile: '',
        whatsappNumber: '',
        email: ''
      },
      payment: {
        totalAmount: 0,
        discountApplied: 0,
        amountPaid: 0,
        paymentType: ''
      },
      loading: false,
      processing: false,
      message: null
    };
  },
  computed: {
    filteredItems() {
      return this.allItems[this.selectedCategory] || [];
    },
    payableAmount() {
      return Math.max(0, this.payment.totalAmount - this.payment.discountApplied);
    },
    pendingAmount() {
      return Math.max(0, this.payableAmount - this.payment.amountPaid);
    },
    isFormValid() {
      return (
        this.customer.fullName.trim() !== '' &&
        this.customer.mobile.trim() !== '' &&
        this.customer.email.trim() !== '' &&
        this.selectedItems.length > 0 &&
        this.payment.paymentType !== ''
      );
    }
  },
  watch: {
    selectedItems: {
      deep: true,
      handler() {
        this.calculateTotal();
      }
    }
  },
  mounted() {
    this.fetchItems();
  },
  methods: {
    async fetchItems() {
      this.loading = true;
      try {
        const response = await fetch('http://localhost:3000/vsa/invoice', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();

        if (data.success) {
          this.allItems.skates_and_boots = data.skatesAndBootsData || [];
          this.allItems.wheels = data.wheelsData || [];
          this.allItems.helmets = data.helmetsData || [];
          this.allItems.bearings = data.bearingsData || [];
          this.allItems.accessories = data.accessoriesData || [];
        } else {
          this.showMessage('Failed to load items', 'error');
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        this.showMessage('Error loading items', 'error');
      } finally {
        this.loading = false;
      }
    },

    addItemToInvoice(item) {
      const existingIndex = this.selectedItems.findIndex(
        selected => selected.item_variation_id === item.item_variation_id
      );

      if (existingIndex !== -1) {
        if (this.selectedItems[existingIndex].quantity < item.quantity) {
          this.selectedItems[existingIndex].quantity++;
        } else {
          this.showMessage('Cannot add more than available stock', 'error');
        }
      } else {
        this.selectedItems.push({
          itemId: item.item_id,
          itemVariationId: item.item_variation_id,
          itemType: item.category,
          name: item.name,
          color: item.color || item.material,
          size: item.size,
          quantity: 1,
          priceAtSale: item.current_price,
          maxQuantity: item.quantity
        });
      }
    },

    removeItem(index) {
      this.selectedItems.splice(index, 1);
    },

    updateQuantity(index, change) {
      const item = this.selectedItems[index];
      const newQuantity = item.quantity + change;

      if (newQuantity <= 0) {
        this.removeItem(index);
      } else if (newQuantity <= item.maxQuantity) {
        item.quantity = newQuantity;
      } else {
        this.showMessage('Cannot exceed available stock', 'error');
      }
    },

    calculateTotal() {
      this.payment.totalAmount = this.selectedItems.reduce(
        (sum, item) => sum + (item.priceAtSale * item.quantity),
        0
      );
    },

    async confirmSale() {
      if (!this.isFormValid) {
        this.showMessage('Please fill all required fields', 'error');
        return;
      }

      this.processing = true;
      this.message = null;

      try {
        const response = await fetch('http://localhost:3000/vsa/admin/sell-item-offline', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            soldItemData: {
              customer: this.customer,
              items: this.selectedItems.map(item => ({
                itemId: item.itemId,
                itemVariationId: item.itemVariationId,
                itemType: item.itemType,
                quantity: item.quantity,
                priceAtSale: item.priceAtSale
              })),
              payment: this.payment
            }
          })
        });

        const data = await response.json();

        if (data.success) {
          this.showMessage(`Sale successful! Invoice: ${data.invoiceNumber}`, 'success');
          
          // Download PDF
          await this.downloadPDF(data.invoiceNumber, true);
          
          // Reset form after short delay
          setTimeout(() => this.resetForm(), 2000);
        } else {
          this.showMessage(data.message || 'Failed to process sale', 'error');
        }
      } catch (error) {
        console.error('Error processing sale:', error);
        this.showMessage('Error processing sale', 'error');
      } finally {
        this.processing = false;
      }
    },

    async generateEstimate() {
      if (this.selectedItems.length === 0) {
        this.showMessage('Please add items to generate estimate', 'error');
        return;
      }

      this.processing = true;

      try {
        await this.downloadPDF('ESTIMATE', false);
        this.showMessage('Estimate generated successfully', 'success');
      } catch (error) {
        console.error('Error generating estimate:', error);
        this.showMessage('Error generating estimate', 'error');
      } finally {
        this.processing = false;
      }
    },

    async downloadPDF(invoiceNumber, isFinal) {
      const response = await fetch('http://localhost:3000/vsa/admin/generate-invoice-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          invoiceData: {
            invoiceNumber,
            isFinal,
            customer: this.customer,
            items: this.selectedItems,
            payment: this.payment,
            payableAmount: this.payableAmount,
            pendingAmount: this.pendingAmount
          }
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${isFinal ? 'Bill' : 'Estimate'}-${invoiceNumber}-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to generate PDF');
      }
    },

    resetForm() {
      this.selectedItems = [];
      this.customer = {
        fullName: '',
        mobile: '',
        whatsappNumber: '',
        email: ''
      };
      this.payment = {
        totalAmount: 0,
        discountApplied: 0,
        amountPaid: 0,
        paymentType: ''
      };
      this.message = null;
    },

    showMessage(text, type) {
      this.message = { text, type };
      setTimeout(() => {
        this.message = null;
      }, 5000);
    },

    navigateTo(path) {
      this.$router.push(path)
    },

  }
};
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>