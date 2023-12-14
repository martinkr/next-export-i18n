![next-export-i18n v3 written over a night scene of a New York City'S street covered in multi-language neon signs](next-export-i18n.png)

# `next-export-i18n v3` [![Build Status](https://app.travis-ci.com/martinkr/next-export-i18n.svg?branch=main)](https://app.travis-ci.com/martinkr/next-export-i18n)

**TL;DR: This npm module provides a simple, reactive client-side javascript solution for project internationalization (i18n) using `next export`/`config: export` for Next.js' `app router`.**

## Use `v3` with the `app` router
Version 3 of the module supports the `app` router exclusively. 
Because `next-export-i18n` works with actual static exported pages, it operates exclusively on the client side. Therefore, you can only use it in `client components`. You must add the `"use client"` directive on top of the file.

Install it on your command line by running `npm install --save-dev next-export-i18n`.

If you're migrating from the `pages` directory to the `app`router, look at the [`migration guide](migration-guide.md).

## Use `v2` with the `pages` directory
To use `next-export-i18n` with Next.js' traditional `pages` directory, use the latest version of the `major version 2`. We'll update this branch with new features. To install it, use the semver range `^2`. 
The complete npm command would be: `npm install --save-dev next-export-i18n@^2`

## Quick Start 
To add the `next-export-i18n`, follow a few basic steps.

1. Run `yarn add next-export-i18n` or `npm install next-export-i18n`.
2. Create a top-level-folder `i18n` and Add your `JSON translation files` similar to the listings below

```json
{
  "headline": "City: Paris",
  "link": {
    "text": "Top 10 Bistros in Paris ",
    "href": "/paris-bistros"
  }
}
```
_File: ./i18n/translations.en.json_

```json
{
  "headline": "Stadt: Paris",
  "link": {
    "text": "Die 10 besten Bistros in Paris ",
    "href": "/paris-bistros"
  }
}
```
_File: ./i18n/translations.de.json_

3. Create the `i18n/index.js`, and use `require` to add your `translation files`. Use the configuration object to customize `next-export-i18n` to your liking.

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
  // optional property will default to "query" if not set
  languageDataStore: "query" || "localStorage",
};

module.exports = i18n;
```
_File: ./i18n/index.js_

4. Add the translation hook ` useTranslation` and the `LanguageSwitcher`component to your code. Then, add the reactive translations using the `t()` function. `Next-export-i18n` updates them automatically immediately when you change the language through the `LanguageSwitcher` component.

If you choose the `query` param (the default method) to store your language selection, remember that every internal link requires the search parameter `lang` on the `href' attribute. By adding this, we tell the destination which language to render. The linked page would fall back to the default language without the search parameter. To simplify this, you can use the `LinkWithLocale` component which automatically adds the `lang`-parameter to each link while preserving all search parameters you've added to the URL (see `?share=social` in the example listing). 

Look at the listing below for an example implementation.
 

```javascript
"use client"

import {
  useTranslation, 
  LanguageSwitcher, 
  LinkWithLocale
} from "next-export-i18n";

export default function Component({}) {
  const { t } = useTranslation();
  
  return (
    <div>
    <header>
      <nav>
        <LanguageSwitcher lang="de">Deutsch</LanguageSwitcher>
        <LanguageSwitcher lang="en">English</LanguageSwitcher>
      </nav>
      </header>
      <main>
      <h1>t('headline')</h1>
      <LinkWithLocale href={t("link.href")}>
        {t("link.text")}
      </LinkWithLocale>
    </main>
    </div>
  );

```
 _File: ./component.js_

## The Usecase for `next-export-i18n`
Since v10.0.0 Next.js already has support for internationalized (i18n) routing out-of-the-box. You can provide a list of locales, a default and domain-specific locales, and Next.js automatically handles the routing. It streamlines the touring and locale parsing for nearly all existing l18n library solutions available for Next.js such as `react-intl`, `react-i18next`, `lingui`, `rosetta`, `next-intl`.

