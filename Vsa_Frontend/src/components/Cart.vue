<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="border-b border-gray-200 mt-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-black"></h1>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
        <p class="text-gray-800">{{ error }}</p>
        <button @click="fetchCart" class="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          Retry
        </button>
      </div>
    </div>

    <!-- Empty Cart -->
    <div v-else-if="!loading && groupedCartItems.length === 0" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center py-16">
        <svg class="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 class="mt-6 text-2xl font-semibold text-gray-900">Your cart is empty</h2>
        <p class="mt-2 text-gray-600">Start adding items to your cart</p>
      </div>
    </div>

    <!-- Cart Items -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <!-- Items List -->
        <div class="lg:col-span-8 space-y-4">
          <div v-for="item in groupedCartItems" :key="item.cart_id" class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div class="p-4 sm:p-6">
              <div class="flex flex-col sm:flex-row gap-4">
                <!-- Product Image -->
                <img 
                :src="'http://localhost:3000' + getImageUrl(item.main_image_path)" 
                :alt="item.name" 
                @click="navigateToProduct(item)"
                class="w-full sm:w-32 h-32 object-cover rounded-lg bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity" 
                @error="handleImageError" 
                />

                <!-- Product Details -->
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start gap-4">
                    <div class="flex-1">
                      <h3 
                        @click="navigateToProduct(item)" 
                        class="text-lg font-semibold text-black cursor-pointer hover:underline"
                        >
                        {{ item.name }}
                      </h3>
                      <p class="text-sm text-gray-600 mt-1">{{ item.item_variation_id }}</p>
                      
                      <!-- Customizations -->
                      <div v-if="item.is_custom && item.customizations.length > 0" class="mt-3 space-y-2">
                        <div v-for="custom in item.customizations" :key="custom.cart_item_customization_id" class="flex items-center gap-2 text-sm">
                          <span class="font-medium text-gray-700">{{ formatCustomizationType(custom.customization_type) }}:</span>
                          <span v-if="custom.customization_type === 'custom_color'" class="flex items-center gap-2">
                            <span class="inline-block w-5 h-5 rounded border border-gray-300" :style="{ backgroundColor: custom.customization_value }"></span>
                            <span class="text-gray-600">{{ custom.customization_value }}</span>
                          </span>
                          <span v-else class="text-gray-600">{{ custom.customization_value }}</span>
                        </div>
                      </div>

                      <!-- Rating -->
                      <div class="flex items-center mt-2">
                        <div class="flex items-center">
                          <svg v-for="i in 5" :key="i" class="w-4 h-4" :class="i <= Math.round(parseFloat(item.average_rating)) ? 'text-black' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span class="ml-2 text-sm text-gray-600">{{ parseFloat(item.average_rating).toFixed(1) }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Delete Button -->
                    <button @click="removeFromCart(item.cart_id)" :disabled="deletingItems[item.cart_id]" class="text-gray-400 hover:text-black transition-colors p-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <!-- Price and Quantity -->
                  <div class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <!-- Quantity Controls -->
                    <div class="flex items-center gap-3">
                      <span class="text-sm text-gray-600">Quantity:</span>
                      <div class="flex items-center border border-gray-300 rounded-lg">
                        <button @click="updateQuantity(item, false)" :disabled="updatingItems[item.cart_id]" class="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                          </svg>
                        </button>
                        <span class="px-4 py-2 min-w-[3rem] text-center font-medium">{{ item.quantity }}</span>
                        <button @click="updateQuantity(item, true)" :disabled="updatingItems[item.cart_id]" class="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <span class="text-xs text-gray-500">{{ item.stock_quantity }} available</span>
                    </div>

                    <!-- Price -->
                    <div class="flex items-baseline gap-2">
                      <span v-if="parseFloat(item.old_price) > parseFloat(item.current_price)" class="text-sm text-gray-400 line-through">{{ item.currency }} {{ formatPrice(item.old_price) }}</span>
                      <span class="text-xl font-bold text-black">{{ item.currency }} {{ formatPrice(item.current_price) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-4 mt-8 lg:mt-0">
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-4">
            <h2 class="text-xl font-bold text-black mb-6">Order Summary</h2>
            
            <div class="space-y-4">
              <div class="flex justify-between text-gray-700">
                <span>Subtotal ({{ totalItems }} items)</span>
                <span class="font-medium">{{ currency }} {{ formatPrice(subtotal) }}</span>
              </div>
              
              <div class="flex justify-between text-gray-700">
                <span>Discount</span>
                <span class="font-medium text-green-600">- {{ currency }} {{ formatPrice(discount) }}</span>
              </div>
              
              <div class="border-t border-gray-300 pt-4">
                <div class="flex justify-between text-lg font-bold text-black">
                  <span>Total</span>
                  <span>{{ currency }} {{ formatPrice(total) }}</span>
                </div>
              </div>
            </div>

            <button class="w-full mt-6 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              Proceed to Checkout
            </button>

            <button @click="fetchCart" class="w-full mt-3 bg-white text-black py-3 rounded-lg font-semibold border-2 border-black hover:bg-gray-50 transition-colors">
              Update Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  data() {
    return {
      loading: true,
      error: null,
      cartItems: [],
      itemDetails: [],
      updatingItems: {},
      deletingItems: {},
      currency: 'INR'
    };
  },
  computed: {
    groupedCartItems() {
      const grouped = {};
      
      this.cartItems.forEach(cartItem => {
        if (!grouped[cartItem.cart_id]) {
          const itemDetail = this.itemDetails.find(
            detail => detail.item_id === cartItem.item_id && 
                     detail.item_variation_id === cartItem.item_variation_id
          );
          
          if (itemDetail) {
            grouped[cartItem.cart_id] = {
              cart_id: cartItem.cart_id,
              item_id: cartItem.item_id,
              item_variation_id: cartItem.item_variation_id,
              item_type: cartItem.item_type,
              quantity: cartItem.quantity,
              is_custom: cartItem.is_custom,
              currency: cartItem.currency,
              name: itemDetail.name,
              main_image_path: itemDetail.main_image_path,
              average_rating: itemDetail.average_rating,
              old_price: itemDetail.old_price,
              current_price: itemDetail.current_price,
              stock_quantity: itemDetail.quantity,
              customizations: []
            };
          }
        }
        
        if (cartItem.cart_item_customization_id && grouped[cartItem.cart_id]) {
          grouped[cartItem.cart_id].customizations.push({
            cart_item_customization_id: cartItem.cart_item_customization_id,
            customization_type: cartItem.customization_type,
            customization_value: cartItem.customization_value,
            extra_price: cartItem.extra_price
          });
        }
      });
      
      return Object.values(grouped);
    },
    totalItems() {
      return this.groupedCartItems.reduce((sum, item) => sum + item.quantity, 0);
    },
    subtotal() {
      return this.groupedCartItems.reduce((sum, item) => {
        const itemTotal = parseFloat(item.old_price) * item.quantity;
        return sum + itemTotal;
      }, 0);
    },
    discount() {
      return this.groupedCartItems.reduce((sum, item) => {
        const itemDiscount = (parseFloat(item.old_price) - parseFloat(item.current_price)) * item.quantity;
        return sum + itemDiscount;
      }, 0);
    },
    total() {
      return this.groupedCartItems.reduce((sum, item) => {
        const itemTotal = parseFloat(item.current_price) * item.quantity;
        const customizationTotal = item.customizations.reduce((cSum, c) => cSum + parseFloat(c.extra_price || 0), 0);
        return sum + itemTotal + customizationTotal;
      }, 0);
    }
  },
  mounted() {
    this.fetchCart();
  },
  methods: {
    async fetchCart() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch('http://localhost:3000/vsa/shop/cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch cart');
        }
        
        if (data.success) {
          this.cartItems = data.cartItems || [];
          this.itemDetails = data.itemDetails || [];
          if (this.cartItems.length > 0) {
            this.currency = this.cartItems[0].currency;
          }
        } else {
          throw new Error(data.message || 'Failed to load cart');
        }
      } catch (err) {
        this.error = err.message;
        console.error('Cart fetch error:', err);
      } finally {
        this.loading = false;
      }
    },
    async updateQuantity(item, isIncrement) {
      this.updatingItems[item.cart_id] = true;
      
      try {
        const response = await fetch('http://localhost:3000/vsa/shop/update-cart-item-quantity', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            cartId: item.cart_id,
            itemId: item.item_id,
            itemVariationId: item.item_variation_id,
            itemType: item.item_type,
            isIncrement,
            currentAppliedQuantity: item.quantity
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          await this.fetchCart();
        } else {
          alert(data.message || 'Failed to update quantity');
        }
      } catch (err) {
        console.error('Update quantity error:', err);
        alert('Failed to update quantity');
      } finally {
        this.updatingItems[item.cart_id] = false;
      }
    },
    async removeFromCart(cartId) {
      if (!confirm('Are you sure you want to remove this item?')) {
        return;
      }
      
      this.deletingItems[cartId] = true;
      
      try {
        const response = await fetch(`http://localhost:3000/vsa/shop/delete-cart-item/${cartId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        
        const data = await response.json();
        
        if (data.success) {
          await this.fetchCart();
        } else {
          throw new Error(data.message || 'Failed to remove item');
        }
      } catch (err) {
        console.error('Remove item error:', err);
        alert(err.message);
      } finally {
        this.deletingItems[cartId] = false;
      }
    },
    formatPrice(price) {
      return parseFloat(price).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    formatCustomizationType(type) {
      return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    },
    getImageUrl(path) {
      if (!path) return '/placeholder-image.jpg';
      return path.startsWith('http') ? path : path;
    },
    handleImageError(e) {
      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
    },
    navigateToProduct(item) {
    // Navigate to product detail page
    this.$router.push({
      name: 'ProductDetail', // or path: `/product-detail/${item.item_variation_id}/${item.item_type}`
      params: {
        itemVariationId: item.item_variation_id,
        itemType: item.item_type
      }
    });
  }
  }
};
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f3f4f6;
}

::-webkit-scrollbar-thumb {
  background: #000;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #374151;
}
</style>