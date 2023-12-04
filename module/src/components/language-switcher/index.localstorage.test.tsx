/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/extend-expect";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import LanguageSwitcher from "./index";

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
      languageDataStore: "localStorage",
      defaultLang: "mock",
    },
  };
});

jest.mock("next/router", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
    };
  },
}));
const useRouter = jest.spyOn(require("next/router"), "useRouter");
const push = jest.fn();
useRouter.mockImplementation(() => ({ push }));

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
beforeEach(() => {
  useSelectedLanguage.mockImplementation(() => ({
    lang: "mock",
  }));
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
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

describe("The LanguageSwitcher Component is set to use the localStorage and ", () => {
  it("updates the language at localStorage on click", async () => {
    const lang = "languageKey";
    const setItemSpy = jest.spyOn(window.localStorage, "setItem");
    render(<LanguageSwitcher lang={lang} />);
    const component = await screen.findByRole("button", {
      name: `set language to ${lang}`,
    });
    await userEvent.click(component);
    expect(setItemSpy).toHaveBeenCalledWith(langStorageId, lang);
  });

  it("dispatches an event on click", async () => {
    const lang = "languageKey";
    const dispatchEventSpy = jest.spyOn(document, "dispatchEvent");

    render(<LanguageSwitcher lang={lang} />);
    const component = await screen.findByRole("button", {
      name: `set language to ${lang}`,
    });
    await userEvent.click(component);
    expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(Event));
  });

  it(`the dispatched event is an ${eventType} event `, async () => {
    const lang = "languageKey";
    const dispatchEventSpy = jest.spyOn(document, "dispatchEvent");

    render(<LanguageSwitcher lang={lang} />);
    const component = await screen.findByRole("button", {
      name: `set language to ${lang}`,
    });
    await userEvent.click(component);
    expect(dispatchEventSpy.mock.calls[0][0].type).toBe(eventType);
  });
});

describe("The LanguageSwitcher Component is set to use the localStorage and takes the children prop and ", () => {
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

  it("updates the language at localStorage on click", async () => {
    const lang = "languageKey";
    const setItemSpy = jest.spyOn(window.localStorage, "setItem");
    render(
      <LanguageSwitcher lang={lang}>
        <span>
          <span>child</span>
        </span>
      </LanguageSwitcher>
    );
    await act(async () => {
      const component = await screen.findByRole("button", {
        name: `set language to ${lang}`,
      });
      await userEvent.click(component);
    });
    expect(setItemSpy).toHaveBeenCalledWith(langStorageId, lang);
  });

  it("dispatches an event on click", async () => {
    const lang = "languageKey";
    const mySpy = jest.fn();
    const dispatchEventSpy = jest.spyOn(document, "dispatchEvent");

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
    expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(Event));
  });

  it(`the dispatched event is an ${eventType} event `, async () => {
    const lang = "languageKeyShallow";
    const dispatchEventSpy = jest.spyOn(document, "dispatchEvent");

    render(
      <LanguageSwitcher lang={lang} shallow={true}>
        <span>
          <span>child</span>
        </span>
      </LanguageSwitcher>
    );
    const component = await screen.findByRole("button", {
      name: `set language to ${lang}`,
    });
    await userEvent.click(component);
    expect(dispatchEventSpy.mock.calls[0][0].type).toBe(eventType);
  });
});
