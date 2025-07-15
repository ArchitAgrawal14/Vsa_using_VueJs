<template>
  <div class="terms-conditions-container">
    <div class="policy-card">
      <h2 class="policy-header">Terms and Conditions</h2>
      <div class="policy-content">
        <ol class="terms-list">
          <li v-for="item in terms" :key="item.id" class="terms-item">
            <strong>{{ item.title }}:</strong>
            <div v-html="item.content"></div>
          </li>
        </ol>

        <div v-if="loading">Loading Terms and Conditions...</div>
        <div v-if="error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'TermsConditions',
  setup() {
    const terms = ref([])
    const loading = ref(true)
    const error = ref(null)
    const apiBaseURL = 'http://localhost:3000/vsa'
    const fetchTerms = async () => {
      try {
        const response = await fetch(`${apiBaseURL}/terms-conditions`)
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const data = await response.json()
        terms.value = data
      } catch (err) {
        console.error(err)
        error.value = 'Failed to load terms and conditions.'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchTerms()
    })

    return {
      terms,
      loading,
      error,
    }
  },
}
</script>

<style scoped>
.terms-conditions-container {
  max-width: 900px;
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
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 25px;
  text-align: center;
  border-bottom: 3px solid #f0f0f0;
  padding-bottom: 20px;
}

.policy-content {
  color: #555555;
  line-height: 1.6;
}

.terms-list {
  list-style: none;
  counter-reset: term-counter;
  padding: 0;
  margin: 0;
}

.terms-item {
  counter-increment: term-counter;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  position: relative;
  padding-left: 50px;
}

.terms-item:before {
  content: counter(term-counter);
  position: absolute;
  left: 15px;
  top: 20px;
  background-color: #333333;
  color: #ffffff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.terms-item:hover {
  background-color: #f5f5f5;
  border-color: #ddd;
  transition: all 0.3s ease;
}

.terms-item strong {
  color: #333333;
  font-size: 16px;
  font-weight: 600;
  display: block;
  margin-bottom: 10px;
}

.sub-list {
  margin: 10px 0 0 0;
  padding-left: 20px;
  list-style: none;
}

.sub-list li {
  margin-bottom: 8px;
  padding-left: 15px;
  position: relative;
}

.sub-list li:before {
  content: '•';
  color: #666666;
  position: absolute;
  left: 0;
  top: 0;
  font-weight: bold;
}

.pickup-section {
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 4px;
  margin-top: 10px;
  border-left: 4px solid #ccc;
}

.pickup-section p {
  margin: 8px 0;
  color: #555555;
}

.subsection-header {
  color: #333333;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.external-link {
  color: #0066cc;
  text-decoration: none;
  font-weight: 500;
}

.external-link:hover {
  text-decoration: underline;
  color: #004499;
}

/* Responsive design */
@media (max-width: 768px) {
  .terms-conditions-container {
    padding: 10px;
  }

  .policy-card {
    padding: 20px;
  }

  .policy-header {
    font-size: 24px;
  }

  .terms-item {
    padding: 15px;
    padding-left: 45px;
  }

  .terms-item:before {
    width: 24px;
    height: 24px;
    font-size: 12px;
    left: 12px;
  }
}
</style>
