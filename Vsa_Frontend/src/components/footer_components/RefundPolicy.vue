<template>
  <div class="refund-policy-container">
    <div class="policy-card">
      <div class="policy-header-section">
        <h2 class="policy-header">Cancellation and Refunds</h2>
        <button v-if="showCloseButton" @click="closePolicy" class="close-button">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="policy-content">
        <ul class="refund-list">
          <li v-for="item in refundItems" :key="item.id" class="refund-item">
            <div class="item-icon">
              <i class="fas fa-circle"></i>
            </div>
            <div class="item-content">
              <strong>{{ item.heading }}:</strong>
              {{ item.description }}
            </div>
          </li>
        </ul>

        <div v-if="loading">Loading refund policy...</div>
        <div v-if="error">{{ error }}</div>
      </div>

      <div class="policy-footer" v-if="showCloseButton">
        <button @click="closePolicy" class="close-policy-button">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'RefundPolicy',
  props: {
    showCloseButton: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const refundItems = ref([])
    const loading = ref(true)
    const error = ref(null)
    const apiBaseURL = 'http://localhost:3000/vsa'
    const fetchRefundPolicy = async () => {
      try {
        const response = await fetch(`${apiBaseURL}/refund-policy`)
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const data = await response.json()
        refundItems.value = data
      } catch (err) {
        console.error(err)
        error.value = 'Failed to load refund policy.'
      } finally {
        loading.value = false
      }
    }

    const closePolicy = () => {
      emit('close-policy')
    }

    onMounted(() => {
      fetchRefundPolicy()
    })

    return {
      refundItems,
      loading,
      error,
      closePolicy,
      props,
    }
  },
}
</script>

<style scoped>
.refund-policy-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  font-family: 'Arial', sans-serif;
}

.policy-card {
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
}

.policy-header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 15px;
}

.policy-header {
  color: #333333;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  color: #666666;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  transition: all 0.3s ease;
}

.close-button:hover {
  background-color: #f5f5f5;
  color: #333333;
}

.policy-content {
  color: #555555;
  line-height: 1.6;
}

.refund-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.refund-item {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  transition: all 0.3s ease;
}

.refund-item:hover {
  background-color: #f5f5f5;
  border-color: #ddd;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-icon {
  background-color: #333333;
  color: #ffffff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
  font-size: 16px;
}

.item-content {
  flex: 1;
  padding-top: 2px;
}

.item-content strong {
  color: #333333;
  display: block;
  margin-bottom: 5px;
  font-size: 16px;
}

.policy-footer {
  margin-top: 30px;
  text-align: center;
  border-top: 1px solid #e5e5e5;
  padding-top: 20px;
}

.close-policy-button {
  background-color: #333333;
  color: #ffffff;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-policy-button:hover {
  background-color: #555555;
  transform: translateY(-1px);
}

/* Responsive design */
@media (max-width: 768px) {
  .refund-policy-container {
    padding: 10px;
  }

  .policy-card {
    padding: 20px;
  }

  .policy-header {
    font-size: 24px;
  }

  .refund-item {
    padding: 15px;
    flex-direction: column;
    text-align: center;
  }

  .item-icon {
    margin-right: 0;
    margin-bottom: 10px;
    align-self: center;
  }

  .item-content {
    padding-top: 0;
  }
}

/* Font Awesome fallback styling */
.fas {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}

/* If Font Awesome is not available, use text fallbacks */
.fa-undo-alt::before {
  content: '↺';
}
.fa-exclamation-triangle::before {
  content: '⚠';
}
.fa-plus-circle::before {
  content: '⊕';
}
.fa-clock::before {
  content: '⏰';
}
.fa-times::before {
  content: '×';
}
</style>
