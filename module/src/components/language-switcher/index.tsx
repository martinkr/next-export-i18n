"use client";

import React, { ReactNode, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import useLanguageSwitcherIsActive from "../../hooks/use-language-switcher-is-active";
import i18n from "../../index";
import { I18N } from "../../types";
import { LanguageDataStore } from "../../enums/languageDataStore";

type Props = {
  lang: string;
  children?: ReactNode;
};

/**
 * Simple component for switching the language.
 * Set the "lang" query parameter on click while preserves the current query parameters
 * Style it using the
 * - [data-language-switcher]
 * - [data-is-current="true"]
 *  attribute selectors or create your own component.
 * @param lang string the language to switch to. Needs to equal the key in i18n/index.
 * @param [children] React.nodes
 */
const LanguageSwitcher = ({ lang, children }: Props): JSX.Element => {
  // state indicating if this component's target language matches the currently selected
  const { isActive: languageSwitcherIsActive } =
    useLanguageSwitcherIsActive(lang);

  // necessary for updating the router's query parameter inside the click handler
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const i18nObj = i18n() as I18N;
  const languageDataStore = i18nObj.languageDataStore;
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  /**
   * Updates the router with the currently selected language
   */
  const handleLanguageChange = () => {
    if (languageDataStore === LanguageDataStore.QUERY) {
      router.push(`${pathname}?${createQueryString("lang", lang)}`);
    }

    if (languageDataStore === LanguageDataStore.PATHNAME) {
      if (searchParams.toString()) {
        router.push(`/${lang}${pathname}?${searchParams.toString()}`);
      } else {
        router.push(`/${lang}${pathname}`);
      }
    }

    if (languageDataStore === LanguageDataStore.LOCAL_STORAGE) {
      window.localStorage.setItem("next-export-i18n-lang", lang);
      const event = new Event("localStorageLangChange");
      document.dispatchEvent(event);
    }
  };

  // use React.cloneElement to manipulate properties
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: () => {
        if (
          children &&
          children.props &&
          typeof children.props.onClick === "function"
        ) {
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
  } else {
    return (
      <span
        role="button"
        aria-label={`set language to ${lang}`}
        data-language-switcher="true"
        // set the current status
        data-is-current={languageSwitcherIsActive}
        onClick={() => {
          // set the language
          handleLanguageChange();
        }}
      >
        {children}
      </span>
    );
  }
};

export default LanguageSwitcher;
