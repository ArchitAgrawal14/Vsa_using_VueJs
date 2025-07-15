<template>
  <div class="shipping-policy-container">
    <div class="policy-card">
      <h2 class="policy-header">Shipping Policy</h2>
      <div class="policy-content">
        <ul class="policy-list">
          <li
            v-for="item in shippingItems"
            :key="item.id"
            class="policy-item"
            v-html="item.content"
          ></li>
        </ul>

        <div v-if="loading">Loading shipping policy...</div>
        <div v-if="error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ShippingPolicy',
  setup() {
    const shippingItems = ref([])
    const loading = ref(true)
    const error = ref(null)
    const apiBaseURL = 'http://localhost:3000/vsa'
    const fetchShippingPolicy = async () => {
      try {
        const response = await fetch(`${apiBaseURL}/shipping-policy`)
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const data = await response.json()
        shippingItems.value = data
      } catch (err) {
        console.error(err)
        error.value = 'Failed to load shipping policy.'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchShippingPolicy()
    })

    return {
      shippingItems,
      loading,
      error,
    }
  },
}
</script>

<style scoped>
.shipping-policy-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  font-family: 'Arial', sans-serif;
}

.policy-card {
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.policy-header {
  color: #333333;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 15px;
}

.policy-content {
  color: #555555;
  line-height: 1.6;
}

.policy-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.policy-item {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #fafafa;
  border-left: 4px solid #ddd;
  border-radius: 4px;
}

.policy-item:hover {
  background-color: #f5f5f5;
  border-left-color: #bbb;
  transition: all 0.3s ease;
}

.subsection-header {
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.policy-item p {
  margin: 8px 0;
}
</style>
