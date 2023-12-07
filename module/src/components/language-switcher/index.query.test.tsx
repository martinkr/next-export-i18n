/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/extend-expect";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import LanguageSwitcher from "./index";
import { useSearchParams, useRouter } from "next/navigation";

jest.mock("../../../../i18n/index", () => {
  return {
    __esModule: true,
    i18n: {
      translations: {
        mock: {
          string: "mock",
          arr: [1, 2, 3],
          obj: { key: "valueMock" },
          levelOne: { levelOneString: "levelOneMock" },
        },
      },
      languageDataStore: "query",
      defaultLang: "mock",
    },
  };
});

jest.mock("next/navigation");

const mockUseRouter = useRouter as jest.MockedFunction<any>;
const mockPush = jest.fn();

mockUseRouter.mockReturnValue({
  push: mockPush,
});

const mockUseSearchParams = useSearchParams as jest.MockedFunction<any>;
const mockGet = jest.fn();
const mockToString = jest.fn();

mockUseSearchParams.mockReturnValue({
  get: mockGet,
  toString: mockToString,
});

jest.mock("../../hooks/use-selected-language", () => {
  return {
    __esModule: true,
    default: () => {},
  };
});

const useSelectedLanguage = jest.spyOn(
  require("../../hooks/use-selected-language"),
  "default"
);
const pathname = "undefined";

beforeEach(() => {
  useSelectedLanguage.mockImplementation(() => ({
    lang: "mock",
  }));
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe("The LanguageSwitcher Component ", () => {
  it("is rendered to the document", async () => {
    const lang = "languageKey";
    render(<LanguageSwitcher lang={lang} />);
    const component = await screen.findByRole("button", {
      name: `set language to ${lang}`,
    });
    expect(component).toBeInTheDocument();
  });
});

describe("The LanguageSwitcher Component is set to use the query and ", () => {
  it("updates the language param with the passed param on click", async () => {
    const lang = "languageKey";
    render(<LanguageSwitcher lang={lang} />);
    const component = await screen.findByRole("button", {
      name: `set language to ${lang}`,
    });
    await userEvent.click(component);
    expect(mockPush).toHaveBeenCalledWith(`${pathname}?lang=${lang}`);
  });
});

describe("The LanguageSwitcher Component is set to use the query and takes the children prop and ", () => {
  it("is rendered to the document", async () => {
    const lang = "languageKey";
    render(
      <LanguageSwitcher lang={lang}>
        <span>
          <span>child</span>
        </span>
      </LanguageSwitcher>
    );
    const component = await screen.findByRole("button", {
      name: `set language to ${lang}`,
    });
    expect(component).toContainElement(screen.queryByText("child"));
  });

  it("updates the language param with the passed param on click", async () => {
    const lang = "languageKey";
    render(
      <LanguageSwitcher lang={lang}>
        <span>
          <span>child</span>
        </span>
      </LanguageSwitcher>
    );
    const component = await screen.findByRole("button", {
      name: `set language to ${lang}`,
    });
    await userEvent.click(component);
    expect(mockPush).toHaveBeenCalledWith(`${pathname}?lang=${lang}`);
  });

  it("updates the language param with the passed param on click and preserves an onClick handler", async () => {
    const lang = "languageKey";
    const mySpy = jest.fn();
    render(
      <LanguageSwitcher lang={lang}>
        <span onClick={() => mySpy()}>
          <span>child</span>
        </span>
      </LanguageSwitcher>
    );
    const component = await screen.findByRole("button", {
      name: `set language to ${lang}`,
    });
    await userEvent.click(component);
    expect(mySpy).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(`${pathname}?lang=${lang}`);
  });
});
