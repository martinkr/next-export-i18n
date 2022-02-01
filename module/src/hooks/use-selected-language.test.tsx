/**
 * @jest-environment jsdom
 */
// import { renderHook, act } from '@testing-library/react-hooks';
import { cleanup } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks/dom'; // will use react-dom
import useSelectedLanguage from './use-selected-language';



jest.mock('./../../../i18n/index', () => {
	return {
		__esModule: true,
		i18n: {
			translations: { mock: { title: 'mock' }, foo: { title: 'bar' } },
			defaultLang: 'mock',
		},
	};
});

jest.mock('next/router', () => ({
	useRouter() {
		return {
			route: '/',
			pathname: '',
			query: '',
			asPath: '',
		};
	},
}));

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

beforeEach(() => { });

afterEach(() => {
	cleanup();
	jest.clearAllMocks();
});

describe('The hook returns ', () => {
	it(`the default language if there is no router query object  `, async () => {
		useRouter.mockImplementation(() => ({
			query: {},
		}));
		const { result } = renderHook(() => useSelectedLanguage());
		expect(result.current.lang).toBe('mock');
	});

	it(`the language from the router query object  `, async () => {
		useRouter.mockImplementation(() => ({
			query: { lang: 'foo' },
		}));
		const { result } = renderHook(() => useSelectedLanguage());
		expect(result.current.lang).toBe('foo');
	});

	it(`the updated language if the router query object changes`, async () => {
		useRouter.mockImplementation(() => ({
			query: { lang: 'foo' },
		}));
		const { result: firstResult } = renderHook(() => useSelectedLanguage());
		expect(firstResult.current.lang).toBe('foo');

		useRouter.mockImplementation(() => ({
			query: { lang: 'bar' },
		}));
		const { result } = renderHook(() => useSelectedLanguage());
		expect(result.current.lang).toBe('mock');
	});
});
