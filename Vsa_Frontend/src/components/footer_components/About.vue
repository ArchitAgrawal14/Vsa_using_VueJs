<template>
  <div class="about-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="skating-loader"></div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-container">
          <div class="skating-element"></div>
          <div class="skating-element"></div>
          <h1 class="hero-title">{{ aboutData.title || 'About Vaibhav Skating Academy' }}</h1>
          <p class="hero-description">
            {{ aboutData.description || 'Shaping the future of skating through innovation, passion, and excellence.' }}
          </p>
          <div class="skating-icons">
            <i class="fas fa-skating skating-icon"></i>
            <i class="fas fa-medal skating-icon"></i>
            <i class="fas fa-trophy skating-icon"></i>
          </div>
        </div>
      </section>

      <div class="about-container">
        <!-- Mission, Vision, Values Section -->
        <section class="mvv-section">
          <h2 class="section-title fade-in" ref="sectionTitle">Our Foundation</h2>
          <div class="mvv-grid">
            <div 
              v-for="(item, index) in mvvData" 
              :key="item.title"
              class="mvv-card fade-in"
              :class="getAnimationClass(index)"
              :style="{ 'animation-delay': (index * 0.2) + 's' }"
              ref="mvvCards"
            >
              <div class="speed-lines" v-if="index === 1"></div>
              <i :class="item.icon + ' mvv-icon'"></i>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </section>

        <!-- Team Section -->
        <section class="team-section">
          <div class="team-skater"></div>
          <div class="team-skater team-skater-2"></div>
          <div class="team-skater team-skater-3"></div>
          <h2 class="section-title fade-in" ref="teamTitle">Our Champions</h2>
          <div class="team-grid">
            <div 
              v-for="(member, index) in aboutData.team || defaultTeam" 
              :key="member.name"
              class="team-card fade-in"
              :style="{ 'animation-delay': (index * 0.1 + 0.3) + 's' }"
              ref="teamCards"
            >
              <div class="team-avatar">
                <i class="fas fa-user"></i>
              </div>
              <h4>{{ member.name }}</h4>
              <p class="role">{{ member.role }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
  data() {
    return {
      loading: true,
      aboutData: {},
      mvvData: [
        {
          title: 'Our Mission',
          icon: 'fas fa-rocket',
          description: 'To inspire and nurture skaters of all levels by providing top-tier training, premium skating gear, and a supportive environment, fostering excellence and empowering individuals to reach their fullest potential.'
        },
        {
          title: 'Our Vision',
          icon: 'fas fa-eye',
          description: 'To be the leading skating academy, recognized globally for excellence in coaching, innovation, and creating a community of champions who inspire the world through their passion and achievements.'
        },
        {
          title: 'Our Values',
          icon: 'fas fa-heart',
          description: 'Commitment to excellence, integrity, passion for skating, continuous learning, and fostering a supportive and inclusive community where every skater can thrive.'
        }
      ],
      defaultTeam: [
        { name: 'Visheshta Singh', role: 'Lead Coach & Founder' },
        { name: 'Harsh Kasaudhan', role: 'Technical Director' },
        { name: 'Our Team', role: 'The Backbone of Excellence' }
      ],
      observer: null
    };
  },
  async mounted() {
    try {
      await this.fetchAboutData();
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      this.loading = false;
      this.$nextTick(() => {
        this.initializeAnimations();
      });
    }
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    async fetchAboutData() {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        const response = await fetch('/vsa/about');
        if (response.ok) {
          this.aboutData = await response.json();
        } else {
          // Fallback to default data if API fails
          this.aboutData = {
            title: 'About Vaibhav Skating Academy',
            description: 'At Vaibhav Skating Academy, we are committed to shaping the future of skating through innovation, passion, and excellence. Our mission is to provide world-class training, cutting-edge skating gear, and a supportive community where skaters of all levels can thrive.',
            team: this.defaultTeam
          };
        }
      } catch (error) {
        // Use default data on error
        this.aboutData = {
          title: 'About Vaibhav Skating Academy',
          description: 'At Vaibhav Skating Academy, we are committed to shaping the future of skating through innovation, passion, and excellence. Our mission is to provide world-class training, cutting-edge skating gear, and a supportive community where skaters of all levels can thrive.',
          team: this.defaultTeam
        };
      }
    },
    getAnimationClass(index) {
      const classes = ['slide-in-left', 'fade-in', 'slide-in-right'];
      return classes[index % classes.length];
    },
    initializeAnimations() {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      // Observe all animated elements
      const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
      animatedElements.forEach(el => {
        this.observer.observe(el);
      });
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --white: #ffffff;
  --off-white: #fafafa;
  --light-gray: #f5f5f5;
  --medium-gray: #e5e5e5;
  --dark-gray: #333333;
  --text-primary: #2d2d2d;
  --text-secondary: #666666;
  --shadow-light: 0 2px 10px rgba(0, 0, 0, 0.05);
  --shadow-medium: 0 4px 20px rgba(0, 0, 0, 0.1);
  --shadow-heavy: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.about-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--white);
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
}

