import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import i18n from "../index";
import { I18N } from "../types";
import { LanguageDataStore } from "../enums/languageDataStore";

/**
 * Returns a boolean react-state indicating if the current selected language equals the one passed to the hook.
 * @param currentLang string the language to check. Needs to equal the key in i18n/index.
 * @returns boolean react-state
 */
export default function useLanguageSwitcherIsActive(currentLang: string) {
  const [isActive, setIsActive] = useState(false);
  const i18nObj = i18n() as I18N;
  const router = useRouter();
  const defaultLang = i18nObj.defaultLang;
  const languageDataStore = i18nObj.languageDataStore;

  useEffect(() => {
    if (languageDataStore === LanguageDataStore.QUERY) {
      let current;

      if (!router.query || !router.query.lang) {
        current = defaultLang === currentLang;
      } else {
        current = router.query?.lang === currentLang;
      }

      setIsActive(current);
    }
  }, [currentLang, defaultLang, router.query]);

  const handleLocalStorageUpdate = () => {
    if (languageDataStore === LanguageDataStore.LOCAL_STORAGE) {
      let current;
      const localStorageLanguage = window.localStorage.getItem(
        "next-export-i18n-lang"
      );
      current = defaultLang === currentLang;

      if (localStorageLanguage) {
        current = localStorageLanguage === currentLang;
      }
      setIsActive(current);
    }
  };

  // Listen for local-storage changes
  useEffect(() => {
    handleLocalStorageUpdate();

    document.addEventListener("localStorageLangChange", () => {
      handleLocalStorageUpdate();
    });

    return () => {
      document.removeEventListener(
        "localStorageLangChange",
        handleLocalStorageUpdate
      );
    };
  }, [handleLocalStorageUpdate]);

  return { isActive } as const;
}
