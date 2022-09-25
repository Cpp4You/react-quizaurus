import React from "react";
import { QuizSetupContext } from "../../contexts";
import { ComponentAnyProps, QuizStage } from "../../QuizSetup";
import { pick } from "../../helper";

export const defaultTitleComponent = "h1";

export function defaultTitleRenderer(comp: ComponentAnyProps, content: React.ReactNode)
{
	return React.createElement(comp, {}, content); // `content` is passed as children!
}

export interface QuizStageTitleProps {
	stage: QuizStage;
}

export default function QuizStageTitle({ stage }: QuizStageTitleProps) {
	const setup = React.useContext(QuizSetupContext);

	const component	= pick(stage.titleComponent,	setup.titleComponent,	defaultTitleComponent);
	const renderer	= pick(stage.renderTitle,		setup.renderTitle,		defaultTitleRenderer);

	return renderer(component, stage.title);
}


