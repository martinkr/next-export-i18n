Object.defineProperty(exports, '__esModule', { value: true });

var navigation = require('next/navigation');
var React = require('react');
var I18N = require('./../../i18n/index.js');
var Mustache = require('mustache');
var Link = require('next/link');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var Mustache__default = /*#__PURE__*/_interopDefaultLegacy(Mustache);
var Link__default = /*#__PURE__*/_interopDefaultLegacy(Link);

var LanguageDataStore;
(function (LanguageDataStore) {
    LanguageDataStore["QUERY"] = "query";
    LanguageDataStore["LOCAL_STORAGE"] = "localStorage";
})(LanguageDataStore || (LanguageDataStore = {}));

/**
 * The entry files for the separated hooks
 */
/**
 * Calculates the default language from the user's language setting and the i18n object.
 * In case there is a language set in the browser which is also available as translation,
 * override the default language setting in the config file.
 * @returns string indicating the default language to use
 */
const getDefaultLanguage = (userI18n) => {
    let browserLang = "";
    if (userI18n.useBrowserDefault &&
        typeof window !== "undefined" &&
        window &&
        window.navigator &&
        (window.navigator.languages || window.navigator.language)) {
        browserLang = ((window.navigator.languages && window.navigator.languages[0]) ||
            window.navigator.language)
            .split("-")[0]
            .toLowerCase();
    }
    if (userI18n.useBrowserDefault &&
        browserLang &&
        userI18n.translations[browserLang]) {
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
const i18n = () => {
    // cast to be typsafe
    const userI18n = I18N;
    // Set "query" as default
    if (!userI18n.languageDataStore) {
        userI18n.languageDataStore = LanguageDataStore.QUERY;
    }
    if (Object.keys(userI18n.translations).length < 1) {
        throw new Error(`Missing translations. Did you import and add the tranlations in 'i18n/index.js'?`);
    }
    if (userI18n.defaultLang.length === 0) {
        throw new Error(`Missing default language. Did you set 'defaultLang' in 'i18n/index.js'?`);
    }
    if (!userI18n.translations[userI18n.defaultLang]) {
        throw new Error(`Invalid default language '${userI18n.defaultLang}'. Check your 'defaultLang' in 'i18n/index.js'?`);
    }
    // if (!Object.values(LanguageDataStore).includes(userI18n.languageDataStore)) {
    //   throw new Error(
    //     `Invalid language detection '${userI18n.languageDataStore}'. Check your 'languageDataStore' in 'i18n/index.js'?`
    //   );
    // }
    userI18n.defaultLang = getDefaultLanguage(userI18n);
    return userI18n;
};

/**
 * Returns a react-state containing the currently selected language.
 * @returns [lang as string, setLang as SetStateAction] a react-state containing the currently selected language
 */
function useSelectedLanguage() {
    const i18nObj = i18n();
    const defaultLang = i18nObj.defaultLang;
    const translations = i18nObj.translations;
    const languageDataStore = i18nObj.languageDataStore;
    const searchParams = navigation.useSearchParams();
    const langParam = searchParams.get("lang");
    const [lang, setLang] = React.useState(defaultLang);
    // set the language if the localStorage value has changed
    const handleLocalStorageUpdate = () => {
        const storedLang = window.localStorage.getItem("next-export-i18n-lang");
        if (languageDataStore === LanguageDataStore.LOCAL_STORAGE &&
            storedLang &&
            storedLang !== lang &&
            translations &&
            translations[storedLang]) {
            setLang(storedLang);
        }
    };
    // Listen for local-storage changes
    React.useEffect(() => {
        handleLocalStorageUpdate();
        document.addEventListener("localStorageLangChange", () => {
            handleLocalStorageUpdate();
        });
        return () => {
            document.removeEventListener("localStorageLangChange", handleLocalStorageUpdate);
        };
    }, [handleLocalStorageUpdate]);
    // set the language if the query parameter changes
    React.useEffect(() => {
        const storedLang = langParam;
        if (languageDataStore === LanguageDataStore.QUERY &&
            storedLang &&
            storedLang !== lang &&
            translations &&
            translations[storedLang]) {
            setLang(storedLang);
        }
    }, [lang, langParam, translations, setLang]);
    return { lang, setLang };
}

/**
 * Returns a boolean react-state indicating if the current selected language equals the one passed to the hook.
 * @param currentLang string the language to check. Needs to equal the key in i18n/index.
 * @returns boolean react-state
 */
function useLanguageSwitcherIsActive(currentLang) {
    const [isActive, setIsActive] = React.useState(false);
    const i18nObj = i18n();
    const searchParams = navigation.useSearchParams();
    const langParam = searchParams.get("lang");
    const defaultLang = i18nObj.defaultLang;
    const languageDataStore = i18nObj.languageDataStore;
    React.useEffect(() => {
        if (languageDataStore === LanguageDataStore.QUERY) {
            let current;
            if (!langParam) {
                current = defaultLang === currentLang;
            }
            else {
                current = langParam === currentLang;
            }
            setIsActive(current);
        }
    }, [currentLang, defaultLang, langParam]);
    const handleLocalStorageUpdate = () => {
        if (languageDataStore === LanguageDataStore.LOCAL_STORAGE) {
            let current;
            const localStorageLanguage = window.localStorage.getItem("next-export-i18n-lang");
            current = defaultLang === currentLang;
            if (localStorageLanguage) {
                current = localStorageLanguage === currentLang;
            }
            setIsActive(current);
        }
    };
    // Listen for local-storage changes
    React.useEffect(() => {
        handleLocalStorageUpdate();
        document?.addEventListener("localStorageLangChange", () => {
            handleLocalStorageUpdate();
        });
        return () => {
            document?.removeEventListener("localStorageLangChange", handleLocalStorageUpdate);
        };
    }, [handleLocalStorageUpdate]);
    return { isActive };
}

/**
 * Provides the t() function which returns the value stored for this given key (e.g. "i18n.ui.headline")
 * in the translation file.
 * The return value can be a string, a number, an array or an object.
 * In case there is no entry for this key, it returns the key.
 * @returns t(key: string): any function
 */
const useTranslation = () => {
    let i18nObj;
    i18nObj = i18n();
    const translations = i18nObj.translations;
    const { lang } = useSelectedLanguage();
    return {
        /**
         * Returns the value stored for this given key (e.g. "i18n.ui.headline")  in the translation file.
         * The return value can be a string, a number, an array or an object.
         * In case there is no entry for this key, it returns the key.
         * @param key the key for looking up the translation
         * @param view the mustache view for interpolating the template string
         * @returns the value stored for this key, could be a string, a number, an array or an object
         */
        t: (key, view) => {
            let value = key
                .split(".")
                .reduce((previous, current) => (previous && previous[current]) || null, translations[lang]);
            let translation = value || key;
            try {
                return Mustache__default["default"].render(translation, view);
            }
            catch (e) {
                return translation;
            }
        },
    };
};

/**
 * Simple component for switching the language.
 * Set the "lang" query parameter on click whie preserves the current query parameters
 * Style it using the
 * - [data-language-switcher]
 * - [data-is-current="true"]
 *  attribute selectors or create your own component.
 * @param lang string the language to switch to. Needs to equal the key in i18n/index.
 * @param [children] React.nodes
 */
const LanguageSwitcher = ({ lang, children }) => {
    // state indicating if this component's target language matches the currently selected
    const { isActive: languageSwitcherIsActive } = useLanguageSwitcherIsActive(lang);
    // necessary for updating the router's query parameter inside the click handler
    const router = navigation.useRouter();
    const pathname = navigation.usePathname();
    const searchParams = navigation.useSearchParams();
    const i18nObj = i18n();
    const languageDataStore = i18nObj.languageDataStore;
    const createQueryString = React.useCallback((name, value) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(name, value);
        return params.toString();
    }, [searchParams]);
    /**
     * Updates the router with the currently selected language
     */
    const handleLanguageChange = () => {
        if (languageDataStore === LanguageDataStore.QUERY) {
            router.push(`${pathname}?${createQueryString("lang", lang)}`);
        }
        if (languageDataStore === LanguageDataStore.LOCAL_STORAGE) {
            window.localStorage.setItem("next-export-i18n-lang", lang);
            const event = new Event("localStorageLangChange");
            document.dispatchEvent(event);
        }
    };
    // use React.cloneElement to manipulate properties
    if (React__default["default"].isValidElement(children)) {
        return React__default["default"].cloneElement(children, {
            onClick: () => {
                if (children &&
                    children.props &&
                    typeof children.props.onClick === "function") {
                    children.props.onClick();
                }
                // set the language
                handleLanguageChange();
            },
            "data-language-switcher": "true",
            // set the current status
            "data-is-current": languageSwitcherIsActive,
            role: "button",
            "aria-label": `set language to ${lang}`,
        });
    }
    else {
        return (React__default["default"].createElement("span", { role: "button", "aria-label": `set language to ${lang}`, "data-language-switcher": "true", "data-is-current": languageSwitcherIsActive, onClick: () => {
                // set the language
                handleLanguageChange();
            } }, children));
    }
};

function LinkWithLocale(props) {
    const { lang } = useSelectedLanguage();
    const i18nObj = i18n();
    const languageDataStore = i18nObj.languageDataStore;
    const { href, ...rest } = props;
    const link = React.useMemo(() => {
        const inputHref = href.toString();
        if (inputHref.includes("?lang=") ||
            inputHref.includes("&lang=") ||
            languageDataStore === LanguageDataStore.LOCAL_STORAGE) {
            return inputHref;
        }
        if (inputHref.includes("?")) {
            return `${inputHref}&lang=${lang}`;
        }
        else {
            return `${inputHref}?lang=${lang}`;
        }
    }, [href, lang]);
    return React__default["default"].createElement(Link__default["default"], { href: link, ...rest });
}

exports.LanguageSwitcher = LanguageSwitcher;
exports.LinkWithLocale = LinkWithLocale;
exports["default"] = i18n;
exports.useLanguageSwitcherIsActive = useLanguageSwitcherIsActive;
exports.useSelectedLanguage = useSelectedLanguage;
exports.useTranslation = useTranslation;
