<template>
  <div class="auth-success">
    <div class="loading-spinner" v-if="isLoading">
      <h3>Completing Google Sign-In...</h3>
      <p>Please wait while we log you in.</p>
      <p>Debug: {{ debugInfo }}</p>
    </div>
    <div v-else-if="error" class="error-message">
      <h3>Authentication Failed</h3>
      <p>{{ errorMessage }}</p>
      <button @click="goToLogin">Go to Login</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'GoogleAuthSuccess',
  data() {
    return {
      isLoading: true,
      error: false,
      errorMessage: '',
      debugInfo: '',
      apiBaseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/vsa',
    }
  },
  created() {
    // console.log('=== GoogleAuthSuccess Component Created ===')
    // console.log('Full URL:', window.location.href)
    // console.log('Search params:', window.location.search)
    // console.log('Route path:', this.$route.path)
    // console.log('Route query:', this.$route.query)
  },
  mounted() {
    // console.log('=== GoogleAuthSuccess Component Mounted ===')
    this.handleGoogleCallback()
  },
  methods: {
    async handleGoogleCallback() {
      // console.log('handleGoogleCallback called')

      // Try BOTH methods to get the token
      const urlParams = new URLSearchParams(window.location.search)
      const tempToken = urlParams.get('token') || this.$route.query.token
      const errorParam = urlParams.get('error') || this.$route.query.error

      // console.log('Token from URLSearchParams:', urlParams.get('token'))
      // console.log('Token from $route.query:', this.$route.query.token)
      // console.log('Final tempToken:', tempToken)
      // console.log('Error param:', errorParam)

      this.debugInfo = `Token: ${tempToken ? 'Found' : 'Missing'}`

      // Handle error cases first
      if (errorParam) {
        // console.log('Error parameter found:', errorParam)
        this.isLoading = false
        this.error = true

        if (errorParam === 'google_auth_failed') {
          this.errorMessage = 'Google authentication was cancelled or failed.'
        } else if (errorParam === 'callback_failed') {
          this.errorMessage = 'Authentication callback failed.'
        } else {
          this.errorMessage = 'Google Sign-In failed. Please try again.'
        }

        setTimeout(() => {
          this.$router.push('/login')
        }, 3000)
        return
      }

      // Handle successful authentication
      if (tempToken) {
        // console.log('Token found, exchanging...')
        try {
          const response = await axios.post(`${this.apiBaseURL}/google-auth-exchange`, {
            tempToken,
          })

          // console.log('Exchange response:', response.data)

          if (response.data.success) {
            // Store auth data
            localStorage.setItem('token', response.data.data.token)
            localStorage.setItem('refreshToken', response.data.data.refreshToken)
            localStorage.setItem('user', JSON.stringify(response.data.data.user))

            // console.log('Auth data stored, redirecting to home')

            window.location.href = '/';
          } else {
            // console.log('Exchange failed:', response.data.message)
            this.isLoading = false
            this.error = true
            this.errorMessage = response.data.message

            setTimeout(() => {
              this.$router.push('/login')
            }, 3000)
          }
        } catch (error) {
          console.error('Token exchange error:', error)
          this.isLoading = false
          this.error = true
          this.errorMessage = 'Google Sign-In failed. Please try again.'

          setTimeout(() => {
            this.$router.push('/login')
          }, 3000)
        }
      } else {
        // No token found
        // console.log('No token found in URL')
        this.isLoading = false
        this.error = true
        this.errorMessage = 'No authentication token found.'
        this.debugInfo = 'Token missing from URL'

        setTimeout(() => {
          this.$router.push('/login')
        }, 3000)
      }
    },
    goToLogin() {
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
.auth-success {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.loading-spinner {
  padding: 2rem;
}

.error-message {
  padding: 2rem;
  color: #d32f2f;
}

.error-message button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-message button:hover {
  background-color: #1565c0;
}
</style>
