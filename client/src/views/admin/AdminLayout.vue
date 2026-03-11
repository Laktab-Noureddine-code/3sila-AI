<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { auth } from "../../stores/auth";
import { useI18n } from "../../composables/useI18n";
import {
  Zap,
  LayoutDashboard,
  Users,
  Clock,
  Settings,
  ArrowLeft,
  Menu,
} from "lucide-vue-next";

const { t } = useI18n();
const route = useRoute();
const isSidebarOpen = ref(false);

const navItems = [
  { name: "dashboard", path: "/admin", icon: "dashboard" },
  { name: "users", path: "/admin/users", icon: "users" },
  { name: "history", path: "/admin/history", icon: "history" },
  { name: "settings", path: "/admin/settings", icon: "settings" },
];

const isActive = (path: string) => {
  if (path === "/admin") return route.path === "/admin";
  return route.path.startsWith(path);
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const handleClickOutside = (e: MouseEvent) => {
  const sidebar = document.getElementById("admin-sidebar");
  if (isSidebarOpen.value && sidebar && !sidebar.contains(e.target as Node)) {
    isSidebarOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#111]">
    <!-- Mobile sidebar backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
        @click="closeSidebar"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      id="admin-sidebar"
      class="fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-[#1a1a1a] border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 lg:translate-x-0"
      :class="[isSidebarOpen ? 'translate-x-0' : '-translate-x-full']"
    >
      <!-- Logo -->
      <div
        class="flex items-center gap-3 px-6 h-16 border-b border-gray-200 dark:border-gray-800"
      >
        <div
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center"
        >
          <Zap class="w-5 h-5 text-white" />
        </div>
        <div>
          <span class="font-bold text-gray-900 dark:text-white">3ssila</span>
          <span class="font-bold text-cyan-500"> AI</span>
          <span
            class="block text-[10px] text-gray-400 uppercase tracking-wider"
            >{{ t.admin.title }}</span
          >
        </div>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-1.5">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          @click="closeSidebar"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          :class="[
            isActive(item.path)
              ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
          ]"
        >
          <!-- Dashboard icon -->
          <LayoutDashboard v-if="item.icon === 'dashboard'" class="w-5 h-5" />
          <!-- Users icon -->
          <Users v-if="item.icon === 'users'" class="w-5 h-5" />
          <!-- History icon -->
          <Clock v-if="item.icon === 'history'" class="w-5 h-5" />
          <!-- Settings icon -->
          <Settings v-if="item.icon === 'settings'" class="w-5 h-5" />
          {{ (t.admin as any)[item.name] }}
        </RouterLink>
      </nav>

      <!-- Bottom section -->
      <div
        class="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-800"
      >
        <!-- Back to site -->
        <RouterLink
          to="/"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
        >
          <ArrowLeft class="w-5 h-5" />
          {{ t.admin.backToSite }}
        </RouterLink>
        <!-- Admin user -->
        <div class="flex items-center gap-3 px-4 py-2.5 mt-1">
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-sm font-bold"
          >
            {{ (auth.user?.name || "A").charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium text-gray-900 dark:text-white truncate"
            >
              {{ auth.user?.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ auth.user?.email }}
            </p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main content area -->
    <div class="lg:ml-64">
      <!-- Top bar -->
      <header
        class="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center px-4 sm:px-6 gap-4"
      >
        <!-- Mobile menu button -->
        <button
          @click.stop="isSidebarOpen = !isSidebarOpen"
          class="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <Menu class="w-6 h-6" />
        </button>

        <!-- Page title -->
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
          <template v-if="route.path === '/admin'">{{
            t.admin.dashboard
          }}</template>
          <template v-else-if="route.path === '/admin/users'">{{
            t.admin.userManagement
          }}</template>
          <template v-else-if="route.path === '/admin/history'">{{
            t.admin.globalHistory
          }}</template>
          <template v-else-if="route.path === '/admin/settings'">{{
            t.admin.systemSettings
          }}</template>
        </h1>
      </header>

      <!-- Page content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
