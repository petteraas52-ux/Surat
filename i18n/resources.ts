import nb from "./locales/nb/translation.json";
import en from "./locales/en/translation.json";
import uk from "./locales/uk/translation.json"

export const resources = {
  nb: {
    translation: nb,
  },
  en: {
    translation: en,
  },
  uk: {
    translation: uk,
  }
} as const;