/* Loading Animation */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

.skating-loader {
  width: 60px;
  height: 60px;
  border: 3px solid var(--light-gray);
  border-top: 3px solid var(--text-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, var(--off-white) 0%, var(--light-gray) 100%);
  padding: 120px 20px 100px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 100%;
  background: 
    radial-gradient(ellipse 160px 30px at 25% 50%, rgba(229, 229, 229, 0.3) 0%, transparent 70%),
    radial-gradient(ellipse 160px 30px at 75% 50%, rgba(229, 229, 229, 0.3) 0%, transparent 70%),
    repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(240, 240, 240, 0.4) 20px, rgba(240, 240, 240, 0.4) 22px);
  opacity: 0.6;
  animation: trackMove 25s linear infinite;
}

@keyframes trackMove {
  0% { transform: translateX(0); }
  100% { transform: translateX(50px); }
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  opacity: 0;
  transform: translateY(30px);
  animation: slideUpFade 1s ease-out 0.5s forwards;
}

.hero-description {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: var(--text-secondary);
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.8;
  opacity: 0;
  transform: translateY(30px);
  animation: slideUpFade 1s ease-out 1s forwards;
}

.skating-icons {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  opacity: 0;
  animation: slideUpFade 1s ease-out 1.5s forwards;
}

.skating-icon {
  font-size: 2rem;
  color: var(--text-secondary);
  animation: float 3s ease-in-out infinite;
}

.skating-icon:nth-child(2) {
  animation-delay: -1s;
}

.skating-icon:nth-child(3) {
  animation-delay: -2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes slideUpFade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Main Content Container */
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.mvv-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(240, 248, 255, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(240, 248, 255, 0.3) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.mvv-section {
  position: relative;
}

.mvv-grid {
  position: relative;
  z-index: 1;
}

.section-title {
  text-align: center;
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 3rem;
  color: var(--text-primary);
}

.mvv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.mvv-card {
  background: var(--white);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: var(--shadow-medium);
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

.mvv-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.8s;
}

.mvv-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: var(--shadow-heavy);
}

.mvv-card:hover::before {
  left: 100%;
}
.mvv-card::after {
  content: '⛸';
  position: absolute;
  bottom: 15px;
  right: 15px;
  font-size: 24px;
  opacity: 0.1;
  transition: all 0.3s ease;
  transform: rotate(-15deg);
  color: var(--text-secondary);
}

.mvv-card:hover::after {
  opacity: 0.3;
  transform: rotate(-10deg) scale(1.1);
}

.mvv-icon {
  font-size: 3rem;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  display: block;
  transition: transform 0.3s ease;
}

.mvv-card:hover .mvv-icon {
  transform: scale(1.1) rotate(5deg);
}

.mvv-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.mvv-card p {
  color: var(--text-secondary);
  line-height: 1.7;
}

/* Team Section */
.team-section {
  padding: 80px 0;
  background: var(--off-white);
  position: relative;
}

.team-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--medium-gray), transparent);
}

