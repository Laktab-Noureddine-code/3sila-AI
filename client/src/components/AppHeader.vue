<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { auth } from "../stores/auth";
import { useI18n } from "../composables/useI18n";
import LanguageSwitcher from "./LanguageSwitcher.vue";

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
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
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
            <svg
              v-if="isDark"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
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
                <svg
                  class="w-4 h-4 text-gray-500 transition-transform duration-200"
                  :class="{ 'rotate-180': isProfileMenuOpen }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
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
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {{ t.nav.history }}
                    </RouterLink>
                    <RouterLink
                      to="/favorites"
                      @click="isProfileMenuOpen = false"
                      class="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                      </svg>
                      {{ t.nav.favorites }}
                    </RouterLink>
                  </div>
                  <div
                    class="border-t border-gray-100 dark:border-gray-700 p-2"
                  >
                    <button
                      @click="handleLogout"
                      class="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
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
            <svg
              v-if="isDark"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>

          <button
            @click="toggleMobileMenu"
            class="p-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none cursor-pointer"
            :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
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
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {{ t.nav.home }}
            </RouterLink>

            <RouterLink
              v-if="auth.isAuthenticated()"
              to="/history"
              @click="closeMobileMenu"
              class="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              active-class="!bg-cyan-50 dark:!bg-cyan-900/20 !text-cyan-600 dark:!text-cyan-400"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ t.nav.history }}
            </RouterLink>

            <RouterLink
              to="/favorites"
              @click="closeMobileMenu"
              class="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              active-class="!bg-yellow-50 dark:!bg-yellow-900/20 !text-yellow-600 dark:!text-yellow-400"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
              {{ t.nav.favorites }}
            </RouterLink>

            <RouterLink
              to="/about"
              @click="closeMobileMenu"
              class="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              active-class="!bg-cyan-50 dark:!bg-cyan-900/20 !text-cyan-600 dark:!text-cyan-400"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ t.nav.about }}
            </RouterLink>

            <RouterLink
              to="/contact"
              @click="closeMobileMenu"
              class="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              active-class="!bg-cyan-50 dark:!bg-cyan-900/20 !text-cyan-600 dark:!text-cyan-400"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {{ t.nav.contact }}
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
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
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
