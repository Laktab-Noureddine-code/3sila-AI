<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useI18n } from "../composables/useI18n";
import { computed } from "vue";
import {
  Languages,
  Zap,
  CheckCircle,
  LayoutGrid,
  Lock,
  Github,
  Linkedin,
  Mail,
  ArrowRight,
} from "lucide-vue-next";

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
                <Languages
                  class="w-20 h-20 mx-auto mb-6 opacity-90"
                  :stroke-width="1.5"
                />
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
              <Zap class="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <!-- Accuracy Icon -->
            <div
              v-else-if="value.icon === 'accuracy'"
              class="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-4 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/40 transition-colors"
            >
              <CheckCircle class="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <!-- Simplicity Icon -->
            <div
              v-else-if="value.icon === 'simplicity'"
              class="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-4 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/40 transition-colors"
            >
              <LayoutGrid class="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <!-- Privacy Icon -->
            <div
              v-else-if="value.icon === 'privacy'"
              class="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-4 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/40 transition-colors"
            >
              <Lock class="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
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
                <Github class="w-5 h-5" />
              </a>
              <a
                :href="member.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-cyan-100 hover:text-cyan-600 dark:hover:bg-cyan-900/40 dark:hover:text-cyan-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin class="w-5 h-5" />
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
              <Mail class="w-5 h-5" />
              {{ t.about.contactUs }}
            </RouterLink>
            <RouterLink
              to="/"
              class="inline-flex items-center gap-2 bg-cyan-700/50 text-white font-bold py-3 px-8 rounded-full hover:bg-cyan-700/70 transition-colors border border-white/20"
            >
              {{ t.about.try3ssilaAI }}
              <ArrowRight class="w-5 h-5" />
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
