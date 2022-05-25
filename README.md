![next-export-i18n written over a mountain peak](next-export-i18n.png)

# `next-export-i18n` [![Build Status](https://app.travis-ci.com/martinkr/next-export-i18n.svg?branch=main)](https://app.travis-ci.com/martinkr/next-export-i18n)

**TL;DR: This npm module provides a simple solution for Internationalization (i18n) of projects using `next export`.**

Since v10.0.0 Next.js already has support for internationalized (i18n) routing out-of-the-box. You can provide a list of locales, a default as well as domain-specific locales and Next.js automatically handles the routing. It streamlines the touring and locale parsing for nearly all existing l18n library solutions available for Next.js such as `react-intl`, `react-i18next`, `lingui`, `rosetta`, `next-intl`.

Unfortunately, [`Next.js` i18n-routing](https://nextjs.org/docs/advanced-features/i18n-routing) does not supports `next export`.

> Note that Internationalized Routing does not integrate with `next export` as next export does not leverage the Next.js routing layer. Hybrid Next.js applications that do not use next export are fully supported.

This means that _none_ of the i18n-libraries (which are utilizing the build in i18n-routing) is able to support fully static sites which are generated with `next export`.

Wait, what is going on here, they explicitly mention support for server-side rendering!

> react-i18next is optimally suited for server-side rendering

[https://react.i18next.com](https://react.i18next.com)

> To complement this, next-i18next provides the remaining functionality – management of translation content, and components/hooks to translate your React components – while fully supporting SSG/SSR, multiple namespaces, codesplitting, etc.

[https://github.com/isaachinman/next-i18next](https://github.com/isaachinman/next-i18next)

They all support _pre-rendered sites_ which are _served with `Next.js`_ - where as `next export` creates a truly static page which can be served with _any_ webserver (e.g. nginx, apache etc).

For the different types of pre-rendering in `Next.js`, take a look at my article [The two and a half + one flavors of `Next.js`'s pre-rendering
](https://dev.to/martinkr/the-two-and-a-half-one-flavors-of-next-js-s-pre-rendering-44o) which explains and summarizes the different options.

## `next-export-i18n` overview

`next-export-i18n` will add a query-parameter `lang` to your urls and use this for setting the correct content for the selected language. The interface for the i18n-content is similar to `react-i18next / next-i18next`. You add get the content with `t(key.to.translation)` from the `useTranslation`-hook.
There are a few things you need to keep in mind:

- you need to set the translations files as `json`. If you prefer a more human friendly format, use `yaml` and [yamljs](https://www.npmjs.com/package/yamljs) and their cli `yaml2json` for easy conversion.
- you refer nested keys with a dot: "nested.key" (see example below). Please no not use dots in your keys unless you use nested keys.
- if there is no translation for the given key, the module renders the key back to the site.
- you need to update the query parameters on your internal links to pass the selected language query-parameter. Use the `query` state from the `useLanguageQuery`-hook and add it as `query-object` to your `next/link`-components (`<Link href={{ query: query … }}>…`). The `useLanguageQuery`-hook will preserve your existing query-parameters.
- it requires JavaScript being enabled on the client side.

## Quick start

1. Run `yarn add next-export-i18n` or `npm install next-export-i18n`.
2. Create a top-level-folder `i18n` and Add your `json translation files` .

### translations.en.json

```json
{
  "myKey": "en translation",
  "nested": {
    "key": "nested en translation"
  }
}
```

### translations.de.json

```json
{
  "myKey": "de translation",
  "nested": {
    "key": "nested en translation"
  }
}
```

3. Create `i18n/index.js`, `require` your `translation files` and export them.

```javascript
var en = require("./translations.en.json");
var de = require("./translations.de.json");

const i18n = {
  translations: {
    en,
    de,
  },
  defaultLang: "en",
  useBrowserDefault: true,
};

module.exports = i18n;
```

_In case there is a default language set in the browser and this language is available in the translations, and `useBrowserDefault` is set to true
it overrides the default language setting in the config file._ Relevant is the primary subtag, e.g.: a default language of `en-US` from the will be read as `en`.
Set `useBrowserDefault` to false if you want to forcefully override the browser language.

4. `import { useTranslation, useLanguageQuery, LanguageSwitcher } from 'next-export-i18n'` in your `pages` and get the required hooks.

```javascript
import {
  useTranslation,
  useLanguageQuery,
  LanguageSwitcher,
} from "next-export-i18n";

const { t } = useTranslation();
const [query] = useLanguageQuery();
```

4. Add the `<LanguageSwitcher lang={string}>` component to change the language (or create your own language switcher).
5. Add the `query` from `useLanguageQuery` to your internal links to enhance them with the language parameter (`<Link href={{ query: query … }}>…`).
6. Add the translations with `t(key)` from `useTranslation` to your elements. They will be automatically update as soon as the language change.

### Module.js

```javascript
const { t } = useTranslation();
const key = "myKey";
let string = t(key);
// string will be "en translation" or "de translation
const nestedKey = "nested.key";
let nestedString = t(key);
// nestedString will be "nested en translation" or "nested de translation
```

## Working with template strings in translation files

You can also provide a [mustache](https://mustache.github.io/) template in your `translation.json` and render it dynamically:

### translation.json

```json
{
  "myTemplate": "{{count}} times"
}
```

### Module.js

```javascript
 import { useTranslation} from 'next-export-i18n'
 const { t } = useTranslation();
 const key = 'myTemplate';
 let string = t(key, { count: 2 }))
 // string will be "2 times"
```

## Sample implementation

You can also take a look at the example implementation [next-export-i18n-example.vercel.app](https://next-export-i18n-example.vercel.app) and its source code at [github: `https://github.com/martinkr/next-export-i18n-example`](https://github.com/martinkr/next-export-i18n-example).

## Getting Started with `Next.js`

Well, you are looking for a very specific solution related to `Next.js`, so I assume you already know about `Next.js`. But anyway …

### Run the development server

```bash
npm run dev
# or
yarn dev
```

and open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Export the project

```bash
npm run export
# or
yarn export
```

and `serve` the `./out` directory with your favorite web server.

## Tech Stack

- next.js: 12.1.5
- react.js: 18.0.0
- jest: 27.5.1
- typescript: 4.6.3

## License

Licensed under the MIT license.
MIT - <http://www.opensource.org/licenses/mit-license.php>
