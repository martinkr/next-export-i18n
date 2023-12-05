/**
 * @jest-environment jsdom
 */
import { cleanup, renderHook } from '@testing-library/react';
import { useTranslation } from './use-translation';

// import useSelectedLanguage from './use-selected-language';

jest.mock('./../../../i18n/index', () => {
	return {
		__esModule: true,
		i18n: {
			translations: {
				mock: {
					template: '{{count}} times',
					string: 'mock',
					arr: [1, 2, 3],
					obj: { key: 'valueMock' },
					levelOne: { levelOneString: 'levelOneMock' },
				},
			},
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

jest.mock('./use-selected-language', () => {
	return {
		__esModule: true,
		default: () => { },
	};
});

const useSelectedLanguage = jest.spyOn(
	require('./use-selected-language'),
	'default'
);

beforeEach(() => {
	useSelectedLanguage.mockImplementation(() => ({
		lang: 'mock',
	}));
});

afterEach(() => {
	cleanup();
	jest.clearAllMocks();
});

describe('The hook exports a function ', () => {
	it(`t() `, async () => {
		const { result } = renderHook(() => useTranslation());
		expect(result.current.t).toBeInstanceOf(Function);
	});

	it(`t() which returns a string interpolated with a template `, async () => {
		const key = 'template';
		const expectation = '2 times';
		const { result } = renderHook(() => useTranslation());
		expect(result.current.t(key, { count: 2 })).toEqual(expectation);
	});

	it(`t() which returns the value for a simple key based on the language`, async () => {
		const key = 'string';
		const expectation = 'mock';
		const { result } = renderHook(() => useTranslation());
		expect(result.current.t(key)).toEqual(expectation);
	});

	it(`t() which returns the value for a multilevel key based on the langage`, async () => {
		const key = 'levelOne.levelOneString';
		const expectation = 'levelOneMock';
		const { result } = renderHook(() => useTranslation());
		expect(result.current.t(key)).toEqual(expectation);
	});

	it(`t() which returns the value (array) for a simple key based on the langage`, async () => {
		const key = 'arr';
		const expectation = [1, 2, 3];
		const { result } = renderHook(() => useTranslation());
		expect(result.current.t(key)).toEqual(expectation);
	});

	it(`t() which returns the value (obj) for a simple key based on the langage`, async () => {
		const key = 'obj';
		const expectation = { key: 'valueMock' };
		const { result } = renderHook(() => useTranslation());
		expect(result.current.t(key)).toEqual(expectation);
	});

	it(`t() which returns the key if there is no enty for this key`, async () => {
		const key = 'invalid.key';
		const expectation = key;
		const { result } = renderHook(() => useTranslation());
		expect(result.current.t(key)).toEqual(expectation);
	});
});

describe('The hook returns ', () => {
	it(`the query object with lang = forceLang if forceLang is passed `, async () => {
		const expectation = [
			{
				bar: 'baz',
				lang: 'forced',
			},
		];
		useRouter.mockImplementation(() => ({
			query: { bar: 'baz', lang: 'foo' },
		}));
		useSelectedLanguage.mockImplementation(() => ({
			lang: 'bar',
		}));
	});
});
