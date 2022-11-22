import Link, { LinkProps } from 'next/link';
import useSelectedLanguage from '../../hooks/use-selected-language';
import React, { ReactNode,useMemo } from 'react';

interface LinkWithLocaleProps extends LinkProps {
  children: ReactNode;
}

export function LinkWithLocale(props: LinkWithLocaleProps) {
  const { lang } = useSelectedLanguage();
  const { href, ...rest } = props;
  const link = useMemo(() => {
    const inputHref = href.toString();
    if(inputHref.includes("?lang=") || inputHref.includes("&lang=")){
        return href.toString();
    }
    if (href.toString().includes('?')) {
      return `${href.toString()}&lang=${lang}`;
    } else {
      return `${href.toString()}?lang=${lang}`;
    }
  }, [href, lang]);
  return <Link href={link} {...rest} />;
}
