import React from "react";
import Option from "../Option";

import styles from "./Quiz.module.scss";

type OptionNode = React.ReactNode;
type OptionCompType<P> = React.FunctionComponent<P> | React.ComponentClass<P> | string;

type OnReplySelectedHandler = (value: string) => void;

type ChoiceValidator = (choice: Choice, expected: Choice | any) => boolean;
type ChoiceValidatorAuto = (choice: Choice) => boolean;

type OptionRendererType = (option: OptionType, comp?: OptionCompType<any>, handler?: OnReplySelectedHandler, reply?: Choice, validate?: ChoiceValidator) => JSX.Element;

type Choice = string | string[];


export function defaultChoiceValidator(choice: Choice, expected: Choice | any): boolean {
	if (typeof choice === "string") {
		return choice === expected;
	}

	if (Array.isArray(expected)) {
		// NOTE: assumes that `choice` and `expected` contains unique values
		return choice.length === expected.length && choice.every(e => expected.includes(e));
	}

	return choice.length === 1 && choice[0] === expected;
}

export interface OptionType {
	node: OptionNode,
	value: string;
}

export class QuizStage {
	label:				React.ReactNode;
	options?:			OptionType[];
	correctAnswer:		unknown;
	validator?:			ChoiceValidator = defaultChoiceValidator;
	maxChoices?			= 1;
	optionComponent?:	OptionCompType<any> = Option;
	renderOption?:		OptionRendererType;
	
	static defaultOptionRenderer(option: OptionType, comp?: OptionCompType<any>, onSelected?: OnReplySelectedHandler, choice?: Choice, validate?: ChoiceValidatorAuto)
	{
		const onSelectedHandler = () => onSelected?.(option.value);

		const isChecked = choice ? (typeof choice === "string" ? choice === option.value : choice.indexOf(option.value) !== -1) : false;
		let valid;
		if (validate && choice) {
			valid = validate(option.value);

			if (!valid && !isChecked)
				valid = undefined;
		}

		return React.createElement(comp || Option,
			{
				checked:	valid === undefined ? isChecked : undefined,
				valid:		valid,
				value:		option.value,
				onSelected:	onSelectedHandler
			}, option.node);
	}
}

export interface QuizSetup {
	stages: QuizStage[];
}

export interface QuizProps {
	title?: string;
	setup: QuizSetup;
}

function toggleChoice(prev: Choice, value: string) {
	if (typeof prev === "string") {
		if (prev === value)
			return [] as Choice;

		else
			return [prev, value];
	}
	else if (Array.isArray(prev)) {
		const idx = prev.indexOf(value);
		if (idx === -1)
			return [...prev, value];

		else
			return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
	}

	else
		return [value];
}

export default function Quiz(props: QuizProps)
{
	const maxStageIndex = props.setup.stages.length - 1;

	const [stageIndex, setStageIndex] = React.useState(0);
	const [choices, setChoices] = React.useState<Choice[]>([]);

	const stageAt = (index: number) => props.setup.stages[ index ];
	const currentStage = () => stageAt( stageIndex );
	const isLastStage = () => stageIndex === maxStageIndex;
	const isResultsStage = () => stageIndex === maxStageIndex + 1;

	const handleOptionToggled = React.useCallback((value: string) => {
		if ((currentStage().maxChoices || 1) > 1)
		{
			setChoices(prev => [
				...prev.slice(0, stageIndex),
				toggleChoice(prev[stageIndex], value),
				...prev.slice(stageIndex + 1)
			]);
		}
		else {
			setChoices(prev => [
				...prev.slice(0, stageIndex),
				value,
				...prev.slice(stageIndex + 1)
			]);
		}
	}, [stageIndex]);

	const selectOptionRenderer = (r?: OptionRendererType) => r || QuizStage.defaultOptionRenderer;

	const previousStage = () => {
		return setStageIndex(prev => Math.max(0, prev - 1));
	};

	const advanceStage = () => {
		setStageIndex(prev => Math.min(prev + 1, maxStageIndex + 1));
	};

	const renderResults = () => {
		return (
			<>
				<div>Results:</div>
				{props.setup.stages.map((stage, idx) => renderStage(stage, idx, false, true))}
			</>
		);
	};

	const choiceValidator = (idx: number) => ( (choice: Choice) => (stageAt(idx).validator || defaultChoiceValidator)(choice, stageAt(idx).correctAnswer) );

	const anyChoiceSelected = (index: number) => {
		if (Array.isArray(choices[index]))
			return choices[index].length > 0;
		return choices[index]; // non-empty string
	};

	const renderStage = (stage: QuizStage, index: number, buttons = true, results = false) => (
		<div key={stage.label?.toString()} className={styles.QuizStage}>
			<h1>{stage.label}</h1>
			{stage.options?.map(opt => (selectOptionRenderer(stage.renderOption))(
				opt,
				stage.optionComponent,
				handleOptionToggled,
				choices[index],
				results ? choiceValidator(index) : undefined
			))}
			{buttons && (<>
				<button onClick={previousStage}>Previous</button>
				<button onClick={advanceStage} disabled={!anyChoiceSelected(index)}>
					{isLastStage() ? "Show results" : "Next question"}
				</button>
			</>)}
		</div>
	);

	return (
		<div className={styles.QuizContainer}>
			{props.title}
			{isResultsStage() ? renderResults() : renderStage(props.setup.stages[stageIndex], stageIndex)}
		</div>
	);
}