__Unfortunately, [`Next.js` i18n-routing](https://nextjs.org/docs/advanced-features/i18n-routing) does not supports `next export`.__

> Note that Internationalized Routing does not integrate with `next export` as next export does not leverage the Next.js routing layer. Hybrid Next.js applications that do not use next export are fully supported.

This means that _none_ of the i18n-libraries (utilizing the built-in i18n-routing) can support fully static sites generated with `next export`.

_Wait, what is happening here? They explicitly mention support for server-side rendering!_

> react-i18next is optimally suited for server-side rendering

[https://react.i18next.com](https://react.i18next.com)

> To complement this, next-i18next provides the remaining functionality – management of translation content and components/hooks to translate your React components – while fully supporting SSG/SSR, multiple namespaces, code-splitting, etc.

[https://github.com/isaachinman/next-i18next](https://github.com/isaachinman/next-i18next)

They all support _pre-rendered sites_ which are _served with `Next.js`_ - whereas `next export` creates a truly static page which can be served with _any_ webserver (e.g. nginx, apache, etc.).

For the different types of pre-rendering in `Next.js`, take a look at my article [The two and a half + one flavours of `Next.js`'s pre-rendering
](https://dev.to/martinkr/the-two-and-a-half-one-flavors-of-next-js-s-pre-rendering-44o), which explains and summarizes the different options.

## `next-export-i18n` overview

__With `next-export-i18n`, you can add true reactive client-side internationalization to your static-generated projects.__


## Documentation
You can configure `next-export-i18n` to match the needs of your project.

### The `useTranslation` hook 
The interface for the i18n-content is similar to `react-i18next/next-i18next`; identical to them, we add the translated content through the `t(key.to.translation)` function that we receive from the `useTranslation`-hook.

Let's look at a simple example:

```javascript
"use client"
import {useTranslation} from "next-export-i18n";

export default function Component({}) {
  const { t } = useTranslation();
  const translatedHeadline = t('headline');
  return (
    <h1>{translatedHeadline}</h1>
  );
}
```
 _File: component.js_

### Translation Files
You must provide a `JSON` file in the `./i18n` subfolder for each language.
Below is an example listing of how they could look like.

```json
{
  "headline": "City: Paris",
  "link": {
    "text": "Top 10 Bistros in Paris ",
    "href": "/paris-bistros"
  } 
}
```
_File: ./i18n/_translations.en.json_

If you prefer a more readable format, you can use `yaml` files and convert them to the required `JSON` format during the build step. A common library for that would be  [yamljs](https://www.npmjs.com/package/yamljs).

Please remember not to use dots in your `JSON` property names. The module uses the dots to determine link keys; for example: `t("link.headline")` refers to the translated content string "City: Paris"

The module renders the key back to the site in case the key is not part of the language files to indicate and remind you of missing translations.

### The Configuration File `i18n/index.js`
Let's look at an example configuration file _`i18n/index.js`_.

```javascript
// First, we load all translation files.
var en = require("./translations.en.json");
var de = require("./translations.de.json");

// Then we need to set up our configuration;
// Here, we add the translations under the particular 
// language key and then configuring the module.
const i18n = {
  translations: {
    en: en.i18n,
    de: de.i18n,
  },
  defaultLang: "de",
  languageDataStore: "localStorage",
  useBrowserDefault: true,
};
```
_File: ./i18n/index.js_

#### The Configuration Options
`Next-export-i18n` has only a few important configuration options. Let's look at them in detail.

##### defaultLang
_A string, for Example: "en"_
We use the `defaultLang` property to set the default language. Remember, this language key needs to be available in your translation configuration.

##### languageDataStore
_Either `"localStorage"` or `"query"`_
With the configuration property `languageDataStore`, you tell `next-export-i18n` to either add a `query` parameter (default) `lang` to your URLs or store the selected language in the browser's `localStorage`. 

##### useBrowserDefault
_Either `true` or `false`_
If you use `true`, we use the browser's language instead of the configuration's `defaultLang` to determine the default language setting. Remember that `next-export-i18n` considers only the primary subtag, e.g., `en-US` from the will be read as `en` and will use the translations you added under èn`in the `i18n/index.js`file.


### The `LinkWithLocale` Component
When you use the `query` param (default) to store your language selection, every internal link requires the search parameter `lang` on the `href' attribute. Otherwise, the destination will not show the content in the selected language; instead, the application will fall back to the default language.

You can use the `LinkWithLocale` component to automatically add the `lang`-parameter to each link while preserving all search parameters you've added to the URL (see `?share=social` in the example listing). Look at the listing below for an example implementation.

```javascript
"use client"

import {LinkWithLocale} from 'next-export-i18n';

export default function Component({ }) {
  return (
    <LinkWithLocale href="/paris-sights?share=social">
      Link to /paris-sights
    </LinkWithLocale>
  );
}
```
_File: component.js_

### The `LanguageSwitcher` Component
`Next-export-i18n` provides a convenient out-of-the-box to switch between the available languages. It preserves an existing search parameter on the current URL, and you can use the `[data-language-switcher]` and `[data-is-current="true"]` to style the component.

Look at the listing below for an example implementation.

```javascript
"use client"

import {LanguageSwitcher} from 'next-export-i18n';

export default function Component({ }) {
  return (
    <nav>
      <LanguageSwitcher lang="de">Deutsch</LanguageSwitcher>
      <LanguageSwitcher lang="en">English</LanguageSwitcher>
    </nav>
  );
}
``` 
_File: component.js_
### Working With Template Strings 

 Let's say we want to display a username or set the number of top locations depending on the number of locations we receive from an API. For those kinds of dynamic text, you can add a [moustache](https://mustache.github.io/) template in the `translation.json` strings and update them dynamically.

Let's look at an example implementation where we replace the fixed number `10` in the string `Top 10 Bistros in Paris` with a dynamic number.

```json
{
  "headline": "City: Paris",
  "link": {
    "text": "Top {{count}} Bistros in Paris ",
    "href": "/paris-bistros"
  }
}
```
_File: translation.json_ 

```javascript
"use client"
import {useTranslation} from "next-export-i18n";

export default function Component({}) {
  const { t } = useTranslation();
  const numberOfItems = 10;
  const translatedContent = t('link.text', { count: numberOfItems }))
  // translatedContent will be "Top 10 Bistros in Paris"
  return (
    <h1>{translatedContent}</h1>
  );
}
```
 _File: component.js_
 

## Example page
We have an example implementation at [next-export-i18n-example.vercel.app](https://next-export-i18n-example.vercel.app) and its source code at [github: `https://github.com/martinkr/next-export-i18n-example`](https://github.com/martinkr/next-export-i18n-example) to showcase `next-export-i18n` and to give you an example of how to use the module.

## Statically Exporting Your Project 
Next.js v14.0.0 replaces the `next export` command with the configuration setting `"output": "export"`.
Add this to the `next.config.js` in your application's root directory. The listing below shows a stripped down minimal example.

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export'
}
```
_File: ./next.config.js_
Run the export command below:

```bash
npm run build
# or
yarn build
```

Then, you can use ` npx serve ./out` to see your exported project in your web browser or deploy the `./out` directory to your existing web server.

## Tech Stack

- next.js: >= 13.0.0
- react.js: >=18.0.0
- jest: ^27.5.1
- typescript: ^4.9.5

## License

It is licensed under the MIT license.
MIT - <http://www.opensource.org/licenses/mit-license.php>

