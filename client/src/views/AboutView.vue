<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useI18n } from "../composables/useI18n";
import { computed } from "vue";

const { t } = useI18n();

const team = [
  {
    name: "Abdellah Khouden",
    roleKey: "coFounderDeveloper",
    image: "/img/us/abdellah.webp",
    github: "https://github.com/khouden",
    linkedin: "https://www.linkedin.com/in/abdellah-khouden/",
  },
  {
    name: "Noureddine Laktab",
    roleKey: "coFounderDeveloper",
    image: "/img/us/noureddine.webp",
    github: "https://github.com/Laktab-Noureddine-code",
    linkedin: "https://www.linkedin.com/in/noureddine-laktab",
  },
];

const values = computed(() => [
  {
    icon: "speed",
    titleKey: "speedFirst",
    descKey: "speedDesc",
  },
  {
    icon: "accuracy",
    titleKey: "precisionMatters",
    descKey: "precisionDesc",
  },
  {
    icon: "simplicity",
    titleKey: "effortlessExperience",
    descKey: "effortlessDesc",
  },
  {
    icon: "privacy",
    titleKey: "privacyFocused",
    descKey: "privacyDesc",
  },
]);

const stats = computed(() => [
  { value: "1K+", labelKey: "translationsCompleted" },
  { value: "30+", labelKey: "languagesSupported" },
  { value: "99.9%", labelKey: "uptimeGuarantee" },
  { value: "< 2s", labelKey: "averageResponseTime" },
]);
</script>

<template>
  <div
    class="min-h-screen bg-white dark:bg-slate-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff09_1px,transparent_1px),linear-gradient(to_bottom,#ffffff09_1px,transparent_1px)] bg-[size:24px_24px]"
  >
    <!-- Hero Section -->
    <section class="relative pt-16 pb-20 px-4 overflow-hidden">
      <div class="max-w-4xl mx-auto text-center">
        <span
          class="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/30 rounded-full"
        >
          {{ t.about.aboutUs }}
        </span>
        <h1
          class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight"
        >
          {{ t.about.heroTitle }}
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-cyan-400"
            >AI</span
          >
        </h1>
        <p
          class="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          {{ t.about.heroDescription }}
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <div
          class="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          <div class="grid md:grid-cols-2 gap-0">
            <!-- Left: Mission Content -->
            <div class="p-8 md:p-12 flex flex-col justify-center">
              <h2
                class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6"
              >
                {{ t.about.ourMission }}
              </h2>
              <p
                class="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6"
              >
                {{ t.about.missionText1 }}
              </p>
              <p
                class="text-gray-600 dark:text-gray-400 text-lg leading-relaxed"
              >
                {{ t.about.missionText2 }}
              </p>
            </div>
            <!-- Right: Visual Element -->
            <div
              class="bg-gradient-to-br from-cyan-500 to-cyan-600 dark:from-cyan-600 dark:to-cyan-700 p-8 md:p-12 flex items-center justify-center"
            >
              <div class="text-center text-white">
                <svg
                  class="w-20 h-20 mx-auto mb-6 opacity-90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                <p class="text-xl font-semibold opacity-95">
                  "{{ t.about.missionQuote }}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div
            v-for="stat in stats"
            :key="stat.labelKey"
            class="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div
              class="text-3xl md:text-4xl font-extrabold text-cyan-500 dark:text-cyan-400 mb-2"
            >
              {{ stat.value }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {{ t.about[stat.labelKey as keyof typeof t.about] }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2
            class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {{ t.about.whatWeStandFor }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {{ t.about.valuesSubtitle }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="value in values"
            :key="value.titleKey"
            class="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl hover:border-cyan-400 dark:hover:border-cyan-500 transition-all duration-300 group"
          >
            <!-- Speed Icon -->
            <div
              v-if="value.icon === 'speed'"
              class="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-4 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/40 transition-colors"
            >
              <svg
                class="w-6 h-6 text-cyan-600 dark:text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <!-- Accuracy Icon -->
            <div
              v-else-if="value.icon === 'accuracy'"
              class="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-4 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/40 transition-colors"
            >
              <svg
                class="w-6 h-6 text-cyan-600 dark:text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <!-- Simplicity Icon -->
            <div
              v-else-if="value.icon === 'simplicity'"
              class="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-4 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/40 transition-colors"
            >
              <svg
                class="w-6 h-6 text-cyan-600 dark:text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
            <!-- Privacy Icon -->
            <div
              v-else-if="value.icon === 'privacy'"
              class="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-4 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/40 transition-colors"
            >
              <svg
                class="w-6 h-6 text-cyan-600 dark:text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {{ t.about[value.titleKey as keyof typeof t.about] }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {{ t.about[value.descKey as keyof typeof t.about] }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-16 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h2
            class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {{ t.about.meetTheTeam }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto">
            {{ t.about.teamSubtitle }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <div
            v-for="member in team"
            :key="member.name"
            class="bg-white dark:bg-[#1a1a1a] rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
          >
            <!-- Avatar -->
            <img
              :src="member.image"
              :alt="member.name"
              class="w-50 h-50 mx-auto mb-6 rounded-full object-cover shadow-lg ring-4 ring-cyan-100 dark:ring-cyan-900/30"
            />
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {{ member.name }}
            </h3>
            <p class="text-cyan-600 dark:text-cyan-400 font-medium mb-4">
              {{ t.about[member.roleKey as keyof typeof t.about] }}
            </p>
            <!-- Social Links -->
            <div class="flex items-center justify-center gap-3">
              <a
                :href="member.github"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-cyan-100 hover:text-cyan-600 dark:hover:bg-cyan-900/40 dark:hover:text-cyan-400 transition-colors"
                aria-label="GitHub"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
              </a>
              <a
                :href="member.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-cyan-100 hover:text-cyan-600 dark:hover:bg-cyan-900/40 dark:hover:text-cyan-400 transition-colors"
                aria-label="LinkedIn"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4">
      <div class="max-w-4xl mx-auto">
        <div
          class="bg-gradient-to-r from-cyan-500 to-cyan-600 dark:from-cyan-600 dark:to-cyan-700 rounded-3xl p-8 md:p-12 text-center shadow-2xl"
        >
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            {{ t.about.readyToBreakBarriers }}
          </h2>
          <p class="text-cyan-100 text-lg mb-8 max-w-xl mx-auto">
            {{ t.about.ctaDescription }}
          </p>
          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <RouterLink
              to="/contact"
              class="inline-flex items-center gap-2 bg-white text-cyan-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
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
              {{ t.about.contactUs }}
            </RouterLink>
            <RouterLink
              to="/"
              class="inline-flex items-center gap-2 bg-cyan-700/50 text-white font-bold py-3 px-8 rounded-full hover:bg-cyan-700/70 transition-colors border border-white/20"
            >
              {{ t.about.try3ssilaAI }}
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Smooth animations */
section {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
