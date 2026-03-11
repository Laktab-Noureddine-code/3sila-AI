<script setup lang="ts">
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import ToastNotification from "./components/ToastNotification.vue";
import ConfirmDialog from "./components/ConfirmDialog.vue";

const route = useRoute();
const isAdminRoute = computed(() => route.path.startsWith("/admin"));
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader v-if="!isAdminRoute" />

    <main class="flex-1">
      <RouterView />
    </main>

    <AppFooter v-if="!isAdminRoute" />
    <ToastNotification />
    <ConfirmDialog />
  </div>
</template>

<style scoped>
nav {
  padding: 1rem;
}
</style>
