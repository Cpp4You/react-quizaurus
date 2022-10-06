import React from "react";

import { QuizSetupContext } from "../../contexts";

import "./NavigationButton.module.scss";


export interface NavigationButtonProps
	extends React.ComponentProps<"button">
{
	children: React.ReactNode;
}

export default function NavigationButton(props: NavigationButtonProps)
{
	const context = React.useContext(QuizSetupContext);

	return (
		<button className="quizaurus__NavigationButton" {...props} />
	);
}
