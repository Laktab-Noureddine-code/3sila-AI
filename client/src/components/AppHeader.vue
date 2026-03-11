<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { auth } from "../stores/auth";
import { useI18n } from "../composables/useI18n";
import LanguageSwitcher from "./LanguageSwitcher.vue";
import {
  Star,
  Sun,
  Moon,
  ChevronDown,
  Clock,
  Settings,
  LogOut,
  Home,
  Info,
  Mail,
  Menu,
  X,
  User,
} from "lucide-vue-next";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

// --- Theme Toggle Logic ---
const isDark = ref(true);

// --- Mobile Menu Logic ---
const isMobileMenuOpen = ref(false);

// --- Profile Dropdown Logic ---
const isProfileMenuOpen = ref(false);
const profileMenu = ref<HTMLElement | null>(null);

// --- Scroll Logic ---
const isScrolled = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const handleLogout = () => {
  auth.clearAuth();
  router.push("/login");
  closeMobileMenu();
  isProfileMenuOpen.value = false;
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

const goHome = () => {
  router.push("/");
  closeMobileMenu();
};

// Close dropdowns when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (profileMenu.value && !profileMenu.value.contains(event.target as Node)) {
    isProfileMenuOpen.value = false;
  }
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

// Initialize theme on load
onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && systemDark)) {
    isDark.value = true;
    document.documentElement.classList.add("dark");
  } else {
    isDark.value = false;
    document.documentElement.classList.remove("dark");
  }
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b transition-all duration-300"
    :class="[
      isScrolled
        ? 'border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md shadow-sm'
        : 'border-transparent bg-white dark:bg-[#1a1a1a]',
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-18">
        <!-- Logo -->
        <div
          class="flex-shrink-0 flex items-center gap-2.5 cursor-pointer group"
          @click="goHome"
        >
          <img
            :src="isDark ? '/img/logo/logo_dark.webp' : '/img/logo/logo.webp'"
            alt="3ssila AI"
            class="w-9 h-9 object-contain transition-transform group-hover:scale-105"
          />
          <span
            class="font-bold text-xl tracking-wide text-gray-900 dark:text-white"
          >
            3ssila <span class="text-cyan-500 dark:text-cyan-400">AI</span>
          </span>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-1">
          <!-- Home -->
          <RouterLink
            to="/"
            class="relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg transition-all duration-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            :class="{
              '!text-cyan-500 dark:!text-cyan-400':
                route.path === '/' && !route.query.mode,
            }"
          >
            {{ t.nav.home }}
          </RouterLink>

          <!-- History (for authenticated users) -->
          <RouterLink
            v-if="auth.isAuthenticated()"
            to="/history"
            class="relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg transition-all duration-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            active-class="!text-cyan-500 dark:!text-cyan-400"
          >
            {{ t.nav.history }}
          </RouterLink>

          <!-- Favorites -->
          <RouterLink
            to="/favorites"
            class="relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg transition-all duration-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1"
            active-class="!text-yellow-500 dark:!text-yellow-400"
          >
            <Star class="w-4 h-4" />
            {{ t.nav.favorites }}
          </RouterLink>

          <!-- About -->
          <RouterLink
            to="/about"
            class="relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg transition-all duration-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            active-class="!text-cyan-500 dark:!text-cyan-400"
          >
            {{ t.nav.about }}
          </RouterLink>

          <!-- Contact -->
          <RouterLink
            to="/contact"
            class="relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg transition-all duration-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            active-class="!text-cyan-500 dark:!text-cyan-400"
          >
            {{ t.nav.contact }}
          </RouterLink>
        </nav>

        <!-- Desktop Actions -->
        <div class="hidden lg:flex items-center gap-3">
          <!-- Language Switcher -->
          <LanguageSwitcher />

          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
            :aria-label="isDark ? t.theme.switchToLight : t.theme.switchToDark"
          >
            <Sun v-if="isDark" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </button>

          <div class="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

          <template v-if="auth.isAuthenticated()">
            <!-- User Profile Dropdown -->
            <div class="relative" ref="profileMenu">
              <button
                @click="toggleProfileMenu"
                class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
              >
                <div
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-sm font-bold"
                >
                  {{ (auth.user?.name || "U").charAt(0).toUpperCase() }}
                </div>
                <span
                  class="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate"
                >
                  {{ auth.user?.name || "User" }}
                </span>
                <ChevronDown
                  class="w-4 h-4 text-gray-500 transition-transform duration-200"
                  :class="{ 'rotate-180': isProfileMenuOpen }"
                />
              </button>

              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div
                  v-if="isProfileMenuOpen"
                  class="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1f1f1f] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div
                    class="px-4 py-3 border-b border-gray-100 dark:border-gray-700"
                  >
                    <p
                      class="text-sm font-semibold text-gray-900 dark:text-white truncate"
                    >
                      {{ auth.user?.name || "User" }}
                    </p>
                    <p
                      class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5"
                    >
                      {{ auth.user?.email || "" }}
                    </p>
                  </div>
                  <div class="p-2">
                    <RouterLink
                      to="/history"
                      @click="isProfileMenuOpen = false"
                      class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Clock class="w-4 h-4" />
                      {{ t.nav.history }}
                    </RouterLink>
                    <RouterLink
                      to="/favorites"
                      @click="isProfileMenuOpen = false"
                      class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Star class="w-4 h-4" />
                      {{ t.nav.favorites }}
                    </RouterLink>
                    <RouterLink
                      to="/profile"
                      @click="isProfileMenuOpen = false"
                      class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <User class="w-4 h-4" />
                      {{ t.auth.profile }}
                    </RouterLink>
                    <!-- Admin Panel Link -->
                    <RouterLink
                      v-if="auth.user?.is_admin"
                      to="/admin"
                      @click="isProfileMenuOpen = false"
                      class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Settings class="w-4 h-4" />
                      {{ t.admin.title }}
                    </RouterLink>
                  </div>
                  <div
                    class="border-t border-gray-100 dark:border-gray-700 p-2"
                  >
                    <button
                      @click="handleLogout"
                      class="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                    >
                      <LogOut class="w-4 h-4" />
                      {{ t.nav.logout }}
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </template>

          <template v-else>
            <RouterLink
              to="/login"
              class="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              {{ t.nav.login }}
            </RouterLink>

            <RouterLink
              to="/signup"
              class="px-5 py-2.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-cyan-300 transition-all duration-200"
            >
              {{ t.nav.getStarted }}
            </RouterLink>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <div class="lg:hidden flex items-center gap-2">
          <button
            @click="toggleTheme"
            class="p-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none cursor-pointer"
            :aria-label="
              isDark ? 'Switch to light mode' : 'Switch to dark mode'
            "
          >
            <Sun v-if="isDark" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </button>

          <button
            @click="toggleMobileMenu"
            class="p-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none cursor-pointer"
            :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
          >
            <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 shadow-xl"
      >
        <div class="max-w-7xl mx-auto px-4 py-4">
          <!-- Language Switcher for Mobile -->
          <div class="pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
            <LanguageSwitcher />
          </div>

          <!-- User Info (if authenticated) -->
          <div
            v-if="auth.isAuthenticated()"
            class="flex items-center gap-3 pb-4 mb-4 border-b border-gray-200 dark:border-gray-700"
          >
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold"
            >
              {{ (auth.user?.name || "U").charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="font-semibold text-gray-900 dark:text-white">
                {{ auth.user?.name || "User" }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ auth.user?.email || "" }}
              </p>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="space-y-1">
            <RouterLink
              to="/"
              @click="closeMobileMenu"
              class="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :class="{
                '!bg-cyan-50 dark:!bg-cyan-900/20 !text-cyan-600 dark:!text-cyan-400':
                  route.path === '/' && !route.query.mode,
              }"
            >
              <Home class="w-5 h-5" />
              {{ t.nav.home }}
            </RouterLink>

            <RouterLink
              v-if="auth.isAuthenticated()"
              to="/history"
              @click="closeMobileMenu"
              class="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              active-class="!bg-cyan-50 dark:!bg-cyan-900/20 !text-cyan-600 dark:!text-cyan-400"
            >
              <Clock class="w-5 h-5" />
              {{ t.nav.history }}
            </RouterLink>

            <RouterLink
              to="/favorites"
              @click="closeMobileMenu"
              class="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              active-class="!bg-yellow-50 dark:!bg-yellow-900/20 !text-yellow-600 dark:!text-yellow-400"
            >
              <Star class="w-5 h-5" />
              {{ t.nav.favorites }}
            </RouterLink>

            <RouterLink
              to="/about"
              @click="closeMobileMenu"
              class="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              active-class="!bg-cyan-50 dark:!bg-cyan-900/20 !text-cyan-600 dark:!text-cyan-400"
            >
              <Info class="w-5 h-5" />
              {{ t.nav.about }}
            </RouterLink>

            <RouterLink
              to="/contact"
              @click="closeMobileMenu"
              class="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              active-class="!bg-cyan-50 dark:!bg-cyan-900/20 !text-cyan-600 dark:!text-cyan-400"
            >
              <Mail class="w-5 h-5" />
              {{ t.nav.contact }}
            </RouterLink>

            <!-- Admin Panel (mobile) -->
            <RouterLink
              v-if="auth.isAuthenticated()"
              to="/profile"
              @click="closeMobileMenu"
              class="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              active-class="!bg-cyan-50 dark:!bg-cyan-900/20 !text-cyan-600 dark:!text-cyan-400"
            >
              <User class="w-5 h-5" />
              {{ t.auth.profile }}
            </RouterLink>

            <!-- Admin Panel (mobile) -->
            <RouterLink
              v-if="auth.user?.is_admin"
              to="/admin"
              @click="closeMobileMenu"
              class="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              active-class="!bg-cyan-50 dark:!bg-cyan-900/20 !text-cyan-600 dark:!text-cyan-400"
            >
              <Settings class="w-5 h-5" />
              {{ t.admin.title }}
            </RouterLink>
          </nav>

          <!-- Auth Actions -->
          <div
            class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2"
          >
            <template v-if="auth.isAuthenticated()">
              <button
                @click="handleLogout"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
              >
                <LogOut class="w-5 h-5" />
                {{ t.nav.logout }}
              </button>
            </template>

            <template v-else>
              <RouterLink
                to="/login"
                @click="closeMobileMenu"
                class="block w-full px-4 py-3 text-sm font-medium rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-colors text-center"
              >
                {{ t.nav.login }}
              </RouterLink>

              <RouterLink
                to="/signup"
                @click="closeMobileMenu"
                class="block w-full px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-white shadow-lg hover:from-cyan-400 hover:to-cyan-300 transition-all text-center"
              >
                {{ t.nav.getStartedFree }}
              </RouterLink>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
