import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import it from "./locales/it.json";

let locale = localStorage.locale;
if (!locale) locale = navigator.language.slice(0, 2);

i18n.use(initReactI18next).init({
  resources: {
    en,
    it
  },
  lng: locale,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
