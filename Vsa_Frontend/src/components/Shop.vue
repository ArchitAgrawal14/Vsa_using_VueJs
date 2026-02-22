<template>
  <div class="min-h-screen bg-gray-50 mt-16">
    <!-- Header Navigation -->
    <div class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex overflow-x-auto no-scrollbar space-x-1 sm:space-x-2 py-4">
          <button
            v-for="category in categories"
            :key="category.value"
            @click="selectCategory(category.value)"
            :class="[
              'px-4 sm:px-6 py-2.5 rounded-lg font-medium text-sm sm:text-base whitespace-nowrap transition-all duration-200',
              selectedCategory === category.value
                ? 'bg-black text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
          >
            {{ category.label }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-red-800 font-medium">{{ error }}</p>
        <button
          @click="fetchItems(selectedCategory)"
          class="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Retry
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="items.length === 0" class="text-center py-20">
        <p class="text-gray-500 text-lg">No items available in this category</p>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard
          v-for="item in items"
          :key="`${item.item_id}-${item.item_variation_id}`"
          :item="item"
          :itemType="selectedCategory"
          @buy-now="handleBuyNow"
          @add-to-cart="openCartPanel"
        />
      </div>
    </div>

    <!-- Cart Side Panel -->
    <transition name="slide">
      <div
        v-if="showCartPanel"
        class="fixed inset-0 z-[9999] overflow-hidden"
        @click.self="closeCartPanel"
      >
        <!-- Backdrop with blur -->
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
          @click="closeCartPanel"
        ></div>

        <!-- Panel Container -->
        <div class="absolute inset-y-0 right-0 max-w-full flex">
          <div class="w-screen max-w-xs sm:max-w-md">
            <div class="h-full flex flex-col bg-white shadow-2xl">
              <!-- Header with gradient -->
              <div
                class="relative px-4 sm:px-6 py-5 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h2 class="text-xl sm:text-2xl font-bold tracking-tight">Add to Cart</h2>
                    <p class="text-xs sm:text-sm text-gray-300 mt-1">Customize your selection</p>
                  </div>
                  <button
                    @click="closeCartPanel"
                    class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm group"
                  >
                    <svg
                      class="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:rotate-90 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Scrollable Content with custom scrollbar -->
              <div class="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 custom-scrollbar">
                <div v-if="selectedItem" class="space-y-5 sm:space-y-6">
                  <!-- Product Image with overlay -->
                  <div
                    class="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg group"
                  >
                    <img
                      :src="'http://localhost:3000' + selectedItem.main_image_path"
                      :alt="selectedItem.name"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    ></div>
                  </div>

                  <!-- Product Info Card -->
                  <div
                    class="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100"
                  >
                    <h3 class="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                      {{ selectedItem.name }}
                    </h3>
                    <div class="mt-3 flex items-center space-x-3">
                      <span
                        v-if="selectedItem.old_price"
                        class="text-gray-400 line-through text-sm sm:text-base"
                      >
                        ${{ selectedItem.old_price }}
                      </span>
                      <span
                        class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                      >
                        ${{ selectedItem.current_price }}
                      </span>
                    </div>
                    <div
                      v-if="selectedItem.average_rating"
                      class="mt-3 flex items-center space-x-2"
                    >
                      <div class="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                        <span class="text-yellow-500 text-sm sm:text-base">★</span>
                        <span class="ml-1 text-gray-800 font-semibold text-sm sm:text-base">{{
                          selectedItem.average_rating
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Stock Info -->
                  <!-- <div
                    class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 shadow-sm"
                  >
                    <div class="flex items-center justify-between">
                      <p class="text-sm sm:text-base text-gray-700 font-medium">Available Stock:</p>
                      <span class="text-lg sm:text-xl font-bold text-blue-600">{{
                        selectedItem.quantity
                      }}</span>
                    </div>
                  </div> -->

                  <!-- Quantity Selector -->
                  <div class="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                    <label class="block text-sm sm:text-base font-semibold text-gray-800 mb-3"
                      >Quantity</label
                    >
                    <div class="flex items-center justify-center space-x-4 sm:space-x-6">
                      <button
                        @click="decrementQuantity"
                        :disabled="cartQuantity <= 1 || quantityUpdating"
                        :class="[
                          'w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center font-bold text-xl sm:text-2xl leading-[1] transition-all duration-200 shadow-sm',
                          cartQuantity <= 1 || quantityUpdating
                            ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                            : 'border-blue-500 bg-white text-blue-600 hover:bg-blue-500 hover:text-white hover:shadow-md active:scale-95',
                        ]"
                      >
                        <span class="relative top-[-1px]">-</span>
                      </button>
                      <span
                        class="text-3xl sm:text-4xl font-bold text-gray-900 min-w-[4rem] text-center"
                      >
                        {{ cartQuantity }}
                      </span>
                      <button
                        @click="incrementQuantity"
                        :disabled="cartQuantity >= selectedItem.quantity || quantityUpdating"
                        :class="[
                          'w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center font-bold text-xl sm:text-2xl leading-[1] transition-all duration-200 shadow-sm',
                          cartQuantity >= selectedItem.quantity || quantityUpdating
                            ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                            : 'border-blue-500 bg-white text-blue-600 hover:bg-blue-500 hover:text-white hover:shadow-md active:scale-95',
                        ]"
                      >
                        <span class="relative top-[-1px]">+</span>
                      </button>
                    </div>
                    <p
                      v-if="quantityMessage"
                      class="mt-3 text-xs sm:text-sm text-gray-600 text-center"
                    >
                      {{ quantityMessage }}
                    </p>
                  </div>

                  <!-- Customizations Section -->
                  <!-- <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                      @click="toggleCustomizations"
                      class="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div>
                        <span class="text-base sm:text-lg font-semibold text-gray-900"
                          >Customize this item</span
                        >
                        <p class="text-xs sm:text-sm text-gray-500 mt-1">
                          Add personalization options
                        </p>
                      </div>
                      <svg
                        :class="[
                          'w-5 h-5 sm:w-6 sm:h-6 text-blue-600 transition-transform duration-300',
                          showCustomizations ? 'rotate-180' : '',
                        ]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    <transition name="expand">
                      <div
                        v-if="showCustomizations"
                        class="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 space-y-4 bg-gray-50"
                      > -->
                        <!-- Name Print -->
                        <!-- <div>
                          <label class="block text-sm font-semibold text-gray-800 mb-2">
                            Name Print
                            <span class="text-blue-600 font-normal"
                              >(+${{ customizationOptions.name_print.extraPrice }})</span
                            >
                          </label>
                          <input
                            type="text"
                            @input="updateCustomization('name_print', $event.target.value)"
                            maxlength="255"
                            placeholder="Enter name"
                            class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                          />
                        </div> -->

                        <!-- Color Strip -->
                        <!-- <div>
                          <label class="block text-sm font-semibold text-gray-800 mb-2">
                            Color Strip
                            <span class="text-blue-600 font-normal"
                              >(+${{ customizationOptions.color_strip.extraPrice }})</span
                            >
                          </label>
                          <select
                            @change="updateCustomization('color_strip', $event.target.value)"
                            class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                          >
                            <option value="">Select color</option>
                            <option
                              v-for="color in customizationOptions.color_strip.options"
                              :key="color"
                              :value="color"
                            >
                              {{ color }}
                            </option>
                          </select>
                        </div> -->

                        <!-- Custom Text -->
                        <!-- <div>
                          <label class="block text-sm font-semibold text-gray-800 mb-2">
                            Custom Text
                            <span class="text-blue-600 font-normal"
                              >(+${{ customizationOptions.text.extraPrice }})</span
                            >
                          </label>
                          <input
                            type="text"
                            @input="updateCustomization('text', $event.target.value)"
                            maxlength="255"
                            placeholder="Enter text"
                            class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                          />
                        </div> -->

                        <!-- Number -->
                        <!-- <div>
                          <label class="block text-sm font-semibold text-gray-800 mb-2">
                            Number
                            <span class="text-blue-600 font-normal"
                              >(+${{ customizationOptions.number.extraPrice }})</span
                            >
                          </label>
                          <input
                            type="number"
                            @input="updateCustomization('number', $event.target.value)"
                            placeholder="Enter number"
                            class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                          />
                        </div> -->

                        <!-- Custom Color -->
                        <!-- <div>
                          <label class="block text-sm font-semibold text-gray-800 mb-2">
                            Custom Color
                            <span class="text-blue-600 font-normal"
                              >(+${{ customizationOptions.custom_color.extraPrice }})</span
                            >
                          </label>
                          <input
                            type="color"
                            @input="updateCustomization('custom_color', $event.target.value)"
                            class="w-full h-12 border-2 border-gray-200 rounded-lg cursor-pointer bg-white"
                          />
                        </div> -->

                        <!-- Customization Summary -->
                        <!-- <div
                          v-if="hasCustomizations"
                          class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200 shadow-sm"
                        >
                          <p class="text-sm font-bold text-blue-900 mb-3 flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                              <path
                                fill-rule="evenodd"
                                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                clip-rule="evenodd"
                              />
                            </svg>
                            Selected Customizations
                          </p>
                          <ul class="text-sm text-blue-800 space-y-2"> -->
                            <!-- <li
                              v-for="(custom, type) in customizations"
                              :key="type"
                              class="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2"
                            >
                              <span class="font-medium"
                                >{{ customizationOptions[type].label }}: {{ custom.value }}</span
                              > -->
                              <!-- <span class="font-semibold text-blue-600"
                                >+₹{{ custom.extraPrice }}</span
                              > -->
                            <!-- </li>
                          </ul>
                        </div>
                      </div> -->
                    <!-- </transition> -->
                  <!-- </div> -->

                  <!-- Total Price Card -->
                  <div
                    class="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-gray-700"
                  >
                    <div class="space-y-3">
                      <div class="flex justify-between items-center text-sm sm:text-base">
                        <span class="text-gray-300">Base Price ({{ cartQuantity }}x)</span>
                        <span class="font-semibold"
                          >₹{{ (selectedItem.current_price * cartQuantity).toFixed(2) }}</span
                        >
                      </div>
                      <div
                        v-if="customizationTotal > 0"
                        class="flex justify-between items-center text-sm sm:text-base"
                      >
                        <span class="text-gray-300">Customizations</span>
                        <span class="font-semibold text-blue-400"
                          >+₹{{ customizationTotal.toFixed(2) }}</span
                        >
                      </div>
                      <div class="flex justify-between items-center pt-3 border-t border-gray-600">
                        <span class="text-sm sm:text-base font-medium">Total Price</span>
                        <span class="text-2xl sm:text-3xl font-bold text-white"
                          >₹{{ totalPrice.toFixed(2) }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer with gradient -->
              <div
                class="border-t border-gray-200 px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-t from-gray-50 to-white"
              >
                <button
                  @click="addToCart"
                  :disabled="addingToCart"
                  :class="[
                    'w-full py-3 sm:py-4 px-6 rounded-xl font-bold text-base sm:text-lg text-white transition-all duration-300 shadow-lg',
                    addingToCart
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 hover:shadow-xl',
                  ]"
                >
                  <span v-if="addingToCart" class="flex items-center justify-center">
                    <svg class="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding to Cart...
                  </span>
                  <span v-else>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- Toast Notification -->
    <transition name="toast">
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-6 right-6 z-[10000] px-6 py-4 rounded-xl shadow-2xl border-2 flex items-center space-x-3 max-w-sm',
          toast.type === 'success' ? 'bg-white border-green-500' : 'bg-white border-red-500',
        ]"
      >
        <!-- Success Icon -->
        <svg
          v-if="toast.type === 'success'"
          class="w-6 h-6 text-green-500 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>

        <!-- Error Icon -->
        <svg
          v-if="toast.type === 'error'"
          class="w-6 h-6 text-red-500 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>

        <p
          :class="[
            'font-semibold text-sm',
            toast.type === 'success' ? 'text-green-800' : 'text-red-800',
          ]"
        >
          {{ toast.message }}
        </p>
      </div>
    </transition>
  </div>
