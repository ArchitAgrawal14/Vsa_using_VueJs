<!-- ItemCard.vue -->
<template>
  <div 
    @click="handleClick"
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
  >
    <div class="aspect-w-1 aspect-h-1 w-full bg-gray-200">
      <img
        :src="'http://localhost:3000' + item.main_image_path || '/placeholder-image.jpg'"
        :alt="item.name"
        class="w-full h-48 object-cover"
      />
    </div>
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-2 truncate" :title="item.name">
        {{ item.name }}
      </h3>
      <p class="text-sm text-gray-600">
        ID: <span class="font-medium">{{ item.item_id }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemCard',
  props: {
    item: {
      type: Object,
      required: true
    },
    itemType: {
      type: String,
      required: true // 'skatesAndBoots', 'wheels', 'helmets', 'bearings', 'accessories'
    }
  },
  methods: {
    handleClick() {
      this.$router.push({
        name: 'EditItem', // Make sure this route is registered
        query: {
          itemName: this.itemType,
          itemId: this.item.item_id
        }
      });
    }
  }
};
</script>