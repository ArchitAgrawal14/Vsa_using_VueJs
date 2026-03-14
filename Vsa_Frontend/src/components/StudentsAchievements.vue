<template>
  <div class="page-root">

    <!-- Floating background decorations -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div class="bg-deco deco-1">🏆</div>
      <div class="bg-deco deco-2">⛸️</div>
      <div class="bg-deco deco-3">🛼</div>
      <div class="bg-deco deco-4">🏆</div>
      <div class="bg-deco deco-5">⛸️</div>
    </div>

    <!-- HEADER -->
    <header class="site-header">
      <div class="header-inner">
        <div class="header-rule"></div>
        <div class="header-brand">
          <span class="brand-eyebrow">Vaibhav Skating Academy</span>
          <h1 class="brand-title">Our Precious<br><em>Students</em></h1>
          <p class="brand-sub">
            Every glide, every fall, and every comeback shapes our young skaters into champions.
            From small victories to remarkable milestones — we celebrate their journey.
          </p>
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

    <!-- SEARCH -->
    <div class="search-wrap">
      <div class="search-box">
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by student name, school, or group…"
          class="search-input"
        />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</button>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="state-loader">
      <div class="loader-ring"></div>
      <span class="loader-text">Curating students…</span>
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="state-error">
      <span class="error-icon">✦</span>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchStudents">Retry</button>
    </div>

    <!-- STUDENTS — EDITORIAL ROWS -->
    <main v-else class="chronicle">

      <div v-if="filteredStudents.length === 0" class="empty-state">
        <span>✦</span>
        <p>No students found matching your search.</p>
      </div>

      <article
        v-else
        v-for="(student, idx) in filteredStudents"
        :key="student.student_id"
        class="entry"
        :class="idx % 2 === 0 ? 'entry--normal' : 'entry--reverse'"
        @click="openModal(student)"
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
              v-if="student.img"
              :src="'http://localhost:3000' + student.img"
              :alt="student.full_name"
              class="visual-img"
              @error="handleImgError"
            />
            <div v-else class="visual-placeholder">
              <span>👤</span>
            </div>
            <div class="visual-overlay"></div>

            <!-- Achievement count badge -->
            <div v-if="student.achievements.length > 0" class="visual-badge">
              <span class="badge-icon">🏆</span>
              <span class="badge-count">{{ student.achievements.length }}</span>
            </div>

            <!-- Status ribbon -->
            <div class="visual-ribbon" :class="student.status === 'active' ? 'ribbon--active' : 'ribbon--inactive'">
              {{ student.status }}
            </div>
          </div>
        </div>

        <!-- Text side -->
        <div class="entry-text">
          <div class="text-meta-line">
            <span class="meta-dot" :class="student.status === 'active' ? 'dot--active' : 'dot--inactive'"></span>
            <span class="meta-label">{{ student.student_group || 'Unassigned Group' }}</span>
          </div>

          <h2 class="entry-title">{{ student.full_name }}</h2>

          <div class="entry-divider">
            <svg width="60" height="8" viewBox="0 0 60 8">
              <line x1="0" y1="4" x2="20" y2="4" stroke="#C9A84C" stroke-width="1"/>
              <rect x="24" y="2" width="4" height="4" fill="#C9A84C" transform="rotate(45 26 4)"/>
              <line x1="32" y1="4" x2="60" y2="4" stroke="#C9A84C" stroke-width="1"/>
            </svg>
          </div>

          <dl class="entry-meta">
            <div v-if="student.school_name" class="meta-row">
              <dt>School</dt>
              <dd>{{ student.school_name }}</dd>
            </div>
            <div v-if="student.father_name" class="meta-row">
              <dt>Father</dt>
              <dd>{{ student.father_name }}</dd>
            </div>
            <div v-if="student.mother_name" class="meta-row">
              <dt>Mother</dt>
              <dd>{{ student.mother_name }}</dd>
            </div>
          </dl>

          <div class="entry-footer">
            <div class="tally">
              <div class="tally-inner">
                <span class="tally-label">Achievements</span>
                <span class="tally-count">{{ student.achievements.length }}</span>
              </div>
            </div>
            <span class="view-cta">View Profile →</span>
          </div>
        </div>

      </article>

      <!-- End ornament -->
      <div class="chronicle-end">
        <svg width="200" height="20" viewBox="0 0 200 20">
          <line x1="0" y1="10" x2="80" y2="10" stroke="#C9A84C" stroke-width="0.75"/>
          <polygon points="100,2 108,10 100,18 92,10" fill="none" stroke="#C9A84C" stroke-width="0.75"/>
          <line x1="120" y1="10" x2="200" y2="10" stroke="#C9A84C" stroke-width="0.75"/>
        </svg>
        <p>End of Records — {{ filteredStudents.length }} student{{ filteredStudents.length !== 1 ? 's' : '' }} shown</p>
      </div>
    </main>

    <!-- ░░ MODAL ░░ -->
    <transition name="modal">
      <div v-if="selectedStudent" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-panel">

          <!-- Modal Header -->
          <div class="modal-header">
            <button class="modal-close" @click="closeModal">✕</button>
            <div class="modal-avatar-wrap">
              <div class="modal-avatar">
                <img v-if="selectedStudent.img" :src="'http://localhost:3000' + selectedStudent.img" :alt="selectedStudent.full_name" @error="handleImgError" />
                <span v-else>👤</span>
              </div>
            </div>
            <div class="modal-hero">
              <span class="modal-eyebrow">{{ selectedStudent.student_group || 'Student' }}</span>
              <h2 class="modal-name">{{ selectedStudent.full_name }}</h2>
              <div class="modal-header-ornament">
                <svg width="120" height="8" viewBox="0 0 120 8">
                  <line x1="0" y1="4" x2="44" y2="4" stroke="#C9A84C" stroke-width="0.75" opacity="0.6"/>
                  <rect x="48" y="2" width="4" height="4" fill="#C9A84C" transform="rotate(45 50 4)" opacity="0.8"/>
                  <line x1="56" y1="4" x2="120" y2="4" stroke="#C9A84C" stroke-width="0.75" opacity="0.6"/>
                </svg>
              </div>
              <p class="modal-school">{{ selectedStudent.school_name || 'N/A' }}</p>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">

            <!-- Student Info -->
            <section class="modal-section">
              <h3 class="modal-section-title">
                <svg width="40" height="6" viewBox="0 0 40 6"><line x1="0" y1="3" x2="40" y2="3" stroke="#C9A84C" stroke-width="1"/></svg>
                Student Information
              </h3>
              <div class="info-grid">
                <div class="info-row">
                  <dt>Status</dt>
                  <dd>
                    <span class="status-pill" :class="selectedStudent.status === 'active' ? 'pill--active' : 'pill--inactive'">
                      {{ selectedStudent.status }}
                    </span>
                  </dd>
                </div>
                <div v-if="selectedStudent.father_name" class="info-row">
                  <dt>Father's Name</dt>
                  <dd>{{ selectedStudent.father_name }}</dd>
                </div>
                <div v-if="selectedStudent.mother_name" class="info-row">
                  <dt>Mother's Name</dt>
                  <dd>{{ selectedStudent.mother_name }}</dd>
                </div>
                <div v-if="selectedStudent.school_name" class="info-row">
                  <dt>School</dt>
                  <dd>{{ selectedStudent.school_name }}</dd>
                </div>
                <div v-if="selectedStudent.student_group" class="info-row">
                  <dt>Group</dt>
                  <dd>{{ selectedStudent.student_group }}</dd>
                </div>
              </div>
            </section>

            <!-- Achievements -->
            <section class="modal-section">
              <h3 class="modal-section-title">
                <svg width="40" height="6" viewBox="0 0 40 6"><line x1="0" y1="3" x2="40" y2="3" stroke="#C9A84C" stroke-width="1"/></svg>
                Achievements
                <span class="section-count">{{ selectedStudent.achievements.length }}</span>
              </h3>

              <div v-if="selectedStudent.achievements.length === 0" class="empty-achievements">
                <span>✦</span>
                <p>No achievements recorded yet.</p>
              </div>

              <div v-else class="achievements-list">
                <div
                  v-for="(ach, i) in selectedStudent.achievements"
                  :key="i"
                  class="ach-entry"
                >
                  <div class="ach-index">{{ String(i + 1).padStart(2, '0') }}</div>
                  <div class="ach-body">
                    <div class="ach-top">
                      <h4 class="ach-title">{{ ach.achievement_title }}</h4>
                      <span v-if="ach.achievement_level" class="ach-level">{{ ach.achievement_level }}</span>
                    </div>

                    <div class="ach-meta">
                      <span v-if="ach.achievement_type" class="ach-meta-item">
                        <em>Type</em> {{ ach.achievement_type }}
                      </span>
                      <span v-if="ach.date_of_achievement" class="ach-meta-item">
                        <em>Date</em> {{ formatDate(ach.date_of_achievement) }}
                      </span>
                      <span v-if="ach.event_name" class="ach-meta-item">
                        <em>Event</em> {{ ach.event_name }}
                      </span>
                    </div>

                    <p v-if="ach.remarks" class="ach-remarks">{{ ach.remarks }}</p>

                    <a v-if="ach.link" :href="ach.link" target="_blank" class="ach-link">
                      🔗 View Link
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name: 'StudentAchievements',
  data() {
    return {
      students: [],
      selectedStudent: null,
      searchQuery: '',
      loading: false,
      error: null,
    }
  },
  computed: {
    filteredStudents() {
      if (!this.searchQuery.trim()) return this.students
      const q = this.searchQuery.toLowerCase()
      return this.students.filter(s =>
        s.full_name.toLowerCase().includes(q) ||
        (s.school_name && s.school_name.toLowerCase().includes(q)) ||
        (s.student_group && s.student_group.toLowerCase().includes(q))
      )
    }
  },
  mounted() {
    this.fetchStudents()
    window.addEventListener('keydown', this.handleKey)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKey)
  },
  methods: {
    async fetchStudents() {
      this.loading = true; this.error = null
      try {
        const res = await fetch('http://localhost:3000/vsa/student_achievements')
        const data = await res.json()
        if (data.success) this.students = data.data
        else this.error = data.message || 'Failed to fetch students'
      } catch {
        this.error = 'Network error. Please check your connection.'
      } finally {
        this.loading = false
      }
    },
    openModal(student) {
      this.selectedStudent = student
      document.body.style.overflow = 'hidden'
    },
    closeModal() {
      this.selectedStudent = null
      document.body.style.overflow = ''
    },
    formatDate(d) {
      return d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'
    },
    handleKey(e) {
      if (e.key === 'Escape') this.closeModal()
    },
    handleImgError(e) {
      e.target.style.display = 'none'
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
  position: relative;
}

/* ── Background decos ─────────────────────────────── */
.bg-deco {
  position: absolute;
  font-size: 3rem;
  opacity: 0.05;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
@keyframes float-up   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-22px) rotate(6deg)} }
@keyframes float-down { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(22px) rotate(-6deg)} }
.deco-1 { top:8%;  left:4%;  animation: float-up   9s infinite; animation-delay:0s; }
.deco-2 { top:25%; right:6%; animation: float-down 7s infinite; animation-delay:1s; }
.deco-3 { bottom:20%; left:7%;  animation: float-up   11s infinite; animation-delay:3s; }
.deco-4 { bottom:10%; right:5%; animation: float-down 8s infinite;  animation-delay:2s; }
.deco-5 { top:55%; left:14%; animation: float-up   10s infinite; animation-delay:4s; }

