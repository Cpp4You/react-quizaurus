import React from "react";
import { pick } from "../../helper";
import { ComponentAnyProps } from "../../QuizSetup";

export const defaultNavButtonComponent	= "button";

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

	const renderer	= pick(defaultNavButtonRenderer);
	const component	= pick(defaultNavButtonComponent);

	return (
		<>
			{renderer(component, "Previous", {
				onClick: onPreviousClicked,
				disabled: !allowPrevious
			})}
			{renderer(component, isLastStage ? "Show results" : "Next question", {
				onClick: onNextClicked,
				disabled: !allowNext
			})}
		</>
	);
}