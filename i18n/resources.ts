import en from "./locales/en/translation.json";
import nb from "./locales/nb/translation.json";
import sv from "./locales/sv/translation.json";
import uk from "./locales/uk/translation.json";

export const resources = {
  // Norwegian Bokmål
  nb: {
    translation: nb,
  },
  // Generic Norwegian Alias (Fixes many locale detection failures)
  no: {
    translation: nb,
  },
  // English
  en: {
    translation: en,
  },
  // Ukrainian
  uk: {
    translation: uk,
  },
  // Swedish
  sv: {
    translation: sv,
  },
} as const;
