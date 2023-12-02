/**
 * @jest-environment jsdom
 */
import { cleanup, renderHook } from "@testing-library/react";
import useLanguageSwitcherIsActive from "./use-language-switcher-is-active";

jest.mock("./../../../i18n/index", () => {
  return {
    __esModule: true,
    i18n: {
      translations: { mock: { title: "mock" }, foo: { title: "bar" } },
      languageDataStore: "localStorage",
      defaultLang: "mock",
    },
  };
});

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
    };
  },
}));

const useRouter = jest.spyOn(require("next/router"), "useRouter");

const storagePrototype = {
  getItem: function (key: string) {
    return localStorageMock[key] || null;
  },
  setItem: function (key: string, value: string) {
    if (!localStorageMock[key]) {
      this.length++;
    }
    localStorageMock[key] = value.toString();
  },
  removeItem: function (key: string) {
    if (localStorageMock[key]) {
      this.length--;
    }
    delete localStorageMock[key];
  },
  clear: function () {
    Object.keys(localStorageMock).forEach(
      (key) => delete localStorageMock[key]
    );
    this.length = 0;
  },
  length: 0,
};

export const localStorageMock = Object.create(storagePrototype);

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const langStorageId = "next-export-i18n-lang";
const eventType = "localStorageLangChange";

beforeEach(() => {});
afterEach(() => {
  cleanup();
  window.localStorage.clear();
  jest.clearAllMocks();
});

describe("The hook returns ", () => {
  it(`true if the localStorage's value is not set and the param equals the default language `, async () => {
    const { result } = renderHook(() => useLanguageSwitcherIsActive("mock"));
    expect(result.current.isActive).toBe(true);
  });

  it(`false if the localStorage's value is not set and the param does not equal the default language `, async () => {
    const { result } = renderHook(() => useLanguageSwitcherIsActive("foo"));
    expect(result.current.isActive).toBe(false);
  });

  it(`true if the localStorage's value equals the param`, async () => {
    window.localStorage.setItem(langStorageId, "foo");
    const { result } = renderHook(() => useLanguageSwitcherIsActive("foo"));
    expect(result.current.isActive).toBe(true);
  });

  it(`false if the localStorage's value does not query equals the param`, async () => {
    window.localStorage.setItem(langStorageId, "foo");
    const { result } = renderHook(() => useLanguageSwitcherIsActive("bar"));
    expect(result.current.isActive).toBe(false);
  });
});
