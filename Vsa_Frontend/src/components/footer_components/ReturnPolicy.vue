<template>
  <div class="return-policy-container">
    <div class="policy-card">
      <h2 class="policy-header">Return Policy</h2>
      <div class="policy-content">
        <ol class="policy-list">
          <li v-for="item in returnItems" :key="item.id" class="policy-item">
            <span class="item-number">{{ item.step_number }}.</span>
            <div class="item-content">
              {{ item.description }}
            </div>
          </li>
        </ol>

        <div v-if="loading">Loading return policy...</div>
        <div v-if="error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ReturnPolicy',
  setup() {
    const returnItems = ref([])
    const loading = ref(true)
    const error = ref(null)
    const apiBaseURL = 'http://localhost:3000/vsa'
    const fetchReturnPolicy = async () => {
      try {
        const response = await fetch(`${apiBaseURL}/return-policy`)
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const data = await response.json()
        returnItems.value = data
      } catch (err) {
        console.error(err)
        error.value = 'Failed to load return policy.'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchReturnPolicy()
    })

    return {
      returnItems,
      loading,
      error,
    }
  },
}
</script>

<style scoped>
.return-policy-container {
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
  counter-reset: item-counter;
}

.policy-item {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #fafafa;
  border-left: 4px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
}

.policy-item:hover {
  background-color: #f5f5f5;
  border-left-color: #bbb;
  transition: all 0.3s ease;
}

.item-number {
  background-color: #333333;
  color: #ffffff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin-right: 15px;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  padding-top: 2px;
}
</style>
