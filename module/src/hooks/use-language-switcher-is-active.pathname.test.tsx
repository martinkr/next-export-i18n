/**
 * @jest-environment jsdom
 */

import { usePathname, useSearchParams } from "next/navigation";
import { act, cleanup, renderHook } from "@testing-library/react";
import useLanguageSwitcherIsActive from "./use-language-switcher-is-active";

jest.mock("./../../../i18n/index", () => {
  return {
    __esModule: true,
    i18n: {
      translations: { mock: { title: "mock" }, foo: { title: "bar" } },
      languageDataStore: "pathname",
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
const mockUsePathname = usePathname as jest.MockedFunction<any>;

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

describe("The hook returns ", () => {
  it(`true if the pathname matches the default language`, async () => {
    mockUsePathname.mockReturnValue("/mock");
    const { result } = renderHook(() => useLanguageSwitcherIsActive("mock"));
    expect(result.current.isActive).toBe(true);
  });

  it(`false if the pathname does not match the default language`, async () => {
    mockUsePathname.mockReturnValue("/mock");
    const { result } = renderHook(() => useLanguageSwitcherIsActive("foo"));
    expect(result.current.isActive).toBe(false);
  });

  it(`true if the pathname matches the given language`, async () => {
    mockUsePathname.mockReturnValue("/foo");
    const { result } = renderHook(() => useLanguageSwitcherIsActive("foo"));
    expect(result.current.isActive).toBe(true);
  });

  it(`false if the pathname does not match the given language`, async () => {
    mockUsePathname.mockReturnValue("/foo");
    const { result } = renderHook(() => useLanguageSwitcherIsActive("bar"));
    expect(result.current.isActive).toBe(false);
  });

  it(`true if the pathname is empty and matches the default language`, async () => {
    mockUsePathname.mockReturnValue("");
    const { result } = renderHook(() => useLanguageSwitcherIsActive("mock"));
    expect(result.current.isActive).toBe(true);
  });

  it(`false if the pathname is empty and does not match the default language`, async () => {
    mockUsePathname.mockReturnValue("");
    const { result } = renderHook(() => useLanguageSwitcherIsActive("foo"));
    expect(result.current.isActive).toBe(false);
  });
});
    