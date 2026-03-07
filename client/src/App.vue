<script setup lang="ts">
import { RouterView } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import ToastNotification from "./components/ToastNotification.vue";
import ConfirmDialog from "./components/ConfirmDialog.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />

    <main class="flex-1">
      <RouterView />
    </main>

    <AppFooter />
    <ToastNotification />
    <ConfirmDialog />
  </div>
</template>

<style scoped>
nav {
  padding: 1rem;
}
</style>
