import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import it from "../locales/it.json";

let locale = localStorage.locale;
if (!locale) locale = navigator.language.slice(0, 2);

export const defaultNS = "default";
export const resources = {
  en: {
    default: en
  },
  it: {
    default: it
  }
} as const;

i18n.use(initReactI18next).init({
  resources,
  defaultNS,
  lng: locale,
  ns: [defaultNS],
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
