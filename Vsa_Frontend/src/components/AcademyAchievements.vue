<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <!-- Ice Skates Animation -->
            <div class="ice-skate-1 absolute opacity-5">
                <svg width="80" height="80" viewBox="0 0 100 100" class="text-blue-300 fill-current">
                    <path
                        d="M20,60 Q30,50 40,55 L45,58 L50,56 L55,58 L60,55 Q70,50 80,60 L78,65 Q68,55 58,60 L53,62 L48,60 L43,62 L38,60 Q28,55 18,65 Z" />
                    <rect x="15" y="65" width="70" height="4" rx="2" />
                </svg>
            </div>
            <div class="ice-skate-2 absolute opacity-5">
                <svg width="60" height="60" viewBox="0 0 100 100" class="text-cyan-300 fill-current">
                    <path
                        d="M20,60 Q30,50 40,55 L45,58 L50,56 L55,58 L60,55 Q70,50 80,60 L78,65 Q68,55 58,60 L53,62 L48,60 L43,62 L38,60 Q28,55 18,65 Z" />
                    <rect x="15" y="65" width="70" height="4" rx="2" />
                </svg>
            </div>

            <!-- Roller Skates Animation -->
            <div class="roller-skate-1 absolute opacity-5">
                <svg width="80" height="80" viewBox="0 0 100 100" class="text-gray-400 fill-current">
                    <rect x="20" y="40" width="60" height="25" rx="5" />
                    <circle cx="30" cy="75" r="8" />
                    <circle cx="45" cy="75" r="8" />
                    <circle cx="55" cy="75" r="8" />
                    <circle cx="70" cy="75" r="8" />
                </svg>
            </div>
            <div class="roller-skate-2 absolute opacity-5">
                <svg width="60" height="60" viewBox="0 0 100 100" class="text-gray-500 fill-current">
                    <rect x="20" y="40" width="60" height="25" rx="5" />
                    <circle cx="30" cy="75" r="8" />
                    <circle cx="45" cy="75" r="8" />
                    <circle cx="55" cy="75" r="8" />
                    <circle cx="70" cy="75" r="8" />
                </svg>
            </div>
        </div>

        <!-- Main Content -->
        <div class="relative z-10 container mx-auto px-4 py-12 sm:py-16 lg:py-20">
            <!-- Header -->
            <div class="text-center mb-12 sm:mb-16">
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
                    Academy Achievements
                </h1>
                <div class="w-24 h-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent mx-auto"></div>
                <p class="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                    Celebrating excellence in skating sports
                </p>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error"
                class="max-w-md mx-auto bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                <p class="text-red-800 font-medium">{{ error }}</p>
            </div>

            <!-- Achievements Grid -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                <div v-for="achievement in achievements" :key="achievement.id"
                    :class="getCategoryClass(achievement.competition_category)"
                    class="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <!-- Banner Image -->
                    <div class="relative h-56 sm:h-64 overflow-hidden">
                        <img :src="achievement.banner_image || 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800'"
                            :alt="achievement.title"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div :class="getCategoryOverlay(achievement.competition_category)" class="absolute inset-0">
                        </div>

                        <!-- Category Badge -->
                        <div class="absolute top-4 right-4">
                            <span :class="getCategoryBadge(achievement.competition_category)"
                                class="px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm shadow-lg">
                                {{ achievement.competition_category }}
                            </span>
                        </div>

                        <!-- Medal Count Overlay -->
                        <div class="absolute bottom-4 left-4 right-4 flex gap-3 justify-center">
                            <div v-if="achievement.gold_medals > 0"
                                class="flex items-center gap-1 bg-yellow-500 bg-opacity-90 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                <span class="text-white font-bold text-sm">🥇</span>
                                <span class="text-white font-bold text-sm">{{ achievement.gold_medals }}</span>
                            </div>
                            <div v-if="achievement.silver_medals > 0"
                                class="flex items-center gap-1 bg-gray-400 bg-opacity-90 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                <span class="text-white font-bold text-sm">🥈</span>
                                <span class="text-white font-bold text-sm">{{ achievement.silver_medals }}</span>
                            </div>
                            <div v-if="achievement.bronze_medals > 0"
                                class="flex items-center gap-1 bg-orange-600 bg-opacity-90 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                <span class="text-white font-bold text-sm">🥉</span>
                                <span class="text-white font-bold text-sm">{{ achievement.bronze_medals }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-6 bg-white">
                        <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                            {{ achievement.title }}
                        </h3>

                        <p class="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">
                            {{ achievement.description }}
                        </p>

                        <!-- Event Details -->
                        <div class="space-y-2 mb-4">
                            <div v-if="achievement.competition_name" class="flex items-start gap-2">
                                <span class="text-gray-900 font-semibold text-xs">🏆</span>
                                <span class="text-sm text-gray-700">{{ achievement.competition_name }}</span>
                            </div>
                            <div v-if="achievement.location" class="flex items-start gap-2">
                                <span class="text-gray-900 font-semibold text-xs">📍</span>
                                <span class="text-sm text-gray-700">{{ achievement.location }}</span>
                            </div>
                            <div v-if="achievement.event_date" class="flex items-start gap-2">
                                <span class="text-gray-900 font-semibold text-xs">📅</span>
                                <span class="text-sm text-gray-700">{{ formatDate(achievement.event_date) }}</span>
                            </div>
                            <div v-if="achievement.competition_level" class="flex items-start gap-2">
                                <span class="text-gray-900 font-semibold text-xs">🎯</span>
                                <span class="text-sm text-gray-700 capitalize">{{ achievement.competition_level }}
                                    Level</span>
                            </div>
                        </div>

                        <!-- Gallery Preview -->
                        <div v-if="achievement.images && achievement.images.length > 0"
                            class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            <img v-for="(image, index) in achievement.images.slice(0, 4)" :key="index" :src="image"
                                :alt="`Achievement ${index + 1}`"
                                class="w-16 h-16 rounded-lg object-cover flex-shrink-0 hover:scale-110 transition-transform cursor-pointer border-2 border-gray-200"
                                @click="openGallery(achievement.images, index)" />
                            <div v-if="achievement.images.length > 4"
                                class="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-gray-300 transition-colors">
                                <span class="text-gray-600 font-bold text-sm">+{{ achievement.images.length - 4
                                    }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Image Gallery Modal -->
            <div v-if="galleryOpen"
                class="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
                @click="closeGallery">
                <button class="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
                    @click="closeGallery">
                    ×
                </button>
                <button v-if="currentGallery.length > 1"
                    class="absolute left-4 text-white text-4xl hover:text-gray-300 transition-colors"
                    @click.stop="previousImage">
                    ‹
                </button>
                <button v-if="currentGallery.length > 1"
                    class="absolute right-4 text-white text-4xl hover:text-gray-300 transition-colors"
                    @click.stop="nextImage">
                    ›
                </button>
                <img :src="currentGallery[currentImageIndex]" class="max-w-full max-h-full object-contain"
                    @click.stop />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AcademyAchievements',
    data() {
        return {
            achievements: [],
            loading: true,
            error: null,
            galleryOpen: false,
            currentGallery: [],
            currentImageIndex: 0
        }
    },
    mounted() {
        this.fetchAchievements()
    },
    methods: {
        async fetchAchievements() {
            try {
                this.loading = true
                const response = await fetch('http://localhost:3000/vsa/academy-achievements')
                const data = await response.json()

                if (data.success) {
                    this.achievements = data.academyAchievements
                } else {
                    this.error = data.message || 'Failed to fetch achievements'
                }
            } catch (err) {
                this.error = 'Unable to load achievements. Please try again later.'
                console.error('Error fetching achievements:', err)
            } finally {
                this.loading = false
            }
        },

        getCategoryClass(category) {
            const classes = {
                'Ice Skating': 'bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200',
                'Roller Speed Skating': 'bg-gradient-to-br from-gray-50 to-slate-100 border-2 border-gray-300',
                'Roll Ball': 'bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200',
                'Record': 'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300',
                'Camp': 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
            }
            return classes[category] || 'bg-white border-2 border-gray-200'
        },

        getCategoryOverlay(category) {
            const overlays = {
                'Ice Skating': 'bg-gradient-to-t from-blue-900 via-cyan-900/50 to-transparent opacity-60',
                'Roller Speed Skating': 'bg-gradient-to-t from-gray-900 via-slate-800/50 to-transparent opacity-60',
                'Roll Ball': 'bg-gradient-to-t from-orange-900 via-red-900/50 to-transparent opacity-60',
                'Record': 'bg-gradient-to-t from-yellow-900 via-amber-900/50 to-transparent opacity-60',
                'Camp': 'bg-gradient-to-t from-green-900 via-emerald-900/50 to-transparent opacity-60'
            }
            return overlays[category] || 'bg-gradient-to-t from-gray-900 to-transparent opacity-60'
        },

        getCategoryBadge(category) {
            const badges = {
                'Ice Skating': 'bg-blue-500 bg-opacity-90 text-white',
                'Roller Speed Skating': 'bg-gray-700 bg-opacity-90 text-white',
                'Roll Ball': 'bg-orange-500 bg-opacity-90 text-white',
                'Record': 'bg-yellow-500 bg-opacity-90 text-gray-900',
                'Camp': 'bg-green-500 bg-opacity-90 text-white'
            }
            return badges[category] || 'bg-gray-800 bg-opacity-90 text-white'
        },

        formatDate(dateString) {
            if (!dateString) return ''
            const date = new Date(dateString)
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        },

        openGallery(images, index) {
            this.currentGallery = images
            this.currentImageIndex = index
            this.galleryOpen = true
            document.body.style.overflow = 'hidden'
        },

        closeGallery() {
            this.galleryOpen = false
            document.body.style.overflow = 'auto'
        },

        nextImage() {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.currentGallery.length
        },

        previousImage() {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.currentGallery.length) % this.currentGallery.length
        }
    }
}
</script>
<style scoped>
@keyframes float-ice-1 {

    0%,
    100% {
        transform: translate(10vw, 10vh) rotate(0deg);
    }

    25% {
        transform: translate(85vw, 20vh) rotate(90deg);
    }

    50% {
        transform: translate(80vw, 75vh) rotate(180deg);
    }

    75% {
        transform: translate(15vw, 70vh) rotate(270deg);
    }
}

