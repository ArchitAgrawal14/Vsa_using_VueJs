<template>
  <div class="page-root">

    <!-- Decorative top bar -->
    <div class="top-bar"></div>

    <!-- Subtle dot pattern bg -->
    <div class="dot-bg"></div>

    <div class="page-wrapper">

      <!-- ── HEADER ── -->
      <header class="page-header">
        <div class="eyebrow">
          <span class="eyebrow-line"></span>
          Legal Documentation
          <span class="eyebrow-line"></span>
        </div>

        <h1 class="headline">
          Terms &amp; <em>Conditions</em>
        </h1>

        <p class="subheadline">
          By using our services, you agree to the following terms. Please read them
          carefully as they govern your relationship with us.
        </p>

        <div class="header-meta">
          <span class="meta-badge">
            <span class="pulse-dot"></span>
            Policy Active
          </span>
          <span class="meta-divider">·</span>
          <span class="meta-date">Last updated {{ lastUpdated }}</span>
        </div>
      </header>

      <!-- ── CARD ── -->
      <main class="policy-card">

        <!-- Loading -->
        <div v-if="loading" class="state-box">
          <div class="spinner">
            <span v-for="i in 3" :key="i" class="dot" :style="`animation-delay:${(i-1)*0.18}s`"></span>
          </div>
          <p class="state-label">Loading terms…</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="state-box">
          <div class="error-icon">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>
          <p class="state-label error-text">{{ error }}</p>
          <button class="retry-btn" @click="fetchTerms">Try again</button>
        </div>

        <!-- Terms list -->
        <ol v-else class="policy-list">
          <li
            v-for="(item, index) in terms"
            :key="item.id"
            class="policy-item"
            :style="`animation-delay:${index * 70}ms`"
          >
            <div class="item-index">{{ String(index + 1).padStart(2, '0') }}</div>
            <div class="item-body">
              <h2 class="item-heading">{{ item.title }}</h2>
              <div class="item-content" v-html="item.content"></div>
            </div>
            <div class="item-arrow">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </li>
        </ol>
      </main>

      <!-- ── FOOTER ── -->
      <footer class="page-footer">
        <p>Questions about our terms? <a href="mailto:info@vaibhavskatingacademy.com" class="footer-link">Contact Support</a></p>
        <p class="footer-copy">© {{ new Date().getFullYear() }} Vaibhav Skating Academy. All rights reserved.</p>
      </footer>

    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'TermsConditions',
  setup() {
    const terms = ref([])
    const loading = ref(true)
    const error = ref(null)
    const apiBaseURL = 'http://localhost:3000/vsa'

    const lastUpdated = computed(() =>
      new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    )

    const fetchTerms = async () => {
      loading.value = true
      error.value = null
      try {
        const response = await fetch(`${apiBaseURL}/terms-conditions`)
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        terms.value = await response.json()
      } catch (err) {
        console.error(err)
        error.value = 'Failed to load terms and conditions.'
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchTerms)

    return { terms, loading, error, fetchTerms, lastUpdated }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
</style>

<style scoped>

/* ── ROOT ── */
.page-root {
  min-height: 100vh;
  background-color: #ffffff;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow-x: hidden;
}

.top-bar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, #b8973a 0%, #e8c96a 50%, #b8973a 100%);
  z-index: 100;
}

.dot-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #d8d8e8 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.4;
}

/* ── LAYOUT ── */
.page-wrapper {
  position: relative;
  max-width: 860px;
  margin: 0 auto;
  padding: clamp(80px, 10vw, 120px) clamp(16px, 5vw, 32px) clamp(48px, 8vw, 80px);
}

/* ── HEADER ── */
.page-header {
  text-align: center;
  margin-bottom: clamp(32px, 6vw, 56px);
}

.eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(9px, 1.8vw, 11px);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #b8973a;
  margin-bottom: 20px;
  font-weight: 500;
}
.eyebrow-line {
  display: block;
  width: clamp(24px, 5vw, 48px);
  height: 1px;
  background: linear-gradient(90deg, transparent, #b8973a);
}
.eyebrow-line:last-child {
  background: linear-gradient(90deg, #b8973a, transparent);
}

.headline {
  font-family: 'Playfair Display', serif;
  font-size: clamp(36px, 8vw, 64px);
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.08;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}
.headline em {
  font-style: italic;
  color: #b8973a;
}

.subheadline {
  font-size: clamp(13px, 2.5vw, 15px);
  color: #6b6b8a;
  line-height: 1.8;
  max-width: 560px;
  margin: 0 auto 28px;
  font-weight: 300;
}

.header-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.meta-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 100px;
  border: 1px solid #e4e4f0;
  background: #fff;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: #4a4a6a;
  box-shadow: 0 1px 6px rgba(26,26,46,0.06);
}

.pulse-dot {
  display: inline-block;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse 2s ease-in-out infinite;
}

.meta-divider { color: #c8c8dd; }

.meta-date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: #9898b8;
}

/* ── CARD ── */
.policy-card {
  background: #ffffff;
  border: 1px solid #e4e4f0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 1px 2px rgba(26,26,46,0.04),
    0 8px 24px rgba(26,26,46,0.06),
    0 32px 80px rgba(26,26,46,0.08);
}

/* ── STATES ── */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 24px;
}

