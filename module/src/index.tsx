
/**
 * The entry files for the separated hooks
 */

import { i18n as userland } from "./../../i18n/index";
import { Dictionary, I18N } from './types';

/**
 * Imports the translations addes by the user in "i18n/index",
 * veryfies the tranlsations and exposes them
 * to the custom hooks
 * @returns the translations and the default language as defined in "i18n/index"
 */
const i18n = (): I18N | Error => {
	// cast to be typsafe
	const userI18n = userland as I18N;
	if (Object.keys(userI18n.translations).length < 1) {
		throw new Error(`Missing translations. Did you import and add the tranlations in 'i18n/index.js'?`);
	}
	if (userI18n.defaultLang.length === 0) {
		throw new Error(`Missing default language. Did you set 'defaultLang' in 'i18n/index.js'?`);
	}
	if (!userI18n.translations[userI18n.defaultLang]) {
		throw new Error(`Invalid default language '${userI18n.defaultLang}'. Check your 'defaultLang' in 'i18n/index.js'?`);
	}
	return userI18n;
};

export default i18n;
