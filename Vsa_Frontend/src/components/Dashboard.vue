<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation Header -->
    <nav class="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <img :src="logoImage" alt="VSA Logo" class="h-10 w-auto" />
            <span class="ml-2 text-xl font-bold text-gray-900">VSA Academy</span>
          </div>
          <button @click="toggleMobileMenu" class="md:hidden">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link v-for="link in navLinks" :key="link.path" :to="link.path"
            class="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
            {{ link.name }}
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div class="mb-12 lg:mb-0">
            <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Master the Art of
              <span class="text-gray-600 inline-block animate-bounce">Speed Skating</span>
            </h1>
            <p class="text-xl text-gray-600 mb-8 leading-relaxed">
              Join our premier skating academy and experience world-class training in both roller
              and ice skating disciplines.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                class="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transform hover:scale-105 transition-all duration-200">
                Start Your Journey
              </button>
              <button
                class="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
                Watch Demo
              </button>
            </div>
          </div>
          <div class="relative">
            <img :src="heroImage" alt="Speed Skating"
              class="w-full h-96 object-cover rounded-2xl shadow-2xl animate-float" />
            <div class="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg animate-slide-up">
              <img :src="skateIcon" alt="Skate" class="w-12 h-12" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="stat in stats" :key="stat.label" class="text-center group">
            <div
              class="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors duration-200">
              <img :src="stat.icon" alt="" class="w-10 h-10" />
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2 animate-counter">
              {{ stat.value }}
            </div>
            <div class="text-gray-600 text-sm">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-8 bg-gray-900 text-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-center mb-4">
          <h3 class="text-lg font-semibold">Latest Speed Skating Records</h3>
        </div>
        <div class="relative">
          <div class="flex animate-scroll space-x-8">
            <div v-for="record in recentRecords" :key="record.id"
              class="flex-shrink-0 bg-gray-800 rounded-lg px-6 py-3">
              <div class="flex items-center space-x-4">
                <img :src="record.discipline === 'roller'
                    ? '/images/roller-icon.jpg'
                    : '/images/ice-icon.jpg'
                  " alt="Discipline" class="w-8 h-8" />
                <div>
                  <div class="font-semibold">{{ record.studentName }}</div>
                  <div class="text-sm text-gray-300">{{ record.event }} - {{ record.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Speed Skating Training Schedule (Add before Join Us CTA) -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Training Schedule</h2>
          <p class="text-xl text-gray-600">
            Structured training sessions for both roller and ice speed skating
          </p>
        </div>
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Roller Speed Schedule -->
          <div class="bg-red-50 rounded-2xl p-8">
            <div class="flex items-center mb-6">
              <img :src="rollerIcon" alt="Roller Skating" class="w-12 h-12 mr-4" />
              <h3 class="text-2xl font-bold text-gray-900">Roller Speed Training</h3>
            </div>
            <div class="space-y-4">
              <div v-for="session in rollerSchedule" :key="session.day"
                class="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                <div>
                  <div class="font-semibold text-gray-900">{{ session.day }}</div>
                  <div class="text-sm text-gray-600">{{ session.level }}</div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-red-600">{{ session.time }}</div>
                  <div class="text-sm text-gray-500">{{ session.duration }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ice Speed Schedule -->
          <div class="bg-blue-50 rounded-2xl p-8">
            <div class="flex items-center mb-6">
              <img :src="iceIcon" alt="Ice Skating" class="w-12 h-12 mr-4" />
              <h3 class="text-2xl font-bold text-gray-900">Ice Speed Training</h3>
            </div>
            <div class="space-y-4">
              <div v-for="session in iceSchedule" :key="session.day"
                class="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                <div>
                  <div class="font-semibold text-gray-900">{{ session.day }}</div>
                  <div class="text-sm text-gray-600">{{ session.level }}</div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-blue-600">{{ session.time }}</div>
                  <div class="text-sm text-gray-500">{{ session.duration }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Programs Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Our Training Programs</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Specialized training programs designed for all skill levels, from beginners to
            competitive athletes.
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="program in programs" :key="program.title"
            class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <div class="relative">
              <img :src="program.image" :alt="program.title" class="w-full h-48 object-cover" />
              <div class="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                {{ program.category }}
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ program.title }}</h3>
              <p class="text-gray-600 mb-4">{{ program.description }}</p>
              <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-gray-900">{{ program.price }}</span>
                <button
                  class="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Equipment Showcase Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div class="mb-12 lg:mb-0">
            <h2 class="text-4xl font-bold text-gray-900 mb-6">Premium Skating Equipment</h2>
            <p class="text-lg text-gray-600 mb-8">
              Discover our collection of professional-grade roller skates and ice skates. From
              beginner-friendly models to competition-level equipment.
            </p>
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <img :src="checkIcon" alt="Check" class="w-6 h-6" />
                <span class="text-gray-700">Professional Speed Roller Skates</span>
              </div>
              <div class="flex items-center space-x-4">
                <img :src="checkIcon" alt="Check" class="w-6 h-6" />
                <span class="text-gray-700">Competition Ice Skating Boots</span>
              </div>
              <div class="flex items-center space-x-4">
                <img :src="checkIcon" alt="Check" class="w-6 h-6" />
                <span class="text-gray-700">Safety Gear & Accessories</span>
              </div>
            </div>
            <router-link to="/shop"
              class="inline-block mt-8 bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transform hover:scale-105 transition-all duration-200">
              Shop Equipment
            </router-link>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <img :src="rollerSkateImage" alt="Roller Skates"
              class="w-full h-64 object-cover rounded-xl shadow-lg animate-fade-in-up" />
            <img :src="iceSkateImage" alt="Ice Skates"
              class="w-full h-64 object-cover rounded-xl shadow-lg animate-fade-in-up delay-100" />
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Speed Skating Disciplines</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Master both roller and ice speed skating with specialized training programs
          </p>
        </div>
        <div class="grid lg:grid-cols-2 gap-12">
          <!-- Roller Speed Skating -->
          <div
            class="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300">
            <div class="relative">
              <img :src="rollerSpeedImage" alt="Roller Speed Skating" class="w-full h-64 object-cover" />
              <div class="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Roller Speed
              </div>
            </div>
            <div class="p-8">
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Roller Speed Skating</h3>
              <p class="text-gray-600 mb-6">
                Experience the thrill of racing on wheels with professional roller speed skating
                training.
              </p>
              <div class="space-y-3 mb-6">
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span class="text-gray-700">Track racing techniques</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span class="text-gray-700">Sprint & distance training</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span class="text-gray-700">Competition preparation</span>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">
                  <span class="font-semibold">Records:</span> {{ rollerRecords.length }} school
                  records
                </div>
                <button
                  class="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          <!-- Ice Speed Skating -->
          <div
            class="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300">
            <div class="relative">
              <img :src="iceSpeedImage" alt="Ice Speed Skating" class="w-full h-64 object-cover" />
              <div class="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Ice Speed
              </div>
            </div>
            <div class="p-8">
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Ice Speed Skating</h3>
              <p class="text-gray-600 mb-6">
                Master the ice with precision and speed in our state-of-the-art ice rink facilities.
              </p>
              <div class="space-y-3 mb-6">
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span class="text-gray-700">Olympic-style training</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span class="text-gray-700">Long & short track</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span class="text-gray-700">International competitions</span>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-500">
                  <span class="font-semibold">Records:</span> {{ iceRecords.length }} regional
                  records
                </div>
                <button
                  class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Coach Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Meet Our Expert Coaches</h2>
          <p class="text-xl text-gray-600">
            Learn from world-class instructors with decades of competitive experience.
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="coach in coaches" :key="coach.name"
            class="bg-white rounded-2xl shadow-lg overflow-hidden text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
            <img :src="coach.image" :alt="coach.name" class="w-full h-64 object-cover" />
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ coach.name }}</h3>
              <p class="text-gray-600 mb-4">{{ coach.specialization }}</p>
              <p class="text-sm text-gray-500">{{ coach.experience }}</p>
            </div>
          </div>
        </div>
        <div class="text-center mt-12">
          <router-link to="/meet-our-coach"
            class="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 inline-block">
            View All Coaches
          </router-link>
        </div>
      </div>
    </section>

    <!-- Achievements Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Our Achievements</h2>
          <p class="text-xl text-gray-600">Celebrating the success of our students and academy.</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="achievement in achievements" :key="achievement.title"
            class="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transform hover:scale-105 transition-all duration-200">
            <img :src="achievement.icon" :alt="achievement.title" class="w-16 h-16 mx-auto mb-4 animate-pulse" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ achievement.title }}</h3>
            <p class="text-gray-600 text-sm">{{ achievement.description }}</p>
          </div>
        </div>
        <div class="text-center mt-12 space-x-4">
          <router-link to="/achievements"
            class="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 inline-block">
            Academy Achievements
          </router-link>
          <router-link to="/students-achievements"
            class="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 inline-block">
            Student Success Stories
          </router-link>
        </div>
      </div>
    </section>

    <!-- Join Us CTA Section -->
    <section class="py-20 bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="mb-12">
          <img :src="skatingBanner" alt="Join VSA" class="w-full h-64 object-cover rounded-2xl opacity-80" />
        </div>
        <h2 class="text-4xl font-bold mb-6">Ready to Start Your Skating Journey?</h2>
        <p class="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Join thousands of students who have transformed their skating skills at VSA Academy.
          Professional training, world-class facilities, and a supportive community await you.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/join-us"
            class="bg-white text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 inline-block font-semibold">
            Join Us Today
          </router-link>
          <router-link to="/fee-status"
            class="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200 inline-block">
            Check Fee Status
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Dashboard',
  data() {
    return {
      mobileMenuOpen: false,
      dashboardData: null,
      loading: true,
      navLinks: [
        { name: 'Achievements', path: '/achievements' },
        { name: 'Student Success', path: '/students-achievements' },
        { name: 'Shop', path: '/shop' },
        { name: 'Our Coaches', path: '/meet-our-coach' },
        { name: 'Fee Status', path: '/fee-status' },
        { name: 'Join Us', path: '/join-us' },
      ],
      stats: [],
      programs: [],
      coaches: [],
      achievements: [],
      rollerRecords: [],
      iceRecords: [],
      rollBallRecords: [],
      recentRecords: [],
      rollerSchedule: [],
      iceSchedule: [],
      rollBallSchedule: [],
      // Image sources
      images: {},
      logoImage: '',
      heroImage: '',
      skateIcon: '',
      checkIcon: '',
      rollerSkateImage: '',
      iceSkateImage: '',
      skatingBanner: '',
      rollerSpeedImage: '',
      iceSpeedImage: '',
      rollerIcon: '',
      iceIcon: '',
    }
  },
  mounted() {
    this.fetchDashboardData()
    this.animateOnScroll()
  },
  methods: {
    async fetchDashboardData() {
      try {
        const response = await axios.get('http://localhost:3000/vsa/dashboard')

        if (response.data.success) {
          const data = response.data.data
          
          // Update stats
          if (data.stats) {
            this.stats = data.stats.map(stat => ({
              label: stat.label,
              value: stat.value,
              icon: stat.image
            }))
          }
          
          // Update programs
          if (data.programs) {
            this.programs = data.programs.map(program => ({
              title: program.title,
              category: program.category,
              description: program.description,
              price: `${program.price}/${program.fee_cycle}`,
              image: program.image
            }))
          }
          
          // Update coaches
          if (data.coaches) {
            this.coaches = data.coaches
          }
          
          // Update achievements
          if (data.achievements) {
            this.achievements = data.achievements.map(achievement => ({
              title: achievement.title,
              description: achievement.description,
              icon: achievement.images
            }))
          }
          
          // Update records
          if (data.records) {
            this.recentRecords = data.records.all || []
            this.rollerRecords = data.records.roller || []
            this.iceRecords = data.records.ice || []
            this.rollBallRecords = data.records.rollBall || []
          }
          
          // Update schedules
          if (data.schedule) {
            this.rollerSchedule = data.schedule.roller || []
            this.iceSchedule = data.schedule.ice || []
            this.rollBallSchedule = data.schedule.rollBall || []
          }
          
          // Update images
          if (data.images) {
            this.images = data.images
            this.logoImage = data.images.logo_image || '/icons/VSA_logo.png'
            this.heroImage = data.images.hero_image || '/images/hero-speed-skating.jpg'
            this.skateIcon = data.images.skate_icon || '/icons/skate-icon.png'
            this.checkIcon = data.images.check_icon || '/icons/check-icon.png'
            this.rollerSkateImage = data.images.roller_skate_image || '/images/roller-skates-showcase.jpg'
            this.iceSkateImage = data.images.ice_skate_image || '/images/ice-skates-showcase.jpg'
            this.skatingBanner = data.images.skating_banner || '/images/join-us-banner.jpg'
            this.rollerSpeedImage = data.images.roller_speed_image || '/images/roller-speed-training.jpg'
            this.iceSpeedImage = data.images.ice_speed_image || '/images/ice-skates-showcase.jpg'
            this.rollerIcon = data.images.roller_icon || '/images/roller-skate-icon.png'
            this.iceIcon = data.images.ice_icon || '/images/ice-skate-icon.png'
          }
          
          this.dashboardData = response.data
        }
        
        this.loading = false
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        this.loading = false
      }
    },
    filterProgramsByDiscipline(discipline) {
      return this.programs.filter((program) =>
        program.category.toLowerCase().includes(discipline.toLowerCase()),
      )
    },

    getRecordsByDiscipline(discipline) {
      const disciplineMap = {
        'roller': this.rollerRecords,
        'ice': this.iceRecords,
        'rollball': this.rollBallRecords
      }
      return disciplineMap[discipline.toLowerCase()] || []
    },

    getScheduleByDiscipline(discipline) {
      const disciplineMap = {
        'roller': this.rollerSchedule,
        'ice': this.iceSchedule,
        'rollball': this.rollBallSchedule
      }
      return disciplineMap[discipline.toLowerCase()] || []
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    animateOnScroll() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
          }
        })
      }, observerOptions)

      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el)
      })
    },
    async fetchSpeedSkatingData() {
      try {
        const response = await axios.get('/vsa/speed-skating-data')
        if (response.data.rollerRecords) {
          this.rollerRecords = response.data.rollerRecords
        }
        if (response.data.iceRecords) {
          this.iceRecords = response.data.iceRecords
        }
        if (response.data.recentRecords) {
          this.recentRecords = response.data.recentRecords
        }
        if (response.data.schedules) {
          this.rollerSchedule = response.data.schedules.roller
          this.iceSchedule = response.data.schedules.ice
        }
      } catch (error) {
        console.error('Error fetching speed skating data:', error)
      }
    },

    filterProgramsByDiscipline(discipline) {
      return this.enhancedPrograms.filter((program) =>
        program.category.toLowerCase().includes(discipline.toLowerCase()),
      )
    },

    getRecordsByDiscipline(discipline) {
      return discipline === 'roller' ? this.rollerRecords : this.iceRecords
    },
  },
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out 0.3s both;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

.animate-fade-in-up.delay-100 {
  animation-delay: 100ms;
}

.animate-counter {
  animation: fadeIn 0.8s ease-out;
}

/* Hover effects */
.group:hover .animate-pulse {
  animation-duration: 0.5s;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
}

/* Custom scrollbar for modern look */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