.team-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: 
    repeating-linear-gradient(90deg, 
      transparent 0px, 
      transparent 40px, 
      rgba(245, 245, 245, 0.8) 42px, 
      rgba(245, 245, 245, 0.8) 44px),
    repeating-linear-gradient(90deg, 
      transparent 20px, 
      rgba(240, 240, 240, 0.6) 62px, 
      rgba(240, 240, 240, 0.6) 64px, 
      transparent 66px);
  opacity: 0.7;
  pointer-events: none;
}
.team-skater {
  position: absolute;
  top: calc(100% - 60px);
  left: -60px;
  width: 40px;
  height: 30px;
  background: linear-gradient(135deg, #444 0%, #666 100%);
  border-radius: 15px 5px 5px 15px;
  animation: skaterMove 12s linear infinite;
  pointer-events: none;
  z-index: 2;
}
.team-skater-2 {
  animation: skaterMove 15s linear infinite;
  animation-delay: -5s;
  background: linear-gradient(135deg, #555 0%, #777 100%);
  top: calc(100% - 40px);
}

.team-skater-3 {
  animation: skaterMove 18s linear infinite;
  animation-delay: -10s;
  background: linear-gradient(135deg, #333 0%, #555 100%);
  top: calc(100% - 80px);
  transform: scale(0.8);
}
.team-skater::before {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 5px;
  width: 30px;
  height: 4px;
  background: linear-gradient(90deg, #888 0%, #aaa 50%, #888 100%);
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.team-skater::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 9px;
  width: 8px;
  height: 8px;
  background: skyblue;
  border-radius: 50%;
  box-shadow: 16px 0 skyblue;
}

@keyframes skaterMove {
  0% {
    left: -60px;
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-2deg);
  }
  50% {
    transform: rotate(2deg);
  }
  75% {
    transform: rotate(-1deg);
  }
  100% {
    left: calc(100% + 60px);
    transform: rotate(0deg);
  }
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.team-card {
  background: var(--white);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.team-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: var(--text-primary);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.team-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-medium);
}

.team-card:hover::after {
  width: 80%;
}

.team-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--light-gray);
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.team-avatar::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transition: all 0.5s ease;
  transform: translate(-50%, -50%);
}

.team-card:hover .team-avatar::before {
  width: 200%;
  height: 200%;
}

.team-card h4 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.team-card .role {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Speed Lines Animation */
.speed-lines {
  position: absolute;
  top: 50%;
  left: -100px;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--medium-gray), transparent);
  animation: speedMove 2s ease-in-out infinite;
}

@keyframes speedMove {
  0% { left: -100px; opacity: 0; }
  50% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}
@keyframes skateGlide {
  0% { 
    transform: translateX(-100px) rotate(-5deg);
    opacity: 0;
  }
  50% { 
    opacity: 0.3;
  }
  100% { 
    transform: translateX(calc(100vw + 100px)) rotate(5deg);
    opacity: 0;
  }
}

.skating-element {
  position: absolute;
  top: 60%;
  left: -100px;
  width: 60px;
  height: 20px;
  background: linear-gradient(90deg, 
    rgba(224, 224, 224, 0.6) 0%, 
    rgba(224, 224, 224, 0.3) 50%, 
    rgba(224, 224, 224, 0.6) 100%);
  border-radius: 10px;
  animation: skateGlide 15s ease-in-out infinite;
  pointer-events: none;
}

.skating-element::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 50%;
  width: 8px;
  height: 8px;
  background: rgba(200, 200, 200, 0.8);
  border-radius: 50%;
  transform: translateY(-50%);
  box-shadow: 36px 0 rgba(200, 200, 200, 0.8);
}

.skating-element:nth-child(2) {
  animation-delay: -7.5s;
  top: 70%;
  background: linear-gradient(90deg, 
    rgba(210, 210, 210, 0.5) 0%, 
    rgba(210, 210, 210, 0.2) 50%, 
    rgba(210, 210, 210, 0.5) 100%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 80px 20px 60px;
  }

  .mvv-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .mvv-card {
    padding: 2rem;
  }

  .team-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .skating-icons {
    gap: 1rem;
  }

  .skating-icon {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .mvv-grid {
    grid-template-columns: 1fr;
  }

  .team-grid {
    grid-template-columns: 1fr;
  }

  .mvv-card, .team-card {
    padding: 1.5rem;
  }
}

/* Intersection Observer Animation */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

.slide-in-left {
  opacity: 0;
  transform: translateX(-50px);
  transition: all 0.8s ease-out;
}

.slide-in-left.visible {
  opacity: 1;
  transform: translateX(0);
}

.slide-in-right {
  opacity: 0;
  transform: translateX(50px);
  transition: all 0.8s ease-out;
}

.slide-in-right.visible {
  opacity: 1;
  transform: translateX(0);
}
</style>