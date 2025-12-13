<template>
  <div id="app" class="min-h-screen bg-black text-white">
    <!-- Header/Navbar -->
    <nav class="backdrop-blur-lg bg-white/10 border-b border-white/20 sticky top-16 z-50 shadow-2xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo and Brand -->
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="text-white">
              <h1 class="text-xl font-bold tracking-tight">VAIBHAV SKATING ACADEMY</h1>
              <p class="text-sm text-gray-300">Admin Portal</p>
            </div>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center space-x-6">
            <a v-if="hasPermission('show_order_status')" href="/ordersStatus" class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 hover:bg-white/10 px-4 py-2 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <span class="font-medium">Orders Status</span>
            </a>
            <a v-if="hasPermission('show_manage_admins')" href="/vsa/manage-admins" class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 hover:bg-white/10 px-4 py-2 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <span class="font-medium">Manage admins</span>
            </a>
            
            <a v-if="hasPermission('show_edit_shop')" href="/vsa/admin/manage-shop" target="_blank" class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 hover:bg-white/10 px-4 py-2 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              <span class="font-medium">Edit Shop</span>
            </a>
            
            <a v-if="hasPermission('show_edit_achievements')" href="/updateAchievements" class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 hover:bg-white/10 px-4 py-2 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
              <span class="font-medium">Achievements</span>
            </a>

            <!-- User Dropdown -->
            <div v-if="login" class="relative">
              <!-- User dropdown content commented out as in original -->
            </div>

            <a v-else href="/login" class="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span class="font-medium">Login</span>
            </a>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleNavbar"
            class="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div v-if="navbarOpen" class="lg:hidden py-4 border-t border-white/20">
          <div class="space-y-2">
            <a v-if="hasPermission('show_order_status')" href="/ordersStatus" class="flex items-center space-x-3 text-gray-300 hover:text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              Orders Status
            </a>
            <a v-if="hasPermission('show_edit_shop')" href="/vsa/admin/manage-shop" class="flex items-center space-x-3 text-gray-300 hover:text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              Edit Shop
            </a>
            <a v-if="hasPermission('show_edit_achievements')" href="/updateAchievements" class="flex items-center space-x-3 text-gray-300 hover:text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-colors duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
              Achievements
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Dashboard Header -->
      <div class="mb-12 mt-12">
        <div class="relative overflow-hidden rounded-3xl bg-black text-white p-8 shadow-2xl">
          <div class="absolute inset-0 bg-black/20"></div>
          <div class="relative z-10">
            <div class="flex items-center space-x-4 mb-4">
              <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <div>
                <h1 class="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p class="text-xl text-white/90">Welcome to Vaibhav Skating Academy Admin Portal</p>
              </div>
            </div>
            <div class="absolute top-4 right-4 opacity-20">
              <svg class="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Operations Section -->
      <div v-if="filteredAdminOperations.length > 0" class="mb-12">
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-white mb-2">Admin Operations</h2>
          <div class="w-24 h-1 bg-white rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="operation in filteredAdminOperations" 
            :key="operation.id"
            class="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div class="relative p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-black rounded-xl shadow-lg text-white">
                  <svg class="w-6 h-6 text-white" :class="operation.icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="operation.id === 1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    <path v-else-if="operation.id === 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 3H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
                    <path v-else-if="operation.id === 3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    <path v-else-if="operation.id === 4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                    <path v-else-if="operation.id === 5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    <path v-else-if="operation.id === 6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    <path v-else-if="operation.id === 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="text-right">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h3 class="text-xl font-bold text-white mb-2">{{ operation.title }}</h3>
              <p class="text-gray-300 text-sm mb-6 leading-relaxed">{{ operation.description }}</p>
              
              <!-- Updated button logic: use link for ID 1 and 7, use method for IDs 2-6 -->
              <a 
                v-if="operation.id === 1 || operation.id === 7 || operation.id === 8"
                :href="operation.link" 
                class="inline-flex items-center justify-center w-full px-4 py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="operation.buttonIcon.includes('plus')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                {{ operation.buttonText }}
              </a>
              
              <button 
                v-else
                @click="downloadPDF(operation.id, operation.endpoint)"
                :disabled="loadingStates[operation.id]"
                class="inline-flex items-center justify-center w-full px-4 py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <svg v-if="!loadingStates[operation.id]" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <svg v-else class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ loadingStates[operation.id] ? 'Downloading...' : operation.buttonText }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Student Management Section -->
      <div v-if="filteredStudentManagement.length > 0" class="mb-12">
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-white mb-2">Student Management</h2>
          <div class="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="management in filteredStudentManagement" 
            :key="management.id"
            class="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div class="relative p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="management.id === 1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                    <path v-else-if="management.id === 2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                    <path v-else-if="management.id === 3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path v-else-if="management.id === 4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                    <path v-else-if="management.id === 5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z M8 12l4 4 8-8"/>
                    <path v-else-if="management.id === 6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2M9 3v2m6-2v2M9 19h1m4 0h1"/>
                  </svg>
                </div>
                <div class="text-right">
                  <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h3 class="text-xl font-bold text-white mb-2">{{ management.title }}</h3>
              <p class="text-gray-300 text-sm mb-6 leading-relaxed">{{ management.description }}</p>
              
              <a 
                :href="management.link" 
                class="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-xl hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="management.buttonIcon.includes('plus')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  <path v-else-if="management.buttonIcon.includes('check')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  <path v-else-if="management.buttonIcon.includes('cogs')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path v-else-if="management.buttonIcon.includes('search')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                {{ management.buttonText }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- No Permissions Message -->
      <div v-if="filteredAdminOperations.length === 0 && filteredStudentManagement.length === 0" class="text-center py-16">
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <h3 class="text-xl font-bold text-white mb-2">No Access Permissions</h3>
          <p class="text-gray-300">You don't have permission to access any admin features. Please contact your administrator.</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-black/30 backdrop-blur-lg border-t border-white/10 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <div class="flex items-center justify-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-white font-semibold">Vaibhav Skating Academy</span>
          </div>
          <p class="text-gray-400">© 2025 Vaibhav Skating Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- Toast Notification -->
    <div class="fixed bottom-4 right-4 z-50">
      <div
        v-if="showToast"
        class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-300 min-w-80"
        :class="{ 'translate-y-0 opacity-100': showToast, 'translate-y-full opacity-0': !showToast }"
      >
        <div class="flex items-center p-4" :style="{ background: `linear-gradient(135deg, ${toastHeaderColor}, ${toastHeaderColor}dd)` }">
          <div class="p-2 bg-white/20 rounded-lg mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="flex-1">
            <h4 class="text-white font-semibold">{{ toastTitle }}</h4>
            <p class="text-white/90 text-sm">Just now</p>
          </div>
          <button
            @click="hideToast"
            class="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="px-4 py-3">
          <p class="text-gray-700">{{ toastMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      login: 'Admin User',
      navbarOpen: false,
      userDropdownOpen: false,
      showToast: false,
      toastTitle: 'Success',
      toastMessage: '',
      toastHeaderColor: '#10b981',
      permissions: {}, // Will store admin permissions from JWT
      loadingStates: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false
      },
      adminOperations: [
        {
          id: 1,
          title: 'Invoice Generation',
          headerIcon: 'fas fa-file-invoice',
          icon: 'fas fa-file-invoice',
          description: 'Generate invoices for customers and transactions.',
          link: '/vsa/invoice',
          buttonIcon: 'fas fa-plus-circle',
          buttonText: 'Create Invoice',
          permission: 'show_invoice_generation'
        },
        {
          id: 2,
          title: 'Online Sales',
          headerIcon: 'fas fa-shopping-cart',
          icon: 'fas fa-download',
          description: 'Download the complete list of items sold online in PDF format.',
          endpoint: '/vsa/download-online-sale-list',
          buttonIcon: 'fas fa-file-download',
          buttonText: 'Download Report',
          permission: 'show_online_sales'
        },
        {
          id: 3,
          title: 'Offline Customers',
          headerIcon: 'fas fa-users',
          icon: 'fas fa-user-friends',
          description: 'Download the complete list of offline customers in PDF format.',
          endpoint: '/downloadofflineUserData',
          buttonIcon: 'fas fa-file-download',
          buttonText: 'Download List',
          permission: 'show_offline_customers'
        },
        {
          id: 4,
          title: 'Online Users',
          headerIcon: 'fas fa-globe',
          icon: 'fas fa-users',
          description: 'Download the complete list of online users in PDF format.',
          endpoint: '/vsa/download-online-user-data',
          buttonIcon: 'fas fa-file-download',
          buttonText: 'Download List',
          permission: 'show_online_users'
        },
        {
          id: 5,
          title: 'Available Stock',
          headerIcon: 'fas fa-boxes',
          icon: 'fas fa-clipboard-list',
          description: 'Download the complete list of available stock in PDF format.',
          endpoint: '/downloadavailableStock',
          buttonIcon: 'fas fa-file-download',
          buttonText: 'Download Inventory',
          permission: 'show_available_stocks'
        },
        {
          id: 6,
          title: 'Offline Sales',
          headerIcon: 'fas fa-shopping-bag',
          icon: 'fas fa-receipt',
          description: 'Download the complete list of items sold offline in PDF format.',
          endpoint: '/downloadOfflineSaleList',
          buttonIcon: 'fas fa-file-download',
          buttonText: 'Download Report',
          permission: 'show_offline_sales'
        },
        {
          id: 7,
          title: 'Send Mails',
          headerIcon: 'fas fa-newspaper',
          icon: 'fas fa-envelope-open-text',
          description: 'Send Mails to platform users',
          link: '/SendMail',
          buttonIcon: 'fas fa-paper-plane',
          buttonText: 'Create & Send',
          permission: 'show_send_mails'
        },
        {
          id: 8,
          title: 'Manage Dashboard',
          headerIcon: 'fas fa-file-invoice',
          icon: 'fas fa-file-invoice',
          description: 'Manage Dashboard Content',
          link: '/vsa/admin/manage-dashboard',
          buttonIcon: 'fas fa-plus-circle',
          buttonText: 'Update',
          permission: 'show_manage_dashboard'
        }
      ],
      studentManagement: [
        {
          id: 1,
          title: 'New Student',
          headerIcon: 'fas fa-user-plus',
          icon: 'fas fa-user-graduate',
          description: 'Register a new student who wants to join the academy.',
          link: '/vsa/admin/register-new-student',
          buttonIcon: 'fas fa-plus-circle',
          buttonText: 'Register Student',
          permission: 'show_new_student'
        },
        {
          id: 2,
          title: 'Attendance',
          headerIcon: 'fas fa-clipboard-check',
          icon: 'fas fa-calendar-check',
          description: 'Mark and manage daily attendance for students.',
          link: '/vsa/admin/mark-attendance',
          buttonIcon: 'fas fa-check-circle',
          buttonText: 'Mark Attendance',
          permission: 'show_attendance'
        },
        {
          id: 3,
          title: 'Manage Students',
          headerIcon: 'fas fa-user-cog',
          icon: 'fas fa-users-cog',
          description: 'Manage student groups, fees, and other details.',
          link: '/vsa/admin/manage-students',
          buttonIcon: 'fas fa-cogs',
          buttonText: 'Manage',
          permission: 'show_manage_students'
        },
        {
          id: 4,
          title: 'Student Achievements',
          headerIcon: 'fas fa-medal',
          icon: 'fas fa-trophy',
          description: 'Add and manage student achievements and recognitions.',
          link: '/vsa/admin/manage-achievements',
          buttonIcon: 'fas fa-plus-circle',
          buttonText: 'Add Achievement',
          permission: 'show_students_achievements'
        },
        {
          id: 5,
          title: 'Attendance Records',
          headerIcon: 'fas fa-search',
          icon: 'fas fa-history',
          description: 'Search and view students\' monthly attendance records.',
          link: '/vsa/admin/monthly-attendance',
          buttonIcon: 'fas fa-search',
          buttonText: 'Search Records',
          permission: 'show_attendance_records'
        },
        {
          id: 6,
          title: 'Newsletter',
          headerIcon: 'fas fa-newspaper',
          icon: 'fas fa-envelope-open-text',
          description: 'Create and send monthly newsletters to students and parents.',
          link: '/Create_newsLetter',
          buttonIcon: 'fas fa-paper-plane',
          buttonText: 'Create & Send',
          permission: 'show_news_letter'
        }
      ]
    }
  },
  computed: {
    filteredAdminOperations() {
      return this.adminOperations.filter(operation => this.hasPermission(operation.permission));
    },
    filteredStudentManagement() {
      return this.studentManagement.filter(management => this.hasPermission(management.permission));
    }
  },
  mounted() {
    this.loadUserPermissions();
    this.checkNewsletterStatus();
    // Close dropdowns when clicking outside
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  },
  methods: {
    loadUserPermissions() {
      try {
        // Get token from localStorage or wherever you store it
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (token) {
          // Decode JWT token to get permissions
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.permissions = payload.permissions || {};
        } else {
          // If no token, redirect to login
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Error loading user permissions:', error);
        // Redirect to login if token is invalid
        window.location.href = '/login';
      }
    },
    hasPermission(permissionKey) {
      // If no permissions object or permission key doesn't exist, return false
      if (!this.permissions || !permissionKey) {
        return false;
      }
      
      // Check if the permission is granted (value is 1 or true)
      return this.permissions[permissionKey] === 1 || this.permissions[permissionKey] === true;
    },
    toggleNavbar() {
      this.navbarOpen = !this.navbarOpen;
    },
    toggleUserDropdown() {
      this.userDropdownOpen = !this.userDropdownOpen;
    },
    handleOutsideClick(event) {
      // Close dropdowns when clicking outside
      if (!event.target.closest('.relative')) {
        this.userDropdownOpen = false;
        this.navbarOpen = false;
      }
    },
    async downloadPDF(operationId, endpoint) {
      console.log('downloadPDF called with:', { operationId, endpoint });
      try {
        // Set loading state
        this.loadingStates[operationId] = true;
        const fullURL = 'http://localhost:3000' + endpoint;
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        const response = await fetch(fullURL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authentication headers
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the blob from response
        const blob = await response.blob();
        
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary anchor element and trigger download
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        
        // Set filename based on operation type
        const filenames = {
          2: 'online-sales-report.pdf',
          3: 'offline-customers-list.pdf',
          4: 'online-users-list.pdf',
          5: 'available-stock-inventory.pdf',
          6: 'offline-sales-report.pdf'
        };
        
        a.download = filenames[operationId] || 'download.pdf';
        
        // Append to body, click, and remove
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up the temporary URL
        window.URL.revokeObjectURL(url);
        
        // Show success toast
        this.showToastNotification('Success', 'PDF downloaded successfully!', '#10b981');
        
      } catch (error) {
        console.error('Error downloading PDF:', error);
        this.showToastNotification('Error', 'Failed to download PDF. Please try again.', '#ef4444');
      } finally {
        // Clear loading state
        this.loadingStates[operationId] = false;
      }
    },
    checkNewsletterStatus() {
      const urlParams = new URLSearchParams(window.location.search);
      const newsletterStatus = urlParams.get('newsletterStatus');

      if (newsletterStatus === 'success') {
        this.showToastNotification('Success', 'Newsletter sent successfully!', '#10b981');
      } else if (newsletterStatus === 'failure') {
        this.showToastNotification('Error', 'Failed to send the newsletter.', '#ef4444');
      }

      if (newsletterStatus) {
        urlParams.delete('newsletterStatus');
        history.replaceState(
          null,
          '',
          `${window.location.pathname}${
            urlParams.toString() ? '?' + urlParams.toString() : ''
          }`
        );
      }
    },
    showToastNotification(title, message, headerColor) {
      this.toastTitle = title;
      this.toastMessage = message;
      this.toastHeaderColor = headerColor;
      this.showToast = true;
      
      setTimeout(() => {
        this.hideToast();
      }, 5000);
    },
    hideToast() {
      this.showToast = false;
    }
  }
}
</script>

<style scoped>
/* Custom animations */
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

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Custom backdrop blur for better browser support */
.backdrop-blur-lg {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* Ensure smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Mobile responsiveness improvements */
@media (max-width: 768px) {
  .text-4xl {
    font-size: 2rem;
    line-height: 2.5rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}
</style>