/* ── Header ───────────────────────────────────────── */
.site-header {
  background: #FFFFFF;
  padding: clamp(48px, 8vw, 96px) clamp(24px, 6vw, 80px) clamp(36px, 5vw, 60px);
  text-align: center;
  position: relative;
  z-index: 1;
}
.header-inner { max-width: 720px; margin: 0 auto; }
.header-rule { height: 1px; background: linear-gradient(90deg, transparent, #C9A84C, transparent); margin: 24px 0; }
.brand-eyebrow { font-size: clamp(9px,1.2vw,11px); font-weight: 500; letter-spacing: 0.35em; text-transform: uppercase; color: #C9A84C; display: block; margin-bottom: 20px; }
.brand-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(50px,9vw,108px); font-weight: 300; line-height: 0.95; color: #111; }
.brand-title em { font-style: italic; color: #C9A84C; }
.brand-sub { font-size: clamp(13px,1.4vw,15px); color: #888; letter-spacing: 0.04em; line-height: 1.75; max-width: 500px; margin: 20px auto 0; }
.header-ornament { margin-top: 32px; display: flex; justify-content: center; }

/* ── Search ───────────────────────────────────────── */
.search-wrap { padding: 0 clamp(20px,5vw,60px) 40px; max-width: 1400px; margin: 0 auto; position: relative; z-index: 1; }
.search-box {
  max-width: 580px; margin: 0 auto;
  display: flex; align-items: center; gap: 12px;
  border: 1px solid #E8E4DD;
  border-bottom: 2px solid #C9A84C;
  padding: 14px 20px;
  background: #FAFAF8;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-box:focus-within {
  border-color: #C9A84C;
  box-shadow: 0 4px 24px rgba(201,168,76,0.1);
  background: #fff;
}
.search-icon { color: #C9A84C; flex-shrink: 0; }
.search-input {
  flex: 1; border: none; background: transparent; outline: none;
  font-family: 'Jost', sans-serif; font-size: 14px; font-weight: 300;
  color: #111; letter-spacing: 0.03em;
}
.search-input::placeholder { color: #aaa; }
.search-clear {
  background: none; border: none; cursor: pointer;
  color: #aaa; font-size: 13px; padding: 2px 4px;
  transition: color 0.2s;
}
.search-clear:hover { color: #C9A84C; }

/* ── States ───────────────────────────────────────── */
.state-loader { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 100px 24px; position: relative; z-index: 1; }
.loader-ring { width: 44px; height: 44px; border: 1px solid #E8E4DD; border-top-color: #C9A84C; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loader-text { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #888; }
.state-error { text-align: center; padding: 80px 24px; position: relative; z-index: 1; }
.error-icon { display: block; font-size: 22px; color: #C9A84C; margin-bottom: 10px; }
.state-error p { color: #c0392b; font-size: 14px; margin-bottom: 16px; }
.retry-btn { font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; background: #111; color: #fff; border: none; padding: 10px 24px; cursor: pointer; transition: background 0.2s; }
.retry-btn:hover { background: #C9A84C; }

/* ── Empty ────────────────────────────────────────── */
.empty-state { text-align: center; padding: 80px 24px; }
.empty-state span { display: block; font-size: 22px; color: #C9A84C; margin-bottom: 12px; }
.empty-state p { font-size: 14px; letter-spacing: 0.06em; color: #888; }

/* ── Chronicle ────────────────────────────────────── */
.chronicle { max-width: 1400px; margin: 0 auto; padding: 0 clamp(20px,5vw,60px) 80px; position: relative; z-index: 1; }

/* ── Entry ────────────────────────────────────────── */
.entry {
  display: grid;
  grid-template-columns: 48px 1fr 1fr;
  column-gap: clamp(24px,4vw,56px);
  padding: clamp(44px,6vw,72px) 0;
  border-bottom: 1px solid #E8E4DD;
  cursor: pointer;
  animation: entryIn 0.65s ease both;
  transition: background 0.3s;
}
.entry:hover { background: #FFFDF5; }
@keyframes entryIn { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
.entry:nth-child(1){animation-delay:0.04s} .entry:nth-child(2){animation-delay:0.10s}
.entry:nth-child(3){animation-delay:0.16s} .entry:nth-child(4){animation-delay:0.22s}
.entry:nth-child(5){animation-delay:0.28s} .entry:nth-child(6){animation-delay:0.34s}
.entry:nth-child(7){animation-delay:0.40s} .entry:nth-child(8){animation-delay:0.46s}
.entry--reverse .entry-visual { order: 3; }
.entry--reverse .entry-text   { order: 2; }

/* Index marker */
.entry-index { display:flex; flex-direction:column; align-items:center; padding-top:6px; gap:12px; }
.index-num { font-family:'Cormorant Garamond',serif; font-size:11px; font-weight:600; letter-spacing:0.15em; color:#C9A84C; writing-mode:vertical-rl; }
.index-line { flex:1; width:1px; background:linear-gradient(to bottom, #C9A84C, transparent); min-height:40px; }

/* Visual */
.entry-visual { display:flex; flex-direction:column; }
.visual-frame { position:relative; width:100%; aspect-ratio:4/3; overflow:hidden; }
.visual-img { width:100%; height:100%; object-fit:cover; transition:transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94); display:block; }
.entry:hover .visual-img { transform:scale(1.05); }
.visual-placeholder { width:100%; height:100%; background:#F5F3EF; display:flex; align-items:center; justify-content:center; font-size:4rem; color:#ccc; }
.visual-overlay { position:absolute; inset:0; background:linear-gradient(to bottom, transparent 30%, rgba(10,10,10,0.5) 100%); pointer-events:none; }

.visual-badge { position:absolute; bottom:14px; left:14px; display:flex; align-items:center; gap:5px; background:rgba(201,168,76,0.88); backdrop-filter:blur(6px); padding:5px 12px; border-radius:2px; }
.badge-icon { font-size:12px; }
.badge-count { font-family:'Jost',sans-serif; font-size:12px; font-weight:600; color:#fff; letter-spacing:0.05em; }

.visual-ribbon { position:absolute; top:14px; right:0; font-family:'Jost',sans-serif; font-size:10px; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; padding:5px 14px 5px 10px; clip-path:polygon(8px 0%,100% 0%,100% 100%,0% 100%); }
.ribbon--active   { background:#111; color:#C9A84C; }
.ribbon--inactive { background:#888; color:#fff; }

/* Text */
.entry-text { display:flex; flex-direction:column; justify-content:center; padding:clamp(0px,2vw,20px) 0; }
.text-meta-line { display:flex; align-items:center; gap:8px; margin-bottom:18px; }
.meta-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.dot--active   { background:#22c55e; }
.dot--inactive { background:#9ca3af; }
.meta-label { font-size:11px; font-weight:500; letter-spacing:0.22em; text-transform:uppercase; color:#444; }

.entry-title { font-family:'Cormorant Garamond',serif; font-size:clamp(28px,4vw,52px); font-weight:300; line-height:1.05; color:#111; margin-bottom:20px; }
.entry-divider { margin-bottom:20px; }

.entry-meta { display:flex; flex-direction:column; gap:10px; margin-bottom:24px; }
.meta-row { display:grid; grid-template-columns:80px 1fr; align-items:baseline; gap:12px; padding-bottom:10px; border-bottom:1px solid #E8E4DD; }
.meta-row dt { font-size:10px; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#C9A84C; }
.meta-row dd { font-size:13px; font-weight:400; color:#444; letter-spacing:0.02em; }

.entry-footer { display:flex; align-items:center; gap:20px; }
.tally { display:flex; }
.tally-inner { display:flex; align-items:center; gap:12px; padding:10px 18px; border:1px solid #E8D5A3; background:linear-gradient(135deg,#FFFDF5,#FFF8E6); }
.tally-label { font-size:10px; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:#C9A84C; }
.tally-count { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:300; color:#111; line-height:1; }
.view-cta { font-size:11px; font-weight:500; letter-spacing:0.15em; text-transform:uppercase; color:#888; transition:color 0.2s; }
.entry:hover .view-cta { color:#C9A84C; }

/* Chronicle end */
.chronicle-end { display:flex; flex-direction:column; align-items:center; gap:12px; padding:48px 0 20px; }
.chronicle-end p { font-size:10px; letter-spacing:0.28em; text-transform:uppercase; color:#aaa; }

/* ── MODAL ────────────────────────────────────────── */
.modal-backdrop { position:fixed; inset:0; background:rgba(5,5,5,0.75); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px); }
.modal-panel { background:#fff; width:100%; max-width:680px; max-height:92vh; overflow:hidden; display:flex; flex-direction:column; position:relative; }

.modal-header { background:#111; padding:clamp(24px,4vw,40px) clamp(20px,4vw,40px) clamp(20px,3vw,32px); position:relative; flex-shrink:0; }
.modal-close { position:absolute; top:16px; right:16px; width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); color:#fff; font-size:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s; z-index:2; }
.modal-close:hover { background:rgba(201,168,76,0.25); border-color:#C9A84C; }

.modal-avatar-wrap { display:flex; justify-content:flex-start; margin-bottom:16px; }
.modal-avatar { width:72px; height:72px; border-radius:50%; overflow:hidden; border:2px solid #C9A84C; background:#222; display:flex; align-items:center; justify-content:center; font-size:2rem; color:#555; flex-shrink:0; }
.modal-avatar img { width:100%; height:100%; object-fit:cover; }

.modal-eyebrow { font-size:10px; font-weight:600; letter-spacing:0.28em; text-transform:uppercase; color:#C9A84C; display:block; margin-bottom:8px; }
.modal-name { font-family:'Cormorant Garamond',serif; font-size:clamp(28px,5vw,44px); font-weight:300; color:#fff; line-height:1.05; margin-bottom:12px; }
.modal-header-ornament { margin-bottom:10px; }
.modal-school { font-size:13px; color:rgba(255,255,255,0.45); letter-spacing:0.04em; }

.modal-body { overflow-y:auto; padding:clamp(20px,4vw,36px) clamp(20px,4vw,40px); display:flex; flex-direction:column; gap:32px; }
.modal-body::-webkit-scrollbar { width:6px; }
.modal-body::-webkit-scrollbar-track { background:#f5f5f5; }
.modal-body::-webkit-scrollbar-thumb { background:#ddd; border-radius:3px; }
.modal-body::-webkit-scrollbar-thumb:hover { background:#C9A84C; }

.modal-section { display:flex; flex-direction:column; gap:16px; }
.modal-section-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:400; color:#111; display:flex; align-items:center; gap:12px; }
.section-count { font-family:'Jost',sans-serif; font-size:11px; font-weight:600; letter-spacing:0.15em; color:#C9A84C; background:#FFF8E6; border:1px solid #E8D5A3; padding:2px 8px; }

.info-grid { display:flex; flex-direction:column; gap:0; }
.info-row { display:grid; grid-template-columns:120px 1fr; align-items:baseline; gap:12px; padding:10px 0; border-bottom:1px solid #F0EDE8; }
.info-row dt { font-size:10px; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:#C9A84C; }
.info-row dd { font-size:13px; color:#333; letter-spacing:0.02em; }
.status-pill { font-size:10px; font-weight:600; letter-spacing:0.15em; text-transform:uppercase; padding:3px 10px; }
.pill--active   { background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; }
.pill--inactive { background:#f5f5f5; color:#888; border:1px solid #e5e5e5; }

.empty-achievements { text-align:center; padding:40px; }
.empty-achievements span { display:block; font-size:20px; color:#C9A84C; margin-bottom:10px; }
.empty-achievements p { font-size:13px; color:#aaa; letter-spacing:0.06em; }

.achievements-list { display:flex; flex-direction:column; gap:0; }
.ach-entry { display:grid; grid-template-columns:32px 1fr; gap:16px; padding:18px 0; border-bottom:1px solid #F0EDE8; }
.ach-index { font-family:'Cormorant Garamond',serif; font-size:13px; color:#C9A84C; font-weight:600; letter-spacing:0.1em; padding-top:3px; }
.ach-body { display:flex; flex-direction:column; gap:8px; }
.ach-top { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
.ach-title { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:400; color:#111; line-height:1.2; }
.ach-level { font-size:10px; font-weight:600; letter-spacing:0.15em; text-transform:uppercase; background:#111; color:#C9A84C; padding:3px 8px; white-space:nowrap; flex-shrink:0; }
.ach-meta { display:flex; flex-wrap:wrap; gap:12px; }
.ach-meta-item { font-size:12px; color:#666; }
.ach-meta-item em { font-style:normal; font-weight:600; color:#C9A84C; letter-spacing:0.1em; text-transform:uppercase; font-size:10px; margin-right:4px; }
.ach-remarks { font-size:13px; color:#555; line-height:1.7; background:#FAFAF8; padding:10px 14px; border-left:2px solid #E8D5A3; font-style:italic; }
.ach-link { font-size:12px; font-weight:500; color:#111; letter-spacing:0.06em; text-decoration:none; border-bottom:1px solid #C9A84C; padding-bottom:1px; transition:color 0.2s; }
.ach-link:hover { color:#C9A84C; }

/* Modal transitions */
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-panel, .modal-leave-active .modal-panel { transition: transform 0.3s ease; }
.modal-enter-from .modal-panel { transform: scale(0.95) translateY(16px); }
.modal-leave-to .modal-panel { transform: scale(0.95) translateY(16px); }

/* ── Responsive ───────────────────────────────────── */
@media (max-width: 900px) {
  .entry { grid-template-columns: 32px 1fr; grid-template-rows: auto auto; }
  .entry-visual { grid-column:2; grid-row:1; order:1 !important; }
  .entry-text   { grid-column:2; grid-row:2; order:2 !important; }
  .entry-index  { grid-column:1; grid-row:1/3; }
}
@media (max-width: 560px) {
  .entry { grid-template-columns:24px 1fr; column-gap:14px; padding:32px 0; }
  .entry-footer { flex-direction:column; align-items:flex-start; gap:12px; }
  .meta-row { grid-template-columns:70px 1fr; }
  .info-row { grid-template-columns:100px 1fr; }
  .modal-panel { max-height:96vh; }
  .ach-top { flex-direction:column; }
}
</style>