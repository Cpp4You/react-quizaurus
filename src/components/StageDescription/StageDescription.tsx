import React from "react";
import { QuizSetupContext } from "../../contexts";
import { ComponentAnyProps, QuizStage } from "../../QuizSetup";
import { pick } from "../../helper";

export const defaultStageDescComponent = "p";

export function defaultStageDescRenderer(comp: ComponentAnyProps, content: React.ReactNode)
{
	return React.createElement(comp, {}, content); // `content` is passed as children!
}

export interface StageDescProps {
	stage: QuizStage;
}

export default function StageDescription
({ stage }: StageDescProps) {
	const setup = React.useContext(QuizSetupContext);

	const component	= pick(stage.descComponent,		setup.descComponent,	defaultStageDescComponent);
	const renderer	= pick(stage.renderStageDesc,	setup.renderStageDesc,	defaultStageDescRenderer);

	return renderer(component, stage.desc);
}


