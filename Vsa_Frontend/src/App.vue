<script setup>
import Header from './components/Header.vue';
import { useRoute } from 'vue-router';
import Footer from './components/Footer.vue';
const route = useRoute();
</script>

<template>
  <div>
    <Header v-if="route.path !== '/login'" />
    <router-view />    
    <Footer v-if="route.path !== '/login' && route.path !== '/admin-dashboard'" ></Footer>
  </div>
</template>

<style scoped>
body {
  background-color: white;
  margin: 0;
  padding-top: 70px;
}
</style>
