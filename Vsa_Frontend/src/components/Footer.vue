<template>
  <footer class="bg-white text-gray-900 relative overflow-hidden border-t border-gray-200">
    <!-- Animated skating background elements -->
    <div class="absolute inset-0 opacity-10">
      <div class="skating-icon" v-for="n in 8" :key="n" :style="getRandomPosition()">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-skating text-blue-500">
          <!-- Ice skate icon -->
          <path d="M2 18h20l-2-6H4l-2 6z"/>
          <path d="M6 12V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/>
          <path d="M4 18v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
          <circle cx="8" cy="8" r="1"/>
          <circle cx="16" cy="8" r="1"/>
        </svg>
      </div>
      <div class="snowflake" v-for="n in 12" :key="'snow-' + n" :style="getSnowflakePosition()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-blue-200">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
    </div>

    <div class="container mx-auto px-4 py-16 relative z-10">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <div class="flex justify-center items-center mb-6">
            <img
                :src="skateIconPath"
                alt="Ice Skate Icon"
                class="w-12 h-13 object-contain mr-4 logo-icon"
            />
            <h2 class="text-4xl font-bold text-gray-900">Vaibhav Skating Academy</h2>
        </div>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Glide into excellence with premium skating gear and world-class training
        </p>
      </div>

      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
        
        <!-- Contact Us Section -->
        <div class="footer-section bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div class="flex items-center mb-4">
            <svg class="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <h3 class="text-xl font-bold text-gray-900">Contact Us</h3>
          </div>
          <div class="space-y-4">
            <div class="flex items-start space-x-3 group">
              <svg class="w-5 h-5 text-blue-500 mt-0.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <a href="mailto:info@vaibhavskatingacademy.com" class="text-gray-700 hover:text-blue-600 hover:underline transition-colors">
                 Mail Us
              </a>
            </div>
            <div class="flex items-start space-x-3 group">
                <svg
                    class="w-5 h-5 text-green-500 mt-0.5 group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                    />
                </svg>
                <div class="flex flex-col space-y-1">
                    <a
                    href="tel:+919301139998"
                    class="text-m text-gray-700 hover:text-green-600 hover:underline transition-colors"
                    >
                    9301139998
                    </a>
                    <a
                    href="tel:+919753869938"
                    class="text-m text-gray-700 hover:text-green-600 hover:underline transition-colors"
                    >
                    9753869938
                    </a>
                </div>
            </div>
            <div class="flex items-start space-x-3 group">
              <svg class="w-5 h-5 text-red-500 mt-0.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
              </svg>
              <a href="https://maps.app.goo.gl/MSeH18NH33EmMJVF7" class="text-gray-700 hover:text-red-600 hover:underline transition-colors">
                Vaibhav Skating Academy, Shri Rama Krishna College, Near BJP Office<br>
                <span class="text-sm text-gray-500">Bharhut Nagar, Satna, 485001</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Policy's -->
        <div class="footer-section bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div class="flex items-center mb-4">
            <svg class="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            <h3 class="text-xl font-bold text-gray-900">Policy's</h3>
          </div>
          <nav class="space-y-3">
            <a @click="navigateTo('/return-policy')" class="flex items-center text-gray-700 hover:text-purple-600 transition-all duration-300 group">
              <svg class="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
              Return policy
            </a>
            <a @click="navigateTo('/terms-and-conditions')" class="flex items-center text-gray-700 hover:text-purple-600 transition-all duration-300 group">
              <svg class="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
              Terms & Conditions
            </a>
            <a @click="navigateTo('/privacy-policy')" class="flex items-center text-gray-700 hover:text-purple-600 transition-all duration-300 group">
              <svg class="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
              Privacy policy
            </a>
            <a @click="navigateTo('/shipping-policy')" class="flex items-center text-gray-700 hover:text-purple-600 transition-all duration-300 group">
              <svg class="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
              Shipping policy
            </a>
            <a @click="navigateTo('/cancellation-refunds')" class="flex items-center text-gray-700 hover:text-purple-600 transition-all duration-300 group">
              <svg class="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
              Cancellation & Refunds
            </a>
          </nav>
        </div>

        <!-- Skating Gear -->
        <div class="footer-section bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div class="flex items-center mb-4">
                <svg class="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <h3 class="text-xl font-bold text-gray-900">Skating Gear</h3>
            </div>
            <nav class="space-y-3">
                <a href="/skates-and-boots" class="flex items-center text-gray-700 hover:text-green-600 transition-all duration-300 group">
                    <svg class="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    Skates and boots
                </a>
                <a href="/helmets" class="flex items-center text-gray-700 hover:text-green-600 transition-all duration-300 group">
                    <svg class="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                    Helmets
                </a>
                <a href="/bearing" class="flex items-center text-gray-700 hover:text-green-600 transition-all duration-300 group">
                    <svg class="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m10-10h-4M6 12H2"/>
                    </svg>
                    Bearing
                </a>
                <a href="/wheels" class="flex items-center text-gray-700 hover:text-green-600 transition-all duration-300 group">
                    <svg class="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="2"/>
                        <circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Wheels
                </a>
                <a href="/accessories" class="flex items-center text-gray-700 hover:text-green-600 transition-all duration-300 group">
                    <svg class="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                    </svg>
                    Accessories
                </a>
            </nav>
        </div>
        <!-- Newsletter -->
        <div class="footer-section bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div class="flex items-center mb-4">
            <svg class="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            <h3 class="text-xl font-bold text-gray-900">Stay Updated</h3>
          </div>
          <p class="text-gray-600 mb-4 text-sm leading-relaxed">
            Get the latest skating tips, gear reviews, and academy news delivered to your inbox!
          </p>
          <form @submit.prevent="subscribeNewsletter" class="space-y-4">
            <div class="relative">
              <input
                v-model="email"
                type="email"
                placeholder="Enter your email"
                required
                class="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span v-if="!isLoading" class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                Subscribe Now
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subscribing...
              </span>
            </button>
          </form>
        </div>
      </div>

      <!-- Social Media & Links -->
      <div class="border-t border-gray-200 pt-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <!-- Social Media -->
          <div class="text-center lg:text-left">
            <h4 class="text-lg font-semibold mb-4 text-gray-900">Follow Our Journey</h4>
            <div class="flex space-x-3 justify-center lg:justify-start">
                <!-- Facebook -->
                <a href="https://www.facebook.com/vaibhavskating?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer"
                class="social-link bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg">
                <img :src="facebookLogoIconPath" alt="Facebook" class="w-5 h-5">
                </a>

                <!-- Instagram -->
                <a href="https://instagram.com/vaibhavskatingacademy?igshid=NGVhN2U2NjQ0Yg==" target="_blank" rel="noopener noreferrer"
                class="social-link bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg">
                <img :src="instaLogoIconPath" alt="Instagram" class="w-5 h-5">
                </a>

                <!-- YouTube -->
                <a href="https://youtube.com/@vaibhavskatingacademy2986?si=p0SfAinyjSgrdstE" target="_blank" rel="noopener noreferrer"
                class="social-link bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg">
                <img :src="youtubeLogoIconPath" alt="YouTube" class="w-5 h-5">
                </a>

                <!-- LinkedIn -->
                <a href="https://www.linkedin.com/in/vaibhav-skating-academy-a59727331/" target="_blank" rel="noopener noreferrer"
                class="social-link bg-blue-800 hover:bg-blue-900 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg">
                <img :src="linkedInLogoIconPath" alt="LinkedIn" class="w-5 h-5">
                </a>

                <!-- X (Twitter) -->
                <a href="https://x.com/vaibhavskating" target="_blank" rel="noopener noreferrer"
                class="social-link bg-black hover:bg-gray-800 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg">
                <img :src="xLogoIconPath" alt="X" class="w-5 h-5">
                </a>
            </div>
        </div>
          <!-- Quick Links -->
          <div class="text-center">
            <div class="flex flex-wrap justify-center gap-4 text-sm">
              <a href="/about" class="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="/contact" class="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              <a href="/faq" class="text-gray-600 hover:text-blue-600 transition-colors">FAQ</a>
              <a href="/privacy" class="text-gray-600 hover:text-blue-600 transition-colors">Privacy</a>
              <a href="/terms" class="text-gray-600 hover:text-blue-600 transition-colors">Terms</a>              
            </div>
          </div>
          
          <!-- Copyright -->
          <div class="text-center lg:text-right">
            <p class="text-gray-600 text-sm font-medium">
              © 2024 Skating Academy
              <br>
              @Powered By Coach Vaibhav Agrawal.
            </p>
            <p class="text-gray-500 text-xs mt-1">
              Excellence on Ice and Roller skating Since 2002
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="fixed bottom-6 right-6 z-50 max-w-sm">
        <div :class="toastClass" class="px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 backdrop-blur-sm">
          <div class="flex-shrink-0">
            <svg v-if="toastType === 'success'" class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-medium text-sm">{{ toastMessage }}</p>
          </div>
          <button @click="showToast = false" class="flex-shrink-0 text-gray-400 hover:text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      email: '',
      isLoading: false,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      skateIconPath: '/icons/VSA_logo.png',
      xLogoIconPath: '/icons/X logo.jpg',
      linkedInLogoIconPath: '/icons/linkedIn_logo.jpg',
      youtubeLogoIconPath: '/icons/youtube_logo.jpg',
      instaLogoIconPath: '/icons/insta logo.jpg',
      facebookLogoIconPath: '/icons/facebook logo.png'
    }
  },
  computed: {
    toastClass() {
      return this.toastType === 'success' 
        ? 'bg-white/90 text-gray-900 border border-green-200 shadow-green-100'
        : 'bg-white/90 text-gray-900 border border-red-200 shadow-red-100'
    }
  },
  methods: {
    async subscribeNewsletter() {
      this.isLoading = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Simulate success/failure (85% success rate)
        const success = Math.random() > 0.15
        
        if (success) {
          this.showToastMessage('🎉 Welcome to the Skating Academy family!', 'success')
          this.email = ''
        } else {
          this.showToastMessage('❄️ Oops! Please try again later.', 'error')
        }
      } catch (error) {
        this.showToastMessage('⚠️ Something went wrong. Please try again.', 'error')
      } finally {
        this.isLoading = false
      }
    },
    
    showToastMessage(message, type) {
      this.toastMessage = message
      this.toastType = type
      this.showToast = true
      
      setTimeout(() => {
        this.showToast = false
      }, 5000)
    },
    
    getRandomPosition() {
      return {
        top: Math.random() * 80 + 10 + '%',
        left: Math.random() * 80 + 10 + '%',
        animationDelay: Math.random() * 8 + 's',
        animationDuration: (Math.random() * 15 + 20) + 's'
      }
    },
    
    getSnowflakePosition() {
      return {
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 5 + 's',
        animationDuration: (Math.random() * 10 + 8) + 's'
      }
    },

    navigateTo(path) {
      this.$router.push(path);      
    },

  }
}
</script>

