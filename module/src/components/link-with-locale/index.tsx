import Link, { LinkProps } from "next/link";
import useSelectedLanguage from "./../../hooks/use-selected-language";
import React, { ReactNode, useMemo } from "react";
import { LanguageDataStore } from "./../../enums/languageDataStore";
import i18n from "./../../index";
import { I18N } from "../../types";
interface LinkWithLocaleProps extends LinkProps {
  children: ReactNode;
}

export default function LinkWithLocale(props: LinkWithLocaleProps) {
  const { lang } = useSelectedLanguage();
  const { href, ...rest } = props;
  const link = useMemo(() => {
    const i18nObj = i18n() as I18N;
    const languageDataStore = i18nObj.languageDataStore;
    const inputHref = href.toString();

    if (
      inputHref.includes("?lang=") ||
      inputHref.includes("&lang=") ||
      languageDataStore === LanguageDataStore.LOCAL_STORAGE
    ) {
      return inputHref;
    }
    if (inputHref.includes("?")) {
      return `${inputHref}&lang=${lang}`;
    } else {
      return `${inputHref}?lang=${lang}`;
    }
  }, [href, lang]);
  return <Link href={link} {...rest} />;
}
