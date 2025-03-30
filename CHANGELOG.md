
# 3.0.1
- Adds support for locale in pathname
### Fix
- Updates next@13 dependency

# 3.0.0
- Switches to `app` router
# 2.3.3
### Fix
- Version numbers in changelog
- Racecondition in useLanguageSwitcherIsActive  

# 2.3.2
### Fix
- Edgecase where useLanguageSwitcherIsActive was not working 
# 2.3.1
### Fix
- Deletes unused variables: https://github.com/martinkr/next-export-i18n/pull/37
- Fixes handling of query params for useLanguageQuery using dynamic routes and pages with additional query params: https://github.com/martinkr/next-export-i18n/pull/60

### Features
- Adds support for links with locale parameter: https://github.com/martinkr/next-export-i18n/pull/52
- Adds support to store selected language in Local Storage https://github.com/martinkr/next-export-i18n/pull/56
# 2.0.0
### Features
- Support for React v18
- Support for Next v12

# 1.4.2
### Fix
- <https://github.com/martinkr/next-export-i18n/issues/24>

# 1.4.1

### Fix

- added tests for window.navigator === null
- <https://github.com/martinkr/next-export-i18n/issues/20>, Thanks to <https://github.com/cyntler>
- <https://github.com/martinkr/next-export-i18n/issues/18>, Thanks to <https://github.com/cyntler>

-

# 1.4.0

### Features

- Make browser language optional

# 1.3.0

### Features

- Use browser default language for default language if possible

# 1.2.1

### Fix

- Dependencies
- Adjust CI server

# 1.2.0

### Features

- Support for Mustache templates
