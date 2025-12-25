<template>
  <header class="header">
    <div class="header-container">
      <!-- Logo Section -->
      <div class="logo" @click="navigateTo('/')">
        <img :src="'http://localhost:3000' + logoIconPath" alt="VSA Logo" class="logo-icon" />
        <img :src="'http://localhost:3000' + logoTextPath" alt="VSA" class="logo-text" />
      </div>

      <!-- Desktop Navigation -->
      <nav class="desktop-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <a @click="navigateTo('/')" class="nav-link">
              <i class="icon-home"></i>
              <span>Home</span>
            </a>
          </li>
          <li class="nav-item">
            <a @click="navigateTo('/my-skater-detail')" class="nav-link">
              <i class="icon-user"></i>
              <span>My Skater</span>
            </a>
          </li>
          <li class="nav-item">
            <a @click="navigateTo('/join-us')" class="nav-link">
              <i class="icon-users"></i>
              <span>Join Us</span>
            </a>
          </li>
          <li class="nav-item">
            <a @click="navigateTo('/shop')" class="nav-link">
              <i class="icon-shop"></i>
              <span>Shop</span>
            </a>
          </li>
          <li class="nav-item">
            <a @click="navigateTo('/cart')" class="nav-link">
              <i class="icon-cart"></i>
              <span>Cart</span>
              <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
            </a>
          </li>
          <li class="nav-item user-menu" v-if="isLoggedIn">
            <a @click="toggleUserDropdown" class="nav-link user-toggle">
              <i class="icon-user"></i>
              <span>{{ username }}</span>
              <i class="icon-chevron" :class="{ 'rotated': isUserDropdownOpen }"></i>
            </a>
            <div class="dropdown-menu" :class="{ 'show': isUserDropdownOpen }">
              <a @click="navigateTo('/profile')" class="dropdown-item">
                <i class="icon-profile"></i>
                <span>Profile</span>
              </a>
              <a @click="navigateTo('/orders')" class="dropdown-item">
                <i class="icon-orders"></i>
                <span>Orders</span>
              </a>
              <a @click="navigateTo('/password-change')" class="dropdown-item">
                <i class="icon-key"></i>
                <span>Change Password</span>
              </a>
              <div class="dropdown-divider"></div>
              <a @click="logout" class="dropdown-item logout">
                <i class="icon-logout"></i>
                <span>Logout</span>
              </a>
            </div>
          </li>
          <li class="nav-item" v-else>
            <a @click="navigateTo('/login')" class="nav-link login-btn">
              <i class="icon-login"></i>
              <span>Login</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Mobile Menu Button -->
      <button class="mobile-menu-btn" @click="toggleMobileMenu" :class="{ 'active': isMobileMenuOpen }">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <div class="mobile-nav" :class="{ 'open': isMobileMenuOpen }">
      <div class="mobile-nav-content">
        <ul class="mobile-nav-list">
          <li class="mobile-nav-item">
            <a @click="navigateToMobile('/')" class="mobile-nav-link">
              <i class="icon-home"></i>
              <span>Home</span>
            </a>
          </li>
          <li class="mobile-nav-item">
            <a @click="navigateToMobile('/my-skater-detail')" class="mobile-nav-link">
              <i class="icon-user"></i>
              <span>My Skater</span>
            </a>
          </li>
          <li class="mobile-nav-item">
            <a @click="navigateToMobile('/join-us')" class="mobile-nav-link">
              <i class="icon-users"></i>
              <span>Join Us</span>
            </a>
          </li>
          <li class="mobile-nav-item">
            <a @click="navigateToMobile('/shop')" class="mobile-nav-link">
              <i class="icon-shop"></i>
              <span>Shop</span>
            </a>
          </li>
          <li class="mobile-nav-item">
            <a @click="navigateToMobile('/cart')" class="mobile-nav-link">
              <i class="icon-cart"></i>
              <span>Cart</span>
              <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
            </a>
          </li>
          
          <template v-if="isLoggedIn">
            <li class="mobile-nav-item user-section">
              <div class="user-info">
                <i class="icon-user"></i>
                <span>{{ username }}</span>
              </div>
            </li>
            <li class="mobile-nav-item">
              <a @click="navigateToMobile('/profile')" class="mobile-nav-link sub-link">
                <i class="icon-profile"></i>
                <span>Profile</span>
              </a>
            </li>
            <li class="mobile-nav-item">
              <a @click="navigateToMobile('/orders')" class="mobile-nav-link sub-link">
                <i class="icon-orders"></i>
                <span>Orders</span>
              </a>
            </li>
            <li class="mobile-nav-item">
              <a @click="navigateToMobile('/password-change')" class="mobile-nav-link sub-link">
                <i class="icon-key"></i>
                <span>Change Password</span>
              </a>
            </li>
            <li class="mobile-nav-item">
              <a @click="logout" class="mobile-nav-link logout">
                <i class="icon-logout"></i>
                <span>Logout</span>
              </a>
            </li>
          </template>
          
          <li class="mobile-nav-item" v-else>
            <a @click="navigateToMobile('/login')" class="mobile-nav-link login-btn">
              <i class="icon-login"></i>
              <span>Login</span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Mobile Overlay -->
    <div class="mobile-overlay" :class="{ 'active': isMobileMenuOpen }" @click="closeMobileMenu"></div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      isMobileMenuOpen: false,
      isUserDropdownOpen: false,
      isLoggedIn: false, 
      username: '', 
      cartCount: 0, 
      logoIconPath: '/images/VSA_logo.png',
      logoTextPath: '/images/vsa logo name.png'
    }
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      if (this.isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    },
    toggleUserDropdown() {
      this.isUserDropdownOpen = !this.isUserDropdownOpen;
    },
    navigateTo(path) {
      this.$router.push(path);
      this.isUserDropdownOpen = false;
    },
    navigateToMobile(path) {
      this.$router.push(path);
      this.closeMobileMenu();
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      this.isLoggedIn = false;
      this.username = '';
      this.isUserDropdownOpen = false;
      this.closeMobileMenu();
      this.$router.push('/');
    }
  },
  mounted() {

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if(token && user){
      this.isLoggedIn = true;
      try {
        const parsedUser = JSON.parse(user);
        this.username = parsedUser.fullName.split(' ')[0];
      } catch (error) {
        console.error('Failed to parse user:', e);
      }
    }
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-menu')) {
        this.isUserDropdownOpen = false;
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });
  },
  beforeUnmount() {
    document.body.style.overflow = '';
  }
}
</script>

