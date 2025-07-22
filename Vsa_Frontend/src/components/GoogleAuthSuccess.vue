<template>
  <div class="auth-success">
    <div class="loading-spinner">
      <h3>Completing Google Sign-In...</h3>
      <p>Please wait while we log you in.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoogleAuthSuccess',
  mounted() {
    // This component will be handled by the parent component's handleGoogleCallback method
    // You can add additional loading UI here if needed
  }
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
</style>