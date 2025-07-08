<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const products = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/products')
    products.value = res.data
  } catch (error) {
    products.value = 'Error connecting to backend'
    console.error(error)
  }
})
</script>

<template>
  <!-- <div>
    <h2>Product List</h2>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{ product.name }} — ₹{{ product.price }}
      </li>
    </ul>
  </div> -->
</template>
