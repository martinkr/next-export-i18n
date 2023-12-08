import Link, { LinkProps } from "next/link";
import useSelectedLanguage from "../../hooks/use-selected-language";
import React, { ReactNode, useMemo } from "react";

interface LinkWithLocaleProps extends LinkProps {
  children: ReactNode;
}

export default function LinkWithLocale(props: LinkWithLocaleProps) {
  const { lang } = useSelectedLanguage();
  const { href, ...rest } = props;
  const link = useMemo(() => {
    const inputHref = href.toString();
    if (inputHref.includes("?lang=") || inputHref.includes("&lang=")) {
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
