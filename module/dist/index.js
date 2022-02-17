Object.defineProperty(exports, '__esModule', { value: true });

var router = require('next/router');
var React = require('react');
var I18N = require('./../../i18n/index.js');
var Mustache = require('mustache');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var Mustache__default = /*#__PURE__*/_interopDefaultLegacy(Mustache);

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
    if (Object.keys(userI18n.translations).length < 1) {
        throw new Error(`Missing translations. Did you import and add the tranlations in 'i18n/index.js'?`);
    }
    if (userI18n.defaultLang.length === 0) {
        throw new Error(`Missing default language. Did you set 'defaultLang' in 'i18n/index.js'?`);
    }
    if (!userI18n.translations[userI18n.defaultLang]) {
        throw new Error(`Invalid default language '${userI18n.defaultLang}'. Check your 'defaultLang' in 'i18n/index.js'?`);
    }
    userI18n.defaultLang = getDefaultLanguage(userI18n);
    return userI18n;
};

/**
 * Returns a react-state containing the currently selected language.
 * @returns [lang as string, setLang as SetStateAction] a react-state containing the currently selected language
 */
function useSelectedLanguage() {
    let i18nObj;
    i18nObj = i18n();
    const defaultLang = i18nObj.defaultLang;
    const translations = i18nObj.translations;
    const router$1 = router.useRouter();
    const [lang, setLang] = React.useState(defaultLang);
    // set the language if the query parameter changes
    React.useEffect(() => {
        if (router$1.query.lang && router$1.query.lang !== lang && translations && translations[router$1.query.lang]) {
            let lang = router$1.query.lang;
            setLang(lang);
        }
    }, [lang, router$1.query.lang]);
    return { lang, setLang };
    // return [lang, setLang] as const;
}

let passedQuery;
/**
 * Returns a react-state which is a queryObject containing an exsisting query and a query string with the current selected
 * language (or the passed forced language).
 * Reason: We want to preserve an existing query string.
 * Usage: LanguageSwitcher with forceLang param and all links without forceLang param
  * @param [forceLang] string to override the selected language
 * @returns queryObject react-state as ParsedUrlQueryInput
 */
function useLanguageQuery(forceLang) {
    const { lang } = useSelectedLanguage();
    const router$1 = router.useRouter();
    const [value, setValue] = React.useState();
    // keep passed parameters
    passedQuery = {};
    if (router$1.query) {
        let query = router$1.query;
        const keys = Object.keys(query);
        keys.forEach((key, index) => {
            passedQuery[key] = query[key];
        });
    }
    // set lang if one of the dependencies is changing
    React.useEffect(() => {
        setValue({
            ...passedQuery,
            lang: forceLang || lang || passedQuery['lang'],
        });
    }, [forceLang, lang]);
    return [value];
}

/**
 * Returns a boolean react-state indicating if the current selected language equals the one passed to the hook.
 * @param currentLang string the language to check. Needs to equal the key in i18n/index.
 * @returns boolean react-state
 */
function useLanguageSwitcherIsActive(currentLang) {
    let i18nObj;
    i18nObj = i18n();
    const defaultLang = i18nObj.defaultLang;
    const router$1 = router.useRouter();
    const [isActive, setIsActive] = React.useState(false);
    React.useEffect(() => {
        let current = false;
        if (!router$1.query || !router$1.query.lang) {
            current = defaultLang === currentLang;
        }
        else {
            current = router$1.query.lang === currentLang;
        }
        setIsActive(current);
    }, [currentLang, defaultLang, router$1.query]);
    return { isActive };
    // return [isActive] as const;
}

/**
 * Provides the t() function which returns the value stored for this given key (e.g. "i18n.ui.headline")
 * in the translation file.
 * The return value can be a string, a number, an array or an object.
 * In case there is no entry for this key, it returns the key.
 * @returns t(key: string): any function
 */
const useTranslation = () => {
    router.useRouter();
    let i18nObj;
    i18nObj = i18n();
    const translations = i18nObj.translations;
    i18nObj.defaultLang;
    const { lang } = useSelectedLanguage();
    // const [lang] = useSelectedLanguage();
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
            let value = key.split('.').reduce((previous, current) => (previous && previous[current]) || null, translations[lang]);
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
 * @param [shallow] enable or disable shallow routing, @see https://nextjs.org/docs/routing/shallow-routing
 */
const LanguageSwitcher = ({ lang, children, shallow = false }) => {
    // state indicating if this component's target language matches the currently selected
    const { isActive: languageSwitcherIsActive } = useLanguageSwitcherIsActive(lang);
    // necessary for updating the router's query parameter inside the click handler
    const router$1 = router.useRouter();
    const [query] = useLanguageQuery(lang);
    /**
     * Updates the router with the currently selected language
     */
    const updateRouter = () => {
        router$1.push({
            pathname: router$1.pathname,
            query: query,
        }, undefined, { shallow: shallow });
    };
    // use React.cloneElement to manipulate properties
    if (React__default["default"].isValidElement(children)) {
        return React__default["default"].cloneElement(children, {
            onClick: () => {
                if (children &&
                    children.props &&
                    typeof children.props.onClick === 'function') {
                    children.props.onClick();
                }
                // set the language
                updateRouter();
            },
            "data-language-switcher": "true",
            // set the current status
            "data-is-current": languageSwitcherIsActive,
            "role": "button",
            "aria-label": `set language to ${lang}`
        });
    }
    else {
        return (React__default["default"].createElement("span", { role: "button", "aria-label": `set language to ${lang}`, "data-language-switcher": "true", "data-is-current": languageSwitcherIsActive, onClick: () => {
                // set the language
                updateRouter();
            } }, children));
    }
};

exports.LanguageSwitcher = LanguageSwitcher;
exports["default"] = i18n;
exports.useLanguageQuery = useLanguageQuery;
exports.useLanguageSwitcherIsActive = useLanguageSwitcherIsActive;
exports.useSelectedLanguage = useSelectedLanguage;
exports.useTranslation = useTranslation;
