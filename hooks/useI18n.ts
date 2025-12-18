/**
 * USE I18N HOOK
 * * ROLE:
 * Manages the application's localization state and persistence.
 * * CORE FUNCTIONALITY:
 * 1. Persistent Locale: Automatically saves the chosen language to AsyncStorage
 * so the app remains in the user's preferred language upon restart.
 * 2. Hydration: Fetches the stored language key during the initial mount phase
 * to synchronize the i18next instance with the device's storage.
 * 3. Event-Driven Updates: Listens to the 'languageChanged' event from i18next
 * to trigger side effects (like updating storage) regardless of where the
 * change was initiated.
 * 4. Translation Access: Provides a shorthand for the 't' function and current
 * language string for UI components.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const LANGUAGE_KEY = "language";

export function useI18n() {
  const { t } = useTranslation();

  /**
   * INITIAL HYDRATION
   * On mount, attempt to retrieve the previously saved language from storage.
   * If a value exists and differs from the current instance, update i18next.
   */
  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((lng) => {
      if (lng && lng !== i18n.language) {
        i18n.changeLanguage(lng);
      }
    });
  }, []);

  /**
   * PERSISTENCE OBSERVER
   * Sets up a listener that monitors language changes.
   * Whenever 'changeLanguage' is successfully called, the new key is
   * mirrored to AsyncStorage.
   */
  useEffect(() => {
    const handler = (lng: string) => {
      AsyncStorage.setItem(LANGUAGE_KEY, lng);
    };

    // Attach the event listener
    i18n.on("languageChanged", handler);

    // Cleanup listener on unmount to prevent memory leaks
    return () => i18n.off("languageChanged", handler);
  }, []);

  return {
    // The translation function used for string keys
    t,
    // The current active language code (e.g., 'nb', 'en')
    language: i18n.language,
    // Method to programmatically switch languages
    setLanguage: (lng: string) => i18n.changeLanguage(lng),
  };
}
