import { useSearchParams } from "next/navigation";

import { ParsedUrlQueryInput, ParsedUrlQuery } from "node:querystring";
import { useEffect, useMemo, useState } from "react";
import useSelectedLanguage from "./use-selected-language";
import { Dictionary } from "../types";

let passedQuery: Dictionary;

/**
 * Returns a react-state which is a queryObject containing an exsisting query and a query string with the current selected
 * language (or the passed forced language).
 * Reason: We want to preserve an existing query string.
 * Usage: LanguageSwitcher with forceLang param and all links without forceLang param
 * @param [forceLang] string to override the selected language
 * @returns queryObject react-state as ParsedUrlQueryInput
 */
export default function useLanguageQuery(forceLang?: string) {
  const { lang } = useSelectedLanguage();

  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");
  const querystring = searchParams.toString();

  const [value, setValue] = useState<ParsedUrlQueryInput>();

  // keep passed parameters
  const passedQuery = useMemo(() => {
    let queryObj: Dictionary = {};

    for (const [key, value] of searchParams.entries()) {
      queryObj[key] = value;
    }
    return queryObj;
  }, [langParam, querystring]);

  // set lang if one of the dependencies is changing
  useEffect(() => {
    setValue({
      ...passedQuery,
      lang: forceLang || (lang as string) || (passedQuery["lang"] as string),
    });
  }, [forceLang, lang, passedQuery, querystring]);

  return [value] as const;
}
