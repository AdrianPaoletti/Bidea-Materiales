import { initReactI18next } from "react-i18next";

import i18n from "i18next";

import { imports as importsCat } from "./cat/imports";
import { imports as importsEn } from "./en/imports";
import { imports as importsEs } from "./es/imports";
import { imports as importsFr } from "./fr/imports";

const resources = {
  cat: importsCat,
  es: importsEs,
  en: importsEn,
  fr: importsFr,
};

i18n
  .use(initReactI18next)
  .use({
    type: "languageDetector",
    name: "customDetector",
    init: () => {},
    cacheUserLanguage: () => {},
    detect: () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("preferredLanguage");
      }
      return "es";
    },
  })
  .init(
    {
      resources,
      defaultNS: "common",
      keySeparator: false,
      fallbackLng: "es",
      interpolation: {
        escapeValue: false,
      },
      load: "languageOnly",
      detection: { order: ["customDetector", "navigator"] },
    },
    (error) => {
      if (error) {
        console.log("Error i18n", error);
      }
    }
  );

export default i18n;
