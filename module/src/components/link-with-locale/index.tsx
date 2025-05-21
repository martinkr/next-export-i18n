"use client";

import Link, { LinkProps } from "next/link";
import useSelectedLanguage from "../../hooks/use-selected-language";
import React, { ReactNode, useMemo } from "react";
import { LanguageDataStore } from "../../enums/languageDataStore";
import i18n from "../../index";
import { I18N } from "../../types";

interface LinkWithLocaleProps extends LinkProps {
  children: ReactNode;
}

/**
 * Simple component wrapper for links with a locale. use it for internal links.
 * Either add the lang parameter to the link target in the href-attribute to
 * force a specific language (e.g. as a language switcher) or let the component
 * add the currently selected languate automatically. Preserves the current query parameters
 * @exmaple
 *  <LinkWithLocale href={`${t("nav.en.about.href")}?share=social"}>
 *    {t(nav.en.about.text")}
 *  </LinkWithLocale>
 * @param href string the value for the href-attribute
 * @param [children] string the text to display
 */
export default function LinkWithLocale(props: LinkWithLocaleProps) {
  const { lang } = useSelectedLanguage();
  const i18nObj = i18n() as I18N;
  const languageDataStore = i18nObj.languageDataStore;
  const { href, ...rest } = props;
  const link = useMemo(() => {
    const inputHref = href.toString();
    try {
      const url = new URL(inputHref, document.baseURI);
      if (
        url.searchParams.has("lang") ||
        languageDataStore === LanguageDataStore.LOCAL_STORAGE
      ) {
        return inputHref;
      }
      url.searchParams.set("lang", lang);
      return url.toString();
    } catch (_e) {
      return inputHref;
    }
  }, [href, lang]);
  return <Link href={link} {...rest} />;
}
