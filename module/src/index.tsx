/**
 * The entry files for the separated hooks
 */

import { i18n as userland } from "./../../i18n/index";
import { I18N } from "./types";
import { LanguageDataStore } from "./enums/languageDataStore";

/**
 * Calculates the default language from the user's language setting and the i18n object.
 * In case there is a language set in the browser which is also available as translation,
 * override the default language setting in the config file.
 * @returns string indicating the default language to use
 */
const getDefaultLanguage = (userI18n: I18N): string => {
  let browserLang: string = "";

  if (
    userI18n.useBrowserDefault &&
    typeof window !== "undefined" &&
    window &&
    window.navigator &&
    (window.navigator.languages || window.navigator.language)
  ) {
    browserLang = (
      (window.navigator.languages && window.navigator.languages[0]) ||
      window.navigator.language
    )
      .split("-")[0]
      .toLowerCase();
  }
  if (
    userI18n.useBrowserDefault &&
    browserLang &&
    userI18n.translations[browserLang]
  ) {
    return browserLang;
  }
  return userI18n.defaultLang;
};

/**
 * Imports the translations addes by the user in "i18n/index",
 * veryfies the tranlsations and exposes them
 * to the custom hooks
 * @returns the translations and the default language as defined in "i18n/index"
 */
const i18n = (): I18N | Error => {
  // cast to be typsafe
  const userI18n = userland as I18N;

  // Set "query" as default
  if (!userI18n.languageDataStore) {
    userI18n.languageDataStore = LanguageDataStore.QUERY;
  }

  if (Object.keys(userI18n.translations).length < 1) {
    throw new Error(
      `Missing translations. Did you import and add the tranlations in 'i18n/index.js'?`
    );
  }

  if (userI18n.defaultLang.length === 0) {
    throw new Error(
      `Missing default language. Did you set 'defaultLang' in 'i18n/index.js'?`
    );
  }

  if (!userI18n.translations[userI18n.defaultLang]) {
    throw new Error(
      `Invalid default language '${userI18n.defaultLang}'. Check your 'defaultLang' in 'i18n/index.js'?`
    );
  }

  // if (!Object.values(LanguageDataStore).includes(userI18n.languageDataStore)) {
  //   throw new Error(
  //     `Invalid language detection '${userI18n.languageDataStore}'. Check your 'languageDataStore' in 'i18n/index.js'?`
  //   );
  // }

  userI18n.defaultLang = getDefaultLanguage(userI18n);

  userI18n.t = (key: string, options?: any): string => {
    const { defaultLang, translations } = userI18n;
    const translation = translations[defaultLang][key];

    // Check if translation is a string, if so, return it
    if (typeof translation === 'string') {
      return translation;
    }

    // If translation is not a string (e.g., a Dictionary), handle accordingly
    // This could be returning a default value, logging an error, etc.
    // Example: return a default/fallback string or key
    return key; // or some other appropriate fallback
  };
  return userI18n;
};

export default i18n;
