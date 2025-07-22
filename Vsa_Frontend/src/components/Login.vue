<template>
  <div class="auth-container">
    <!-- Background Elements -->
    <div class="skating-bg">
      <div class="skate-icon skate-1">
        <svg viewBox="0 0 100 100">
          <path d="M20 50 Q30 30 50 50 Q70 70 80 50" stroke="currentColor" stroke-width="2" fill="none" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
          <path d="M45 55 L55 55 M50 50 L50 60" stroke="currentColor" stroke-width="1" />
        </svg>
      </div>
      <div class="skate-icon skate-2">
        <svg viewBox="0 0 100 100">
          <ellipse cx="50" cy="70" rx="35" ry="8" fill="currentColor" opacity="0.3" />
          <path d="M25 40 Q50 20 75 40 L75 65 Q50 55 25 65 Z" fill="currentColor" />
          <circle cx="35" cy="75" r="4" fill="currentColor" />
          <circle cx="50" cy="75" r="4" fill="currentColor" />
          <circle cx="65" cy="75" r="4" fill="currentColor" />
        </svg>
      </div>
      <div class="skate-icon skate-3">
        <svg viewBox="0 0 100 100">
          <path d="M20 60 L80 60 M30 65 L70 65" stroke="currentColor" stroke-width="3" />
          <path d="M35 40 Q50 25 65 40 L65 55 L35 55 Z" fill="currentColor" />
          <line x1="25" y1="65" x2="25" y2="55" stroke="currentColor" stroke-width="2" />
          <line x1="75" y1="65" x2="75" y2="55" stroke="currentColor" stroke-width="2" />
        </svg>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="toast">
      <div v-if="toast" :class="['toast', toast.type]">
        <div class="toast-icon">
          <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22,4 12,14.01 9,11.01"></polyline>
          </svg>
          <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <span>{{ toast.message }}</span>
        <button @click="toast = null" class="toast-close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </transition>

    <!-- Main Form Container -->
    <div class="form-container">
      <div class="form-header">
        <h1 class="brand-title">
          <svg class="brand-icon" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" stroke-width="2" />
            <path d="M12 20 Q20 12 28 20 Q20 28 12 20" fill="currentColor" opacity="0.8" />
          </svg>
          Vaibhav skating academy
        </h1>
        <p class="brand-subtitle">Premium skating experience awaits</p>
      </div>

      <!-- Toggle Buttons -->
      <div class="toggle-container">
        <button :class="['toggle-btn', { active: isLogin }]" @click="switchMode(true)">
          Sign In
        </button>
        <button :class="['toggle-btn', { active: !isLogin }]" @click="switchMode(false)">
          Sign Up
        </button>
      </div>

      <!-- Forms -->
      <div class="form-wrapper">
        <!-- Login Form -->
        <transition name="slide">
          <form v-if="isLogin" @submit.prevent="handleSubmit" class="auth-form">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-group">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input v-model="loginForm.email" type="email" placeholder="Email" class="form-input" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-group">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input v-model="loginForm.password" :type="showPassword ? 'text' : 'password'" placeholder="Password"
                  class="form-input" required />
                <button type="button" @click="showPassword = !showPassword" class="password-toggle">
                  <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z">
                    </path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <div class="captcha-group">
              <label class="form-label">CAPTCHA</label>
              <div class="captcha-container">
                <div class="captcha-code">{{ captchaCode }}</div>
                <button type="button" @click="refreshCaptcha" class="captcha-refresh">
                  <i class="fas fa-sync-alt"></i>
                </button>
              </div>
              <input v-model="captcha" type="text" placeholder="Enter CAPTCHA" class="form-input" required />
            </div>

            <button type="submit" class="submit-btn" :disabled="isLoading">
              <span v-if="isLoading" class="loading-spinner"></span>
              <span v-if="!isLoading">Sign In</span>
              <span v-else>Signing In...</span>
            </button>

            <div class="divider">
              <!-- <span>or</span> -->
            </div>

            <button type="button" @click="handleGoogleSignIn" class="google-btn" :disabled="isLoading">
              <span v-if="isLoading" class="loading-spinner"></span>
              <svg v-if="!isLoading" class="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span v-if="!isLoading">Continue with Google</span>
              <span v-else>Signing In...</span>
            </button>

            <p class="form-footer">
              Don't have an account?
              <button type="button" @click="switchMode(false)" class="switch-link">
                Sign up here
              </button>
            </p>
          </form>
        </transition>

        <!-- Signup Form -->
        <transition name="slide">
          <form v-if="!isLogin" @submit.prevent="handleSubmit" class="auth-form">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <div class="input-group">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input v-model="signupForm.fullName" type="text" placeholder="Full name" class="form-input" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Mobile Number</label>
              <div class="input-group">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
                  </path>
                </svg>
                <input v-model="signupForm.mobile" type="tel" placeholder="Mobile number" class="form-input" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-group">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input v-model="signupForm.email" type="email" placeholder="Email" class="form-input" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-group">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input v-model="signupForm.password" :type="showPassword ? 'text' : 'password'"
                  placeholder="Create a password" class="form-input" required />
                <button type="button" @click="showPassword = !showPassword" class="password-toggle">
                  <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z">
                    </path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Confirm Password</label>
              <div class="input-group">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input v-model="signupForm.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirm your password" class="form-input" required />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="password-toggle">
                  <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z">
                    </path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <div class="captcha-group">
              <label class="form-label">CAPTCHA</label>
              <div class="captcha-container">
                <div class="captcha-code">{{ captchaCode }}</div>
                <button type="button" @click="refreshCaptcha" class="captcha-refresh">
                  <i class="fas fa-sync-alt"></i>
                </button>
              </div>
              <input v-model="captcha" type="text" placeholder="Enter CAPTCHA" class="form-input" required />
            </div>

            <button type="submit" class="submit-btn" :disabled="isLoading">
              <span v-if="isLoading" class="loading-spinner"></span>
              <span v-if="!isLoading">Create Account</span>
              <span v-else>Creating Account...</span>
            </button>

            <div class="divider">
              <!-- <span>or</span> -->
            </div>

            <button type="button" @click="handleGoogleSignIn" class="google-btn" :disabled="isLoading">
              <span v-if="isLoading" class="loading-spinner"></span>
              <svg v-if="!isLoading" class="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span v-if="!isLoading">Continue with Google</span>
              <span v-else>Signing In...</span>
            </button>

            <p class="form-footer">
              Already have an account?
              <button type="button" @click="switchMode(true)" class="switch-link">
                Sign in here
              </button>
            </p>
          </form>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  created() {
    this.setupAxiosInterceptors();
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.checkVerificationStatus();
      }, 100);
    });
    this.handleGoogleCallback();
  },
  data() {
    return {
      isLogin: true,
      isLoading: false,
      showPassword: false,
      showConfirmPassword: false,
      apiBaseURL: 'http://localhost:3000/vsa',
      captcha: '',
      captchaCode: this.generateCaptcha(),
      toast: null,
      loginForm: {
        email: '',
        password: ''
      },
      signupForm: {
        fullName: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    setupAxiosInterceptors() {
      // Request interceptor to add token
      axios.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Response interceptor to handle token refresh
      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;

          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
              const refreshToken = localStorage.getItem('refreshToken');
              const response = await axios.post(`${this.apiBaseURL}/refresh-token`, {
                refreshToken
              });

              if (response.data.success) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${response.data.data.token}`;
                return axios(originalRequest);
              }
            } catch (refreshError) {
              this.handleLogout();
            }
          }
          return Promise.reject(error);
        }
      );
    },

    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      this.$router.push('/login');
    },

    generateCaptcha() {
      return Math.random().toString(36).substr(2, 6).toUpperCase();
    },

    showToast(type, message) {
      this.toast = { type, message };
      setTimeout(() => {
        this.toast = null;
      }, 4000);
    },

    switchMode(login) {
      this.isLogin = login;
      this.showPassword = false;
      this.showConfirmPassword = false;
      this.captcha = '';
      this.captchaCode = this.generateCaptcha();
    },
    clearForms() {
      this.loginForm = {
        email: '',
        password: ''
      }
      this.signupForm = {
        fullName: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    },
    refreshCaptcha() {
      this.captchaCode = this.generateCaptcha();
      this.captcha = '';
    },
    isTokenExpired() {
      const token = localStorage.getItem('token');
      if (!token) return true;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
      } catch (error) {
        return true;
      }
    },
    async handleSubmit() {
      if (this.captcha.toUpperCase() !== this.captchaCode) {
        this.showToast('error', 'Invalid CAPTCHA. Please try again.');
        this.refreshCaptcha();
        return;
      }
      this.isLoading = true;
      try {
        if (this.isLogin) {
          if (!this.loginForm.email || !this.loginForm.password) {
            this.showToast('error', 'Please fill in all fields.');
            this.isLoading = false;
            return;
          }
          const response = await axios.post(`${this.apiBaseURL}/login`, {
            email: this.loginForm.email,
            password: this.loginForm.password,
            captcha: this.captcha
          });
          if (response.data.success) {
            try {
              localStorage.setItem('token', response.data.data.token);
              localStorage.setItem('refreshToken', response.data.data.refreshToken);
              localStorage.setItem('user', JSON.stringify(response.data.data.user));
            } catch (error) {
              console.error('Failed to save to localStorage:', error);
            }
            this.showToast('success', response.data.message);
            this.clearForms();
            if (!response.data.data.user.isAdmin) {
              this.$router.replace('/');
            } else {
              this.$router.replace('/admin-dashboard');
            } 
          }
        } else {
          if (!this.signupForm.fullName || !this.signupForm.mobile || !this.signupForm.email || !this.signupForm.password) {
            this.showToast('error', 'Please fill in all fields.');
            this.isLoading = false;
            return;
          }
          if (this.signupForm.password != this.signupForm.confirmPassword) {
            this.showToast('error', 'Passwords do not match.');
            this.isLoading = false;
            return;
          }

          const response = await axios.post(`${this.apiBaseURL}/signup`, {
            email: this.signupForm.email,
            password: this.signupForm.password,
            fullName: this.signupForm.fullName,
            mobile: this.signupForm.mobile,
            captcha: this.captcha,
            confirmPassword: this.signupForm.confirmPassword
          });

          if (response.data.success) {
            try {
              localStorage.setItem('token', response.data.data.token);
              localStorage.setItem('refreshToken', response.data.data.refreshToken);
              localStorage.setItem('user', JSON.stringify(response.data.data.user));
            } catch (error) {
              console.error('Failed to save to localStorage:', error);
            }
            this.showToast('success', response.data.message);
            this.clearForms();
            this.$router.push('/login');
          }
        }
      } catch (error) {
        console.error('API error :', error);

        if (error.response && error.response.data) {
          this.showToast('error', error.response.data.message || 'An error occurred');
          if (error.response.data.errors) {
            const errorMessages = error.response.data.error.map(err => err.msg).join(', ');
            this.showToast('error', errorMessages);
          }
        } else {
          this.showToast('error', 'Network error. Please check your connection.');
        }
        this.refreshCaptcha();

      } finally {
        this.isLoading = false;
      }
    },
    async handleGoogleSignIn() {
      this.isLoading = true;

      try {
        window.location.href = `${this.apiBaseURL}/auth/google`;
      } catch (error) {
        console.error('Google Sign-In Error:', error);
        this.showToast('error', 'Google Sign-In failed. Please try again.');
        this.isLoading = false;
      }
    },
    async handleGoogleCallback() {
      // Check if we're on the success page with a token
      const urlParams = new URLSearchParams(window.location.search);
      const tempToken = urlParams.get('token');

      if (tempToken && this.$route.path === '/auth/google/success') {
        try {
          const response = await axios.post(`${this.apiBaseURL}/google-auth-exchange`, {
            tempToken
          });

          if (response.data.success) {
            // Store auth data
            try {
              localStorage.setItem('token', response.data.data.token);
              localStorage.setItem('refreshToken', response.data.data.refreshToken);
              localStorage.setItem('user', JSON.stringify(response.data.data.user));
            } catch (error) {
              console.error('Failed to save to localStorage:', error);
            }

            this.showToast('success', response.data.message);
            this.$router.push('/');
          }
        } catch (error) {
          console.error('Token exchange failed:', error);
          this.showToast('error', 'Google Sign-In failed. Please try again.');
          this.$router.push('/login');
        }
      }

      // Handle error cases
      const errorParam = urlParams.get('error');
      if (errorParam) {
        let errorMessage = 'Google Sign-In failed. Please try again.';
        if (errorParam === 'google_auth_failed') {
          errorMessage = 'Google authentication was cancelled or failed.';
        } else if (errorParam === 'callback_failed') {
          errorMessage = 'Authentication callback failed.';
        }
        this.showToast('error', errorMessage);
        this.$router.push('/login');
      }
    },
    checkVerificationStatus() {
      const urlParams = new URLSearchParams(window.location.search);
      const verified = urlParams.get('verified');
      const message = urlParams.get('message');

      console.log('URL Params:', { verified, message }); // Debug log

      if (verified && message) {
        const decodedMessage = decodeURIComponent(message);
        console.log('Showing toast:', verified, decodedMessage); // Debug log

        if (verified === 'success') {
          this.showToast('success', decodedMessage);
        } else if (verified === 'error') {
          this.showToast('error', decodedMessage);
        } else if (verified === 'info') {
          this.showToast('info', decodedMessage);
        }

        // Clean up URL parameters
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  display: inline-block;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Button Loading States */
.submit-btn:disabled,
.google-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}

.submit-btn:disabled {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.google-btn:disabled {
  background-color: #f5f5f5;
  border-color: #ddd;
}

/* Button content alignment when loading */
.submit-btn,
.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.auth-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* Background Skating Elements */
.skating-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.skate-icon {
  position: absolute;
  width: 120px;
  height: 120px;
  opacity: 0.03;
  color: #1a202c;
  animation: float 6s ease-in-out infinite;
}

.skate-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.skate-2 {
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.skate-3 {
  bottom: 15%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

/* Toast Notification */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  max-width: 400px;
  backdrop-filter: blur(10px);
}

.toast.success {
  background: rgba(16, 185, 129, 0.95);
  color: white;
}

.toast.error {
  background: rgba(239, 68, 68, 0.95);
  color: white;
}

.toast.warning {
  background: rgba(245, 158, 11, 0.95);
  color: white;
}

.toast-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Form Container */
.form-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 480px;
  position: relative;
  backdrop-filter: blur(10px);
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.brand-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.brand-icon {
  width: 36px;
  height: 36px;
  color: #374151;
}

.brand-subtitle {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
}

/* Toggle Buttons */
.toggle-container {
  display: flex;
  background: #f3f4f6;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 32px;
}

.toggle-btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
  color: #6b7280;
}

.toggle-btn.active {
  background: white;
  color: #1a202c;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toggle-btn:hover:not(.active) {
  color: #374151;
}

/* Form Wrapper */
.form-wrapper {
  position: relative;
  overflow: hidden;
}

.auth-form {
  width: 100%;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}

.slide-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

/* Form Groups */
.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 14px;
}

.input-group {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  color: #1a202c;
}

.form-input:focus {
  outline: none;
  border-color: #374151;
  box-shadow: 0 0 0 3px rgba(55, 65, 81, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  width: 20px;
  height: 20px;
  color: #9ca3af;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #374151;
}

/* CAPTCHA */
.captcha-group {
  margin-bottom: 24px;
}

.captcha-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.captcha-code {
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 18px;
  color: #374151;
  letter-spacing: 3px;
  user-select: none;
  min-width: 120px;
  text-align: center;
}

.captcha-refresh {
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.captcha-refresh:hover {
  background: #e5e7eb;
  color: #374151;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 16px;
  background: #1a202c;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.submit-btn:hover {
  background: #2d3748;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(26, 32, 44, 0.15);
}

.submit-btn:active {
  transform: translateY(0);
}

/* Divider */
.divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
  color: #9ca3af;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: white;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
}

/* Google Button */
.google-btn {
  width: 100%;
  padding: 16px;
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.google-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.google-btn:active {
  transform: translateY(0);
}

.google-icon {
  width: 20px;
  height: 20px;
}

/* Form Footer */
.form-footer {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.switch-link {
  background: none;
  border: none;
  color: #1a202c;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.switch-link:hover {
  color: #374151;
}

/* Responsive Design */
@media (max-width: 640px) {
  .auth-container {
    padding: 16px;
  }

  .form-container {
    padding: 24px;
    border-radius: 16px;
  }

  .brand-title {
    font-size: 24px;
  }

  .form-input {
    padding: 14px 14px 14px 44px;
    font-size: 16px;
  }

  .submit-btn,
  .google-btn {
    padding: 14px;
    font-size: 15px;
  }

  .skate-icon {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 480px) {
  .toggle-btn {
    padding: 10px 16px;
    font-size: 14px;
  }

  .captcha-container {
    flex-direction: column;
    align-items: stretch;
  }

  .captcha-code {
    min-width: auto;
  }
}

/* Animation for form elements */
.form-group {
  animation: slideInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

.form-group:nth-child(1) {
  animation-delay: 0.1s;
}

.form-group:nth-child(2) {
  animation-delay: 0.2s;
}

.form-group:nth-child(3) {
  animation-delay: 0.3s;
}

.form-group:nth-child(4) {
  animation-delay: 0.4s;
}

.form-group:nth-child(5) {
  animation-delay: 0.5s;
}

.form-group:nth-child(6) {
  animation-delay: 0.6s;
}

.captcha-group {
  animation: slideInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  animation-delay: 0.7s;
}

.submit-btn {
  animation: slideInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  animation-delay: 0.8s;
}

.divider {
  animation: slideInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  animation-delay: 0.9s;
}

.google-btn {
  animation: slideInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  animation-delay: 1s;
}

.form-footer {
  animation: slideInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  animation-delay: 1.1s;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Focus states for accessibility */
.toggle-btn:focus,
.form-input:focus,
.submit-btn:focus,
.google-btn:focus,
.switch-link:focus {
  outline: 2px solid #374151;
  outline-offset: 2px;
}

/* Hover animations */
.form-input:hover {
  border-color: #d1d5db;
}

.captcha-refresh:focus {
  outline: 2px solid #374151;
  outline-offset: 2px;
}

.password-toggle:focus {
  outline: 2px solid #374151;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
