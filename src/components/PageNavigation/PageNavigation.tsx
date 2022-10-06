import React from "react";
import { QuizSetupContext } from "../../contexts";
import { pick } from "../../helper";
import { ComponentAnyProps } from "../../QuizSetup";
import NavigationButton from "../NavigationButton";

export const defaultNavButtonComponent = NavigationButton;

export function defaultNavButtonRenderer(comp: ComponentAnyProps, content: React.ReactNode, props?: React.ComponentProps<"button">)
{
	return React.createElement(comp, props, content); // `content` is passed as children!
}


export interface PageNavigationProps {

	allowNext?: boolean;
	allowPrevious?: boolean;
	isLastStage?: boolean;

	onPreviousClicked: () => void;
	onNextClicked: () => void;
}

export default function PageNavigation({
	allowNext,
	allowPrevious,
	isLastStage,
	onPreviousClicked,
	onNextClicked
}: PageNavigationProps)
{

	const context = React.useContext(QuizSetupContext);

	const navigation = context.navigation;

	const renderer	= pick(defaultNavButtonRenderer);
	const component	= pick(defaultNavButtonComponent);

	return (
		<>
			{renderer(
				component,
				pick(navigation?.prev, "Previous"),
				{
					onClick: onPreviousClicked,
					disabled: !allowPrevious
				})}
			{renderer(
				component,
				isLastStage ?
					pick(navigation?.results, "Show results")
					:
					pick(navigation?.next, "Next"),
				{
					onClick: onNextClicked,
					disabled: !allowNext
				})}
		</>
	);
}
