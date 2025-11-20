<template>
  <div class="min-h-screen bg-white">
    <!-- Header Section with Skating Elements -->
    <div class="relative overflow-hidden bg-white border-b border-gray-200">
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-10 left-10 text-black text-6xl">⛸️</div>
        <div class="absolute bottom-10 right-20 text-black text-5xl transform rotate-12">🛼</div>
        <div class="absolute top-20 right-10 text-black text-4xl">⛸️</div>
        <div class="absolute bottom-20 left-20 text-black text-5xl transform -rotate-12">🛼</div>
      </div>
      
      <div class="relative container mx-auto px-4 py-16 sm:py-20 lg:py-24">
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-4 tracking-tight">
            Meet Our <span class="text-gray-700">Expert Coaches</span>
          </h1>
          <p class="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
            World-class instructors dedicated to helping you master the art of skating
          </p>
          <div class="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
            <span class="flex items-center gap-2">
              <span class="text-2xl">⛸️</span>
              Ice Skating
            </span>
            <span class="w-px h-4 bg-gray-700"></span>
            <span class="flex items-center gap-2">
              <span class="text-2xl">🛼</span>
              Roller Skating
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-16">
      <div class="flex flex-col items-center justify-center min-h-[400px]">
        <div class="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600 text-lg">Loading our amazing coaches...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-16">
      <div class="max-w-md mx-auto bg-white border-2 border-red-200 rounded-lg p-8 text-center shadow-lg">
        <div class="text-red-500 text-5xl mb-4">⚠️</div>
        <h3 class="text-xl font-semibold text-black mb-2">Oops! Something went wrong</h3>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button 
          @click="fetchCoaches"
          class="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Coaches Grid -->
    <div v-else class="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
      <!-- Stats Bar -->
      <div class="mb-12 flex justify-center">
        <div class="inline-flex items-center gap-3 bg-black border border-gray-800 rounded-full px-6 py-3 shadow-md">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-white font-medium">{{ totalCoaches }} Professional Coaches</span>
        </div>
      </div>

      <!-- Coaches Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <div 
          v-for="coach in coaches" 
          :key="coach.id"
          class="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-black transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <!-- Image Container -->
          <div class="relative h-64 sm:h-72 bg-gray-100 overflow-hidden">
            <img 
              v-if="coach.image" 
              :src="'http://localhost:3000' + coach.image" 
              :alt="coach.coach_name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              @error="handleImageError"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
              <span class="text-6xl text-gray-400">👤</span>
            </div>
            
            <!-- Status Badge -->
            <div class="absolute top-4 right-4">
              <span 
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  coach.status === 'active' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                ]"
              >
                {{ coach.status === 'active' ? 'Active' : 'Inactive' }}
              </span>
            </div>

            <!-- Skating Icon Overlay -->
            <div class="absolute bottom-4 left-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
              {{ coach.id % 2 === 0 ? '⛸️' : '🛼' }}
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Name & Experience -->
            <div class="mb-4">
              <h3 class="text-2xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors">
                {{ coach.coach_name }}
              </h3>
              <div class="flex items-center gap-2 text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm font-medium">{{ coach.experience }} Experience</span>
              </div>
            </div>

            <!-- Specialization -->
            <div v-if="coach.specialization" class="mb-4">
              <div class="inline-flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5">
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
                <span class="text-sm text-black">{{ coach.specialization }}</span>
              </div>
            </div>

            <!-- Description -->
            <p class="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {{ coach.description }}
            </p>

            <!-- Achievements -->
            <div v-if="coach.achievements" class="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 class="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Achievements</h4>
              <p class="text-sm text-black line-clamp-2">{{ coach.achievements }}</p>
            </div>

            <!-- Certifications -->
            <div v-if="coach.certifications" class="mb-4">
              <h4 class="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Certifications</h4>
              <p class="text-sm text-gray-600 line-clamp-2">{{ coach.certifications }}</p>
            </div>

            <!-- Last Updated -->
            <div class="pt-4 border-t border-gray-200">
              <p class="text-xs text-gray-500">
                Updated {{ formatDate(coach.updated_at) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="coaches.length === 0 && !loading && !error" class="text-center py-16">
        <div class="text-6xl mb-4 opacity-20">🛼</div>
        <h3 class="text-2xl font-semibold text-gray-600 mb-2">No Coaches Available</h3>
        <p class="text-gray-500">Check back soon for our amazing coaching team!</p>
      </div>
    </div>

    <!-- Footer Accent -->
    <div class="border-t border-gray-200 bg-gray-50 py-8">
      <div class="container mx-auto px-4 text-center">
        <p class="text-gray-600 text-sm flex items-center justify-center gap-2 flex-wrap">
          <span>⛸️</span>
          <span>Vaibhav Skating Academy - Where Champions Are Made</span>
          <span>🛼</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MeetOurCoaches',
  data() {
    return {
      coaches: [],
      totalCoaches: 0,
      loading: true,
      error: null
    }
  },
  mounted() {
    this.fetchCoaches();
  },
  methods: {
    async fetchCoaches() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch('http://localhost:3000/vsa/meet-our-coaches');
        const data = await response.json();
        
        if (data.success) {
          this.coaches = data.coaches;
          this.totalCoaches = data.totalCoaches;
        } else {
          this.error = data.message || 'Failed to fetch coaches data';
        }
      } catch (err) {
        this.error = 'Unable to connect to the server. Please try again later.';
        console.error('Error fetching coaches:', err);
      } finally {
        this.loading = false;
      }
    },
    handleImageError(event) {
      event.target.style.display = 'none';
    },
    formatDate(dateString) {
      if (!dateString) return 'Recently';
      
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes pulse {
  0%, 100% {
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