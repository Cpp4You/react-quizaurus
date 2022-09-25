import React from "react";
import Choice, { defaultOptionTransformer, defaultOptionValidator } from "../../Choice";
import { QuizSetupContext } from "../../contexts";
import { QuizStage } from "../../QuizSetup";
import { defaultOptionComponent, defaultOptionRenderer } from "../Option";
import { pick } from "../../helper";

export interface StageOptionsProps {
	stage: QuizStage;
	verifyOption?: boolean;
	revealCorrect?: boolean;
	choice: Choice;
	onOptionToggled?: (value: string) => void;
}

export default function StageOptions({
	stage,
	choice,
	verifyOption,
	revealCorrect,
	onOptionToggled
}: StageOptionsProps) {

	const setup = React.useContext(QuizSetupContext);

	const component		= pick(stage.optionComponent,	setup.optionComponent,		defaultOptionComponent);
	const renderer		= pick(stage.renderOption,		setup.renderOption,			defaultOptionRenderer);
	const transformer	= pick(stage.optionTransformer,	setup.optionTransformer,	defaultOptionTransformer);
	const validator		= pick(stage.validator,			setup.validator,			defaultOptionValidator);

	return (
		<>
			{stage.options?.map(option => {
				const selected = choice ? choice.indexOf(option.value) !== -1 : false;
				const validateResult = validator(option.value, stage.correctAnswer, transformer);

				let correct;
				if (revealCorrect && validateResult)
					correct = true;
				else if (selected && verifyOption)
					correct = validateResult;

				return renderer(
					component,
					option,
					selected,
					correct,
					onOptionToggled
				);
			})}
		</>
	);
}
