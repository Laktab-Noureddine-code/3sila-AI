<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useI18n } from "../composables/useI18n";
import { Github, Linkedin, Heart } from "lucide-vue-next";

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
                :src="
                  isDark ? '/img/logo/logo_dark.webp' : '/img/logo/logo.webp'
                "
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
                  <Github class="w-4 h-4" />
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
                    <Github class="w-4 h-4 text-gray-500" />
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
                  <Linkedin class="w-4 h-4" />
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
                    <Linkedin class="w-4 h-4 text-gray-500" />
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
          <Heart
            class="w-4 h-4 text-red-500 animate-pulse"
            fill="currentColor"
          />
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
