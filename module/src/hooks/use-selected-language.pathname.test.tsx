/**
 * @jest-environment jsdom
 */
import { usePathname, useSearchParams } from "next/navigation";
import { cleanup, renderHook } from "@testing-library/react";
import useSelectedLanguage from "./use-selected-language";

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

describe("With pathname, the hook returns ", () => {
  it(`the default language if the pathname is empty`, async () => {
    mockUsePathname.mockReturnValue("");
    const { result } = renderHook(() => useSelectedLanguage());
    expect(result.current.lang).toBe("mock");
  });

  it(`the language from the pathname`, async () => {
    mockUsePathname.mockReturnValue("/foo");
    const { result } = renderHook(() => useSelectedLanguage());
    expect(result.current.lang).toBe("foo");
  });

  it(`the updated language if the pathname changes`, async () => {
    mockUsePathname.mockReturnValue("/foo");
    const { result: firstResult } = renderHook(() => useSelectedLanguage());
    expect(firstResult.current.lang).toBe("foo");

    mockUsePathname.mockReturnValue("/bar");
    const { result } = renderHook(() => useSelectedLanguage());
    expect(result.current.lang).toBe("mock");
  });

  it(`the default language if the pathname does not match any language`, async () => {
    mockUsePathname.mockReturnValue("/unknown");
    const { result } = renderHook(() => useSelectedLanguage());
    expect(result.current.lang).toBe("mock");
  });
});
