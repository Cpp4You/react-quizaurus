import React from "react";
import Option from "../Option";

import styles from "./Quiz.module.scss";

type OptionNode = React.ReactNode;
type OptionCompType<P> = React.FunctionComponent<P> | React.ComponentClass<P> | string;

type OnReplySelectedHandler = (value: string) => void;

type OptionRendererType = (option: OptionType, comp?: OptionCompType<any>, handler?: OnReplySelectedHandler, reply?: Choice) => JSX.Element;

type Choice = string | string[];

export interface OptionType {
	node: OptionNode,
	value: string;
}

export class QuizStage {
	label: React.ReactNode;
	options?: OptionType[];
	maxChoices? = 1;
	optionComponent?: OptionCompType<any> = Option;
	renderOption?: OptionRendererType;
	
	static defaultRenderOptionImpl(option: OptionType, comp?: OptionCompType<any>, onSelected?: OnReplySelectedHandler, choice?: Choice)
	{
		const onSelectedHandler = () => onSelected?.(option.value);

		const isChecked = choice ? (typeof choice === "string" ? choice === option.value : choice.indexOf(option.value) !== -1) : false;

		return React.createElement(comp || Option,
			{
				checked:	isChecked,
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

	const handleOptionToggled = React.useCallback((value: string) => {
		if ((props.setup.stages[ stageIndex ].maxChoices || 1) > 1)
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

	const selectOptionRenderer = (r?: OptionRendererType) => r || QuizStage.defaultRenderOptionImpl;

	const renderStage = (stage: QuizStage) => (
		<div key={stage.label?.toString()} className={styles.QuizStage}>
			<h1>{stage.label}</h1>
			{stage.options?.map(opt => (selectOptionRenderer(stage.renderOption))(opt, stage.optionComponent, handleOptionToggled, choices[stageIndex]))}
			<button onClick={() => setStageIndex(prev => Math.max(0, prev - 1))}>Previous</button>
			<button onClick={() => setStageIndex(prev => Math.min(prev + 1, maxStageIndex))}>Accept</button>
		</div>
	);

	return (
		<div className={styles.QuizContainer}>
			{props.title}
			{renderStage(props.setup.stages[stageIndex])}
		</div>
	);
}