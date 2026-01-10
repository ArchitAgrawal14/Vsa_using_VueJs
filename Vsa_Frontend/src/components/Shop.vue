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
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
        class="fixed inset-0 z-50 overflow-hidden"
        @click.self="closeCartPanel"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>

        <!-- Panel -->
        <div class="absolute inset-y-0 right-0 max-w-full flex">
          <div class="w-screen max-w-md">
            <div class="h-full flex flex-col bg-white shadow-xl">
              <!-- Header -->
              <div class="px-6 py-4 bg-black text-white">
                <div class="flex items-center justify-between">
                  <h2 class="text-xl font-semibold">Add to Cart</h2>
                  <button
                    @click="closeCartPanel"
                    class="text-white hover:text-gray-300 transition-colors"
                  >
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 overflow-y-auto px-6 py-6">
                <div v-if="selectedItem" class="space-y-6">
                  <!-- Product Image -->
                  <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      :src="'http://localhost:3000' + selectedItem.main_image_path"
                      :alt="selectedItem.name"
                      class="w-full h-full object-cover"
                    />
                  </div>

                  <!-- Product Info -->
                  <div>
                    <h3 class="text-xl font-semibold text-gray-900">{{ selectedItem.name }}</h3>
                    <div class="mt-2 flex items-center space-x-2">
                      <span v-if="selectedItem.old_price" class="text-gray-400 line-through text-sm">
                        ${{ selectedItem.old_price }}
                      </span>
                      <span class="text-2xl font-bold text-black">
                        ${{ selectedItem.current_price }}
                      </span>
                    </div>
                    <div v-if="selectedItem.average_rating" class="mt-2 flex items-center">
                      <span class="text-yellow-400">★</span>
                      <span class="ml-1 text-gray-700">{{ selectedItem.average_rating }}</span>
                    </div>
                  </div>

                  <!-- Stock Info -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <p class="text-sm text-gray-600">
                      Available Stock: <span class="font-semibold text-black">{{ selectedItem.quantity }}</span>
                    </p>
                  </div>

                  <!-- Quantity Selector -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <div class="flex items-center space-x-4">
                      <button
                        @click="decrementQuantity"
                        :disabled="cartQuantity <= 1 || quantityUpdating"
                        :class="[
                          'w-12 h-12 rounded-lg border-2 flex items-center justify-center font-semibold text-xl transition-all',
                          cartQuantity <= 1 || quantityUpdating
                            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                            : 'border-black text-black hover:bg-black hover:text-white'
                        ]"
                      >
                        -
                      </button>
                      <span class="text-2xl font-semibold text-black min-w-[3rem] text-center">
                        {{ cartQuantity }}
                      </span>
                      <button
                        @click="incrementQuantity"
                        :disabled="cartQuantity >= selectedItem.quantity || quantityUpdating"
                        :class="[
                          'w-12 h-12 rounded-lg border-2 flex items-center justify-center font-semibold text-xl transition-all',
                          cartQuantity >= selectedItem.quantity || quantityUpdating
                            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                            : 'border-black text-black hover:bg-black hover:text-white'
                        ]"
                      >
                        +
                      </button>
                    </div>
                    <p v-if="quantityMessage" class="mt-2 text-sm text-gray-600">
                      {{ quantityMessage }}
                    </p>
                  </div>

                  <!-- Total Price -->
                  <div class="bg-gray-900 text-white rounded-lg p-4">
                    <div class="flex justify-between items-center">
                      <span class="text-sm">Total Price</span>
                      <span class="text-2xl font-bold">
                        ₹{{ (selectedItem.current_price * cartQuantity).toFixed(2) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t border-gray-200 px-6 py-4">
                <button
                  @click="addToCart"
                  :disabled="addingToCart"
                  :class="[
                    'w-full py-3 px-6 rounded-lg font-semibold text-white transition-all',
                    addingToCart
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800 active:scale-95'
                  ]"
                >
                  {{ addingToCart ? 'Adding...' : 'Add to Cart' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ProductCard from './shop_components/ProductCard.vue';

export default {
  name: 'Shop',
  components: {
    ProductCard
  },
  data() {
    return {
      categories: [
        { label: 'Skates and Boots', value: 'skates_and_boots' },
        { label: 'Wheels', value: 'wheels' },
        { label: 'Bearings', value: 'bearings' },
        { label: 'Helmets', value: 'helmets' },
        { label: 'Accessories', value: 'accessories' }
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
      addingToCart: false
    };
  },
  mounted() {
    this.fetchItems(this.selectedCategory);
  },
  methods: {
    async selectCategory(category) {
      this.selectedCategory = category;
      await this.fetchItems(category);
    },
    async fetchItems(itemType) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(`http://localhost:3000/vsa/shop/${itemType}`);
        const data = await response.json();
        
        if (data.success) {
          this.items = data.items || [];
        } else {
          this.error = data.message || 'Failed to fetch items';
        }
      } catch (err) {
        this.error = 'Network error. Please try again.';
        console.error('Error fetching items:', err);
      } finally {
        this.loading = false;
      }
    },
    handleBuyNow(item) {
      // Implement buy now functionality
      console.log('Buy now:', item);
    },
    openCartPanel(item) {
      this.selectedItem = item;
      this.cartQuantity = 1;
      this.quantityMessage = '';
      this.showCartPanel = true;
    },
    closeCartPanel() {
      this.showCartPanel = false;
      this.selectedItem = null;
      this.cartQuantity = 1;
      this.quantityMessage = '';
    },
    async incrementQuantity() {
      if (!this.selectedItem || this.quantityUpdating) return;
      
      this.quantityUpdating = true;
      this.quantityMessage = '';
      
      try {
        const response = await fetch('http://localhost:3000/vsa/shop/update-item-quantity', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            itemId: this.selectedItem.item_id,
            itemVariationId: this.selectedItem.item_variation_id,
            itemType: this.selectedCategory,
            isIncrement: true,
            currentAppliedQuantity: this.cartQuantity
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          this.cartQuantity = data.newQuantity;
        } else {
          this.quantityMessage = data.message;
        }
      } catch (err) {
        console.error('Error updating quantity:', err);
        this.quantityMessage = 'Failed to update quantity';
      } finally {
        this.quantityUpdating = false;
      }
    },
    async decrementQuantity() {
      if (!this.selectedItem || this.quantityUpdating) return;
      
      this.quantityUpdating = true;
      this.quantityMessage = '';
      
      try {
        const response = await fetch('http://localhost:3000/vsa/shop/update-item-quantity', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            itemId: this.selectedItem.item_id,
            itemVariationId: this.selectedItem.item_variation_id,
            itemType: this.selectedCategory,
            isIncrement: false,
            currentAppliedQuantity: this.cartQuantity
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          this.cartQuantity = data.newQuantity;
        } else {
          this.quantityMessage = data.message;
        }
      } catch (err) {
        console.error('Error updating quantity:', err);
        this.quantityMessage = 'Failed to update quantity';
      } finally {
        this.quantityUpdating = false;
      }
    },
    async addToCart() {
      if (!this.selectedItem || this.addingToCart) return;
      
      this.addingToCart = true;
      
      try {
        const response = await fetch('http://localhost:3000/vsa/shop/add-to-cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            itemToAddToCart: {
              itemId: this.selectedItem.item_id,
              itemVariationId: this.selectedItem.item_variation_id,
              itemType: this.selectedCategory,
              quantity: this.cartQuantity
            }
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          alert('Item added to cart successfully!');
          this.closeCartPanel();
        } else {
          alert(data.message || 'Failed to add item to cart');
        }
      } catch (err) {
        console.error('Error adding to cart:', err);
        alert('Network error. Please try again.');
      } finally {
        this.addingToCart = false;
      }
    }
  }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
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
</style>