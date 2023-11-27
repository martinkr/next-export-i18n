import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import i18n from './../index';
import { I18N } from '../types';
import { LanguageDataStore } from '../enums/languageDataStore';

/**
 * Returns a react-state containing the currently selected language.
 * @returns [lang as string, setLang as SetStateAction] a react-state containing the currently selected language
 */
export default function useSelectedLanguage()  {
	const i18nObj = i18n() as I18N;

	const defaultLang: string = i18nObj.defaultLang;
	const translations = i18nObj.translations;
	const languageDataStore = i18nObj.languageDataStore;

	const router = useRouter();
	const [lang, setLang] = useState<string>(defaultLang);

  const handleLocalStorageUpdate = useCallback(() => {
    const localStorageLang = window.localStorage.getItem('lang');

    if (
      languageDataStore === LanguageDataStore.LOCAL_STORAGE &&
      localStorageLang &&
      localStorageLang !== lang &&
      translations &&
      translations[localStorageLang]
    ) {
      setLang(localStorageLang);
    }

  }, [translations, lang, setLang, languageDataStore]);

	// set the language if the query parameter changes
	useEffect(() => {
		if (
      languageDataStore === LanguageDataStore.QUERY &&
      router.query.lang &&
      router.query.lang !== lang &&
      translations &&
      translations[router.query.lang as string]
    ) {
			setLang(router.query.lang as string);
		}

	}, [lang, router.query.lang, translations, setLang, languageDataStore]);

  useEffect(() => {
    handleLocalStorageUpdate();

    // Listen for local-storage changes
    document.addEventListener('localStorageLangChange', handleLocalStorageUpdate);

    return () => {
      document.removeEventListener('localStorageLangChange', handleLocalStorageUpdate);
    }

  }, [handleLocalStorageUpdate]);

	return { lang, setLang } as const;
}
