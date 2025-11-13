<template>
    <div class="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-blue-100 overflow-hidden relative">
        <!-- Animated Ice Crystal Background -->
        <div class="fixed inset-0 pointer-events-none z-0">
            <!-- Ice Crystals Layer 1 - Small crystals -->
            <div class="absolute inset-0">
                <div v-for="i in 20" :key="`crystal-small-${i}`" 
                     class="ice-crystal-small absolute"
                     :style="{
                         left: `${Math.random() * 100}%`,
                         animationDelay: `${Math.random() * 20}s`,
                         animationDuration: `${15 + Math.random() * 10}s`
                     }">
                    <svg class="w-4 h-4 text-blue-300 opacity-40" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l1.5 3.5L17 7l-3.5 1.5L12 12l-1.5-3.5L7 7l3.5-1.5L12 2z" />
                        <path d="M12 12l1 2.5L15.5 15l-2.5 1L12 18.5l-1-2.5L8.5 15l2.5-1L12 12z" />
                    </svg>
                </div>
            </div>

            <!-- Ice Crystals Layer 2 - Medium crystals -->
            <div class="absolute inset-0">
                <div v-for="i in 15" :key="`crystal-medium-${i}`" 
                     class="ice-crystal-medium absolute"
                     :style="{
                         left: `${Math.random() * 100}%`,
                         animationDelay: `${Math.random() * 25}s`,
                         animationDuration: `${20 + Math.random() * 15}s`
                     }">
                    <svg class="w-6 h-6 text-cyan-300 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 2v20M2 12h20M6 6l12 12M18 6L6 18" stroke-width="2" stroke-linecap="round"/>
                        <circle cx="12" cy="12" r="3" stroke-width="2"/>
                    </svg>
                </div>
            </div>

            <!-- Ice Crystals Layer 3 - Large crystals -->
            <div class="absolute inset-0">
                <div v-for="i in 8" :key="`crystal-large-${i}`" 
                     class="ice-crystal-large absolute"
                     :style="{
                         left: `${Math.random() * 100}%`,
                         animationDelay: `${Math.random() * 30}s`,
                         animationDuration: `${25 + Math.random() * 20}s`
                     }">
                    <svg class="w-8 h-8 text-blue-200 opacity-20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" />
                        <path d="M12 11l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5 1.5-3z" />
                    </svg>
                </div>
            </div>

            <!-- Floating Snowflakes -->
            <div class="absolute inset-0">
                <div v-for="i in 30" :key="`snowflake-${i}`" 
                     class="snowflake absolute"
                     :style="{
                         left: `${Math.random() * 100}%`,
                         animationDelay: `${Math.random() * 15}s`,
                         animationDuration: `${10 + Math.random() * 20}s`,
                         fontSize: `${8 + Math.random() * 12}px`
                     }">
                    ❄
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="relative z-10">
            <!-- Hero Section -->
            <section class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div class="max-w-6xl mx-auto text-center">
                    <h1 class="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 drop-shadow-lg">
                            {{ hero.title }}
                        </span>
                    </h1>
                    <p class="text-xl sm:text-2xl text-blue-900 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                        {{ hero.subtitle }}
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            class="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full text-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
                            {{ hero.primaryCTA }}
                        </button>
                        <button
                            class="px-8 py-4 bg-white/80 backdrop-blur-sm text-blue-700 border-2 border-blue-400 rounded-full text-lg font-semibold hover:bg-white transition-all transform hover:scale-105 shadow-lg">
                            {{ hero.secondaryCTA }}
                        </button>
                    </div>
                </div>
            </section>

            <!-- Benefits Section -->
            <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-white/50 backdrop-blur-sm">
                <div class="max-w-7xl mx-auto">
                    <div class="text-center mb-16">
                        <h2 class="text-5xl font-bold text-blue-900 mb-4">Why Ice Speed Skating?</h2>
                        <p class="text-xl text-blue-700 max-w-2xl mx-auto">
                            Transform your body and mind through the power of speed skating
                        </p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="(benefit, index) in benefits" :key="index"
                            class="bg-white/70 backdrop-blur-md rounded-xl p-6 border-2 border-blue-200 hover:border-cyan-400 hover:bg-white/90 transition-all group shadow-lg hover:shadow-xl">
                            <div
                                class="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        :d="benefit.icon" />
                                </svg>
                            </div>
                            <h3 class="text-xl font-bold text-blue-900 mb-2">{{ benefit.title }}</h3>
                            <p class="text-blue-700 text-sm leading-relaxed">{{ benefit.description }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Events & Competitions Section -->
            <section class="py-20 px-4 sm:px-6 lg:px-8">
                <div class="max-w-7xl mx-auto">
                    <div class="text-center mb-16">
                        <h2 class="text-5xl font-bold text-blue-900 mb-4">Upcoming Events</h2>
                        <p class="text-xl text-blue-700 max-w-2xl mx-auto">
                            Join us at exciting skating events and competitions throughout the year
                        </p>
                    </div>
                    <div class="space-y-6">
                        <div v-for="(event, index) in events" :key="index"
                            class="bg-white/80 backdrop-blur-md rounded-2xl border-2 border-blue-200 hover:border-cyan-400 transition-all overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl">
                            <div class="flex flex-col md:flex-row">
                                <div
                                    class="bg-gradient-to-br from-blue-700 via-cyan-600 to-blue-800 text-white p-8 md:w-48 flex flex-col justify-center items-center md:items-start shadow-inner">
                                    <div class="text-5xl font-bold mb-1">{{ event.date }}</div>
                                    <div class="text-xl">{{ event.month }}</div>
                                    <div class="text-sm text-blue-200 mt-1">{{ event.year }}</div>
                                </div>
                                <div class="flex-1 p-8">
                                    <div class="flex flex-wrap items-center gap-2 mb-3">
                                        <span class="px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-semibold rounded-full shadow-sm">
                                            {{ event.category }}
                                        </span>
                                        <span
                                            class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                            {{ event.location }}
                                        </span>
                                    </div>
                                    <h3 class="text-2xl font-bold text-blue-900 mb-3 group-hover:text-cyan-600 transition-colors">
                                        {{ event.title }}
                                    </h3>
                                    <p class="text-blue-700 mb-4">{{ event.description }}</p>
                                    <div class="flex items-center text-sm text-blue-600">
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
            <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 via-cyan-800 to-blue-950 text-white">
                <div class="max-w-7xl mx-auto">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 class="text-5xl font-bold mb-6">Master the Art of Speed</h2>
                            <p class="text-xl text-blue-100 mb-8 leading-relaxed">
                                Speed skating is not just about going fast—it's a symphony of technique, endurance, and
                                mental discipline. Our specialized training methodology focuses on building champions
                                from the ground up.
                            </p>
                            <div class="space-y-6">
                                <div v-for="(insight, index) in trainingInsights" :key="index" class="flex items-start">
                                    <div
                                        class="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-300 text-blue-900 rounded-lg flex items-center justify-center flex-shrink-0 mr-4 font-bold text-xl shadow-lg">
                                        {{ index + 1 }}
                                    </div>
                                    <div>
                                        <h3 class="text-xl font-bold mb-2">{{ insight.title }}</h3>
                                        <p class="text-blue-200 text-sm leading-relaxed">{{ insight.description }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white/10 backdrop-blur-md rounded-3xl p-12 border-2 border-cyan-400/30 shadow-2xl">
                            <h3 class="text-3xl font-bold mb-8 text-center">Training Metrics</h3>
                            <div class="space-y-6">
                                <div v-for="(metric, index) in metrics" :key="index">
                                    <div class="flex justify-between mb-2">
                                        <span class="text-blue-100">{{ metric.label }}</span>
                                        <span class="font-bold text-cyan-300">{{ metric.value }}%</span>
                                    </div>
                                    <div class="w-full bg-blue-900/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                                        <div class="bg-gradient-to-r from-cyan-400 to-blue-400 h-full rounded-full transition-all duration-1000 shadow-lg"
                                            :style="{ width: metric.value + '%' }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Equipment & Gear Section -->
            <section class="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white/50 to-blue-50/70 backdrop-blur-sm">
                <div class="max-w-4xl mx-auto text-center">
                    <h2 class="text-5xl font-bold text-blue-900 mb-6">Equipment & Safety First</h2>
                    <p class="text-xl text-blue-700 mb-12 max-w-2xl mx-auto">
                        Learn about the essential gear for speed skating and our commitment to athlete safety
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div v-for="(gear, index) in equipment" :key="index"
                            class="bg-white/80 backdrop-blur-md rounded-2xl p-6 border-2 border-blue-200 hover:border-cyan-400 hover:bg-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                            <div class="text-5xl mb-4">{{ gear.emoji }}</div>
                            <h3 class="text-lg font-bold mb-2 text-blue-900">{{ gear.name }}</h3>
                            <p class="text-sm text-blue-700">{{ gear.description }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            class="px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full text-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
                            View Complete Guide
                        </button>
                        <button
                            class="px-10 py-5 bg-white/80 backdrop-blur-sm text-blue-700 border-2 border-blue-400 rounded-full text-lg font-semibold hover:bg-white transition-all transform hover:scale-105 shadow-lg"
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
    name: 'IceSkatingDiscipline',
    data() {
        return {
            hero: {
                title: 'Vaibhav Skating Academy',
                subtitle: 'Where passion meets precision. Master the art of ice speed skating with professional coaching and state-of-the-art facilities.',
                primaryCTA: 'Start Your Journey',
                secondaryCTA: 'Explore Programs'
            },
            benefits: [
                {
                    title: "Full-Body Workout",
                    description: "Ice skating engages your legs, core, and arms, helping build strength, flexibility, and coordination while improving overall fitness.",
                    icon: "M13 16h-1v-4h-1m1-4h.01M12 8v4m0 4v2m0 4a9 9 0 100-18 9 9 0 000 18z",
                },
                {
                    title: "Improves Balance & Coordination",
                    description: "The constant need to maintain stability on the ice enhances balance, coordination, and posture — skills that benefit daily life and other sports.",
                    icon: "M12 4v16m8-8H4",
                },
                {
                    title: "Boosts Cardiovascular Health",
                    description: "Ice speed skating is an excellent aerobic exercise that strengthens your heart and improves endurance through sustained movement and speed control.",
                    icon: "M5 13l4 4L19 7",
                },
                {
                    title: "Enhances Mental Focus",
                    description: "Concentrating on rhythm, turns, and speed improves mental sharpness and teaches focus under pressure — essential for both sport and life.",
                    icon: "M12 8v4l3 3",
                },
                {
                    title: "Builds Confidence & Discipline",
                    description: "Progressing on ice requires persistence and practice, building confidence, patience, and a strong sense of discipline in skaters of all ages.",
                    icon: "M9 12l2 2 4-4",
                },
                {
                    title: "Fun & Social Activity",
                    description: "Ice skating brings people together — whether for competition or recreation, it fosters teamwork, friendship, and a love for winter sports.",
                    icon: "M3 10h11M9 21V3m12 8h-7",
                },
            ],
            events: [
                {
                    date: '15',
                    month: 'Dec',
                    year: '2025',
                    category: 'Competition',
                    location: 'Ice Arena',
                    title: 'Winter Speed Challenge',
                    description: 'Annual speed skating championship for all skill levels',
                    tourFees: '$50'
                }
            ],
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
                    name: 'Ice Skates',
                    description: 'Professional Ice speed skates with high quality blader configuration for maximum velocity and control'
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
        this.fetchAcademyData();
    },
    methods: {
        async fetchAcademyData() {
            try {
                const response = await fetch('http://localhost:3000/vsa/ice-skating-discipline');
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
        },
    }
}
</script>

<style scoped>
@keyframes float-down {
    0% {
        transform: translateY(-10vh) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(110vh) rotate(360deg);
        opacity: 0;
    }
}

@keyframes crystal-float {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-20px) rotate(180deg);
    }
}

@keyframes crystal-shimmer {
    0%, 100% {
        opacity: 0.2;
    }
    50% {
        opacity: 0.5;
    }
}

.snowflake {
    animation: float-down linear infinite;
    color: rgba(147, 197, 253, 0.6);
    text-shadow: 0 0 5px rgba(147, 197, 253, 0.8);
    user-select: none;
    pointer-events: none;
}

.ice-crystal-small {
    animation: float-down linear infinite, crystal-shimmer 3s ease-in-out infinite;
}

.ice-crystal-medium {
    animation: float-down linear infinite, crystal-float 4s ease-in-out infinite;
}

.ice-crystal-large {
    animation: float-down linear infinite, crystal-shimmer 5s ease-in-out infinite;
}

/* Frosty glass effect */
.backdrop-blur-sm {
    backdrop-filter: blur(8px);
}

.backdrop-blur-md {
    backdrop-filter: blur(12px);
}

/* Smooth transitions */
* {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>