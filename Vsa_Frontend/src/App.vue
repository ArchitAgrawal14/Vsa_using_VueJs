<script setup>
import Header from './components/Header.vue';
import { useRoute } from 'vue-router';
import Footer from './components/Footer.vue';
import Dashboard from './components/Dashboard.vue';
const route = useRoute();
</script>

<template>
  <div>
    <Header v-if="route.path !== '/login'" />
    <router-view />
    <Dashboard />
    <Footer></Footer>
  </div>
</template>

<style scoped>
body {
  background-color: white;
  margin: 0;
  padding-top: 70px;
}
</style>
