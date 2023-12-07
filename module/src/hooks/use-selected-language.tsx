import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import i18n from "./../index";
import { I18N } from "../types";
import { LanguageDataStore } from "../enums/languageDataStore";

/**
 * Returns a react-state containing the currently selected language.
 * @returns [lang as string, setLang as SetStateAction] a react-state containing the currently selected language
 */
export default function useSelectedLanguage() {
  const i18nObj = i18n() as I18N;

  const defaultLang: string = i18nObj.defaultLang;
  const translations = i18nObj.translations;
  const languageDataStore = i18nObj.languageDataStore;

  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");
  const [lang, setLang] = useState<string>(defaultLang);

  // set the language if the localStorage value has changed
  const handleLocalStorageUpdate = () => {
    const storedLang = window.localStorage.getItem("next-export-i18n-lang");

    if (
      languageDataStore === LanguageDataStore.LOCAL_STORAGE &&
      storedLang &&
      storedLang !== lang &&
      translations &&
      translations[storedLang]
    ) {
      setLang(storedLang);
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

  // set the language if the query parameter changes
  useEffect(() => {
    const storedLang = langParam;

    if (
      languageDataStore === LanguageDataStore.QUERY &&
      storedLang &&
      storedLang !== lang &&
      translations &&
      translations[storedLang]
    ) {
      setLang(storedLang);
    }
  }, [lang, langParam, translations, setLang]);

  return { lang, setLang } as const;
}
