<template>
  <div 
    @click="navigateToProductDetail"
    class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-sky-200 max-w-xs mx-auto cursor-pointer"
  >
    <!-- Product Image Container -->
    <div class="relative aspect-[4/3] bg-gradient-to-br from-sky-50 to-gray-50 overflow-hidden">
      <img
        :src="'http://localhost:3000' + item.main_image_path"
        :alt="item.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      
      <!-- Gradient Overlay on Hover -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <!-- Stock Badge -->
      <div
        v-if="item.quantity <= 5"
        class="absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm shadow-md"
        :class="item.quantity === 0 
          ? 'bg-red-500/90 text-white' 
          : 'bg-amber-400/90 text-black'"
      >
        {{ item.quantity === 0 ? 'Out of Stock' : `${item.quantity} left` }}
      </div>

      <!-- Discount Badge -->
      <div
        v-if="item.old_price && item.current_price < item.old_price"
        class="absolute top-2 left-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md"
      >
        {{ calculateDiscount }}% OFF
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4 space-y-2.5">
      <!-- Product Name -->
      <h3 class="font-bold text-gray-900 text-base leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-sky-600 transition-colors duration-200">
        {{ item.name }}
      </h3>

      <!-- Rating Section -->
      <div v-if="item.average_rating" class="flex items-center gap-1.5">
        <div class="flex items-center gap-0.5">
          <span
            v-for="star in 5"
            :key="star"
            class="text-sm"
            :class="star <= Math.round(item.average_rating) ? 'text-amber-400' : 'text-gray-200'"
          >
            ★
          </span>
        </div>
        <span class="text-xs font-medium text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded">
          {{ item.average_rating }}
        </span>
      </div>

      <!-- Price Section -->
      <div class="flex items-baseline gap-2">
        <span class="text-2xl font-black bg-gradient-to-r from-sky-600 to-sky-800 bg-clip-text text-transparent">
          ${{ item.current_price }}
        </span>
        <span v-if="item.old_price" class="text-sm text-gray-400 line-through">
          ${{ item.old_price }}
        </span>
      </div>

      <!-- Action Buttons - Stacked -->
      <div class="flex flex-col gap-2 pt-1" @click.stop>
        <button
          @click="handleBuyNow"
          :disabled="item.quantity === 0"
          :class="[
            'w-full py-2.5 px-4 rounded-lg font-bold transition-all duration-200 transform active:scale-95 text-sm',
            item.quantity === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-600 hover:to-sky-700 shadow-md hover:shadow-lg'
          ]"
        >
          Buy Now
        </button>
        <button
          @click="handleAddToCart"
          :disabled="item.quantity === 0"
          :class="[
            'w-full py-2.5 px-4 rounded-lg font-bold border-2 transition-all duration-200 transform active:scale-95 text-sm',
            item.quantity === 0
              ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
              : 'border-black text-black hover:bg-black hover:text-white'
          ]"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    item: {
      type: Object,
      required: true
    },
    itemType: {
      type: String,
      required: true
    }
  },
  computed: {
    calculateDiscount() {
      if (!this.item.old_price || !this.item.current_price) return 0;
      const discount = ((this.item.old_price - this.item.current_price) / this.item.old_price) * 100;
      return Math.round(discount);
    }
  },
  methods: {
    handleBuyNow() {
      this.$emit('buy-now', this.item);
    },
    handleAddToCart() {
      this.$emit('add-to-cart', this.item);
    },
    navigateToProductDetail() {
      this.$router.push({
        name: 'ProductDetail',
        params: {
          itemVariationId: this.item.item_variation_id,
          itemType: this.itemType
        }
      });
    }
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>