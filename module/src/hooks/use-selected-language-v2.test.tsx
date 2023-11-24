/**
 * @jest-environment jsdom
 */
import { useSearchParams } from 'next/navigation';
import { cleanup, renderHook } from '@testing-library/react';
import useSelectedLanguageV2 from './use-selected-language-v2';

jest.mock('./../../../i18n/index', () => {
	return {
		__esModule: true,
		i18n: {
			translations: { mock: { title: 'mock' }, foo: { title: 'bar' } },
			defaultLang: 'mock',
		},
	};
});

jest.mock('next/navigation');

const mockUseSearchParams = useSearchParams as jest.MockedFunction<any>;
const mockGet = jest.fn();

mockUseSearchParams.mockReturnValue({
	get: mockGet
})

beforeEach(() => { });

afterEach(() => {
	cleanup();
	jest.clearAllMocks();
});

describe('The hook returns ', () => {
	it(`the default language if there is no router query object  `, async () => {
		mockGet.mockReturnValue(null);
		const { result } = renderHook(() => useSelectedLanguageV2());
		expect(result.current.lang).toBe('mock');
	});

	it(`the language from the router query object  `, async () => {
		mockGet.mockReturnValue('foo');
		const { result } = renderHook(() => useSelectedLanguageV2());
		expect(result.current.lang).toBe('foo');
	});

	it(`the updated language if the router query object changes`, async () => {
		mockGet.mockReturnValue('foo');
		const { result: firstResult } = renderHook(() => useSelectedLanguageV2());
		expect(firstResult.current.lang).toBe('foo');

		mockGet.mockReturnValue('bar');
		const { result } = renderHook(() => useSelectedLanguageV2());
		expect(result.current.lang).toBe('mock');
	});
});