<style scoped>
.logo-icon {
  height: 45px;
  width: auto;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.footer-section {
  @apply transform transition-all duration-300;
}

.footer-section:hover {
  @apply -translate-y-1;
}

.social-link {
  @apply shadow-lg;
}

.social-link:hover {
  @apply shadow-xl;
}

/* Skating Animation */
@keyframes skating {
  0% {
    transform: translateX(-10px) translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateX(5px) translateY(-5px) rotate(10deg);
  }
  50% {
    transform: translateX(10px) translateY(0px) rotate(0deg);
  }
  75% {
    transform: translateX(-5px) translateY(5px) rotate(-10deg);
  }
  100% {
    transform: translateX(-10px) translateY(0px) rotate(0deg);
  }
}

@keyframes snowfall {
  0% {
    transform: translateY(-100vh) translateX(0px) rotate(0deg);
  }
  100% {
    transform: translateY(100vh) translateX(50px) rotate(360deg);
  }
}

.animate-skating {
  animation: skating 12s ease-in-out infinite;
}

.skating-icon {
  position: absolute;
  animation: skating 15s ease-in-out infinite;
}

.snowflake {
  position: absolute;
  animation: snowfall 10s linear infinite;
}

/* Toast Transitions */
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  transform: translateX(100%) scale(0.8);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%) scale(0.8);
  opacity: 0;
}

