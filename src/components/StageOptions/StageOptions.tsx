import React from "react";
import Choice, { defaultChoiceTransformer, defaultChoiceValidator } from "../../Choice";
import { QuizSetupContext } from "../../contexts";
import { QuizStage } from "../../QuizSetup";
import { defaultOptionComponent, defaultOptionRenderer } from "../Option";
import { pick } from "../../helper";

export interface StageOptionsProps {
	stage: QuizStage;
	isResultsPage?: boolean;
	choice: Choice;
	onOptionToggled?: (value: string) => void;
}

export default function StageOptions({ stage, choice, isResultsPage, onOptionToggled }: StageOptionsProps) {

	const setup = React.useContext(QuizSetupContext);

	const component		= pick(stage.optionComponent,	setup.optionComponent,		defaultOptionComponent);
	const renderer		= pick(stage.renderOption,		setup.renderOption,			defaultOptionRenderer);
	const transformer	= pick(stage.choiceTransformer,	setup.choiceTransformer,	defaultChoiceTransformer);
	const validator		= pick(stage.validator,			setup.validator,			defaultChoiceValidator);

	const validatorWrapper = (choice: Choice) => validator(choice, stage.correctAnswer, transformer);

	return (
		<>
			{stage.options?.map(opt => (
				renderer(
					component,
					opt,
					choice,
					isResultsPage ? undefined : onOptionToggled,
					isResultsPage ? validatorWrapper : undefined
				)))
			}
		</>
	);
}
