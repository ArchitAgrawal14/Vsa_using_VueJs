<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="bg-black text-white py-6 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold"></h1>
        <p class="text-gray-400 mt-1"></p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

      <!-- Image Assets Section -->
      <section class="mb-12 bg-gray-50 rounded-lg p-6 border-2 border-black">
        <h2 class="text-2xl font-bold mb-6 text-black">Image Assets</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="key in assetKeys" :key="key"
            class="bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-black transition-colors">
            <label class="block text-sm font-semibold text-black mb-2">
              {{ formatLabel(key) }}
            </label>

            <!-- Current Image Preview -->
            <div class="mb-3 border-2 border-gray-200 rounded overflow-hidden bg-gray-100">
              <img v-if="currentImages[key]" :src="'http://localhost:3000' + currentImages[key]" :alt="key"
                class="w-full h-32 object-contain" />
              <div v-else class="w-full h-32 flex items-center justify-center text-gray-400">
                No Image
              </div>
            </div>

            <!-- New Image Preview -->
            <div v-if="imageFiles[key]?.preview" class="mb-3 border-2 border-black rounded overflow-hidden">
              <img :src="imageFiles[key].preview" :alt="`New ${key}`" class="w-full h-32 object-contain" />
            </div>

            <!-- File Input -->
            <input type="file" :id="`file-${key}`" accept="image/*" @change="handleImageChange(key, $event)"
              class="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-2 file:border-black file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-black hover:file:text-white file:cursor-pointer cursor-pointer" />
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="updateImageAssets" :disabled="!hasImageUpdates || isUpdatingImages"
            class="px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            {{ isUpdatingImages ? 'Updating...' : 'Update Images' }}
          </button>
        </div>

        <!-- Success/Error Message for Images -->
        <div v-if="imageMessage"
          :class="['mt-4 p-4 rounded', imageMessage.type === 'success' ? 'bg-green-100 text-green-800 border-2 border-green-800' : 'bg-red-100 text-red-800 border-2 border-red-800']">
          {{ imageMessage.text }}
        </div>
      </section>

      <!-- Stats Section -->
      <section class="bg-gray-50 rounded-lg p-6 border-2 border-black">
        <h2 class="text-2xl font-bold mb-6 text-black">Dashboard Statistics</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="stat in stats" :key="stat.key"
            class="bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-black transition-colors">
            <label class="block text-sm font-semibold text-black mb-2">
              {{ formatLabel(stat.key) }}
            </label>

            <!-- Current Stat Display -->
            <div class="mb-4 p-3 bg-gray-100 rounded border border-gray-300">
              <div class="flex items-center gap-3">
                <img v-if="stat.currentImage" :src="'http://localhost:3000' + stat.currentImage" :alt="stat.key"
                  class="w-12 h-12 object-contain" />
                <div>
                  <p class="text-xs text-gray-600">Current Value</p>
                  <p class="text-lg font-bold text-black">{{ stat.currentValue || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- New Image Preview -->
            <div v-if="stat.newImagePreview" class="mb-3 border-2 border-black rounded p-2">
              <p class="text-xs text-gray-600 mb-1">New Image</p>
              <img :src="stat.newImagePreview" :alt="`New ${stat.key}`" class="w-12 h-12 object-contain" />
            </div>

            <!-- Value Input -->
            <div class="mb-3">
              <label class="block text-xs text-gray-600 mb-1">New Value</label>
              <input v-model="stat.newValue" type="text" placeholder="Enter new value"
                class="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none" />
            </div>

            <!-- Image Input -->
            <div>
              <label class="block text-xs text-gray-600 mb-1">New Image</label>
              <input type="file" :id="`stat-file-${stat.key}`" accept="image/*"
                @change="handleStatImageChange(stat.key, $event)"
                class="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-2 file:border-black file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-black hover:file:text-white file:cursor-pointer cursor-pointer" />
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="updateStats" :disabled="!hasStatUpdates || isUpdatingStats"
            class="px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            {{ isUpdatingStats ? 'Updating...' : 'Update Statistics' }}
          </button>
        </div>

        <!-- Success/Error Message for Stats -->
        <div v-if="statsMessage"
          :class="['mt-4 p-4 rounded', statsMessage.type === 'success' ? 'bg-green-100 text-green-800 border-2 border-green-800' : 'bg-red-100 text-red-800 border-2 border-red-800']">
          {{ statsMessage.text }}
        </div>
      </section>

      <!-- New Records Section -->
      <section class="mt-12 bg-gray-50 rounded-lg p-6 border-2 border-black">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-black">Add New Records</h2>
          <button @click="addRecordRow"
            class="px-4 py-2 bg-white text-black font-semibold rounded border-2 border-black hover:bg-black hover:text-white transition-colors">
            + Add Row
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="(record, index) in newRecords" :key="index"
            class="bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-black transition-colors">
            <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label class="block text-xs font-semibold text-black mb-1">Event</label>
                <input v-model="record.event" type="text" placeholder="100m Sprint"
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-black mb-1">Time</label>
                <input v-model="record.time" type="text" placeholder="12.34s"
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-black mb-1">Student Name</label>
                <input v-model="record.studentName" type="text" placeholder="Visheshta Singh"
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-black mb-1">Discipline</label>
                <select v-model="record.discipline"
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm">
                  <option v-for="disc in disciplines" :key="disc" :value="disc">{{ disc }}</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-black mb-1">Year</label>
                <input v-model.number="record.year" type="number" :min="2000" :max="new Date().getFullYear()"
                  class="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm" />
              </div>

              <div class="flex items-end gap-2">
                <div class="flex items-center">
                  <input v-model="record.isFeatured" type="checkbox" :id="`featured-${index}`"
                    class="w-4 h-4 border-2 border-gray-300 rounded focus:ring-black" />
                  <label :for="`featured-${index}`" class="ml-2 text-xs font-semibold text-black">Featured</label>
                </div>
                <button v-if="newRecords.length > 1" @click="removeRecordRow(index)"
                  class="px-3 py-2 bg-red-100 text-red-800 font-semibold rounded border-2 border-red-800 hover:bg-red-800 hover:text-white transition-colors text-sm">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="addNewRecords" :disabled="!hasValidRecords || isAddingRecords"
            class="px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            {{ isAddingRecords ? 'Adding...' : 'Add Records' }}
          </button>
        </div>

        <!-- Success/Error Message -->
        <div v-if="recordsMessage"
          :class="['mt-4 p-4 rounded', recordsMessage.type === 'success' ? 'bg-green-100 text-green-800 border-2 border-green-800' : 'bg-red-100 text-red-800 border-2 border-red-800']">
          {{ recordsMessage.text }}
        </div>

        <!-- Recently Added Records Preview -->
        <div v-if="recentRecords.length > 0" class="mt-8">
          <h3 class="text-lg font-bold text-black mb-4">Recently Added Records (Last 10)</h3>
          <div class="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
            <table class="w-full">
              <thead class="bg-black text-white">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase">Event</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase">Time</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase">Student</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase">Discipline</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase">Year</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase">Featured</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="record in recentRecords" :key="record.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm">{{ record.event }}</td>
                  <td class="px-4 py-3 text-sm">{{ record.time }}</td>
                  <td class="px-4 py-3 text-sm">{{ record.studentName }}</td>
                  <td class="px-4 py-3 text-sm">{{ record.discipline }}</td>
                  <td class="px-4 py-3 text-sm">{{ record.year }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span
                      :class="['px-2 py-1 rounded text-xs font-semibold', record.is_featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800']">
                      {{ record.is_featured ? 'Yes' : 'No' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Schedule Management Section -->
      <section class="mt-12 bg-gray-50 rounded-lg p-6 border-2 border-black">
        <h2 class="text-2xl font-bold mb-6 text-black">Update Schedule</h2>

        <div v-if="sortedScheduleAll.length > 0" class="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-black text-white">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase">Day</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase">Discipline</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase">Level</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase">Time</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase">Duration</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="schedule in sortedScheduleAll" :key="schedule.id"
                  :class="['hover:bg-gray-50', isScheduleEdited(schedule.id) ? 'bg-yellow-50' : '']">
                  <td class="px-4 py-3 text-sm font-semibold">{{ schedule.day }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span :class="[
                      'px-2 py-1 rounded text-xs font-semibold',
                      schedule.discipline === 'Roller Skating' ? 'bg-blue-100 text-blue-800' :
                        schedule.discipline === 'Ice Skating' ? 'bg-cyan-100 text-cyan-800' :
                          'bg-purple-100 text-purple-800'
                    ]">
                      {{ schedule.discipline }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <select :value="editedSchedules[schedule.id]?.level || schedule.level"
                      @change="trackScheduleEdit(schedule.id, 'level', $event.target.value)"
                      class="w-full px-2 py-1 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </td>
                  <td class="px-4 py-3">
                    <input type="text" :value="editedSchedules[schedule.id]?.time || schedule.time"
                      @input="trackScheduleEdit(schedule.id, 'time', $event.target.value)" placeholder="6:00 AM"
                      class="w-full px-2 py-1 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm" />
                  </td>
                  <td class="px-4 py-3">
                    <input type="text" :value="editedSchedules[schedule.id]?.duration || schedule.duration"
                      @input="trackScheduleEdit(schedule.id, 'duration', $event.target.value)" placeholder="2 hours"
                      class="w-full px-2 py-1 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          No schedule data available
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="updateSchedule" :disabled="!hasScheduleUpdates || isUpdatingSchedule"
            class="px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            {{ isUpdatingSchedule ? 'Updating...' : 'Update Schedule' }}
          </button>
        </div>

        <!-- Success/Error Message -->
        <div v-if="scheduleMessage"
          :class="['mt-4 p-4 rounded', scheduleMessage.type === 'success' ? 'bg-green-100 text-green-800 border-2 border-green-800' : 'bg-red-100 text-red-800 border-2 border-red-800']">
          {{ scheduleMessage.text }}
        </div>

        <!-- Schedule by Discipline Preview -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Roller Skating -->
          <div v-if="scheduleData.roller.length > 0" class="bg-white border-2 border-blue-300 rounded-lg p-4">
            <h3 class="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
              <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
              Roller Skating ({{ scheduleData.roller.length }})
            </h3>
            <div class="space-y-2">
              <div v-for="item in scheduleData.roller" :key="item.id" class="text-sm border-b border-gray-200 pb-2">
                <p class="font-semibold">{{ item.day }}</p>
                <p class="text-gray-600">{{ item.time }} • {{ item.duration }} • {{ item.level }}</p>
              </div>
            </div>
          </div>

          <!-- Ice Skating -->
          <div v-if="scheduleData.ice.length > 0" class="bg-white border-2 border-cyan-300 rounded-lg p-4">
            <h3 class="text-lg font-bold text-cyan-800 mb-3 flex items-center gap-2">
              <span class="w-3 h-3 bg-cyan-500 rounded-full"></span>
              Ice Skating ({{ scheduleData.ice.length }})
            </h3>
            <div class="space-y-2">
              <div v-for="item in scheduleData.ice" :key="item.id" class="text-sm border-b border-gray-200 pb-2">
                <p class="font-semibold">{{ item.day }}</p>
                <p class="text-gray-600">{{ item.time }} • {{ item.duration }} • {{ item.level }}</p>
              </div>
            </div>
          </div>

          <!-- Roll Ball -->
          <div v-if="scheduleData.rollBall.length > 0" class="bg-white border-2 border-purple-300 rounded-lg p-4">
            <h3 class="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
              <span class="w-3 h-3 bg-purple-500 rounded-full"></span>
              Roll Ball ({{ scheduleData.rollBall.length }})
            </h3>
            <div class="space-y-2">
              <div v-for="item in scheduleData.rollBall" :key="item.id" class="text-sm border-b border-gray-200 pb-2">
                <p class="font-semibold">{{ item.day }}</p>
                <p class="text-gray-600">{{ item.time }} • {{ item.duration }} • {{ item.level }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Programs Management Section -->
      <section class="mt-12 bg-gray-50 rounded-lg p-6 border-2 border-black">
        <h2 class="text-2xl font-bold mb-6 text-black">Update Programs</h2>

        <div v-if="sortedPrograms.length > 0" class="space-y-4">
          <div v-for="program in sortedPrograms" :key="program.id" :class="['bg-white border-2 rounded-lg p-5 transition-colors',
            isProgramEdited(program.id) ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 hover:border-black']">
            <div class="flex items-start gap-4">
              <!-- Program Image -->
              <div class="flex-shrink-0">
                <img :src="'http://localhost:3000' + program.image" :alt="program.title"
                  class="w-24 h-24 object-cover rounded border-2 border-gray-200" />
              </div>

              <!-- Program Details -->
              <div class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-black mb-1">Title</label>
                  <input type="text" :value="editedPrograms[program.id]?.title || program.title"
                    @input="trackProgramEdit(program.id, 'title', $event.target.value)"
                    class="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-black mb-1">Category</label>
                  <select :value="editedPrograms[program.id]?.category || program.category"
                    @change="trackProgramEdit(program.id, 'category', $event.target.value)"
                    class="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm">
                    <option v-for="cat in programCategories" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-xs font-semibold text-black mb-1">Description (Min 10 words and no more the 10 words)</label>
                  <textarea :value="editedPrograms[program.id]?.description || program.description"
                    @input="trackProgramEdit(program.id, 'description', $event.target.value)" rows="2"
                    class="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm"></textarea>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-black mb-1">Price (₹)</label>
                  <input type="number" :value="editedPrograms[program.id]?.price || program.price"
                    @input="trackProgramEdit(program.id, 'price', $event.target.value)" min="0"
                    class="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-black mb-1">Fee Cycle</label>
                  <select :value="editedPrograms[program.id]?.feeCycle || program.fee_cycle"
                    @change="trackProgramEdit(program.id, 'feeCycle', $event.target.value)"
                    class="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm">
                    <option v-for="cycle in feeCycles" :key="cycle" :value="cycle">{{ cycle }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          No programs available
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="updatePrograms" :disabled="!hasProgramUpdates || isUpdatingPrograms"
            class="px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            {{ isUpdatingPrograms ? 'Updating...' : 'Update Programs' }}
          </button>
        </div>

        <!-- Success/Error Message -->
        <div v-if="programsMessage"
          :class="['mt-4 p-4 rounded', programsMessage.type === 'success' ? 'bg-green-100 text-green-800 border-2 border-green-800' : 'bg-red-100 text-red-800 border-2 border-red-800']">
          {{ programsMessage.text }}
        </div>
      </section>

      <!-- Coaches Management Section -->
      <section class="mt-12 bg-gray-50 rounded-lg p-6 border-2 border-black">
        <h2 class="text-2xl font-bold mb-6 text-black">Update Coaches</h2>

        <div v-if="sortedCoaches.length > 0" class="space-y-4">
          <div v-for="coach in sortedCoaches" :key="coach.id" :class="['bg-white border-2 rounded-lg p-5 transition-colors',
            isCoachEdited(coach.id) ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 hover:border-black']">
            <div class="flex items-start gap-4">
              <!-- Coach Image -->
              <div class="flex-shrink-0">
                <img :src="'http://localhost:3000' + coach.image" :alt="coach.name"
                  class="w-24 h-24 object-cover rounded-full border-2 border-gray-200" />
              </div>

              <!-- Coach Details -->
              <div class="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-black mb-1">Name</label>
                  <input type="text" :value="editedCoaches[coach.id]?.name || coach.name"
                    @input="trackCoachEdit(coach.id, 'name', $event.target.value)"
                    class="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-black mb-1">Specialization</label>
                  <input type="text" :value="editedCoaches[coach.id]?.specialization || coach.specialization"
                    @input="trackCoachEdit(coach.id, 'specialization', $event.target.value)"
                    class="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-black mb-1">Experience</label>
                  <input type="text" :value="editedCoaches[coach.id]?.experience || coach.experience"
                    @input="trackCoachEdit(coach.id, 'experience', $event.target.value)" placeholder="e.g., 10+ years"
                    class="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          No coaches available
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="updateCoaches" :disabled="!hasCoachUpdates || isUpdatingCoaches"
            class="px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            {{ isUpdatingCoaches ? 'Updating...' : 'Update Coaches' }}
          </button>
        </div>

        <!-- Success/Error Message -->
        <div v-if="coachesMessage"
          :class="['mt-4 p-4 rounded', coachesMessage.type === 'success' ? 'bg-green-100 text-green-800 border-2 border-green-800' : 'bg-red-100 text-red-800 border-2 border-red-800']">
          {{ coachesMessage.text }}
        </div>
      </section>

    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Image Assets
      assetKeys: [
        "logo_image", "hero_image", "skate_icon", "check_icon",
        "roller_skate_image", "ice_skate_image", "skating_banner",
        "roller_speed_image", "roller_icon", "ice_icon", "ice_speed_image"
      ],
      currentImages: {},
      imageFiles: {},
      isUpdatingImages: false,
      imageMessage: null,

      // Stats
      stats: [
        { key: "Active_Students", currentValue: "", currentImage: "", newValue: "", newImage: null, newImagePreview: null },
        { key: "Expert_Coaches", currentValue: "", currentImage: "", newValue: "", newImage: null, newImagePreview: null },
        { key: "Championships_Won", currentValue: "", currentImage: "", newValue: "", newImage: null, newImagePreview: null },
        { key: "Years_Experience", currentValue: "", currentImage: "", newValue: "", newImage: null, newImagePreview: null }
      ],
      isUpdatingStats: false,
      statsMessage: null,
      newRecords: [
        {
          event: "",
          time: "",
          studentName: "",
          discipline: "Roller Skating",
          year: new Date().getFullYear(),
          isFeatured: true
        }
      ],
      disciplines: ['Roller Skating', 'Ice Skating', 'Roll Ball'],
      recentRecords: [],
      isAddingRecords: false,
      recordsMessage: null,
      // Schedule
      scheduleData: {
        all: [],
        roller: [],
        ice: [],
        rollBall: []
      },
      editedSchedules: {},
      isUpdatingSchedule: false,
      scheduleMessage: null,
      daysOrder: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      // Programs
      programsData: [],
      editedPrograms: {},
      isUpdatingPrograms: false,
      programsMessage: null,
      programCategories: ['Roller', 'Ice', 'Roll Ball'],
      feeCycles: ['monthly', 'quarterly', 'half-yearly','yearly'],

      // Coaches
      coachesData: [],
      editedCoaches: {},
      isUpdatingCoaches: false,
      coachesMessage: null,
      // API Base URL - adjust as needed
      apiBaseUrl: "http://localhost:3000/vsa"
    };
  },
  computed: {
    hasImageUpdates() {
      return Object.keys(this.imageFiles).length > 0;
    },
    hasStatUpdates() {
      return this.stats.some(stat => stat.newValue || stat.newImage);
    },
    hasValidRecords() {
      return this.newRecords.some(record =>
        record.event && record.time && record.studentName && record.discipline
      );
    },
    hasScheduleUpdates() {
      return Object.keys(this.editedSchedules).length > 0;
    },

    sortedScheduleAll() {
      return [...this.scheduleData.all].sort((a, b) => {
        return this.daysOrder.indexOf(a.day) - this.daysOrder.indexOf(b.day);
      });
    },
    hasProgramUpdates() {
      return Object.keys(this.editedPrograms).length > 0;
    },

    hasCoachUpdates() {
      return Object.keys(this.editedCoaches).length > 0;
    },

    sortedPrograms() {
      return [...this.programsData].sort((a, b) => a.display_order - b.display_order);
    },

    sortedCoaches() {
      return [...this.coachesData].sort((a, b) => a.display_order - b.display_order);
    },
  },
  mounted() {
    this.fetchDashboardData();
  },
  methods: {
    formatLabel(key) {
      return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },

    async fetchDashboardData() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/dashboard`);
        const data = await response.json();

        if (data.success) {
          // Populate current images
          this.currentImages = { ...data.data.images };

          // Populate current stats
          data.data.stats.forEach(stat => {
            const statObj = this.stats.find(s => s.key === stat.label.replace(/ /g, '_'));
            if (statObj) {
              statObj.currentValue = stat.value;
              statObj.currentImage = stat.image;
            }
          });
          // Populate recent records
          if (data.data.records) {
            this.recentRecords = data.data.records;
          }

          // Populate schedule data
          if (data.data.schedule) {
            this.scheduleData = data.data.schedule;
          }

          // Populate programs data
          if (data.data.programs) {
            this.programsData = data.data.programs;
          }

          // Populate coaches data
          if (data.data.coaches) {
            this.coachesData = data.data.coaches;
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    },

    handleImageChange(key, event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageFiles[key] = {
            file: file,
            preview: e.target.result
          };
        };
        reader.readAsDataURL(file);
      }
    },

    handleStatImageChange(key, event) {
      const file = event.target.files[0];
      if (file) {
        const stat = this.stats.find(s => s.key === key);
        if (stat) {
          const reader = new FileReader();
          reader.onload = (e) => {
            stat.newImage = file;
            stat.newImagePreview = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }
    },

    async updateImageAssets() {
      this.isUpdatingImages = true;
      this.imageMessage = null;

      const formData = new FormData();
      Object.keys(this.imageFiles).forEach(key => {
        formData.append(key, this.imageFiles[key].file);
      });

      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(`${this.apiBaseUrl}/admin/edit-image-assets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'PUT',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          this.imageMessage = { type: 'success', text: data.message };
          this.imageFiles = {};
          // Clear file inputs
          this.assetKeys.forEach(key => {
            const input = document.getElementById(`file-${key}`);
            if (input) input.value = '';
          });
          await this.fetchDashboardData();
        } else {
          this.imageMessage = { type: 'error', text: data.message };
        }
      } catch (error) {
        this.imageMessage = { type: 'error', text: 'Failed to update images' };
      } finally {
        this.isUpdatingImages = false;
      }
    },

    async updateStats() {
      this.isUpdatingStats = true;
      this.statsMessage = null;

      const formData = new FormData();
      const values = {};

      this.stats.forEach(stat => {
        if (stat.newValue) {
          values[stat.key] = stat.newValue;
        }
        if (stat.newImage) {
          formData.append(stat.key, stat.newImage);
        }
      });

      if (Object.keys(values).length > 0) {
        formData.append('values', JSON.stringify(values));
      }

      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(`${this.apiBaseUrl}/admin/edit-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'PUT',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          this.statsMessage = { type: 'success', text: data.message };
          // Clear inputs
          this.stats.forEach(stat => {
            stat.newValue = '';
            stat.newImage = null;
            stat.newImagePreview = null;
            const input = document.getElementById(`stat-file-${stat.key}`);
            if (input) input.value = '';
          });
          await this.fetchDashboardData();
        } else {
          this.statsMessage = { type: 'error', text: data.message };
        }
      } catch (error) {
        this.statsMessage = { type: 'error', text: 'Failed to update statistics' };
      } finally {
        this.isUpdatingStats = false;
      }
    },

    addRecordRow() {
      this.newRecords.push({
        event: "",
        time: "",
        studentName: "",
        discipline: "Roller Skating",
        year: new Date().getFullYear(),
        isFeatured: true
      });
    },

    removeRecordRow(index) {
      if (this.newRecords.length > 1) {
        this.newRecords.splice(index, 1);
      }
    },

    async addNewRecords() {
      this.isAddingRecords = true;
      this.recordsMessage = null;

      // Filter out empty records
      const validRecords = this.newRecords.filter(record =>
        record.event && record.time && record.studentName && record.discipline
      );

      if (validRecords.length === 0) {
        this.recordsMessage = { type: 'error', text: 'Please fill in at least one complete record' };
        this.isAddingRecords = false;
        return;
      }

      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(`${this.apiBaseUrl}/admin/add-new-record`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ records: validRecords })
        });

        const data = await response.json();

        if (data.success) {
          this.recordsMessage = { type: 'success', text: data.message };
          // Reset to single empty row
          this.newRecords = [{
            event: "",
            time: "",
            studentName: "",
            discipline: "Roller Skating",
            year: new Date().getFullYear(),
            isFeatured: true
          }];
          await this.fetchDashboardData();
        } else {
          this.recordsMessage = { type: 'error', text: data.message };
        }
      } catch (error) {
        this.recordsMessage = { type: 'error', text: 'Failed to add records' };
      } finally {
        this.isAddingRecords = false;
      }
    },

    trackScheduleEdit(scheduleId, field, value) {
      if (!this.editedSchedules[scheduleId]) {
        const original = this.scheduleData.all.find(s => s.id === scheduleId);
        this.editedSchedules[scheduleId] = {
          id: scheduleId,
          day: original.day,
          discipline: original.discipline,
          level: original.level,
          time: original.time,
          duration: original.duration
        };
      }
      this.editedSchedules[scheduleId][field] = value;
    },

    async updateSchedule() {
      this.isUpdatingSchedule = true;
      this.scheduleMessage = null;

      const schedulesToUpdate = Object.values(this.editedSchedules);

      if (schedulesToUpdate.length === 0) {
        this.scheduleMessage = { type: 'error', text: 'No changes to update' };
        this.isUpdatingSchedule = false;
        return;
      }

      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(`${this.apiBaseUrl}/admin/update-schedule`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ allSchedule: schedulesToUpdate })
        });

        const data = await response.json();

        if (data.success) {
          this.scheduleMessage = { type: 'success', text: `${data.message} (${data.updatedRows} rows updated)` };
          this.editedSchedules = {};
          await this.fetchDashboardData();
        } else {
          this.scheduleMessage = { type: 'error', text: data.message };
        }
      } catch (error) {
        this.scheduleMessage = { type: 'error', text: 'Failed to update schedule' };
      } finally {
        this.isUpdatingSchedule = false;
      }
    },

    isScheduleEdited(scheduleId) {
      return !!this.editedSchedules[scheduleId];
    },

    trackProgramEdit(programId, field, value) {
      if (!this.editedPrograms[programId]) {
        const original = this.programsData.find(p => p.id === programId);
        this.editedPrograms[programId] = {
          id: programId,
          title: original.title,
          category: original.category,
          description: original.description,
          price: original.price,
          feeCycle: original.fee_cycle
        };
      }
      this.editedPrograms[programId][field] = value;
    },

    async updatePrograms() {
      this.isUpdatingPrograms = true;
      this.programsMessage = null;

      const programsToUpdate = Object.values(this.editedPrograms);

      if (programsToUpdate.length === 0) {
        this.programsMessage = { type: 'error', text: 'No changes to update' };
        this.isUpdatingPrograms = false;
        return;
      }

      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(`${this.apiBaseUrl}/admin/update-programs`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ updatedProgramsData: programsToUpdate })
        });

        const data = await response.json();

        if (data.success) {
          this.programsMessage = { type: 'success', text: `${data.message} (${data.updatedRows} rows updated)` };
          this.editedPrograms = {};
          await this.fetchDashboardData();
        } else {
          this.programsMessage = { type: 'error', text: data.message };
        }
      } catch (error) {
        this.programsMessage = { type: 'error', text: 'Failed to update programs' };
      } finally {
        this.isUpdatingPrograms = false;
      }
    },

    isProgramEdited(programId) {
      return !!this.editedPrograms[programId];
    },

    trackCoachEdit(coachId, field, value) {
      if (!this.editedCoaches[coachId]) {
        const original = this.coachesData.find(c => c.id === coachId);
        this.editedCoaches[coachId] = {
          id: coachId,
          name: original.name,
          specialization: original.specialization,
          experience: original.experience
        };
      }
      this.editedCoaches[coachId][field] = value;
    },

    async updateCoaches() {
      this.isUpdatingCoaches = true;
      this.coachesMessage = null;

      const coachesToUpdate = Object.values(this.editedCoaches);

      if (coachesToUpdate.length === 0) {
        this.coachesMessage = { type: 'error', text: 'No changes to update' };
        this.isUpdatingCoaches = false;
        return;
      }

      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(`${this.apiBaseUrl}/admin/update-coaches`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ updatedCoachesData: coachesToUpdate })
        });

        const data = await response.json();

        if (data.success) {
          this.coachesMessage = { type: 'success', text: `${data.message} (${data.updatedRows} rows updated)` };
          this.editedCoaches = {};
          await this.fetchDashboardData();
        } else {
          this.coachesMessage = { type: 'error', text: data.message };
        }
      } catch (error) {
        this.coachesMessage = { type: 'error', text: 'Failed to update coaches' };
      } finally {
        this.isUpdatingCoaches = false;
      }
    },

    isCoachEdited(coachId) {
      return !!this.editedCoaches[coachId];
    }
  }
};
</script>