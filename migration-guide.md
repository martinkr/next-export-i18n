![next-export-i18n v3 written over a night scene of a New York City'S street covered in multi-language neon signs](next-export-i18n.png)

# `next-export-i18n`: From Version 2 to Version 3

**For the `pages` directory, use Version 2**
You can add it to your project with `npm install --save-dev next-export-i18n@^2`

**Version 3 supports the `app `router**
Install or update `next-export-i18n` with `npm install --save-dev next-export-i18n` or `npm update next-export-i18n`.

This guide operates under the assumption that you are migrating from the `pages` directory to the `app` router, and your legacy code uses the `next-export-i18n` module.

__If you are building a new application directly with the `app` router, please look at the [`README](README.md) file.__

## Use client components with "use client" 
Because `next-export-i18n` works with actual static exported pages, it operates exclusively on the client side. Therefore, you can only use it in `client components`. You must add the `"use client"` directive on top of the file.


## Replace the `useQueryLanguage` Hook with the `LinkWithLocale` Component
Version 3 deprecates the `useQueryLanguage` hook and provides the `LinkWithLocale` instead.

You've probably only used this hook to add the currently selected language to internal links.
For example, you would have had code similar to the one in the listing below, where `query` adds the current search parameters to the internal link to preserve the selected language. 

```javascript
import { useTranslation, useLanguageQuery } from 'next-export-i18n';

export default function Component({ }) {
  const { t } = useTranslation();
  const [query] = useLanguageQuery();
  return (
    <Link href={{ pathname: t('link.href'), query: query }}>
      {t('link.text')}
    </Link>
  )
}
``` 

In version 3, `next-export-i18n` provides a dedicated component to simplify working with the search parameters. Instead of manually adding the parameters, the component handles that. Let's look at a modified listing that uses the `LinkWithLocale` component instead of the `useLanguageQuery` hook.


```javascript
import { useTranslation, LinkWithLocale } from 'next-export-i18n';

export default function Component({ }) {
  const { t } = useTranslation();
  return (
    <LinkWithLocale href={t('link.href')}>
      {t('link.text')}
    </LinkWithLocale>
  )
}
``` 

If you used it to read the currently selected language, please use `searchParams` instead. The listing below shows an example of how to get the `lang` from the search parameters of the current URL.

```javascript
'use client'

import { useSearchParams } from 'next/navigation'
 
export default function Component() {
  // URL is "/paris-bistros?lang=en"
  const searchParams = useSearchParams()
  // lang is "en"
  const lang = searchParams.get('lang')
  …
}
```
 
 