</template>

<script>
import ProductCard from './shop_components/ProductCard.vue'

export default {
  name: 'Shop',
  components: {
    ProductCard,
  },
  data() {
    return {
      categories: [
        { label: 'Skates and Boots', value: 'skates_and_boots' },
        { label: 'Wheels', value: 'wheels' },
        { label: 'Bearings', value: 'bearings' },
        { label: 'Helmets', value: 'helmets' },
        { label: 'Accessories', value: 'accessories' },
      ],
      selectedCategory: 'skates_and_boots',
      items: [],
      loading: false,
      error: null,
      showCartPanel: false,
      selectedItem: null,
      cartQuantity: 1,
      quantityUpdating: false,
      quantityMessage: '',
      addingToCart: false,
      customizations: {}, // Store customization selections
      customizationOptions: {
        name_print: { label: 'Name Print', type: 'text', extraPrice: 0.0 },
        color_strip: {
          label: 'Color Strip',
          type: 'select',
          options: ['Red', 'Blue', 'Green', 'Yellow'],
          extraPrice: 0.0,
        },
        text: { label: 'Custom Text', type: 'text', extraPrice: 0.0 },
        number: { label: 'Number', type: 'number', extraPrice: 0.0 },
        custom_color: { label: 'Custom Color', type: 'color', extraPrice: 0.0 },
      },
      showCustomizations: false, // Toggle customization section
      customizationTotal: 0, // Track extra cost from customizations
      toast: {
        show: false,
        message: '',
        type: 'success', // 'success', 'error', 'info'
      },
    }
  },
  mounted() {
    this.fetchItems(this.selectedCategory)
  },
  methods: {
    showToast(message, type = 'success') {
      this.toast = {
        show: true,
        message,
        type,
      }

      setTimeout(() => {
        this.toast.show = false
      }, 3000) // Auto-hide after 3 seconds
    },
    async selectCategory(category) {
      this.selectedCategory = category
      await this.fetchItems(category)
    },
    async fetchItems(itemType) {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(`http://localhost:3000/vsa/shop/${itemType}`)
        const data = await response.json()

        if (data.success) {
          this.items = data.items || []
        } else {
          this.error = data.message || 'Failed to fetch items'
        }
      } catch (err) {
        this.error = 'Network error. Please try again.'
        console.error('Error fetching items:', err)
      } finally {
        this.loading = false
      }
    },
    handleBuyNow(item) {
      // Implement buy now functionality
      console.log('Buy now:', item)
    },
    openCartPanel(item) {
      this.selectedItem = item
      this.cartQuantity = 1
      this.quantityMessage = ''
      this.resetCustomizations()
      this.showCartPanel = true
    },
    closeCartPanel() {
      this.showCartPanel = false
      this.selectedItem = null
      this.cartQuantity = 1
      this.quantityMessage = ''
      this.resetCustomizations()
    },
    async incrementQuantity() {
      if (!this.selectedItem || this.quantityUpdating) return

      this.quantityUpdating = true
      this.quantityMessage = ''

      try {
        const response = await fetch('http://localhost:3000/vsa/shop/update-item-quantity', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            itemId: this.selectedItem.item_id,
            itemVariationId: this.selectedItem.item_variation_id,
            itemType: this.selectedCategory,
            isIncrement: true,
            currentAppliedQuantity: this.cartQuantity,
          }),
        })

        const data = await response.json()

        if (data.success) {
          this.cartQuantity = data.newQuantity
          this.calculateCustomizationTotal()
        } else {
          this.quantityMessage = data.message
        }
      } catch (err) {
        console.error('Error updating quantity:', err)
        this.quantityMessage = 'Failed to update quantity'
      } finally {
        this.quantityUpdating = false
      }
    },
    async decrementQuantity() {
      if (!this.selectedItem || this.quantityUpdating) return

      this.quantityUpdating = true
      this.quantityMessage = ''

      try {
        const response = await fetch('http://localhost:3000/vsa/shop/update-item-quantity', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            itemId: this.selectedItem.item_id,
            itemVariationId: this.selectedItem.item_variation_id,
            itemType: this.selectedCategory,
            isIncrement: false,
            currentAppliedQuantity: this.cartQuantity,
          }),
        })

        const data = await response.json()

        if (data.success) {
          this.cartQuantity = data.newQuantity
        } else {
          this.quantityMessage = data.message
        }
      } catch (err) {
        console.error('Error updating quantity:', err)
        this.quantityMessage = 'Failed to update quantity'
      } finally {
        this.quantityUpdating = false
      }
    },
    async addToCart() {
      if (!this.selectedItem || this.addingToCart) return
      // console.log('')
      this.addingToCart = true

      try {
        const response = await fetch('http://localhost:3000/vsa/shop/add-to-cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            itemToAddToCart: {
              itemId: this.selectedItem.item_id,
              itemVariationId: this.selectedItem.item_variation_id,
              itemType: this.selectedCategory,
              quantity: this.cartQuantity,
              customizations: this.hasCustomizations ? this.customizations : undefined,
            },
          }),
        })

        const data = await response.json()

        if (data.success) {
          this.showToast('Item added to cart successfully!', 'success')
          this.closeCartPanel()
        } else {
          this.showToast(data.message || 'Failed to add item to cart', 'error')
        }
      } catch (err) {
        console.error('Error adding to cart:', err)
        this.showToast('Network error. Please try again.', 'error')
      } finally {
        this.addingToCart = false
      }
    },
    toggleCustomizations() {
      this.showCustomizations = !this.showCustomizations
    },

    updateCustomization(type, value) {
      if (value && value.trim() !== '') {
        this.customizations[type] = {
          value: value,
          extraPrice: this.customizationOptions[type].extraPrice,
        }
      } else {
        delete this.customizations[type]
      }
      this.calculateCustomizationTotal()
    },

    calculateCustomizationTotal() {
      this.customizationTotal =
        Object.values(this.customizations).reduce(
          (sum, custom) => sum + (custom.extraPrice || 0),
          0,
        ) * this.cartQuantity
    },

    resetCustomizations() {
      this.customizations = {}
      this.customizationTotal = 0
      this.showCustomizations = false
    },
  },
  computed: {
    totalPrice() {
      if (!this.selectedItem) return 0
      const basePrice = this.selectedItem.current_price * this.cartQuantity
      return basePrice + this.customizationTotal
    },

    hasCustomizations() {
      return Object.keys(this.customizations).length > 0
    },
  },
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #2563eb);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #1d4ed8);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from .absolute,
.slide-leave-to .absolute {
  transform: translateX(100%);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 1000px;
  opacity: 1;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
