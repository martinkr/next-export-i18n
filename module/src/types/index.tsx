import { LanguageDataStore } from "../enums/languageDataStore";

export type Dictionary = { [key: string]: string | Dictionary };

export type I18N = {
  translations: { [language: string]: Dictionary };
  defaultLang: string;
  useBrowserDefault: boolean;
  languageDataStore?: LanguageDataStore;
  t: (key: string, options?: any) => string;
};
