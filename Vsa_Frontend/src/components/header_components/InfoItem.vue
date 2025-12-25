<template>
  <div class="bg-gray-50 rounded-lg p-4">
    <p class="text-sm text-gray-600 mb-1">{{ label }}</p>
    <p class="text-base font-medium text-gray-900">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    default: 'N/A'
  }
})
</script>