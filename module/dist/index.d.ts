import useLanguageQuery from "./hooks/use-language-query";
import useSelectedLanguage from "./hooks/use-selected-language";
import useLanguageSwitcherIsActive from "./hooks/use-language-switcher-is-active";
import { useTranslation } from "./hooks/use-translation";
import LanguageSwitcher from "./components/language-switcher";
import LinkWithLocale from "./components/link-with-locale";
import i18n from "./index.js";
export { useLanguageQuery, useSelectedLanguage, useLanguageSwitcherIsActive, useTranslation, LanguageSwitcher, LinkWithLocale, };
export default i18n;
