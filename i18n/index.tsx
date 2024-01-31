// import { Dictionary, I18N } from 'next-export-i18n/types';
import { Dictionary, I18N } from "../module/src/types/index";

// A basic implementation of the `t` function
function translate(key: string, lang: string, translations: { [key: string]: Dictionary }): string {
  let result = translations[lang];
  const translationKeys = key.split('.');

  for (const k of translationKeys) {
    const lookup = result[k];

    // If the lookup is undefined, return the key as the fallback
    if (lookup === undefined) {
      return key;
    }

    // If the lookup results in a string, return it directly
    if (typeof lookup === 'string') {
      return lookup;
    }

    // Otherwise, continue with the next part of the key
    result = lookup;
  }

  // Fallback to key if the translation result isn't a string (e.g., if it's a nested object)
  return key;
}

// @ts-ignore
import de from "./translations.de.yaml";
//  @ts-ignore
import en from "./translations.en.yaml";

const i18n = {
  translations: {
    en: en.i18n as Dictionary,
    de: de.i18n as Dictionary,
  },
  defaultLang: "de",
  useBrowserDefault: true,
  t: (key: string, options?: any): string => {
    // Example usage, adjust based on your actual `I18N` interface and translation structure
    const lang = i18n.useBrowserDefault && typeof navigator !== "undefined" ? navigator.language.split('-')[0] : i18n.defaultLang;
    return translate(key, lang, i18n.translations);
},
} as I18N;

export { i18n };
