import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_KEY = "language";

export function useI18n() {
  const { t } = useTranslation();

  // Hent språk ved første render (RN-miljøet er klart)
  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((lng) => {
      if (lng && lng !== i18n.language) {
        i18n.changeLanguage(lng);
      }
    });
  }, []);

  // Lagre språk når det endres
  useEffect(() => {
    const handler = (lng: string) => {
      AsyncStorage.setItem(LANGUAGE_KEY, lng);
    };

    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  return {
    t,
    language: i18n.language,
    setLanguage: (lng: string) => i18n.changeLanguage(lng),
  };
}
