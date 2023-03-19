import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import i18n from '../index';
import { I18N } from '../types';
import { LanguageDataStore } from '../enums/languageDataStore';

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

	useEffect( () => {
    if (languageDataStore === LanguageDataStore.QUERY) {
      let current;

      if (!router.query || !router.query.lang) {
        current = defaultLang === currentLang;
      } else {
        current = router.query?.lang === currentLang;
      }

      setIsActive(current);
    }
	},[currentLang, defaultLang, router.query, languageDataStore]);

  useEffect( () => {
    if (languageDataStore === LanguageDataStore.LOCAL_STORAGE) {
      const localStorageLanguage = window.localStorage.getItem('lang');
      let current = defaultLang === currentLang;

      if (localStorageLanguage) {
        current = localStorageLanguage === currentLang;
      }

      setIsActive(current);
    }
  },[currentLang, defaultLang, languageDataStore]);

	return { isActive } as const;
}


