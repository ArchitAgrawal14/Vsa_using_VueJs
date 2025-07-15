<template>
  <div class="cancellation-refunds-container">
    <div class="policy-card">
      <h2 class="policy-header">Cancellation and Refunds</h2>

      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else class="policy-content">
        <ul class="policy-list">
          <li v-for="item in policies" :key="item.id" class="policy-item">
            <strong>{{ item.title }}:</strong>
            {{ item.content }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'CancellationRefunds',
  setup() {
    const policies = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const apiBaseURL = 'http://localhost:3000/vsa';

    const fetchPolicies = async () => {
      try {
        const response = await fetch(`${apiBaseURL}/cancellation-refunds`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

        // Assuming backend returns { success: true, data: [...] }
        if (data.success) {
          policies.value = data.data;
        } else {
          throw new Error('Failed to fetch cancellation refunds data.');
        }
      } catch (err) {
        console.error(err);
        error.value = 'Failed to load cancellation and refund policies.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchPolicies();
    });

    return { policies, loading, error };
  }
};
</script>

<style scoped>
.cancellation-refunds-container {
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

.policy-item strong {
  color: #333333;
  display: block;
  margin-bottom: 8px;
}

.policy-item:hover {
  background-color: #f5f5f5;
  border-left-color: #bbb;
  transition: all 0.3s ease;
}
</style>