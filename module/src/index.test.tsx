/**
 * @jest-environment jsdom
 */
import { i18n as userland } from "./../../i18n/index";
import index from "./index";
import { I18N } from "./types";
const navigator = {
  language: "es",
};

jest.mock("./../../i18n/index", () => {
  return {
    __esModule: true,
    i18n: {
      translations: {
        mock: { title: "mock" },
        foo: { title: "bar" },
      },
      defaultLang: "mock",
      useBrowserDefault: true,
    } as any,
  };
});
// we can not use this for the actual mock due to hositing
const mockedData: any = {
  translations: { mock: { title: "mock" }, foo: { title: "bar" } },
  defaultLang: "mock",
  useBrowserDefault: true,
};

describe("Without window.navigator", () => {
  beforeEach(() => {
    Object.defineProperty(window, "navigator", {
      value: null,
      writable: true,
    });
    jest.resetModules();
    // reset values before each test
    const translations = { mock: { type: "mock" } };
    userland["defaultLang"] = mockedData["defaultLang"];
    userland["useBrowserDefault"] = true;
    userland["translations"] = mockedData["translations"] as unknown as any;
  });
  describe("The main file returns ", () => {
    it(`should preserve the defaultLanguage window.navigator is undefined `, async () => {
      const i18nObj = index() as I18N;
      expect(i18nObj.defaultLang).toStrictEqual("mock");
    });
  });
});

describe("With window.navigator", () => {
  beforeEach(() => {
    Object.defineProperty(window, "navigator", {
      value: navigator,
      writable: true,
    });
    jest.resetModules();
    // reset values before each test
    const translations = { mock: { type: "mock" } };
    userland["defaultLang"] = mockedData["defaultLang"];
    userland["useBrowserDefault"] = true;
    userland["translations"] = mockedData["translations"] as unknown as any;
  });

  describe("The main file returns ", () => {
    it(`the data from 'i18n/index.js'`, async () => {
      const i18nObj = index() as I18N;
      expect(i18nObj).toStrictEqual(mockedData);
    });

    it(`should preserve the defaultLanguage if the browser has a default lang which is not part of the i18n`, async () => {
      const originalLang = global.navigator.language;

      //@ts-ignore
      global.navigator.language = "invalid";

      const i18nObj = index() as I18N;
      expect(i18nObj.defaultLang).toStrictEqual("mock");
      //@ts-ignore
      global.navigator.language = originalLang;
    });

    it(`overrides the defaultLanguage with the primary subtag if the browser has a default lang which is part of the i18n`, async () => {
      const originalLang = global.navigator.language;

      //@ts-ignore
      global.navigator.language = "foo-US";

      const i18nObj = index() as I18N;
      expect(i18nObj.defaultLang).toStrictEqual("foo");
      //@ts-ignore
      global.navigator.language = originalLang;
    });

    it(`overrides the defaultLanguage with the primary subtag if the browser has an array of default langues and the first one is part of the i18n`, async () => {
      const originalLang = global.navigator.language;

      //@ts-ignore
      global.navigator.language = null;
      //@ts-ignore
      global.navigator.languages = ["foo-US", "fr-fr", "es-es"];

      const i18nObj = index() as I18N;
      expect(i18nObj.defaultLang).toStrictEqual("foo");
      //@ts-ignore
      global.navigator.language = originalLang;
    });

    it(`should preserve the defaultLanguage if useBrowserDefault is set to false`, async () => {
      const originalLang = global.navigator.languages;
      userland["useBrowserDefault"] = false;

      //@ts-ignore
      global.navigator.language = "foo-US";

      const i18nObj = index() as I18N;
      expect(i18nObj.defaultLang).toStrictEqual("mock");
      //@ts-ignore
      global.navigator.language = originalLang;
    });
  });

  describe("The main file throws an error if ", () => {
    it("there are not translations set", async () => {
      userland["translations"] = {} as unknown as any;
      expect(() => {
        index();
      }).toThrow(
        `Missing translations. Did you import and add the tranlations in 'i18n/index.js'`
      );
    });

    it("the defined default language is not present in the translations object", async () => {
      userland["defaultLang"] = "invalid";
      expect(() => {
        index();
      }).toThrow(
        `Invalid default language 'invalid'. Check your 'defaultLang' in 'i18n/index.js'?`
      );
    });

    it("the default language is not set", async () => {
      userland["defaultLang"] = "";
      expect(() => {
        index();
      }).toThrow(
        `Missing default language. Did you set 'defaultLang' in 'i18n/index.js'?`
      );
    });
  });
});
