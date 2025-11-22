<template>
  <div id="app">
    <!-- Ice crystal background -->
    <div class="ice-background">
      <div class="ice-crystal" v-for="n in 5" :key="n">
        <i class="fas fa-snowflake"></i>
      </div>
    </div>

    <!-- Skating trail animation -->
    <div class="skating-trail">
      <div class="trail-line" v-for="n in 3" :key="n"></div>
    </div>

    <!-- Main content -->
    <main class="container">
      <h2 class="faq-title">Frequently Asked Questions</h2>

      <!-- Loading state -->
      <div v-if="loading" class="loading">
        <div class="loading-spinner">
          <i class="fas fa-spinner"></i>
        </div>
        <p>Loading FAQ data...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <p>{{ error }}</p>
      </div>

      <!-- No data state -->
      <div v-else-if="!faqData || faqData.length === 0" class="no-data">
        <div class="no-data-icon">
          <i class="fas fa-question-circle"></i>
        </div>
        <p>No FAQs available at the moment.</p>
      </div>

      <!-- FAQ Accordion -->
      <div v-else class="faq-accordion">
        <div 
          v-for="(faq, index) in faqData" 
          :key="index" 
          class="faq-item"
        >
          <div 
            class="faq-header" 
            @click="toggleFaq(index)"
          >
            <div class="faq-question">{{ faq.question }}</div>
            <div 
              class="faq-toggle"
              :class="{ active: activeIndex === index }"
            >
              <i class="fas fa-chevron-down"></i>
            </div>
          </div>
          <div 
            class="faq-content"
            :class="{ active: activeIndex === index }"
          >
            <div class="faq-answer">
              <span class="faq-highlight">{{ faq.highlighted_part }}</span>
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'FAQ',
  setup() {
    const faqData = ref([])
    const loading = ref(true)
    const error = ref(null)
    const activeIndex = ref(0)
    const apiBaseURL = 'http://localhost:3000/vsa';
    const fetchFaqData = async () => {
      try {
        loading.value = true
        error.value = null
        
        const response = await fetch(`${apiBaseURL}/faq`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        faqData.value = data
        
        // Set first item as active by default if data exists
        if (faqData.value && faqData.value.length > 0) {
          activeIndex.value = 0
        }
        
      } catch (err) {
        error.value = `Failed to load FAQ data: ${err.message}`
        console.error('Error fetching FAQ data:', err)
      } finally {
        loading.value = false
      }
    }

    const toggleFaq = (index) => {
      activeIndex.value = activeIndex.value === index ? -1 : index
    }

    onMounted(() => {
      fetchFaqData()
    })

    return {
      faqData,
      loading,
      error,
      activeIndex,
      fetchFaqData,
      toggleFaq
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%);
  min-height: 100vh;
  overflow-x: hidden;
}

/* Ice crystal background animation */
.ice-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.ice-crystal {
  position: absolute;
  color: rgba(173, 216, 230, 0.1);
  animation: float 6s ease-in-out infinite;
  font-size: 24px;
}

.ice-crystal:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
.ice-crystal:nth-child(2) { top: 20%; left: 80%; animation-delay: 2s; }
.ice-crystal:nth-child(3) { top: 60%; left: 15%; animation-delay: 4s; }
.ice-crystal:nth-child(4) { top: 80%; left: 70%; animation-delay: 1s; }
.ice-crystal:nth-child(5) { top: 40%; left: 90%; animation-delay: 3s; }

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* Skating trail animation */
.skating-trail {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.trail-line {
  position: absolute;
  width: 2px;
  height: 100px;
  background: linear-gradient(to bottom, rgba(0, 123, 255, 0.1), transparent);
  animation: skate 8s linear infinite;
}

.trail-line:nth-child(1) { top: 20%; left: 5%; animation-delay: 0s; }
.trail-line:nth-child(2) { top: 50%; left: 85%; animation-delay: 2s; }
.trail-line:nth-child(3) { top: 70%; left: 25%; animation-delay: 4s; }

@keyframes skate {
  0% { transform: translateX(0px) scaleY(1); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateX(200px) scaleY(0.5); opacity: 0; }
}

@keyframes shine {
  0% { left: -100%; }
  100% { left: 100%; }
}

.skating-icon {
  color: #007bff;
  animation: spin 4s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Main container */
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 20px;
}

.faq-title {
  text-align: center;
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 40px;
  position: relative;
}

.faq-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(45deg, #007bff, #00d4ff);
  border-radius: 2px;
}

/* FAQ Accordion */
.faq-accordion {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.faq-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-item:hover {
  background: rgba(0, 123, 255, 0.02);
}

.faq-header {
  padding: 20px 25px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
}

.faq-header:hover {
  background: rgba(0, 123, 255, 0.05);
}

.faq-question {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  flex: 1;
  margin-right: 15px;
}

.faq-toggle {
  font-size: 1.2rem;
  color: #007bff;
  transition: transform 0.3s ease;
}

.faq-toggle.active {
  transform: rotate(180deg);
}

.faq-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-content.active {
  max-height: 500px;
}

.faq-answer {
  padding: 0 25px 20px;
  color: #555;
  line-height: 1.6;
  animation: fadeIn 0.3s ease;
}

.faq-highlight {
  color: #007bff;
  font-weight: 600;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Loading state */
.loading {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.loading-spinner {
  animation: spin 1s linear infinite;
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 20px;
}

/* Error state */
.error {
  text-align: center;
  padding: 60px 20px;
  color: #dc3545;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

/* No data state */
.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-data-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #007bff;
}

/* Responsive design */
@media (max-width: 768px) {
  .header-title {
    font-size: 2rem;
  }
  
  .faq-title {
    font-size: 1.8rem;
  }
  
  .container {
    padding: 40px 15px;
  }
  
  .faq-header {
    padding: 15px 20px;
  }
  
  .faq-question {
    font-size: 1rem;
  }
}
</style>