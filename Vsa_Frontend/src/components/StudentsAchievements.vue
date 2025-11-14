<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <!-- Background Animations -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div class="trophy trophy-1">🏆</div>
            <div class="trophy trophy-2">🏆</div>
            <div class="skate skate-1">⛸️</div>
            <div class="skate skate-2">🛼</div>
            <div class="skate skate-3">⛸️</div>
        </div>

        <!-- Main Content -->
        <div class="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
            <!-- Header -->
            <div class="text-center mb-8 mt-24">
                <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                    Our Precious Students Achievements
                </h1>
                <p class="text-gray-600 text-lg">
                    Every glide, every fall, and every comeback shapes our young skaters into champions.
                    From small victories to remarkable milestones, we proudly celebrate their dedication, spirit, and
                    journey of excellence.
                </p>
            </div>

            <!-- Search Bar -->
            <div class="mb-8 max-w-2xl mx-auto">
                <div class="relative">
                    <input v-model="searchQuery" type="text" placeholder="Search by student name, school, or group..."
                        class="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-gray-900 focus:outline-none text-gray-900 placeholder-gray-400 shadow-lg transition-all" />
                    <svg class="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-20">
                <div
                    class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900">
                </div>
                <p class="mt-4 text-gray-600">Loading students...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-20">
                <p class="text-red-600 text-lg">{{ error }}</p>
                <button @click="fetchStudents"
                    class="mt-4 px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">
                    Retry
                </button>
            </div>

            <!-- Students Grid -->
            <div v-else-if="filteredStudents.length > 0"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div v-for="student in filteredStudents" :key="student.student_id" @click="openModal(student)"
                    class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-gray-900">
                    <div class="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                        <img v-if="student.img" :src="student.img" :alt="student.full_name"
                            class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center text-6xl text-gray-400">
                            👤
                        </div>
                        <div v-if="student.achievements.length > 0"
                            class="absolute top-3 right-3 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            🏆 {{ student.achievements.length }}
                        </div>
                    </div>

                    <div class="p-5">
                        <h3 class="text-lg font-bold text-gray-900 mb-2 truncate">
                            {{ student.full_name }}
                        </h3>
                        <p class="text-sm text-gray-600 mb-1 truncate">
                            📚 {{ student.school_name || 'N/A' }}
                        </p>
                        <p class="text-sm text-gray-600 mb-3">
                            👥 {{ student.student_group || 'N/A' }}
                        </p>
                        <div class="flex items-center justify-between">
                            <span
                                :class="student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                                class="px-3 py-1 rounded-full text-xs font-semibold">
                                {{ student.status }}
                            </span>
                            <span class="text-xs text-gray-500">View Details →</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- No Results -->
            <div v-else class="text-center py-20">
                <p class="text-gray-600 text-lg">No students found matching your search.</p>
            </div>
        </div>

        <!-- Modal -->
        <transition name="modal">
            <div v-if="selectedStudent"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
                @click.self="closeModal">
                <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    <!-- Modal Header -->
                    <div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 relative">
                        <button @click="closeModal"
                            class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all">
                            ✕
                        </button>

                        <div class="flex items-center gap-6">
                            <div
                                class="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                                <img v-if="selectedStudent.img" :src="selectedStudent.img"
                                    :alt="selectedStudent.full_name" class="w-full h-full object-cover" />
                                <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">
                                    👤
                                </div>
                            </div>

                            <div>
                                <h2 class="text-3xl font-bold mb-2">{{ selectedStudent.full_name }}</h2>
                                <p class="text-gray-200">{{ selectedStudent.school_name || 'N/A' }}</p>
                                <p class="text-sm text-gray-300 mt-1">Group: {{ selectedStudent.student_group || 'N/A'
                                    }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Body -->
                    <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                        <!-- Student Details -->
                        <div class="bg-gray-50 rounded-2xl p-5 mb-6">
                            <h3 class="text-xl font-bold text-gray-900 mb-4">Student Information</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="text-gray-600">Father's Name:</span>
                                    <span class="ml-2 font-semibold text-gray-900">{{ selectedStudent.father_name ||
                                        'N/A' }}</span>
                                </div>
                                <div>
                                    <span class="text-gray-600">Mother's Name:</span>
                                    <span class="ml-2 font-semibold text-gray-900">{{ selectedStudent.mother_name ||
                                        'N/A' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Achievements -->
                        <div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                🏆 Achievements
                                <span class="text-lg text-gray-600">({{ selectedStudent.achievements.length }})</span>
                            </h3>

                            <div v-if="selectedStudent.achievements.length === 0"
                                class="text-center py-10 text-gray-500">
                                No achievements recorded yet.
                            </div>

                            <div v-else class="space-y-4">
                                <div v-for="(achievement, index) in selectedStudent.achievements" :key="index"
                                    class="bg-white border-2 border-gray-200 rounded-2xl p-5 hover:border-gray-900 transition-all">
                                    <div class="flex items-start justify-between mb-3">
                                        <h4 class="text-lg font-bold text-gray-900 flex-1">
                                            {{ achievement.achievement_title }}
                                        </h4>
                                        <span
                                            class="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-semibold ml-2">
                                            {{ achievement.achievement_level }}
                                        </span>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                                        <div>
                                            <span class="text-gray-600">Type:</span>
                                            <span class="ml-2 font-semibold text-gray-900">{{
                                                achievement.achievement_type }}</span>
                                        </div>
                                        <div>
                                            <span class="text-gray-600">Date:</span>
                                            <span class="ml-2 font-semibold text-gray-900">{{
                                                formatDate(achievement.date_of_achievement) }}</span>
                                        </div>
                                    </div>

                                    <div v-if="achievement.event_name" class="mb-2 text-sm">
                                        <span class="text-gray-600">Event:</span>
                                        <span class="ml-2 font-semibold text-gray-900">{{ achievement.event_name
                                            }}</span>
                                    </div>

                                    <div v-if="achievement.remarks"
                                        class="mb-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                        {{ achievement.remarks }}
                                    </div>

                                    <a v-if="achievement.link" :href="achievement.link" target="_blank"
                                        class="inline-flex items-center gap-2 text-sm text-gray-900 hover:text-gray-700 font-semibold transition-colors">
                                        🔗 View Link
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'StudentAchievements',
    data() {
        return {
            students: [],
            selectedStudent: null,
            searchQuery: '',
            loading: false,
            error: null
        };
    },
    computed: {
        filteredStudents() {
            if (!this.searchQuery.trim()) {
                return this.students;
            }

            const query = this.searchQuery.toLowerCase();
            return this.students.filter(student => {
                return (
                    student.full_name.toLowerCase().includes(query) ||
                    (student.school_name && student.school_name.toLowerCase().includes(query)) ||
                    (student.student_group && student.student_group.toLowerCase().includes(query))
                );
            });
        }
    },
    mounted() {
        this.fetchStudents();
    },
    methods: {
        async fetchStudents() {
            this.loading = true;
            this.error = null;

            try {
                const response = await fetch('http://localhost:3000/vsa/student_achievements');
                const result = await response.json();

                if (result.success) {
                    this.students = result.data;
                } else {
                    this.error = result.message || 'Failed to fetch students';
                }
            } catch (err) {
                this.error = 'Network error. Please check your connection.';
                console.error('Fetch error:', err);
            } finally {
                this.loading = false;
            }
        },
        openModal(student) {
            this.selectedStudent = student;
            document.body.style.overflow = 'hidden';
        },
        closeModal() {
            this.selectedStudent = null;
            document.body.style.overflow = 'auto';
        },
        formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }
};
</script>

<style scoped>
/* Background Animations */
@keyframes float {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    50% {
        transform: translateY(-20px) rotate(5deg);
    }
}

@keyframes float-reverse {

    0%,
    100% {
        transform: translateY(0px) rotate(0deg);
    }

    50% {
        transform: translateY(20px) rotate(-5deg);
    }
}

.trophy,
.skate {
    position: absolute;
    font-size: 3rem;
    opacity: 0.08;
    animation-duration: 8s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
}

.trophy-1 {
    top: 10%;
    left: 5%;
    animation-name: float;
    animation-delay: 0s;
}

.trophy-2 {
    bottom: 15%;
    right: 8%;
    animation-name: float-reverse;
    animation-delay: 2s;
}

.skate-1 {
    top: 30%;
    right: 10%;
    animation-name: float;
    animation-delay: 1s;
}

.skate-2 {
    bottom: 30%;
    left: 8%;
    animation-name: float-reverse;
    animation-delay: 3s;
}

.skate-3 {
    top: 60%;
    left: 15%;
    animation-name: float;
    animation-delay: 4s;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
    transition: transform 0.3s ease;
}

.modal-enter-from .bg-white {
    transform: scale(0.9);
}

.modal-leave-to .bg-white {
    transform: scale(0.9);
}

/* Scrollbar Styling */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>