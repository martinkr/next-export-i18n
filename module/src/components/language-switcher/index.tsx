
import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import useLanguageQuery from '../../hooks/use-language-query';
import useLanguageSwitcherIsActive from '../../hooks/use-language-switcher-is-active';

type Props = {
	lang: string,
	children?: ReactNode,
	shallow?: boolean,
};
type Dict = { [key: string]: string };

/**
 * Simple component for switching the language.
 * Set the "lang" query parameter on click whie preserves the current query parameters
 * Style it using the
 * - [data-language-switcher]
 * - [data-is-current="true"]
 *  attribute selectors or create your own component.
 * @param lang string the language to switch to. Needs to equal the key in i18n/index.
 * @param [children] React.nodes
 * @param [shallow] enable or disable shallow routing, @see https://nextjs.org/docs/routing/shallow-routing
 */
const LanguageSwitcher = ({ lang, children, shallow=false }: Props) => {

	// state indicating if this component's target language matches the currently selected
	const { isActive: languageSwitcherIsActive } = useLanguageSwitcherIsActive(lang);

	// necessary for updating the router's query parameter inside the click handler
	const router = useRouter();
	const [query] = useLanguageQuery(lang);

	/**
	 * Updates the router with the currently selected language
	 */
	const updateRouter = () => {
		router.push(
			{
				pathname: router.pathname,
				query: query,
			},
			undefined,
			{ shallow: shallow }
		);
	};

	// use React.cloneElement to manipulate properties
	if (React.isValidElement(children)) {
		return React.cloneElement(children, {
			onClick: () => {
				if (
					children &&
					children.props &&
					typeof children.props.onClick === 'function'
				) {
					children.props.onClick();
				}
				// set the language
				updateRouter();
			},
			"data-language-switcher": "true",
			// set the current status
			"data-is-current": languageSwitcherIsActive,
			"role": "button",
			"aria-label": `set language to ${lang}`
		});
	} else {
		return (
			<span
				role="button"
				aria-label={`set language to ${lang}`}
				data-language-switcher="true"
				// set the current status
				data-is-current={languageSwitcherIsActive}
				onClick={() => {
					// set the language
					updateRouter();
				}}
			>
				{children}
			</span>
		);
	}
};

export default LanguageSwitcher;
