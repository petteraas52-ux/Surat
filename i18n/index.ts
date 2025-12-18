/**
 * I18NEXT CONFIGURATION
 * * ROLE:
 * The initialization entry point for the application's translation engine.
 * * CORE FUNCTIONALITY:
 * 1. React Integration: Hooks into the React lifecycle via 'initReactI18next'
 * to provide the 't' function and translation context.
 * 2. Resource Loading: Imports the 'resources' object which contains the
 * key-value pairs for Norsk, English, and other supported languages.
 * 3. Fallback Logic: Defines 'nb' (Norwegian) as the default language, but
 * gracefully falls back to 'en' (English) if a translation key is missing.
 * 4. XSS Protection: Disables string escaping since React handles
 * cross-site scripting protection natively.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./resources";

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    // 1. Translation data (keys and values)
    resources: resources,

    // 2. Default language if no saved preference is found
    lng: "nb",

    // 3. The language to use if the primary language is missing a specific key
    fallbackLng: "en",

    // 4. Configuration for dynamic value injection
    interpolation: {
      escapeValue: false, // Not needed for React as it escapes by default
    },

    /**
     * NOTE ON PLURALIZATION:
     * If using i18next v22+ in a React Native environment, ensure your
     * JSON structures match the pluralization rules of the version used.
     * Modern setups typically don't require compatibilityJSON: 'v3' unless
     * migrating legacy translation files.
     */
  });

export default i18n;
