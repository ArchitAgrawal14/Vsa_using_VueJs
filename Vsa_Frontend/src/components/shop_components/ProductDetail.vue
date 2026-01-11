<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-sky-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div
          class="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"
        ></div>
        <p class="mt-4 text-gray-600 font-medium">Loading product details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen p-4">
      <div class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div
          class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button
          @click="$router.go(-1)"
          class="bg-sky-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>

    <!-- Product Detail Content -->
    <div v-else-if="product" class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Breadcrumb -->
      <nav class="mb-6 flex items-center gap-2 text-sm flex-wrap">
        <button
          @click="$router.push('/')"
          class="text-gray-500 hover:text-sky-600 transition-colors"
        >
          Home
        </button>
        <span class="text-gray-400">/</span>
        <button @click="$router.go(-1)" class="text-gray-500 hover:text-sky-600 transition-colors">
          Products
        </button>
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
              class="aspect-square bg-gradient-to-br from-sky-50 to-gray-50 flex items-center justify-center"
            >
              <img
                :src="'http://localhost:3000' + currentImage"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- Thumbnail Gallery -->
          <div
            v-if="selectedVariation && selectedVariation.images.length > 0"
            class="grid grid-cols-4 sm:grid-cols-5 gap-3"
          >
            <button
              v-for="(image, index) in selectedVariation.images"
              :key="index"
              @click="currentImage = image.imagePath"
              :class="[
                'aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200',
                currentImage === image.imagePath
                  ? 'border-sky-500 ring-2 ring-sky-200'
                  : 'border-gray-200 hover:border-sky-300',
              ]"
            >
              <img
                :src="'http://localhost:3000' + image.imagePath"
                :alt="`${product.name} view ${index + 1}`"
                class="w-full h-full object-cover"
              />
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
                <span
                  v-for="star in 5"
                  :key="star"
                  class="text-lg"
                  :class="
                    star <= Math.round(product.averageRating) ? 'text-amber-400' : 'text-gray-300'
                  "
                >
                  ★
                </span>
              </div>
              <span class="text-gray-600 font-medium">{{ product.averageRating }} / 10</span>
              <span class="text-gray-400">•</span>
              <span class="text-sky-600 font-medium">{{ product.ratings.length }} Reviews</span>
            </div>

            <p class="text-gray-600 text-lg">{{ product.shortDescription }}</p>
          </div>

          <!-- Price with Customizations -->
          <div class="bg-gradient-to-br from-sky-50 to-white p-6 rounded-xl border border-sky-100">
            <div class="space-y-3">
              <div class="flex items-baseline gap-3">
                <span
                  class="text-4xl font-black bg-gradient-to-r from-sky-600 to-sky-800 bg-clip-text text-transparent"
                >
                  ₹{{ selectedVariation?.currentPrice }}
                </span>
                <span
                  v-if="
                    selectedVariation?.oldPrice &&
                    selectedVariation?.currentPrice < selectedVariation?.oldPrice
                  "
                  class="text-xl text-gray-400 line-through"
                >
                  ₹{{ selectedVariation?.oldPrice }}
                </span>
              </div>

              <div v-if="selectedVariation?.discount > 0" class="flex items-center gap-2">
                <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                  {{ selectedVariation.discount }}% OFF
                </span>
                <span class="text-green-600 font-semibold">
                  Save ₹{{
                    (selectedVariation.oldPrice - selectedVariation.currentPrice).toFixed(2)
                  }}
                </span>
              </div>

              <!-- Price Breakdown -->
              <div
                v-if="hasCustomizations || cartQuantity > 1"
                class="pt-3 border-t border-sky-200 space-y-2 text-sm"
              >
                <div class="flex justify-between text-gray-700">
                  <span>Base Price × {{ cartQuantity }}</span>
                  <span class="font-semibold"
                    >₹{{ (selectedVariation?.currentPrice * cartQuantity).toFixed(2) }}</span
                  >
                </div>
                <div v-if="customizationTotal > 0" class="flex justify-between text-sky-700">
                  <span>Customizations</span>
                  <span class="font-semibold">+₹{{ customizationTotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between pt-2 border-t border-sky-200 text-lg font-bold">
                  <span>Total</span>
                  <span class="text-sky-600">₹{{ totalPrice.toFixed(2) }}</span>
                </div>
              </div>
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
                  <button
                    v-for="color in availableColors"
                    :key="color"
                    @click="selectVariationByAttribute('color', color)"
                    :class="[
                      'px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200',
                      selectedVariation?.color === color
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-gray-300 hover:border-sky-300 text-gray-700',
                    ]"
                  >
                    {{ color }}
                  </button>
                </div>
              </div>

              <!-- Size Selection -->
              <div v-if="availableSizes.length > 0">
                <label class="block text-sm font-bold text-gray-700 mb-2">Size</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="size in availableSizes"
                    :key="size"
                    @click="selectVariationByAttribute('size', size)"
                    :class="[
                      'px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200',
                      selectedVariation?.size === size
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-gray-300 hover:border-sky-300 text-gray-700',
                    ]"
                  >
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
                  <button
                    v-for="rating in availableAbecRatings"
                    :key="rating"
                    @click="selectVariationByAttribute('abecRating', rating)"
                    :class="[
                      'px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200',
                      selectedVariation?.abecRating === rating
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-gray-300 hover:border-sky-300 text-gray-700',
                    ]"
                  >
                    {{ rating }}
                  </button>
                </div>
              </div>

              <!-- Material -->
              <div v-if="availableMaterials.length > 0">
                <label class="block text-sm font-bold text-gray-700 mb-2">Material</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="material in availableMaterials"
                    :key="material"
                    @click="selectVariationByAttribute('material', material)"
                    :class="[
                      'px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200',
                      selectedVariation?.material === material
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-gray-300 hover:border-sky-300 text-gray-700',
                    ]"
                  >
                    {{ material }}
                  </button>
                </div>
              </div>

              <!-- Pack Size -->
              <div v-if="availablePackSizes.length > 0">
                <label class="block text-sm font-bold text-gray-700 mb-2">Pack Size</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="packSize in availablePackSizes"
                    :key="packSize"
                    @click="selectVariationByAttribute('packSize', packSize)"
                    :class="[
                      'px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200',
                      selectedVariation?.packSize === packSize
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-gray-300 hover:border-sky-300 text-gray-700',
                    ]"
                  >
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
              <button
                @click="decrementQuantity"
                :disabled="cartQuantity <= 1 || quantityUpdating"
                :class="[
                  'w-9 h-9 rounded-lg border-2 flex items-center justify-center font-semibold text-xl leading-[1] transition-all',
                  cartQuantity <= 1 || quantityUpdating
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-black text-black hover:bg-black hover:text-white',
                ]"
              >
                <span class="relative top-[-1px]">−</span>
              </button>
              <span class="text-2xl font-semibold text-black min-w-[3rem] text-center">
                {{ cartQuantity }}
              </span>
              <button
                @click="incrementQuantity"
                :disabled="cartQuantity >= selectedVariation.quantity || quantityUpdating"
                :class="[
                  'w-9 h-9 rounded-lg border-2 flex items-center justify-center font-semibold text-xl leading-[1] transition-all',
                  cartQuantity >= selectedVariation.quantity || quantityUpdating
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-black text-black hover:bg-black hover:text-white',
                ]"
              >
                <span class="relative top-[-1px]">+</span>
              </button>
            </div>
            <p v-if="quantityMessage" class="mt-2 text-sm text-gray-600">
              {{ quantityMessage }}
            </p>
          </div>

          <!-- Customizations Section -->
          <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <button
              @click="toggleCustomizations"
              class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center gap-3">
                <svg
                  class="w-6 h-6 text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  ></path>
                </svg>
                <span class="text-base font-bold text-gray-900">Customize Your Product</span>
              </div>
              <svg
                :class="[
                  'w-5 h-5 text-gray-500 transition-transform duration-200',
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
                class="border-t border-gray-200 p-4 space-y-4 bg-gradient-to-br from-sky-50 to-white"
              >
                <!-- Name Print -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">
                    <span class="flex items-center justify-between">
                      <span>Name Print</span>
                      <span class="text-sky-600"
                        >+₹{{ customizationOptions.name_print.extraPrice }}</span
                      >
                    </span>
                  </label>
                  <input
                    type="text"
                    @input="updateCustomization('name_print', $event.target.value)"
                    maxlength="255"
                    placeholder="Enter name to print"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <!-- Color Strip -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">
                    <span class="flex items-center justify-between">
                      <span>Color Strip</span>
                      <span class="text-sky-600"
                        >+₹{{ customizationOptions.color_strip.extraPrice }}</span
                      >
                    </span>
                  </label>
                  <select
                    @change="updateCustomization('color_strip', $event.target.value)"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
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
                </div>

                <!-- Custom Text -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">
                    <span class="flex items-center justify-between">
                      <span>Custom Text</span>
                      <span class="text-sky-600">+₹{{ customizationOptions.text.extraPrice }}</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    @input="updateCustomization('text', $event.target.value)"
                    maxlength="255"
                    placeholder="Enter custom text"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <!-- Number -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">
                    <span class="flex items-center justify-between">
                      <span>Number</span>
                      <span class="text-sky-600"
                        >+₹{{ customizationOptions.number.extraPrice }}</span
                      >
                    </span>
                  </label>
                  <input
                    type="number"
                    @input="updateCustomization('number', $event.target.value)"
                    placeholder="Enter number"
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <!-- Custom Color -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">
                    <span class="flex items-center justify-between">
                      <span>Custom Color</span>
                      <span class="text-sky-600"
                        >+₹{{ customizationOptions.custom_color.extraPrice }}</span
                      >
                    </span>
                  </label>
                  <div class="flex gap-3 items-center">
                    <input
                      type="color"
                      @input="updateCustomization('custom_color', $event.target.value)"
                      class="w-20 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                    />
                    <span
                      v-if="customizations.custom_color"
                      class="text-sm text-gray-600 font-mono"
                    >
                      {{ customizations.custom_color.value }}
                    </span>
                  </div>
                </div>

                <!-- Customization Summary -->
                <div
                  v-if="hasCustomizations"
                  class="bg-white rounded-lg p-4 border-2 border-sky-200"
                >
                  <p class="text-sm font-bold text-sky-900 mb-3 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Selected Customizations
                  </p>
                  <ul class="space-y-2">
                    <li
                      v-for="(custom, type) in customizations"
                      :key="type"
                      class="flex items-center justify-between text-sm"
                    >
                      <span class="text-gray-700 font-medium">
                        {{ customizationOptions[type].label }}:
                        <span class="text-sky-600">{{ custom.value }}</span>
                      </span>
                      <span class="text-gray-900 font-bold">+₹{{ custom.extraPrice }}</span>
                    </li>
                  </ul>
                  <div class="mt-3 pt-3 border-t border-sky-200 flex items-center justify-between">
                    <span class="text-sm font-bold text-gray-700">Customization Total:</span>
                    <span class="text-lg font-bold text-sky-600"
                      >₹{{ customizationTotal.toFixed(2) }}</span
                    >
                  </div>
                </div>
              </div>
            </transition>
          </div>
          <!-- Stock Status -->
          <div class="flex items-center gap-2">
            <div v-if="selectedVariation?.availableQuantity > 0" class="flex items-center gap-2">
              <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-green-600 font-semibold">
                {{
                  selectedVariation.availableQuantity > 5
                    ? 'In Stock'
                    : `Only
                                ${selectedVariation.availableQuantity} left!`
                }}
              </span>
            </div>
            <div v-else class="flex items-center gap-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <span class="text-red-600 font-semibold">Out of Stock</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              @click="handleBuyNow"
              :disabled="!selectedVariation || selectedVariation.availableQuantity === 0"
              :class="[
                'flex-1 py-4 px-8 rounded-xl font-bold text-lg transition-all duration-200 transform active:scale-95',
                !selectedVariation || selectedVariation.availableQuantity === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-600 hover:to-sky-700 shadow-lg hover:shadow-xl',
              ]"
            >
              Buy Now
            </button>
            <button
              @click="handleAddToCart"
              :disabled="!selectedVariation || selectedVariation.availableQuantity === 0"
              :class="[
                'flex-1 py-4 px-8 rounded-xl font-bold text-lg border-2 transition-all duration-200 transform active:scale-95',
                !selectedVariation || selectedVariation.availableQuantity === 0
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'border-black text-black hover:bg-black hover:text-white shadow-md hover:shadow-lg',
              ]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <!-- Product Details Sections -->
      <div class="space-y-8 mb-12">
        <!-- Description Section -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-100">
          <div class="bg-indigo-600 px-6 py-5">
            <div class="flex items-center gap-3">
              <div class="bg-white/20 p-2 rounded-lg">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  ></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-white">Product Description</h2>
            </div>
          </div>
          <div class="p-6 lg:p-8 bg-gradient-to-br from-indigo-50/30 to-white">
            <div class="bg-white rounded-xl p-6 border border-indigo-100 shadow-sm">
              <p class="text-gray-700 leading-relaxed text-lg">{{ product.detailedDescription }}</p>
            </div>
          </div>
        </div>

        <!-- Features Section -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100">
          <div class="bg-emerald-600 px-6 py-5">
            <div class="flex items-center gap-3">
              <div class="bg-white/20 p-2 rounded-lg">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-white">Key Features</h2>
            </div>
          </div>
          <div class="p-6 lg:p-8 bg-gradient-to-br from-emerald-50/30 to-white">
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li
                v-for="(feature, index) in parsedFeatures"
                :key="index"
                class="flex items-start gap-3 bg-white p-5 rounded-xl border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-200 hover:shadow-md group"
              >
                <div
                  class="bg-emerald-100 p-2 rounded-lg group-hover:bg-emerald-200 transition-colors"
                >
                  <svg
                    class="w-5 h-5 text-emerald-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <span class="text-gray-800 font-medium pt-1">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Why Choose Section -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100">
          <div class="bg-amber-600 px-6 py-5">
            <div class="flex items-center gap-3">
              <div class="bg-white/20 p-2 rounded-lg">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  ></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-white">Why Choose This Product</h2>
            </div>
          </div>
          <div class="p-6 lg:p-8 bg-gradient-to-br from-amber-50/30 to-white">
            <ul class="space-y-4">
              <li
                v-for="(reason, index) in parsedWhyChoose"
                :key="index"
                class="flex items-start gap-4 bg-white p-5 rounded-xl border-2 border-amber-100 hover:border-amber-300 transition-all duration-200 hover:shadow-md group"
              >
                <div class="flex-shrink-0">
                  <div
                    class="bg-amber-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform"
                  >
                    {{ index + 1 }}
                  </div>
                </div>
                <span class="text-gray-800 font-medium text-lg pt-1">{{ reason }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Reviews Section -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100">
          <div class="bg-purple-600 px-6 py-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="bg-white/20 p-2 rounded-lg">
                  <svg
                    class="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-white">Customer Reviews</h2>
              </div>
              <span
                v-if="product.ratings.length > 0"
                class="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold"
              >
                {{ product.ratings.length }}
                {{ product.ratings.length === 1 ? 'Review' : 'Reviews' }}
              </span>
            </div>
          </div>
          <div class="p-6 lg:p-8 bg-gradient-to-br from-purple-50/30 to-white">
            <div v-if="product.ratings.length > 0" class="space-y-4">
              <div
                v-for="review in product.ratings"
                :key="review.id"
                class="bg-white rounded-xl p-6 border-2 border-purple-100 hover:border-purple-300 transition-all duration-200 hover:shadow-md"
              >
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <div class="flex items-center gap-3 mb-2">
                      <div class="bg-purple-100 p-2 rounded-full">
                        <svg
                          class="w-5 h-5 text-purple-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                          ></path>
                        </svg>
                      </div>
                      <h4 class="font-bold text-gray-900 text-lg">{{ review.customerName }}</h4>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="flex bg-amber-50 px-3 py-1 rounded-lg">
                        <span
                          v-for="star in 10"
                          :key="star"
                          class="text-lg"
                          :class="star <= review.rating ? 'text-amber-400' : 'text-gray-300'"
                        >
                          ★
                        </span>
                      </div>
                      <span class="text-sm text-gray-600 font-bold bg-gray-100 px-3 py-1 rounded-lg"
                        >{{ review.rating }}/10</span
                      >
                    </div>
                  </div>
                  <span
                    class="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg font-medium"
                    >{{ formatDate(review.ratingDate) }}</span
                  >
                </div>
                <p class="text-gray-700 leading-relaxed pl-14">{{ review.comment }}</p>
              </div>
            </div>
            <div v-else class="text-center py-16">
              <div
                class="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-10 h-10 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  ></path>
                </svg>
              </div>
              <p class="text-gray-700 text-xl font-bold mb-2">No reviews yet</p>
              <p class="text-gray-500 text-sm">
                Be the first to share your experience with this product!
              </p>
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
      cartQuantity: 1,
      quantityUpdating: false,
      quantityMessage: '',
      customizations: {},
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
      showCustomizations: false,
      customizationTotal: 0,
    }
  },
  computed: {
    itemVariationId() {
      return this.$route.params.itemVariationId
    },
    itemType() {
      return this.$route.params.itemType
    },
    parsedFeatures() {
      try {
        return JSON.parse(this.product.features || '[]')
      } catch {
        return []
      }
    },
    parsedWhyChoose() {
      try {
        const parsed = JSON.parse(this.product.whyToChoose || '[]')
        return Array.isArray(parsed) ? parsed : [this.product.whyToChoose]
      } catch {
        return [this.product.whyToChoose]
      }
    },
    // For regular items
    availableColors() {
      if (this.itemType === 'bearings') return []
      return [...new Set(this.product.variations.map((v) => v.color))].filter(Boolean)
    },
    availableSizes() {
      if (this.itemType === 'bearings') return []
      return [...new Set(this.product.variations.map((v) => v.size))].filter(Boolean)
    },
    // For bearings
    availableAbecRatings() {
      if (this.itemType !== 'bearings') return []
      return [...new Set(this.product.variations.map((v) => v.abecRating))].filter(Boolean)
    },
    availableMaterials() {
      if (this.itemType !== 'bearings') return []
      return [...new Set(this.product.variations.map((v) => v.material))].filter(Boolean)
    },
    availablePackSizes() {
      if (this.itemType !== 'bearings') return []
      return [...new Set(this.product.variations.map((v) => v.packSize))].filter(Boolean)
    },
    totalPrice() {
      if (!this.selectedVariation) return 0
      const basePrice = this.selectedVariation.currentPrice * this.cartQuantity
      return basePrice + this.customizationTotal
    },

    hasCustomizations() {
      return Object.keys(this.customizations).length > 0
    },
  },
  async mounted() {
    await this.fetchProductDetail()
  },
  methods: {
    async fetchProductDetail() {
      try {
        this.loading = true
        const response = await fetch(
          `http://localhost:3000/vsa/shop/product-detail/${this.itemVariationId}/${this.itemType}`,
        )

        const data = await response.json()

        if (!data.success) {
          this.error = data.message || 'Failed to load product'
          return
        }

        this.product = data.data

        // Set selected variation
        this.selectedVariation =
          this.product.variations.find(
            (v) => v.itemVariationId === this.product.selectedVariationId,
          ) || this.product.variations[0]

        // Set initial image
        this.currentImage =
          this.selectedVariation.baseImagePath ||
          this.selectedVariation.images[0]?.imagePath ||
          this.product.mainImagePath
      } catch (err) {
        this.error = 'Failed to load product details'
        console.error('Error fetching product:', err)
      } finally {
        this.loading = false
      }
    },
    selectVariationByAttribute(attribute, value) {
      const variation = this.product.variations.find((v) => v[attribute] === value)
      if (variation) {
        this.selectedVariation = variation
        this.currentImage =
          variation.baseImagePath || variation.images[0]?.imagePath || this.product.mainImagePath
        this.resetCustomizations()
      }
    },
    handleBuyNow() {
      console.log('Buy now:', this.selectedVariation)
      // Implement buy now logic
    },
    async handleAddToCart() {
      console.log('Add to cart:', this.selectedVariation)

      try {
        const response = await fetch('http://localhost:3000/vsa/shop/add-to-cart', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            itemToAddToCart: {
              itemId: this.product.itemId,
              itemVariationId: this.selectedVariation.itemVariationId,
              itemType: this.itemType,
              quantity: this.cartQuantity,
              customizations: this.hasCustomizations ? this.customizations : undefined,
            },
          }),
        })

        const data = await response.json()

        if (data.success) {
          alert('Item added to cart successfully!')
        } else {
          alert(data.message || 'Failed to add item to cart')
        }
      } catch (err) {
        console.error('Error adding to cart:', err)
        alert('Network error. Please try again.')
      } finally {
        this.addingToCart = false
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
    async incrementQuantity() {
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
            itemId: this.product.itemId,
            itemVariationId: this.selectedVariation.itemVariationId,
            itemType: this.itemType,
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
      if (!this.selectedVariation || this.quantityUpdating) return

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
            itemId: this.product.itemId,
            itemVariationId: this.selectedVariation.itemVariationId,
            itemType: this.itemType,
            isIncrement: false,
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
}
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

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
