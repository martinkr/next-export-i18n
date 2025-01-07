import { ParsedUrlQueryInput } from 'node:querystring';
import * as react from 'react';
import react__default, { JSX, ReactNode } from 'react';
import { LinkProps } from 'next/link';

/**
 * Returns a react-state which is a queryObject containing an exsisting query and a query string with the current selected
 * language (or the passed forced language).
 * Reason: We want to preserve an existing query string.
 * Usage: LanguageSwitcher with forceLang param and all links without forceLang param
  * @param [forceLang] string to override the selected language
 * @returns queryObject react-state as ParsedUrlQueryInput
 */
declare function useLanguageQuery(forceLang?: string): readonly [ParsedUrlQueryInput | undefined];

/**
 * Returns a react-state containing the currently selected language.
 * @returns [lang as string, setLang as SetStateAction] a react-state containing the currently selected language
 */
declare function useSelectedLanguage(): {
    readonly lang: string;
    readonly setLang: react.Dispatch<react.SetStateAction<string>>;
};

/**
 * Returns a boolean react-state indicating if the current selected language equals the one passed to the hook.
 * @param currentLang string the language to check. Needs to equal the key in i18n/index.
 * @returns boolean react-state
 */
declare function useLanguageSwitcherIsActive(currentLang: string): {
    readonly isActive: boolean;
};

/**
 * Provides the t() function which returns the value stored for this given key (e.g. "i18n.ui.headline")
 * in the translation file.
 * The return value can be a string, a number, an array or an object.
 * In case there is no entry for this key, it returns the key.
 * @returns t(key: string): any function
 */
declare const useTranslation: () => {
    /**
     * Returns the value stored for this given key (e.g. "i18n.ui.headline")  in the translation file.
     * The return value can be a string, a number, an array or an object.
     * In case there is no entry for this key, it returns the key.
     * @param key the key for looking up the translation
     * @param view the mustache view for interpolating the template string
     * @returns the value stored for this key, could be a string, a number, an array or an object
     */
    t: (key: string, view?: object) => any;
};

type Props = {
    lang: string;
    children?: ReactNode;
    shallow?: boolean;
};
/**
 * Simple component for switching the language.
 * Set the "lang" query parameter on click while preserving the current query parameters
 * Style it using the
 * - [data-language-switcher]
 * - [data-is-current="true"]
 *  attribute selectors or create your own component.
 * @param lang string the language to switch to. Needs to equal the key in i18n/index.
 * @param [children] React.nodes
 * @param [shallow] enable or disable shallow routing, @see https://nextjs.org/docs/routing/shallow-routing
 */
declare const LanguageSwitcher: ({ lang, children, shallow, }: Props) => JSX.Element;

interface LinkWithLocaleProps extends LinkProps {
    children: ReactNode;
}
declare function LinkWithLocale(props: LinkWithLocaleProps): react__default.JSX.Element;

declare enum LanguageDataStore {
    QUERY = "query",
    LOCAL_STORAGE = "localStorage"
}

type Dictionary = {
    [key: string]: string | Dictionary;
};
type I18N = {
    translations: {
        [language: string]: Dictionary;
    };
    defaultLang: string;
    useBrowserDefault: boolean;
    languageDataStore?: LanguageDataStore;
};

/**
 * The entry files for the separated hooks
 */

/**
 * Imports the translations addes by the user in "i18n/index",
 * veryfies the tranlsations and exposes them
 * to the custom hooks
 * @returns the translations and the default language as defined in "i18n/index"
 */
declare const i18n: () => I18N | Error;

export { LanguageSwitcher, LinkWithLocale, i18n as default, useLanguageQuery, useLanguageSwitcherIsActive, useSelectedLanguage, useTranslation };
