import { reactive, watch } from "vue";

export type Language = "en" | "fr" | "ar";

interface LanguageState {
  current: Language;
}

const STORAGE_KEY = "3ssila_language";

// Get saved language or default to English
const getSavedLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && ["en", "fr", "ar"].includes(saved)) {
      return saved as Language;
    }
  } catch (e) {
    console.warn("Failed to load language from localStorage:", e);
  }
  return "en";
};

const state = reactive<LanguageState>({
  current: getSavedLanguage(),
});

// Watch for changes and persist + update document direction
watch(
  () => state.current,
  (newLang) => {
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch (e) {
      console.warn("Failed to save language to localStorage:", e);
    }

    // Update document direction for RTL languages (Arabic)
    if (newLang === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.setAttribute("lang", "ar");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.setAttribute("lang", newLang);
    }
  },
  { immediate: true }
);

export const language = {
  get current() {
    return state.current;
  },

  setLanguage(lang: Language) {
    state.current = lang;
  },

  isRTL() {
    return state.current === "ar";
  },

  getLanguageInfo() {
    const languages = {
      en: { name: "English", nativeName: "English", flag: "gb" },
      fr: { name: "French", nativeName: "Français", flag: "fr" },
      ar: { name: "Arabic", nativeName: "العربية", flag: "sa" },
    };
    return languages[state.current];
  },

  getAllLanguages() {
    return [
      {
        code: "en" as Language,
        name: "English",
        nativeName: "English",
        flag: "gb",
      },
      {
        code: "fr" as Language,
        name: "French",
        nativeName: "Français",
        flag: "fr",
      },
      {
        code: "ar" as Language,
        name: "Arabic",
        nativeName: "العربية",
        flag: "sa",
      },
    ];
  },
};
