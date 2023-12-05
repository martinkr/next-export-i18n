/**
 * @jest-environment jsdom
 */
import { cleanup, renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import useSelectedLanguage from "./use-selected-language";

jest.mock("./../../../i18n/index", () => {
  return {
    __esModule: true,
    i18n: {
      translations: { mockLs: { title: "mockLs" }, fooLs: { title: "barLs" } },
      languageDataStore: "localStorage",
      defaultLang: "mockLs",
    },
  };
});

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

beforeEach(() => {
  window.localStorage.setItem(langStorageId, "fooLs");
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  jest.clearAllMocks();
});

describe("With localStorage, the hook returns ", () => {
  it(`the default language if there is no data set at localStorage `, async () => {
    window.localStorage.setItem(langStorageId, "");
    window.localStorage.removeItem(langStorageId);
    window.localStorage.clear();
    const { result } = renderHook(() => useSelectedLanguage());
    expect(result.current.lang).toBe("mockLs");
  });

  it(`the language from localStorage `, async () => {
    const { result } = renderHook(() => useSelectedLanguage());
    expect(result.current.lang).toBe("fooLs");
  });

  it.only(`the updated language if ${eventType} is dispatched`, async () => {
    const { result } = renderHook(() => useSelectedLanguage());
    expect(result.current.lang).toBe("fooLs");
    act(() => {
      window.localStorage.setItem(langStorageId, "mockLs");
      const event = new Event(eventType);
      document.dispatchEvent(event);
    });
    expect(result.current.lang).toBe("mockLs");
  });
});
