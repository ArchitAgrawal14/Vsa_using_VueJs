<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-sky-50">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center min-h-screen">
            <div class="text-center">
                <div class="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto">
                </div>
                <p class="mt-4 text-gray-600 font-medium">Loading product details...</p>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center min-h-screen p-4">
            <div class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                <p class="text-gray-600 mb-6">{{ error }}</p>
                <button @click="$router.go(-1)"
                    class="bg-sky-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors">
                    Go Back
                </button>
            </div>
        </div>

        <!-- Product Detail Content -->
        <div v-else-if="product" class="container mx-auto px-4 py-8 max-w-7xl">
            <!-- Breadcrumb -->
            <nav class="mb-6 flex items-center gap-2 text-sm flex-wrap">
                <button @click="$router.push('/')"
                    class="text-gray-500 hover:text-sky-600 transition-colors">Home</button>
                <span class="text-gray-400">/</span>
                <button @click="$router.go(-1)"
                    class="text-gray-500 hover:text-sky-600 transition-colors">Products</button>
                <span class="text-gray-400">/</span>
                <span class="text-gray-900 font-medium">{{ product.name }}</span>
            </nav>

            <!-- Main Product Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <!-- Image Gallery -->
                <div class="space-y-4">
                    <!-- Main Image -->
                    <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div
                            class="aspect-square bg-gradient-to-br from-sky-50 to-gray-50 flex items-center justify-center">
                            <img :src="'http://localhost:3000' + currentImage" :alt="product.name"
                                class="w-full h-full object-cover" />
                        </div>
                    </div>

                    <!-- Thumbnail Gallery -->
                    <div v-if="selectedVariation && selectedVariation.images.length > 0"
                        class="grid grid-cols-4 sm:grid-cols-5 gap-3">
                        <button v-for="(image, index) in selectedVariation.images" :key="index"
                            @click="currentImage = image.imagePath" :class="[
                                'aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200',
                                currentImage === image.imagePath
                                    ? 'border-sky-500 ring-2 ring-sky-200'
                                    : 'border-gray-200 hover:border-sky-300'
                            ]">
                            <img :src="'http://localhost:3000' + image.imagePath"
                                :alt="`${product.name} view ${index + 1}`" class="w-full h-full object-cover" />
                        </button>
                    </div>
                </div>

                <!-- Product Info -->
                <div class="space-y-6">
                    <!-- Title & Rating -->
                    <div>
                        <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{{ product.name }}</h1>

                        <div v-if="product.averageRating > 0" class="flex items-center gap-3 mb-4">
                            <div class="flex items-center gap-1">
                                <span v-for="star in 5" :key="star" class="text-lg"
                                    :class="star <= Math.round(product.averageRating) ? 'text-amber-400' : 'text-gray-300'">
                                    ★
                                </span>
                            </div>
                            <span class="text-gray-600 font-medium">{{ product.averageRating }} / 10</span>
                            <span class="text-gray-400">•</span>
                            <span class="text-sky-600 font-medium">{{ product.ratings.length }} Reviews</span>
                        </div>

                        <p class="text-gray-600 text-lg">{{ product.shortDescription }}</p>
                    </div>

                    <!-- Price -->
                    <div class="bg-gradient-to-br from-sky-50 to-white p-6 rounded-xl border border-sky-100">
                        <div class="flex items-baseline gap-3 mb-2">
                            <span
                                class="text-4xl font-black bg-gradient-to-r from-sky-600 to-sky-800 bg-clip-text text-transparent">
                                ₹{{ selectedVariation?.currentPrice }}
                            </span>
                            <span
                                v-if="selectedVariation?.oldPrice && selectedVariation?.currentPrice < selectedVariation?.oldPrice"
                                class="text-xl text-gray-400 line-through">
                                ₹{{ selectedVariation?.oldPrice }}
                            </span>
                        </div>
                        <div v-if="selectedVariation?.discount > 0" class="flex items-center gap-2">
                            <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                {{ selectedVariation.discount }}% OFF
                            </span>
                            <span class="text-green-600 font-semibold">
                                Save ₹{{ (selectedVariation.oldPrice - selectedVariation.currentPrice).toFixed(2) }}
                            </span>
                        </div>
                    </div>

                    <!-- Variation Selectors -->
                    <div class="space-y-4">
                        <!-- For Regular Items (color and size) -->
                        <div v-if="itemType !== 'bearings'">
                            <!-- Color Selection -->
                            <div v-if="availableColors.length > 0">
                                <label class="block text-sm font-bold text-gray-700 mb-2">Color</label>
                                <div class="flex flex-wrap gap-2">
                                    <button v-for="color in availableColors" :key="color"
                                        @click="selectVariationByAttribute('color', color)" :class="[
                                            'px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200',
                                            selectedVariation?.color === color
                                                ? 'border-sky-500 bg-sky-50 text-sky-700'
                                                : 'border-gray-300 hover:border-sky-300 text-gray-700'
                                        ]">
                                        {{ color }}
                                    </button>
                                </div>
                            </div>

                            <!-- Size Selection -->
                            <div v-if="availableSizes.length > 0">
                                <label class="block text-sm font-bold text-gray-700 mb-2">Size</label>
                                <div class="flex flex-wrap gap-2">
                                    <button v-for="size in availableSizes" :key="size"
                                        @click="selectVariationByAttribute('size', size)" :class="[
                                            'px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200',
                                            selectedVariation?.size === size
                                                ? 'border-sky-500 bg-sky-50 text-sky-700'
                                                : 'border-gray-300 hover:border-sky-300 text-gray-700'
                                        ]">
                                        {{ size }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- For Bearings (ABEC rating, material, etc.) -->
                        <div v-else class="space-y-4">
                            <!-- ABEC Rating -->
                            <div v-if="availableAbecRatings.length > 0">
                                <label class="block text-sm font-bold text-gray-700 mb-2">ABEC Rating</label>
                                <div class="flex flex-wrap gap-2">
                                    <button v-for="rating in availableAbecRatings" :key="rating"
                                        @click="selectVariationByAttribute('abecRating', rating)" :class="[
                                            'px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200',
                                            selectedVariation?.abecRating === rating
                                                ? 'border-sky-500 bg-sky-50 text-sky-700'
                                                : 'border-gray-300 hover:border-sky-300 text-gray-700'
                                        ]">
                                        {{ rating }}
                                    </button>
                                </div>
                            </div>

                            <!-- Material -->
                            <div v-if="availableMaterials.length > 0">
                                <label class="block text-sm font-bold text-gray-700 mb-2">Material</label>
                                <div class="flex flex-wrap gap-2">
                                    <button v-for="material in availableMaterials" :key="material"
                                        @click="selectVariationByAttribute('material', material)" :class="[
                                            'px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200',
                                            selectedVariation?.material === material
                                                ? 'border-sky-500 bg-sky-50 text-sky-700'
                                                : 'border-gray-300 hover:border-sky-300 text-gray-700'
                                        ]">
                                        {{ material }}
                                    </button>
                                </div>
                            </div>

                            <!-- Pack Size -->
                            <div v-if="availablePackSizes.length > 0">
                                <label class="block text-sm font-bold text-gray-700 mb-2">Pack Size</label>
                                <div class="flex flex-wrap gap-2">
                                    <button v-for="packSize in availablePackSizes" :key="packSize"
                                        @click="selectVariationByAttribute('packSize', packSize)" :class="[
                                            'px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200',
                                            selectedVariation?.packSize === packSize
                                                ? 'border-sky-500 bg-sky-50 text-sky-700'
                                                : 'border-gray-300 hover:border-sky-300 text-gray-700'
                                        ]">
                                        {{ packSize }} Pack
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quantity Selector -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <div class="flex items-center space-x-4">
                            <button @click="decrementQuantity" :disabled="cartQuantity <= 1 || quantityUpdating" :class="[
                                'w-12 h-12 rounded-lg border-2 flex items-center justify-center font-semibold text-xl transition-all',
                                cartQuantity <= 1 || quantityUpdating
                                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                    : 'border-black text-black hover:bg-black hover:text-white'
                            ]">
                                -
                            </button>
                            <span class="text-2xl font-semibold text-black min-w-[3rem] text-center">
                                {{ cartQuantity }}
                            </span>
                            <button @click="incrementQuantity"
                                :disabled="cartQuantity >= selectedVariation.quantity || quantityUpdating" :class="[
                                    'w-12 h-12 rounded-lg border-2 flex items-center justify-center font-semibold text-xl transition-all',
                                    cartQuantity >= selectedVariation.quantity || quantityUpdating
                                        ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                        : 'border-black text-black hover:bg-black hover:text-white'
                                ]">
                                +
                            </button>
                        </div>
                        <p v-if="quantityMessage" class="mt-2 text-sm text-gray-600">
                            {{ quantityMessage }}
                        </p>
                    </div>


                    <!-- Stock Status -->
                    <div class="flex items-center gap-2">
                        <div v-if="selectedVariation?.availableQuantity > 0" class="flex items-center gap-2">
                            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span class="text-green-600 font-semibold">
                                {{ selectedVariation.availableQuantity > 5 ? 'In Stock' : `Only
                                ${selectedVariation.availableQuantity} left!` }}
                            </span>
                        </div>
                        <div v-else class="flex items-center gap-2">
                            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span class="text-red-600 font-semibold">Out of Stock</span>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button @click="handleBuyNow"
                            :disabled="!selectedVariation || selectedVariation.availableQuantity === 0" :class="[
                                'flex-1 py-4 px-8 rounded-xl font-bold text-lg transition-all duration-200 transform active:scale-95',
                                !selectedVariation || selectedVariation.availableQuantity === 0
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-600 hover:to-sky-700 shadow-lg hover:shadow-xl'
                            ]">
                            Buy Now
                        </button>
                        <button @click="handleAddToCart"
                            :disabled="!selectedVariation || selectedVariation.availableQuantity === 0" :class="[
                                'flex-1 py-4 px-8 rounded-xl font-bold text-lg border-2 transition-all duration-200 transform active:scale-95',
                                !selectedVariation || selectedVariation.availableQuantity === 0
                                    ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                                    : 'border-black text-black hover:bg-black hover:text-white shadow-md hover:shadow-lg'
                            ]">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            <!-- Product Details Tabs -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-12">
                <div class="border-b border-gray-200">
                    <div class="flex overflow-x-auto">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                            'px-6 py-4 font-semibold whitespace-nowrap transition-colors border-b-2',
                            activeTab === tab.id
                                ? 'border-sky-500 text-sky-600'
                                : 'border-transparent text-gray-600 hover:text-sky-600'
                        ]">
                            {{ tab.label }}
                        </button>
                    </div>
                </div>

                <div class="p-6 lg:p-8">
                    <!-- Description Tab -->
                    <div v-show="activeTab === 'description'" class="prose max-w-none">
                        <p class="text-gray-700 leading-relaxed text-lg">{{ product.detailedDescription }}</p>
                    </div>

                    <!-- Features Tab -->
                    <div v-show="activeTab === 'features'">
                        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <li v-for="(feature, index) in parsedFeatures" :key="index"
                                class="flex items-start gap-3 bg-sky-50 p-4 rounded-lg">
                                <svg class="w-6 h-6 text-sky-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span class="text-gray-800 font-medium">{{ feature }}</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Why Choose Tab -->
                    <div v-show="activeTab === 'why-choose'">
                        <ul class="space-y-3">
                            <li v-for="(reason, index) in parsedWhyChoose" :key="index"
                                class="flex items-start gap-3 bg-gradient-to-r from-sky-50 to-white p-4 rounded-lg border border-sky-100">
                                <span
                                    class="bg-sky-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                    {{ index + 1 }}
                                </span>
                                <span class="text-gray-800 font-medium text-lg">{{ reason }}</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Reviews Tab -->
                    <div v-show="activeTab === 'reviews'">
                        <div v-if="product.ratings.length > 0" class="space-y-4">
                            <div v-for="review in product.ratings" :key="review.id"
                                class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <div class="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 class="font-bold text-gray-900">{{ review.customerName }}</h4>
                                        <div class="flex items-center gap-2 mt-1">
                                            <div class="flex">
                                                <span v-for="star in 10" :key="star" class="text-sm"
                                                    :class="star <= review.rating ? 'text-amber-400' : 'text-gray-300'">
                                                    ★
                                                </span>
                                            </div>
                                            <span class="text-sm text-gray-600 font-medium">{{ review.rating
                                                }}/10</span>
                                        </div>
                                    </div>
                                    <span class="text-sm text-gray-500">{{ formatDate(review.ratingDate) }}</span>
                                </div>
                                <p class="text-gray-700 leading-relaxed">{{ review.comment }}</p>
                            </div>
                        </div>
                        <div v-else class="text-center py-12">
                            <p class="text-gray-500 text-lg">No reviews yet. Be the first to review this product!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductDetail',
    data() {
        return {
            product: null,
            loading: true,
            error: null,
            currentImage: null,
            selectedVariation: null,
            activeTab: 'description',
            cartQuantity: 1,
            quantityUpdating : false,
            quantityMessage : '',
            tabs: [
                { id: 'description', label: 'Description' },
                { id: 'features', label: 'Features' },
                { id: 'why-choose', label: 'Why Choose' },
                { id: 'reviews', label: 'Reviews' }
            ]
        };
    },
    computed: {
        itemVariationId() {
            return this.$route.params.itemVariationId;
        },
        itemType() {
            return this.$route.params.itemType;
        },
        parsedFeatures() {
            try {
                return JSON.parse(this.product.features || '[]');
            } catch {
                return [];
            }
        },
        parsedWhyChoose() {
            try {
                const parsed = JSON.parse(this.product.whyToChoose || '[]');
                return Array.isArray(parsed) ? parsed : [this.product.whyToChoose];
            } catch {
                return [this.product.whyToChoose];
            }
        },
        // For regular items
        availableColors() {
            if (this.itemType === 'bearings') return [];
            return [...new Set(this.product.variations.map(v => v.color))].filter(Boolean);
        },
        availableSizes() {
            if (this.itemType === 'bearings') return [];
            return [...new Set(this.product.variations.map(v => v.size))].filter(Boolean);
        },
        // For bearings
        availableAbecRatings() {
            if (this.itemType !== 'bearings') return [];
            return [...new Set(this.product.variations.map(v => v.abecRating))].filter(Boolean);
        },
        availableMaterials() {
            if (this.itemType !== 'bearings') return [];
            return [...new Set(this.product.variations.map(v => v.material))].filter(Boolean);
        },
        availablePackSizes() {
            if (this.itemType !== 'bearings') return [];
            return [...new Set(this.product.variations.map(v => v.packSize))].filter(Boolean);
        }
    },
    async mounted() {
        await this.fetchProductDetail();
    },
    methods: {
        async fetchProductDetail() {
            try {
                this.loading = true;
                const response = await fetch(
                    `http://localhost:3000/vsa/shop/product-detail/${this.itemVariationId}/${this.itemType}`
                );

                const data = await response.json();

                if (!data.success) {
                    this.error = data.message || 'Failed to load product';
                    return;
                }

                this.product = data.data;

                // Set selected variation
                this.selectedVariation = this.product.variations.find(
                    v => v.itemVariationId === this.product.selectedVariationId
                ) || this.product.variations[0];

                // Set initial image
                this.currentImage = this.selectedVariation.baseImagePath ||
                    (this.selectedVariation.images[0]?.imagePath) ||
                    this.product.mainImagePath;

            } catch (err) {
                this.error = 'Failed to load product details';
                console.error('Error fetching product:', err);
            } finally {
                this.loading = false;
            }
        },
        selectVariationByAttribute(attribute, value) {
            const variation = this.product.variations.find(v => v[attribute] === value);
            if (variation) {
                this.selectedVariation = variation;
                this.currentImage = variation.baseImagePath || variation.images[0]?.imagePath || this.product.mainImagePath;
            }
        },
        handleBuyNow() {
            console.log('Buy now:', this.selectedVariation);
            // Implement buy now logic
        },
        async handleAddToCart() {
            console.log('Add to cart:', this.selectedVariation);

            try {
                const response = await fetch("http://localhost:3000/vsa/shop/add-to-cart", {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        itemToAddToCart: {
                            itemId: this.product.itemId,
                            itemVariationId: this.selectedVariation.itemVariationId,
                            itemType: this.itemType,
                            quantity: this.cartQuantity
                        }
                    })
                });
        
                const data = await response.json();
        
                if (data.success) {
                alert('Item added to cart successfully!');
                } else {
                alert(data.message || 'Failed to add item to cart');
                }
            } catch (err) {
                console.error('Error adding to cart:', err);
                alert('Network error. Please try again.');
            } finally {
                this.addingToCart = false;
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },
        async incrementQuantity() {

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
                        itemId: this.product.itemId,
                        itemVariationId: this.selectedVariation.itemVariationId,
                        itemType: this.itemType,
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
            if (!this.selectedVariation || this.quantityUpdating) return;

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
                        itemId: this.product.itemId,
                        itemVariationId: this.selectedVariation.itemVariationId,
                        itemType: this.itemType,
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
    }
};
</script>

<style scoped>
/* Smooth scrolling for tabs on mobile */
.overflow-x-auto {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.overflow-x-auto::-webkit-scrollbar {
    display: none;
}

/* Animation for loading spinner */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

/* Animation for stock indicator */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>