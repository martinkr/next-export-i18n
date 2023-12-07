/**
 * @jest-environment jsdom
 */

import { useSearchParams } from "next/navigation";
import { act, cleanup, renderHook } from "@testing-library/react";
import useLanguageSwitcherIsActive from "./use-language-switcher-is-active";

jest.mock("./../../../i18n/index", () => {
  return {
    __esModule: true,
    i18n: {
      translations: { mock: { title: "mock" }, foo: { title: "bar" } },
      languageDataStore: "query",
      defaultLang: "mock",
    },
  };
});

jest.mock("next/navigation");

const mockUseSearchParams = useSearchParams as jest.MockedFunction<any>;
const mockGet = jest.fn();

mockUseSearchParams.mockReturnValue({
  get: mockGet,
});

beforeEach(() => {});
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe("The hook returns ", () => {
  it(`true if there is no query at the router and the param equals the default language `, async () => {
    mockGet.mockReturnValue(null);
    const { result } = renderHook(() => useLanguageSwitcherIsActive("mock"));
    expect(result.current.isActive).toBe(true);
  });

  it(`false if there is no query at the router and the param does not equal the default language `, async () => {
    mockGet.mockReturnValue(null);
    const { result } = renderHook(() => useLanguageSwitcherIsActive("foo"));
    expect(result.current.isActive).toBe(false);
  });
  it(`true if there is no language (no value) at the query and the param equals the default language `, async () => {
    mockGet.mockReturnValue("");
    const { result } = renderHook(() => useLanguageSwitcherIsActive("mock"));
    expect(result.current.isActive).toBe(true);
  });

  it(`false if there is no language (no value) at the query and the param does not equal the default language `, async () => {
    mockGet.mockReturnValue("");
    const { result } = renderHook(() => useLanguageSwitcherIsActive("foo"));
    expect(result.current.isActive).toBe(false);
  });

  it(`true if the router query equals the param`, async () => {
    mockGet.mockReturnValue("foo");
    const { result } = renderHook(() => useLanguageSwitcherIsActive("foo"));
    expect(result.current.isActive).toBe(true);
  });

  it(`false if the router does not query equals the param`, async () => {
    mockGet.mockReturnValue("foo");
    const { result } = renderHook(() => useLanguageSwitcherIsActive("bar"));
    expect(result.current.isActive).toBe(false);
  });
});
