<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "../composables/useI18n";
import type { Language } from "../stores/language";

const { t, currentLanguage, setLanguage, getAllLanguages } = useI18n();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const languages = getAllLanguages();

const currentFlag = () => {
  const lang = languages.find((l) => l.code === currentLanguage.value);
  return lang?.flag || "gb";
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectLanguage = (code: Language) => {
  setLanguage(code);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
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
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
      :aria-label="t.languageSelector.selectLanguage"
    >
      <span
        :class="`fi fi-${currentFlag()} rounded-sm`"
        style="font-size: 1.25rem"
      ></span>
      <svg
        class="w-4 h-4 text-gray-500 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
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
        v-if="isOpen"
        class="absolute top-full mt-2 bg-white dark:bg-[#1f1f1f] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-[180px]"
        :class="currentLanguage === 'ar' ? 'left-0' : 'right-0'"
      >
        <div class="p-1">
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="selectLanguage(lang.code)"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer"
            :class="[
              currentLanguage === lang.code
                ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
            ]"
          >
            <span
              :class="`fi fi-${lang.flag} rounded-sm`"
              style="font-size: 1.25rem"
            ></span>
            <span class="text-sm font-medium">{{ lang.nativeName }}</span>
            <svg
              v-if="currentLanguage === lang.code"
              class="w-4 h-4 ms-auto text-cyan-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
