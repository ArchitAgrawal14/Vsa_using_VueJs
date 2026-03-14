<template>
  <div class="page-root">

    <!-- ░░ HEADER ░░ -->
    <header class="site-header">
      <div class="header-inner">
        <div class="header-rule"></div>
        <div class="header-brand">
          <span class="brand-eyebrow">Vaibhav Skating Academy</span>
          <h1 class="brand-title">Hall of<br><em>Achievement</em></h1>
          <p class="brand-sub">A chronicle of excellence — every medal, every milestone, every moment of glory.</p>
          <p class="brand-sub">#Passion To Win.</p>
        </div>
        <div class="header-rule"></div>
      </div>
      <div class="header-ornament">
        <svg width="320" height="12" viewBox="0 0 320 12" fill="none">
          <line x1="0" y1="6" x2="140" y2="6" stroke="#C9A84C" stroke-width="0.75"/>
          <circle cx="160" cy="6" r="5" fill="none" stroke="#C9A84C" stroke-width="0.75"/>
          <circle cx="160" cy="6" r="2" fill="#C9A84C"/>
          <line x1="180" y1="6" x2="320" y2="6" stroke="#C9A84C" stroke-width="0.75"/>
        </svg>
      </div>
    </header>

    <!-- ░░ LOADING ░░ -->
    <div v-if="loading" class="state-loader">
      <div class="loader-ring"></div>
      <span class="loader-text">Curating achievements…</span>
    </div>

    <!-- ░░ ERROR ░░ -->
    <div v-else-if="error" class="state-error">
      <span class="error-icon">✦</span>
      <p>{{ error }}</p>
    </div>

    <!-- ░░ ACHIEVEMENTS — EDITORIAL ROWS ░░ -->
    <main v-else class="chronicle">

      <article
        v-for="(achievement, idx) in achievements"
        :key="achievement.id"
        class="entry"
        :class="idx % 2 === 0 ? 'entry--normal' : 'entry--reverse'"
      >
        <!-- Index marker -->
        <div class="entry-index">
          <span class="index-num">{{ String(idx + 1).padStart(2, '0') }}</span>
          <div class="index-line"></div>
        </div>

        <!-- Visual side -->
        <div class="entry-visual">
          <div class="visual-frame">
            <img
              :src="'http://localhost:3000' + (achievement.banner_image || '')"
              :alt="achievement.title"
              class="visual-img"
              @error="handleImgError"
            />
            <div class="visual-overlay"></div>
            <div class="visual-medals">
              <span v-if="achievement.gold_medals > 0" class="medal-tag gold">🥇 ×{{ achievement.gold_medals }}</span>
              <span v-if="achievement.silver_medals > 0" class="medal-tag silver">🥈 ×{{ achievement.silver_medals }}</span>
              <span v-if="achievement.bronze_medals > 0" class="medal-tag bronze">🥉 ×{{ achievement.bronze_medals }}</span>
            </div>
            <div class="visual-ribbon">
              <span>{{ getCategoryIcon(achievement.competition_category) }} {{ achievement.competition_category }}</span>
            </div>
          </div>

          <div v-if="achievement.images && achievement.images.length > 0" class="thumb-strip">
            <div
              v-for="(img, i) in achievement.images.slice(0, 5)"
              :key="i"
              class="thumb"
              @click="openGallery(achievement.images, i)"
            >
              <img :src="'http://localhost:3000' + img" :alt="`Photo ${i+1}`" />
              <div v-if="i === 4 && achievement.images.length > 5" class="thumb-more">
                +{{ achievement.images.length - 5 }}
              </div>
            </div>
          </div>
        </div>

        <!-- Text side -->
        <div class="entry-text">
          <div class="text-category-line">
            <span class="cat-dot" :style="getCategoryDotStyle(achievement.competition_category)"></span>
            <span class="cat-label">{{ achievement.competition_category }}</span>
            <span v-if="achievement.competition_level" class="cat-level">— {{ achievement.competition_level }}</span>
          </div>

          <h2 class="entry-title">{{ achievement.title }}</h2>

          <div class="entry-divider">
            <svg width="60" height="8" viewBox="0 0 60 8">
              <line x1="0" y1="4" x2="20" y2="4" stroke="#C9A84C" stroke-width="1"/>
              <rect x="24" y="2" width="4" height="4" fill="#C9A84C" transform="rotate(45 26 4)"/>
              <line x1="32" y1="4" x2="60" y2="4" stroke="#C9A84C" stroke-width="1"/>
            </svg>
          </div>

          <p class="entry-desc">{{ achievement.description }}</p>

          <dl class="entry-meta">
            <div v-if="achievement.competition_name" class="meta-row">
              <dt>Competition</dt>
              <dd>{{ achievement.competition_name }}</dd>
            </div>
            <div v-if="achievement.location" class="meta-row">
              <dt>Venue</dt>
              <dd>{{ achievement.location }}</dd>
            </div>
            <div v-if="achievement.event_date" class="meta-row">
              <dt>Date</dt>
              <dd>{{ formatDate(achievement.event_date) }}</dd>
            </div>
          </dl>

          <div class="tally">
            <div class="tally-inner">
              <span class="tally-label">Total Medals</span>
              <span class="tally-count">
                {{ (achievement.gold_medals || 0) + (achievement.silver_medals || 0) + (achievement.bronze_medals || 0) }}
              </span>
            </div>
          </div>
        </div>

      </article>

      <div class="chronicle-end">
        <svg width="200" height="20" viewBox="0 0 200 20">
          <line x1="0" y1="10" x2="80" y2="10" stroke="#C9A84C" stroke-width="0.75"/>
          <polygon points="100,2 108,10 100,18 92,10" fill="none" stroke="#C9A84C" stroke-width="0.75"/>
          <line x1="120" y1="10" x2="200" y2="10" stroke="#C9A84C" stroke-width="0.75"/>
        </svg>
        <p>End of Chronicle</p>
      </div>
    </main>

    <!-- ░░ GALLERY LIGHTBOX ░░ -->
    <transition name="lb">
      <div v-if="galleryOpen" class="lightbox" @click="closeGallery">
        <button class="lb-close" @click="closeGallery">✕</button>
        <div class="lb-counter">{{ currentImageIndex + 1 }} / {{ currentGallery.length }}</div>
        <button v-if="currentGallery.length > 1" class="lb-nav lb-prev" @click.stop="previousImage">‹</button>
        <button v-if="currentGallery.length > 1" class="lb-nav lb-next" @click.stop="nextImage">›</button>
        <img :src="'http://localhost:3000' + currentGallery[currentImageIndex]" class="lb-img" @click.stop />
        <div v-if="currentGallery.length > 1" class="lb-dots">
          <span
            v-for="(_, i) in currentGallery" :key="i"
            class="lb-dot" :class="{ active: i === currentImageIndex }"
            @click.stop="currentImageIndex = i"
          ></span>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name: 'AcademyAchievements',
  data() {
    return {
      achievements: [],
      loading: true,
      error: null,
      galleryOpen: false,
      currentGallery: [],
      currentImageIndex: 0,
    }
  },
  mounted() {
    this.fetchAchievements()
    window.addEventListener('keydown', this.handleKey)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKey)
  },
  methods: {
    async fetchAchievements() {
      try {
        const res = await fetch('http://localhost:3000/vsa/academy-achievements')
        const data = await res.json()
        if (data.success) this.achievements = data.academyAchievements
        else this.error = data.message || 'Failed to fetch achievements'
      } catch {
        this.error = 'Unable to load achievements. Please try again later.'
      } finally {
        this.loading = false
      }
    },
    getCategoryIcon(c) {
      return { 'Ice Skating':'❄️','Roller Speed Skating':'🛼','Roll Ball':'🎯','Record':'📋','Camp':'🏕️' }[c] || '🏅'
    },
    getCategoryDotStyle(c) {
      const map = { 'Ice Skating':'#3b82f6','Roller Speed Skating':'#64748b','Roll Ball':'#f97316','Record':'#eab308','Camp':'#22c55e' }
      return `background:${map[c]||'#9ca3af'}`
    },
    formatDate(d) {
      return d ? new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }) : ''
    },
    openGallery(imgs, idx) {
      this.currentGallery = imgs; this.currentImageIndex = idx; this.galleryOpen = true
      document.body.style.overflow = 'hidden'
    },
    closeGallery() { this.galleryOpen = false; document.body.style.overflow = '' },
    nextImage() { this.currentImageIndex = (this.currentImageIndex + 1) % this.currentGallery.length },
    previousImage() { this.currentImageIndex = (this.currentImageIndex - 1 + this.currentGallery.length) % this.currentGallery.length },
    handleKey(e) {
      if (!this.galleryOpen) return
      if (e.key === 'ArrowRight') this.nextImage()
      if (e.key === 'ArrowLeft') this.previousImage()
      if (e.key === 'Escape') this.closeGallery()
    },
    handleImgError(e) {
      e.target.src = 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800'
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.page-root {
  min-height: 100vh;
  background: #FFFFFF;
  color: #111111;
  font-family: 'Jost', sans-serif;
  font-weight: 300;
  overflow-x: hidden;
}

/* HEADER */
.site-header {
  background: #FFFFFF;
  padding: clamp(48px, 8vw, 96px) clamp(24px, 6vw, 80px) clamp(36px, 5vw, 64px);
  text-align: center;
}
.header-inner { max-width: 720px; margin: 0 auto; }
.header-rule {
  height: 1px;
  background: linear-gradient(90deg, transparent, #C9A84C, transparent);
  margin: 24px 0;
}
.brand-eyebrow {
  font-family: 'Jost', sans-serif;
  font-size: clamp(9px, 1.2vw, 11px);
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #C9A84C;
  display: block;
  margin-bottom: 20px;
}
.brand-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(52px, 9vw, 110px);
  font-weight: 300;
  line-height: 0.95;
  color: #111111;
}
.brand-title em { font-style: italic; color: #C9A84C; }
.brand-sub {
  font-size: clamp(13px, 1.4vw, 15px);
  color: #888888;
  letter-spacing: 0.04em;
  line-height: 1.7;
  max-width: 480px;
  margin: 20px auto 0;
}
.header-ornament { margin-top: 32px; display: flex; justify-content: center; }

/* STATES */
.state-loader { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 120px 24px; }
.loader-ring {
  width: 48px; height: 48px;
  border: 1px solid #E8E4DD;
  border-top-color: #C9A84C;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loader-text { font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #888888; }
.state-error { text-align: center; padding: 80px 24px; color: #c0392b; font-size: 14px; }
.error-icon { display: block; font-size: 24px; margin-bottom: 12px; color: #C9A84C; }

/* CHRONICLE */
.chronicle { max-width: 1400px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 60px) 80px; }

/* ENTRY */
.entry {
  display: grid;
  grid-template-columns: 48px 1fr 1fr;
  column-gap: clamp(24px, 4vw, 56px);
  padding: clamp(48px, 7vw, 80px) 0;
  border-bottom: 1px solid #E8E4DD;
  animation: entryIn 0.7s ease both;
}
@keyframes entryIn {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.entry:nth-child(1) { animation-delay: 0.05s; }
.entry:nth-child(2) { animation-delay: 0.15s; }
.entry:nth-child(3) { animation-delay: 0.25s; }
.entry:nth-child(4) { animation-delay: 0.35s; }
.entry:nth-child(5) { animation-delay: 0.45s; }
.entry:nth-child(6) { animation-delay: 0.55s; }

.entry--reverse .entry-visual { order: 3; }
.entry--reverse .entry-text   { order: 2; }

/* INDEX */
.entry-index { display: flex; flex-direction: column; align-items: center; padding-top: 6px; gap: 12px; }
.index-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.15em; color: #C9A84C;
  writing-mode: vertical-rl;
}
.index-line { flex: 1; width: 1px; background: linear-gradient(to bottom, #C9A84C, transparent); min-height: 40px; }

/* VISUAL */
.entry-visual { display: flex; flex-direction: column; gap: 12px; }
.visual-frame { position: relative; width: 100%; aspect-ratio: 4 / 3; overflow: hidden; }
.visual-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94); display: block; }
.entry:hover .visual-img { transform: scale(1.04); }
.visual-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, rgba(10,10,10,0.55) 100%); pointer-events: none; }
.visual-medals { position: absolute; bottom: 14px; left: 14px; display: flex; flex-wrap: wrap; gap: 6px; }
.medal-tag { font-size: 11px; font-family: 'Jost', sans-serif; font-weight: 500; letter-spacing: 0.05em; padding: 4px 10px; border-radius: 2px; backdrop-filter: blur(8px); }
.medal-tag.gold   { background: rgba(201,168,76,0.85); color: #fff; }
.medal-tag.silver { background: rgba(120,130,145,0.85); color: #fff; }
.medal-tag.bronze { background: rgba(160,82,45,0.85); color: #fff; }
.visual-ribbon { position: absolute; top: 14px; right: 0; background: #111; color: #E8D5A3; font-size: 10px; font-family: 'Jost', sans-serif; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; padding: 5px 14px 5px 10px; clip-path: polygon(8px 0%, 100% 0%, 100% 100%, 0% 100%); }

.thumb-strip { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
.thumb-strip::-webkit-scrollbar { display: none; }
.thumb { position: relative; width: 68px; height: 52px; flex-shrink: 0; overflow: hidden; cursor: pointer; }
.thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s ease; }
.thumb:hover img { transform: scale(1.1); }
.thumb-more { position: absolute; inset: 0; background: rgba(0,0,0,0.6); color: #fff; font-size: 12px; font-weight: 500; display: flex; align-items: center; justify-content: center; }

/* TEXT */
.entry-text { display: flex; flex-direction: column; justify-content: center; padding: clamp(0px, 2vw, 24px) 0; }
.text-category-line { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; }
.cat-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.cat-label { font-size: 11px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: #444444; }
.cat-level { font-size: 11px; letter-spacing: 0.12em; color: #888888; }
.entry-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(28px, 4vw, 52px); font-weight: 300; line-height: 1.05; color: #111111; margin-bottom: 20px; }
.entry-divider { margin-bottom: 20px; }
.entry-desc { font-size: clamp(13px, 1.3vw, 15px); line-height: 1.8; color: #444444; font-weight: 300; margin-bottom: 28px; max-width: 52ch; }

.entry-meta { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
.meta-row { display: grid; grid-template-columns: 90px 1fr; align-items: baseline; gap: 12px; padding-bottom: 10px; border-bottom: 1px solid #E8E4DD; }
.meta-row dt { font-size: 10px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #C9A84C; }
.meta-row dd { font-size: 13px; font-weight: 400; color: #444444; letter-spacing: 0.02em; }

.tally { display: flex; }
.tally-inner { display: flex; align-items: center; gap: 14px; padding: 12px 20px; border: 1px solid #E8D5A3; background: linear-gradient(135deg, #FFFDF5, #FFF8E6); }
.tally-label { font-size: 10px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #C9A84C; }
.tally-count { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 300; color: #111111; line-height: 1; }

/* END */
.chronicle-end { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 56px 0 24px; }
.chronicle-end p { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #888888; }

/* LIGHTBOX */
.lightbox { position: fixed; inset: 0; background: rgba(5,5,5,0.97); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px; }
.lb-img { max-width: 100%; max-height: 82vh; object-fit: contain; box-shadow: 0 32px 80px rgba(0,0,0,0.6); }
.lb-close { position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); color: #fff; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
.lb-close:hover { background: rgba(255,255,255,0.15); }
.lb-counter { position: absolute; top: 24px; left: 50%; transform: translateX(-50%); font-size: 11px; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); }
.lb-nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #fff; width: 48px; height: 48px; border-radius: 50%; font-size: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s, border-color 0.2s; }
.lb-nav:hover { background: rgba(201,168,76,0.2); border-color: #C9A84C; }
.lb-prev { left: 20px; }
.lb-next { right: 20px; }
.lb-dots { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; }
.lb-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.25); cursor: pointer; transition: background 0.2s; }
.lb-dot.active { background: #C9A84C; }
.lb-enter-active, .lb-leave-active { transition: opacity 0.3s ease; }
.lb-enter-from, .lb-leave-to { opacity: 0; }

/* RESPONSIVE */
@media (max-width: 900px) {
  .entry { grid-template-columns: 32px 1fr; grid-template-rows: auto auto; }
  .entry-visual { grid-column: 2; grid-row: 1; order: 1 !important; }
  .entry-text   { grid-column: 2; grid-row: 2; order: 2 !important; }
  .entry-index  { grid-column: 1; grid-row: 1 / 3; }
}
@media (max-width: 560px) {
  .entry { grid-template-columns: 24px 1fr; column-gap: 14px; padding: 36px 0; }
  .meta-row { grid-template-columns: 80px 1fr; }
  .tally-count { font-size: 28px; }
  .lb-nav { width: 36px; height: 36px; font-size: 20px; }
  .lb-prev { left: 8px; }
  .lb-next { right: 8px; }
}
</style>