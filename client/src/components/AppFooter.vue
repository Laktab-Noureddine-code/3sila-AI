<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useI18n } from "../composables/useI18n";

const { t } = useI18n();

const router = useRouter();
const currentYear = new Date().getFullYear();
const isDark = ref(true);
const isGithubDropdownOpen = ref(false);
const isLinkedinDropdownOpen = ref(false);

const developers = [
  {
    name: "Noureddine Laktab",
    github: "https://github.com/Laktab-Noureddine-code",
    linkedin: "https://www.linkedin.com/in/noureddine-laktab",
  },
  {
    name: "Abdellah Khouden",
    github: "https://github.com/khouden",
    linkedin: "https://www.linkedin.com/in/abdellah-khouden/",
  },
];

const navigateToMode = (mode: string) => {
  router.push(`/?mode=${mode}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const toggleGithubDropdown = () => {
  isGithubDropdownOpen.value = !isGithubDropdownOpen.value;
  isLinkedinDropdownOpen.value = false;
};

const toggleLinkedinDropdown = () => {
  isLinkedinDropdownOpen.value = !isLinkedinDropdownOpen.value;
  isGithubDropdownOpen.value = false;
};

const closeDropdowns = () => {
  setTimeout(() => {
    isGithubDropdownOpen.value = false;
    isLinkedinDropdownOpen.value = false;
  }, 150);
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  isDark.value = savedTheme === "dark" || (!savedTheme && systemDark);

  // Watch for theme changes
  const observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains("dark");
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
});
</script>

<template>
  <footer
    class="relative border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0f0f0f]"
  >
    <!-- Subtle gradient overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyan-500/5 dark:to-cyan-400/5 pointer-events-none"
    ></div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Main Footer Content -->
      <div class="py-12 lg:py-16">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12"
        >
          <!-- Brand Column -->
          <div class="lg:col-span-1">
            <div class="flex items-center gap-2 mb-5">
              <img
                :src="isDark ? '/img/logo/logo_dark.webp' : '/img/logo/logo.webp'"
                alt="3ssila AI"
                class="w-8 h-8 object-contain"
              />
              <span
                class="font-bold text-xl tracking-wide text-gray-900 dark:text-white"
              >
                3ssila <span class="text-cyan-400">AI</span>
              </span>
            </div>
            <p
              class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 max-w-xs"
            >
              {{ t.footer.description }}
            </p>
            <!-- Social Links -->
            <div class="flex items-center gap-3">
              <!-- GitHub Dropdown -->
              <div class="relative">
                <button
                  @click="toggleGithubDropdown"
                  @blur="closeDropdowns"
                  class="group flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-cyan-400 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-white transition-all duration-200 cursor-pointer"
                  aria-label="GitHub"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                    />
                  </svg>
                </button>
                <!-- GitHub Dropdown Menu -->
                <div
                  v-if="isGithubDropdownOpen"
                  class="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
                >
                  <p
                    class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700"
                  >
                    {{ t.footer.developers }}
                  </p>
                  <a
                    v-for="dev in developers"
                    :key="dev.github"
                    :href="dev.github"
                    target="_blank"
                    rel="noopener noreferrer"
                    @mousedown.prevent
                    class="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg
                      class="w-4 h-4 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                      />
                    </svg>
                    {{ dev.name }}
                  </a>
                </div>
              </div>
              <!-- LinkedIn Dropdown -->
              <div class="relative">
                <button
                  @click="toggleLinkedinDropdown"
                  @blur="closeDropdowns"
                  class="group flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-cyan-400 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-white transition-all duration-200 cursor-pointer"
                  aria-label="LinkedIn"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    />
                  </svg>
                </button>
                <!-- LinkedIn Dropdown Menu -->
                <div
                  v-if="isLinkedinDropdownOpen"
                  class="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
                >
                  <p
                    class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700"
                  >
                    {{ t.footer.developers }}
                  </p>
                  <a
                    v-for="dev in developers"
                    :key="dev.linkedin"
                    :href="dev.linkedin"
                    target="_blank"
                    rel="noopener noreferrer"
                    @mousedown.prevent
                    class="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg
                      class="w-4 h-4 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                      />
                    </svg>
                    {{ dev.name }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Column -->
          <div>
            <h3
              class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4"
            >
              {{ t.footer.product }}
            </h3>
            <ul class="space-y-3">
              <li>
                <a
                  @click="navigateToMode('translate')"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-200 cursor-pointer"
                >
                  {{ t.footer.translate }}
                </a>
              </li>
              <li>
                <a
                  @click="navigateToMode('summarize')"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-200 cursor-pointer"
                >
                  {{ t.footer.summarize }}
                </a>
              </li>
              <li>
                <RouterLink
                  to="/history"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-200"
                >
                  {{ t.nav.history }}
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- Company Column -->
          <div>
            <h3
              class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4"
            >
              {{ t.footer.company }}
            </h3>
            <ul class="space-y-3">
              <li>
                <RouterLink
                  to="/about"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-200"
                >
                  {{ t.footer.about }}
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/contact"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-200"
                >
                  {{ t.footer.contact }}
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- Legal Column -->
          <div>
            <h3
              class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4"
            >
              {{ t.footer.legal }}
            </h3>
            <ul class="space-y-3">
              <li>
                <RouterLink
                  to="/privacy"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-200"
                >
                  {{ t.footer.privacy }}
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/terms"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-200"
                >
                  {{ t.footer.terms }}
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div
        class="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"
      ></div>

      <!-- Bottom Bar -->
      <div
        class="py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <p class="text-sm text-gray-500 dark:text-gray-500">
          © {{ currentYear }}
          <span class="font-medium text-gray-700 dark:text-gray-300"
            >3ssila AI</span
          >. {{ t.footer.allRightsReserved }}
        </p>
        <div
          class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500"
        >
          <span>Made with</span>
          <svg
            class="w-4 h-4 text-red-500 animate-pulse"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clip-rule="evenodd"
            />
          </svg>
          <span>for seamless communication</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Smooth hover transitions for links */
a {
  position: relative;
}

/* Subtle underline animation for footer links */
footer nav a::after,
footer ul a::after {
  content: "";
  position: absolute;
  width: 0;
  height: 1px;
  bottom: -2px;
  left: 0;
  background-color: currentColor;
  transition: width 0.2s ease-in-out;
}

footer nav a:hover::after,
footer ul a:hover::after {
  width: 100%;
}
</style>
