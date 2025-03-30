"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import i18n from "../index";
import { I18N } from "../types";
import { LanguageDataStore } from "../enums/languageDataStore";
import {useLanguagePathname} from "./use-language-pathname";

/**
 * Returns a boolean react-state indicating if the current selected language equals the one passed to the hook.
 * @param currentLang string the language to check. Needs to equal the key in i18n/index.
 * @returns boolean react-state
 */
export default function useLanguageSwitcherIsActive(currentLang: string) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const i18nObj = i18n() as I18N;
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");
  const langPath = useLanguagePathname();
  const defaultLang = i18nObj.defaultLang;
  const languageDataStore = i18nObj.languageDataStore;

  useEffect(() => {
    if (languageDataStore === LanguageDataStore.QUERY) {
      let current;
      if (!langParam) {
        current = defaultLang === currentLang;
      } else {
        current = langParam === currentLang;
      }
      setIsActive(current);
    }
  }, [currentLang, defaultLang, langParam]);

  useEffect(() => {
    if (languageDataStore === LanguageDataStore.PATHNAME) {
      let current;
      if (!langPath) {
        current = defaultLang === currentLang;
      } else {
        current = langPath === currentLang;
      }
      setIsActive(current);
    }
  }, [currentLang, defaultLang, langPath]);

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
    document?.addEventListener("localStorageLangChange", () => {
      handleLocalStorageUpdate();
    });
    return () => {
      document?.removeEventListener(
        "localStorageLangChange",
        handleLocalStorageUpdate
      );
    };
  }, [handleLocalStorageUpdate]);

  return { isActive } as const;
}
