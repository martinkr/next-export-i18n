/**
 * @jest-environment jsdom
 */
import { useSearchParams, useRouter } from "next/navigation";
import { cleanup, renderHook } from "@testing-library/react";
import useSelectedLanguage from "./use-selected-language";
import useLanguageQuery from "./use-language-query";

jest.mock("./../../../i18n/index", () => {
  return {
    __esModule: true,
    i18n: {
      translations: { mock: { title: "mock" }, foo: { title: "bar" } },
      defaultLang: "mock",
    },
  };
});

jest.mock("next/navigation");

const mockUseSearchParams = useSearchParams as jest.MockedFunction<any>;
const mockUseRouter = useRouter as jest.MockedFunction<any>;
const mockGet = jest.fn();
const mockEntries = jest.fn((arg) => console.log("MOCKENTRIES", arg));

mockUseSearchParams.mockReturnValue({
  get: mockGet,
  entries: mockEntries,
});

jest.mock("./use-selected-language");
const mockUseSelectedLanguage = useSelectedLanguage as jest.MockedFunction<any>;

beforeEach(() => {
  mockUseSelectedLanguage.mockImplementation(() => ({
    lang: "mock",
  }));
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe("The hook returns ", () => {
  it.only(`the query object with lang = forceLang if forceLang is passed `, async () => {
    const expectation = [
      {
        bar: "baz",
        lang: "forced",
      },
    ];
    const routerReturn = {
      query: { bar: "baz", lang: "foo" },
    };
    // router.push(`${pathname}?${createQueryString("lang", lang)}`);

    mockUseRouter.mockImplementation(() => routerReturn);
    mockUseSelectedLanguage.mockImplementation(() => ({
      lang: "bar",
    }));

    const { result } = renderHook(() => useLanguageQuery("forced"));
    expect(result.current).toEqual(expectation);
  });

  it(`the query object with lang = selectedLanguage if no forceLang is passed and selectedLanguage is present`, async () => {
    const expectation = [
      {
        bar: "baz",
        lang: "bar",
      },
    ];
    const routerReturn = {
      query: { bar: "baz", lang: "foo" },
    };
    mockUseRouter.mockImplementation(() => routerReturn);
    mockUseSelectedLanguage.mockImplementation(() => ({
      lang: "bar",
    }));

    const { result } = renderHook(() => useLanguageQuery());
    expect(result.current).toEqual(expectation);
  });

  it(`the query object with lang = lang if no forceLang is passed and no selectedLanguage is present`, async () => {
    const expectation = [
      {
        bar: "baz",
        lang: "foo",
      },
    ];
    const routerReturn = {
      query: { bar: "baz", lang: "foo" },
    };
    mockUseRouter.mockImplementation(() => routerReturn);
    mockUseSelectedLanguage.mockImplementation(() => ({
      lang: "",
    }));

    const { result } = renderHook(() => useLanguageQuery());
    expect(result.current).toEqual(expectation);
  });

  it(`an empty object if there is no query`, async () => {
    const expectation = [{}];
    const routerReturn = {
      query: null,
    };
    mockUseRouter.mockImplementation(() => routerReturn);
    mockUseSelectedLanguage.mockImplementation(() => ({
      lang: "",
    }));

    const { result } = renderHook(() => useLanguageQuery());
    expect(result.current).toEqual(expectation);
  });

  it(`updates the query object if route changes`, async () => {
    const expectation = [{}];
    const routerReturn = {
      query: null,
    };
    mockUseRouter.mockImplementation(() => routerReturn);
    mockUseSelectedLanguage.mockImplementation(() => ({
      lang: "",
    }));

    const { result, rerender } = renderHook(() => useLanguageQuery());
    expect(result.current).toEqual(expectation);

    const newQuery = {
      id: "foo",
      lang: "en",
    };
    mockUseRouter.mockImplementation(() => ({ query: newQuery }));

    // hook rerenders when route changes and query object is updated
    rerender();

    const expectation2 = [
      {
        id: "foo",
        lang: "en",
      },
    ];
    expect(result.current).toEqual(expectation2);
  });
});
//