@keyframes float-ice-2 {

    0%,
    100% {
        transform: translate(70vw, 80vh) rotate(45deg);
    }

    25% {
        transform: translate(20vw, 75vh) rotate(135deg);
    }

    50% {
        transform: translate(25vw, 15vh) rotate(225deg);
    }

    75% {
        transform: translate(75vw, 20vh) rotate(315deg);
    }
}

@keyframes float-roller-1 {

    0%,
    100% {
        transform: translate(80vw, 30vh) rotate(0deg);
    }

    33% {
        transform: translate(30vw, 60vh) rotate(120deg);
    }

    66% {
        transform: translate(60vw, 10vh) rotate(240deg);
    }
}

@keyframes float-roller-2 {

    0%,
    100% {
        transform: translate(15vw, 85vh) rotate(90deg);
    }

    33% {
        transform: translate(75vw, 50vh) rotate(210deg);
    }

    66% {
        transform: translate(40vw, 80vh) rotate(330deg);
    }
}

.ice-skate-1 {
    animation: float-ice-1 35s infinite ease-in-out;
}

.ice-skate-2 {
    animation: float-ice-2 40s infinite ease-in-out;
}

.roller-skate-1 {
    animation: float-roller-1 30s infinite ease-in-out;
}

.roller-skate-2 {
    animation: float-roller-2 38s infinite ease-in-out;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>