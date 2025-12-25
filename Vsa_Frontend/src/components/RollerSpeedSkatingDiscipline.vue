<template>
    <div class="min-h-screen bg-white overflow-hidden relative">
        <!-- Animated Background Tracks -->
        <div class="fixed inset-0 pointer-events-none z-0">
            <!-- Track 1 - Top -->
            <div class="absolute top-1/4 left-0 w-full overflow-hidden">
                <div class="flex animate-scroll-left">
                    <div v-for="i in 4" :key="`track1-${i}`" class="flex-shrink-0 mx-32">
                        <svg class="w-12 h-12 opacity-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M3 12h18M3 6h18M3 18h18" stroke-width="1.5" stroke-linecap="round" />
                            <circle cx="6" cy="21" r="1.5" fill="currentColor" />
                            <circle cx="18" cy="21" r="1.5" fill="currentColor" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Track 2 - Middle -->
            <div class="absolute top-1/2 left-0 w-full overflow-hidden">
                <div class="flex animate-scroll-right">
                    <div v-for="i in 4" :key="`track2-${i}`" class="flex-shrink-0 mx-32">
                        <svg class="w-12 h-12 opacity-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M4 5l4 7-4 7M12 5l4 7-4 7" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <circle cx="8" cy="20" r="1" fill="currentColor" />
                            <circle cx="12" cy="20" r="1" fill="currentColor" />
                            <circle cx="16" cy="20" r="1" fill="currentColor" />
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Track 3 - Bottom -->
            <div class="absolute top-3/4 left-0 w-full overflow-hidden">
                <div class="flex animate-scroll-left-slow">
                    <div v-for="i in 4" :key="`track3-${i}`" class="flex-shrink-0 mx-32">
                        <svg class="w-12 h-12 opacity-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M8 4v16M12 4v16" stroke-width="1.5" stroke-linecap="round" />
                            <circle cx="6" cy="21" r="1.5" fill="currentColor" />
                            <circle cx="10" cy="21" r="1.5" fill="currentColor" />
                            <circle cx="14" cy="21" r="1.5" fill="currentColor" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="relative z-10">
            <!-- Hero Section -->
            <section class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div class="max-w-6xl mx-auto text-center">
                    <h1 class="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                        <span class="text-black">{{ hero.title }}</span>
                    </h1>
                    <p class="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                        {{ hero.subtitle }}
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            class="px-8 py-4 bg-black text-white rounded-full text-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105"
                            @click="navigateTo('/join-us')">
                            {{ hero.primaryCTA }}
                        </button>
                        <button
                            class="px-8 py-4 bg-white text-black border-2 border-black rounded-full text-lg font-semibold hover:bg-gray-50 transition-all transform hover:scale-105"
                            @click="navigateTo('/#programs')" >
                            {{ hero.secondaryCTA }}
                        </button>
                    </div>
                </div>
            </section>

            <!-- Benefits Section -->
            <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
                <div class="max-w-7xl mx-auto">
                    <div class="text-center mb-16">
                        <h2 class="text-5xl font-bold text-black mb-4">Why Roller Speed Skating?</h2>
                        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                            Transform your body and mind through the power of speed skating
                        </p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="(benefit, index) in benefits" :key="index"
                            class="bg-white rounded-xl p-6 border border-gray-200 hover:border-black transition-all group">
                            <div
                                class="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        :d="benefit.icon" />
                                </svg>
                            </div>
                            <h3 class="text-xl font-bold text-black mb-2">{{ benefit.title }}</h3>
                            <p class="text-gray-600 text-sm leading-relaxed">{{ benefit.description }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Events & Competitions Section -->
            <section class="py-20 px-4 sm:px-6 lg:px-8">
                <div class="max-w-7xl mx-auto">
                    <div class="text-center mb-16">
                        <h2 class="text-5xl font-bold text-black mb-4">Upcoming Events</h2>
                        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                            Join us at exciting skating events and competitions throughout the year
                        </p>
                    </div>
                    <div class="space-y-6">
                        <div v-for="(event, index) in events" :key="index"
                            class="bg-white rounded-2xl border-2 border-gray-100 hover:border-black transition-all overflow-hidden group cursor-pointer">
                            <div class="flex flex-col md:flex-row">
                                <div
                                    class="bg-gradient-to-br from-gray-900 to-gray-700 text-white p-8 md:w-48 flex flex-col justify-center items-center md:items-start">
                                    <div class="text-5xl font-bold mb-1">{{ event.date }}</div>
                                    <div class="text-xl">{{ event.month }}</div>
                                    <div class="text-sm text-gray-400 mt-1">{{ event.year }}</div>
                                </div>
                                <div class="flex-1 p-8">
                                    <div class="flex flex-wrap items-center gap-2 mb-3">
                                        <span class="px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
                                            {{ event.category }}
                                        </span>
                                        <span
                                            class="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                                            {{ event.location }}
                                        </span>
                                    </div>
                                    <h3 class="text-2xl font-bold text-black mb-3 group-hover:underline">{{ event.title
                                    }}</h3>
                                    <p class="text-gray-600 mb-4">{{ event.description }}</p>
                                    <div class="flex items-center text-sm text-gray-500">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {{ event.tourFees }} Tour Fees
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Training Insights Section -->
            <section class="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
                <div class="max-w-7xl mx-auto">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 class="text-5xl font-bold mb-6">Master the Art of Speed</h2>
                            <p class="text-xl text-gray-300 mb-8 leading-relaxed">
                                Speed skating is not just about going fast—it's a symphony of technique, endurance, and
                                mental discipline. Our specialized training methodology focuses on building champions
                                from the ground up.
                            </p>
                            <div class="space-y-6">
                                <div v-for="(insight, index) in trainingInsights" :key="index" class="flex items-start">
                                    <div
                                        class="w-12 h-12 bg-white text-black rounded-lg flex items-center justify-center flex-shrink-0 mr-4 font-bold text-xl">
                                        {{ index + 1 }}
                                    </div>
                                    <div>
                                        <h3 class="text-xl font-bold mb-2">{{ insight.title }}</h3>
                                        <p class="text-gray-400 text-sm leading-relaxed">{{ insight.description }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-900 rounded-3xl p-12 border-2 border-gray-800">
                            <h3 class="text-3xl font-bold mb-8 text-center">Training Metrics</h3>
                            <div class="space-y-6">
                                <div v-for="(metric, index) in metrics" :key="index">
                                    <div class="flex justify-between mb-2">
                                        <span class="text-gray-300">{{ metric.label }}</span>
                                        <span class="font-bold">{{ metric.value }}%</span>
                                    </div>
                                    <div class="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                                        <div class="bg-white h-full rounded-full transition-all duration-1000"
                                            :style="{ width: metric.value + '%' }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Equipment & Gear Section -->
            <section class="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
                <div class="max-w-4xl mx-auto text-center">
                    <h2 class="text-5xl font-bold text-black mb-6">Equipment & Safety First</h2>
                    <p class="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        Learn about the essential gear for speed skating and our commitment to athlete safety
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div v-for="(gear, index) in equipment" :key="index"
                            class="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-black transition-all">
                            <div class="text-4xl mb-4">{{ gear.emoji }}</div>
                            <h3 class="text-lg font-bold mb-2">{{ gear.name }}</h3>
                            <p class="text-sm text-gray-600">{{ gear.description }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            class="px-10 py-5 bg-black text-white rounded-full text-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg">
                            View Complete Guide
                        </button>
                        <button
                            class="px-10 py-5 bg-white text-black border-2 border-black rounded-full text-lg font-semibold hover:bg-gray-50 transition-all transform hover:scale-105"
                            @click="navigateTo('/join-us')">
                            Schedule Visit
                        </button>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RollerSpeedSkatingDiscipline',
    data() {
        return {
            hero: {
                title: 'Vaibhav Skating Academy',
                subtitle: 'Where passion meets precision. Master the art of roller speed skating with professional coaching and state-of-the-art facilities.',
                primaryCTA: 'Start Your Journey',
                secondaryCTA: 'Explore Programs'
            },
            benefits: [
                {
                    title: 'Full-Body Workout',
                    description: 'Engage every major muscle group while building exceptional cardiovascular endurance. Speed skating burns up to 600 calories per hour while being low-impact on joints.',
                    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
                },
                {
                    title: 'Mental Toughness',
                    description: 'Develop focus, discipline, and resilience through competitive training. Learn to push beyond your limits and build unwavering confidence.',
                    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                },
                {
                    title: 'Speed & Agility',
                    description: 'Master explosive acceleration and razor-sharp cornering techniques. Develop the lightning-fast reflexes needed for competitive racing.',
                    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
                },
                {
                    title: 'Balance & Coordination',
                    description: 'Build superior proprioception and body control. These foundational skills translate to better performance in all aspects of life.',
                    icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9'
                },
                {
                    title: 'Community & Teamwork',
                    description: 'Join a passionate community of skaters. Train alongside like-minded athletes and forge lifelong friendships through shared challenges.',
                    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                },
                {
                    title: 'Competitive Edge',
                    description: 'Prepare for local, state, and national competitions. Our athletes consistently rank among the top performers in their categories.',
                    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
                }
            ],
            events: [],
            trainingInsights: [
                {
                    title: 'Progressive Technique Development',
                    description: 'Build your skills systematically from basic stance and stride mechanics to advanced racing strategies and corner techniques.'
                },
                {
                    title: 'Personalized Training Plans',
                    description: 'Every athlete receives a customized training regimen based on their goals, current skill level, and competitive aspirations.'
                },
                {
                    title: 'Video Analysis & Feedback',
                    description: 'Utilize cutting-edge video analysis technology to perfect your form and identify areas for improvement in real-time.'
                },
                {
                    title: 'Strength & Conditioning',
                    description: 'Complementary off-skate training programs designed to build the specific muscle groups and endurance needed for speed skating.'
                }
            ],
            metrics: [
                { label: 'Speed Improvement', value: 75 },
                { label: 'Technique Mastery', value: 82 },
                { label: 'Endurance Building', value: 78 },
                { label: 'Competition Readiness', value: 78 }
            ],
            equipment: [
                {
                    emoji: '⛸️',
                    name: 'Speed Skates',
                    description: 'Professional inline speed skates with 4-wheel configuration for maximum velocity and control'
                },
                {
                    emoji: '🪖',
                    name: 'Safety Gear',
                    description: 'Certified helmets, knee pads, elbow pads, and wrist guards for complete protection'
                },
                {
                    emoji: '👕',
                    name: 'Performance Wear',
                    description: 'Aerodynamic skating suits and moisture-wicking training apparel for optimal performance'
                }
            ]
        }
    },
    mounted() {
        // Server call to fetch dynamic data
        this.fetchAcademyData();
    },
    methods: {
        async fetchAcademyData() {
            try {
                const response = await fetch('http://localhost:3000/vsa/roller-speed-skating-discipline');
                const data = await response.json();
                if (data.success && data.events && data.events.length > 0) {
                    this.events = data.events;
                    console.log('Academy data loaded:', this.events.length, 'events');
                } else {
                    console.warn('No events found, keeping default data');
                }
            } catch (error) {
                console.error('Error fetching academy data:', error);
            }
        },
        navigateTo(path) {
            this.$router.push(path);
            this.isUserDropdownOpen = false;
        },
    }
}
</script>

<style scoped>
@keyframes scroll-left {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-50%);
    }
}

@keyframes scroll-right {
    0% {
        transform: translateX(-50%);
    }

    100% {
        transform: translateX(0);
    }
}

@keyframes scroll-left-slow {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-50%);
    }
}

.animate-scroll-left {
    animation: scroll-left 40s linear infinite;
    width: 200%;
}

.animate-scroll-right {
    animation: scroll-right 35s linear infinite;
    width: 200%;
}

.animate-scroll-left-slow {
    animation: scroll-left-slow 50s linear infinite;
    width: 200%;
}
</style>