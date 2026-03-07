import en from "./en";
import fr from "./fr";
import ar from "./ar";
import type { Language } from "../stores/language";

export type TranslationKeys = typeof en;

const translations: Record<Language, TranslationKeys> = {
  en,
  fr,
  ar,
};

export default translations;
