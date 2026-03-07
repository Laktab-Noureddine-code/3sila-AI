import { computed } from "vue";
import { language } from "../stores/language";
import translations from "../i18n";

/**
 * Composable for internationalization (i18n)
 * Usage:
 *   const { t } = useI18n();
 *   t.nav.home // returns translated string based on current language
 */
export function useI18n() {
  const t = computed(() => {
    return translations[language.current];
  });

  const currentLanguage = computed(() => language.current);
  const isRTL = computed(() => language.isRTL());

  const setLanguage = language.setLanguage.bind(language);
  const getAllLanguages = language.getAllLanguages.bind(language);
  const getLanguageInfo = language.getLanguageInfo.bind(language);

  return {
    t,
    currentLanguage,
    isRTL,
    setLanguage,
    getAllLanguages,
    getLanguageInfo,
  };
}