<style scoped>
/* CSS Custom Properties */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --accent-color: #4f46e5;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --text-light: #ffffff;
  --background-light: #ffffff;
  --background-dark: #1f2937;
  --border-color: #e5e7eb;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--background-light);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-md);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

/* Logo Styles */
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.02);
}

.logo-icon {
  height: 45px;
  width: auto;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.logo-text {
  height: 25px;
  width: auto;
  max-width: 200px;
}

/* Desktop Navigation */
.desktop-nav {
  display: block;
}

.nav-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  white-space: nowrap;
  position: relative;
}

.nav-link:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  transform: translateY(-1px);
  color: var(--accent-color);
}

.login-btn {
  background: var(--primary-gradient);
  color: var(--text-light);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  background: var(--primary-gradient);
  color: var(--text-light);
}

/* Cart Badge */
.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--secondary-gradient);
  color: var(--text-light);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

/* User Dropdown */
.user-menu {
  position: relative;
}

.user-toggle {
  background: rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.2);
}

.user-toggle:hover {
  background: rgba(79, 70, 229, 0.15);
}

.icon-chevron {
  transition: transform 0.3s ease;
  font-size: 0.8rem;
}

.icon-chevron.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: #ffffff !important;
  border-radius: 16px;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
  min-width: 200px;
  padding: 0.5rem 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
  color: var(--text-primary) !important;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  color: var(--text-primary) !important;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  font-size: 0.9rem;
}

.dropdown-item:hover {
  background: rgba(79, 70, 229, 0.05);
  color: var(--accent-color);
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background: rgba(239, 68, 68, 0.05);
  color: #dc2626;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0.5rem 0;
}

.dropdown-item.logout {
  color: #ef4444 !important;
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  z-index: 1002;
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background: black;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 2px 0;
  border-radius: 2px;
}

.mobile-menu-btn.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-btn.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(3px, -3px);
}

/* Mobile Navigation */
.mobile-nav {
  position: fixed;
  top: 0;
  right: -100%;
  width: 320px;
  height: 100vh;
  background: var(--background-light);
  box-shadow: var(--shadow-xl);
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
  overflow-y: auto;
}

.mobile-nav.open {
  right: 0;
}

.mobile-nav-content {
  padding: 100px 0 2rem;
  background-color: whitesmoke;
}

.mobile-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mobile-nav-item {
  border-bottom: 1px solid var(--border-color);
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.mobile-nav-link:hover {
  background: rgba(79, 70, 229, 0.05);
  color: var(--accent-color);
}

.mobile-nav-link.sub-link {
  padding-left: 3rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.mobile-nav-link.login-btn {
  background: var(--primary-gradient);
  color: var(--text-light);
  margin: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
}

.mobile-nav-link.logout {
  color: #ef4444;
}

.user-section .user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: rgba(79, 70, 229, 0.05);
  font-weight: 600;
  color: var(--accent-color);
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
}

.mobile-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* Icons */
.icon-home::before { content: '🏠'; }
.icon-users::before { content: '👥'; }
.icon-shop::before { content: '🛍️'; }
.icon-cart::before { content: '🛒'; }
.icon-user::before { content: '👤'; }
.icon-profile::before { content: '👤'; }
.icon-orders::before { content: '📦'; }
.icon-key::before { content: '🔑'; }
.icon-logout::before { content: '🚪'; }
.icon-login::before { content: '🔐'; }
.icon-chevron::before { content: '▼'; }

/* Responsive Design */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .header-container {
    padding: 0 1rem;
    height: 60px;
  }
  
  .logo-icon {
    height: 35px;
  }
  
  .logo-text {
    height: 20px;
    max-width: 150px;
  }
  
  .mobile-nav {
    width: 280px;
  }
}

@media (max-width: 480px) {
  .mobile-nav {
    width: 100%;
    right: -100%;
  }
  
  .mobile-nav.open {
    right: 0;
  }
  
  .logo-text {
    max-width: 120px;
  }
}

@media (min-width: 769px) {
  .mobile-nav,
  .mobile-overlay {
    display: none;
  }
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav-item {
  animation: fadeInDown 0.6s ease forwards;
  animation-delay: calc(0.1s * var(--stagger, 0));
}

/* Add stagger delays */
.nav-item:nth-child(1) { --stagger: 1; }
.nav-item:nth-child(2) { --stagger: 2; }
.nav-item:nth-child(3) { --stagger: 3; }
.nav-item:nth-child(4) { --stagger: 4; }
.nav-item:nth-child(5) { --stagger: 5; }
</style>