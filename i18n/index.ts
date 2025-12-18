import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./resources";

i18n.use(initReactI18next).init({
  resources: resources,
  lng: "nb",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  // Fix: Remove compatibilityJSON 'v3' if you are on i18next v22+
  // or change it to 'v4' if your types require it.
  // Most modern Expo/React Native setups now use 'v4' or don't need the line at all.
});

export default i18n;
