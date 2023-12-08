/**
 * the unified entry file for the exported and compiled node module
 */
import { i18n as userland } from "./../../i18n/index.js";
import useSelectedLanguage from "./hooks/use-selected-language";
import useLanguageSwitcherIsActive from "./hooks/use-language-switcher-is-active";
import { useTranslation } from "./hooks/use-translation";
import LanguageSwitcher from "./components/language-switcher";
import LinkWithLocale from "./components/link-with-locale";
import i18n from "./index.js";

import { Dictionary, I18N } from "./types";

export {
  useSelectedLanguage,
  useLanguageSwitcherIsActive,
  useTranslation,
  LanguageSwitcher,
  LinkWithLocale,
};
export default i18n;