/* Enhanced Hover Effects */
.footer-section a {
  @apply relative;
}

.footer-section a::before {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background: linear-gradient(90deg, #3B82F6, #8B5CF6);
  transition: width 0.3s ease;
}

.footer-section a:hover::before {
  width: 100%;
}

/* Input Enhanced Styling */
input:focus {
  @apply transform scale-105 shadow-lg;
}

/* Button Enhanced Effects */
button:hover:not(:disabled) {
  @apply shadow-xl;
}

/* Mobile Responsive Improvements */
@media (max-width: 640px) {
  .footer-section {
    @apply text-center mb-8;
  }
  
  .social-link {
    @apply mx-2;
  }
  
  .skating-icon {
    @apply hidden;
  }
}

@media (max-width: 768px) {
  .grid {
    @apply gap-6;
  }
  
  .footer-section {
    @apply p-4;
  }

  .logo-icon {
    height: 35px;
  }
}

/* Accessibility and Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .animate-skating,
  .skating-icon,
  .snowflake {
    animation: none;
  }
  
  .transform {
    transform: none !important;
  }
  
  .transition-all {
    transition: none !important;
  }
}

/* Print Styles */
@media print {
  .footer-section {
    @apply shadow-none border border-gray-300;
  }
  
  .skating-icon,
  .snowflake {
    @apply hidden;
  }
}

/* Dark Mode Support (if needed) */
@media (prefers-color-scheme: dark) {
  .footer-section {
    @apply bg-gray-50;
  }
}

/* Focus Indicators for Accessibility */
a:focus,
button:focus,
input:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

/* High Contrast Support */
@media (prefers-contrast: high) {
  .footer-section {
    @apply border-2 border-gray-900;
  }
}
</style>