/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/extend-expect";
import { act, cleanup, render, screen } from "@testing-library/react";
import React from "react";
import LinkWithLocale from "./index";

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
  jest.clearAllMocks();
});
const location = "location";

describe("The LinkWithLocale Component is set to use the localStorage and ", () => {
  it("is rendered to the document", async () => {
    render(
      <LinkWithLocale href={`${location}`}>
        {`link to ${location}`}
      </LinkWithLocale>
    );
    const component = await screen.findByRole("link", {
      name: `link to ${location}`,
    });
    expect(component).toBeInTheDocument();
  });

  it("preserves passed search parameters", async () => {
    render(
      <LinkWithLocale href={`${location}?foo=bar&bar=baz`}>
        {`link to ${location}`}
      </LinkWithLocale>
    );
    const component = await screen.findByRole("link", {
      name: `link to location`,
    });
    expect(component.getAttribute("href")).toContain(`foo=bar`);
    expect(component.getAttribute("href")).toContain(`bar=baz`);
  });

  it("the component automatically adds the currently selected lang as a search parameter to the href", async () => {
    render(
      <LinkWithLocale href={`${location}`}>
        {`link to ${location}`}
      </LinkWithLocale>
    );
    const component = await screen.findByRole("link", {
      name: `link to location`,
    });
    expect(component.getAttribute("href")).toContain(`lang=mock`);
  });

  it("the component automatically adds the currently selected lang as a search parameter to the href and preserves existing parameters", async () => {
    render(
      <LinkWithLocale href={`${location}?foo=bar&bar=baz`}>
        {`link to ${location}`}
      </LinkWithLocale>
    );
    const component = await screen.findByRole("link", {
      name: `link to location`,
    });
    expect(component.getAttribute("href")).toContain(`foo=bar`);
    expect(component.getAttribute("href")).toContain(`bar=baz`);
    expect(component.getAttribute("href")).toContain(`lang=mock`);
  });
});