.spinner { display: flex; gap: 7px; }
.dot {
  width: 9px; height: 9px;
  border-radius: 50%;
  background: #b8973a;
  animation: bounce 1.2s ease-in-out infinite;
  display: block;
}

.state-label {
  font-size: 12px;
  color: #9898b8;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.06em;
}

.error-icon {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: #fef2f2;
  border: 1px solid #fecaca;
  display: flex; align-items: center; justify-content: center;
  color: #ef4444;
}
.error-text { color: #ef4444; }

.retry-btn {
  padding: 8px 24px;
  border-radius: 8px;
  border: 1px solid #b8973a;
  background: transparent;
  color: #b8973a;
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.2s ease;
}
.retry-btn:hover {
  background: #b8973a;
  color: #fff;
}

/* ── LIST ── */
.policy-list { list-style: none; }

.policy-item {
  display: flex;
  align-items: flex-start;
  gap: clamp(12px, 3vw, 24px);
  padding: clamp(20px, 4vw, 28px) clamp(16px, 5vw, 36px);
  border-bottom: 1px solid #f0f0f8;
  cursor: default;
  transition: background 0.22s ease;
  animation: slideUp 0.45s ease both;
  position: relative;
}
.policy-item:last-child { border-bottom: none; }

.policy-item::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #b8973a, #e8c96a);
  opacity: 0;
  transition: opacity 0.22s ease;
}
.policy-item:hover { background: #fdf8ee; }
.policy-item:hover::before { opacity: 1; }
.policy-item:hover .item-arrow { opacity: 1; transform: translateX(3px); }
.policy-item:hover .item-heading { color: #96761e; }

.item-index {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(10px, 2vw, 12px);
  font-weight: 500;
  color: #b8973a;
  opacity: 0.55;
  flex-shrink: 0;
  margin-top: 4px;
  min-width: 22px;
}

.item-body { flex: 1; min-width: 0; }

.item-heading {
  font-family: 'Playfair Display', serif;
  font-size: clamp(15px, 3vw, 18px);
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 10px;
  line-height: 1.35;
  transition: color 0.2s ease;
}

/* v-html rendered content styles */
.item-content {
  font-size: clamp(13px, 2.2vw, 14px);
  color: #6b6b8a;
  line-height: 1.8;
  font-weight: 300;
}

.item-content :deep(p) {
  margin-bottom: 8px;
  color: #6b6b8a;
  line-height: 1.8;
}

.item-content :deep(ul),
.item-content :deep(.sub-list) {
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
}

.item-content :deep(ul li),
.item-content :deep(.sub-list li) {
  position: relative;
  padding-left: 16px;
  margin-bottom: 6px;
  font-size: clamp(12px, 2vw, 13px);
  color: #7a7a9a;
  line-height: 1.7;
}

.item-content :deep(ul li)::before,
.item-content :deep(.sub-list li)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #b8973a;
  opacity: 0.6;
}

.item-content :deep(.pickup-section) {
  background: #fdf8ee;
  border-left: 3px solid #b8973a;
  border-radius: 0 8px 8px 0;
  padding: 14px 18px;
  margin-top: 12px;
}

.item-content :deep(.pickup-section p) {
  margin: 6px 0;
  color: #6b6b8a;
  font-size: 13px;
}

.item-content :deep(.subsection-header) {
  font-family: 'Playfair Display', serif;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 8px;
}

.item-content :deep(.external-link),
.item-content :deep(a) {
  color: #b8973a;
  text-decoration: none;
  border-bottom: 1px solid rgba(184,151,58,0.3);
  transition: border-color 0.2s ease;
}
.item-content :deep(.external-link:hover),
.item-content :deep(a:hover) {
  border-color: #b8973a;
}

.item-arrow {
  flex-shrink: 0;
  color: #b8973a;
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  margin-top: 4px;
}

/* ── FOOTER ── */
.page-footer {
  margin-top: clamp(24px, 5vw, 40px);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: #9898b8;
}
.footer-link {
  color: #b8973a;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}
.footer-link:hover { border-color: #b8973a; }
.footer-copy { color: #c8c8dd; font-size: 11px; }

/* ── ANIMATIONS ── */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40%           { transform: translateY(-9px); }
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.45; transform: scale(0.82); }
}

/* ── RESPONSIVE ── */
@media (max-width: 600px) {
  .item-arrow { display: none; }
}
@media (max-width: 400px) {
  .header-meta { flex-direction: column; gap: 8px; }
  .eyebrow-line { width: 20px; }
}
</style>