import React from "react";
import QuizSetup, { ComponentAnyProps } from "../../QuizSetup";

import { QuizSetupContext }	from "../../contexts";

import Choice, {
	defaultOptionTransformer,
	defaultScoreEvaluator,
	toggleChoice
} from "../../Choice";

import styles from "./Quiz.module.scss";
import StagePagination from "../StagePagination";
import { pick } from "../../helper";

export const defaultTitleComponent = "h1";
export const defaultDescComponent = "p";

export function defaultTitleRenderer(comp: ComponentAnyProps, content: React.ReactNode)
{
	return React.createElement(comp, { className: "quizaurus__QuizTitle" }, content);
}

export function defaultDescRenderer(comp: ComponentAnyProps, content: React.ReactNode)
{
	return React.createElement(comp, { className: "quizaurus__QuizDescription" }, content);
}

export type TitleRenderer = (comp: ComponentAnyProps, content: React.ReactNode) => JSX.Element;
export type DescRenderer = (comp: ComponentAnyProps, content: React.ReactNode) => JSX.Element;
export interface QuizProps {
	setup: QuizSetup;

	title?: React.ReactNode;
	desc?: React.ReactNode;
	theme?: "dark" | "light" | "custom";

	titleComponent?: ComponentAnyProps;
	titleRenderer?: TitleRenderer;

	descComponent?: ComponentAnyProps;
	descRenderer?: DescRenderer;
}

const themeClasses = {
	"dark":		` ${styles.darkTheme || ""} ${styles.builtinTheme}`,
	"light":	` ${styles.lightTheme || ""} ${styles.builtinTheme}`,
	"custom":	"" // no additional class
};

const generateEmptyChoiceArray = (count: number) => {
	const emptyChoices: Choice[] = [];
	for (let i = 0; i < count; ++i)
		emptyChoices.push([]);
	return emptyChoices;
};

export default function Quiz(props: QuizProps)
{
	const setup = props.setup;

	const [choices, setChoices] = React.useState<Choice[]>( generateEmptyChoiceArray(setup.stages.length) );
	const [score, setScore] = React.useState<[number, number] | undefined>(undefined);

	const handleOptionToggled = React.useCallback((stageIndex: number, value: string) => {
		const stage			= setup.stages[stageIndex];
		const max			= (stage.maxAnswers || 1);
		const canDeselect	= pick(stage.instantFeedback, setup.instantFeedback, false) !== true;

		setChoices(prev => [
			...prev.slice(0, stageIndex),
			toggleChoice(prev[stageIndex], value, max, canDeselect),
			...prev.slice(stageIndex + 1)
		]);
	}, []);

	const calculateScore = (): [number, number] => {
		let score = 0;
		let maxScore = 0;
		for (let sid = 0; sid < setup.stages.length; ++sid) {
			const stage = setup.stages[sid];

			const scoreOf = (value: string) => (stage.options?.find(elem => elem.value === value)?.score || 1);

			const scoreSetup		= pick(stage.score, setup.score, {});
			const scoreEvaluator	= pick(stage.scoreEvaluator, setup.scoreEvaluator, defaultScoreEvaluator);
			const optionTransformer	= pick(stage.optionTransformer, setup.optionTransformer, defaultOptionTransformer);

			let stageScore			= scoreEvaluator(scoreSetup, choices[sid], stage.correctAnswer, optionTransformer, scoreOf);
			const expected			= Array.isArray(stage.correctAnswer) ? stage.correctAnswer : [stage.correctAnswer];
			let stageMaxScore		= (expected as string[]).reduce<number>((prev, curr) => prev + scoreOf(curr), 0);

			if (stage.remapScore !== undefined)
			{
				stageScore = stageScore / stageMaxScore * stage.remapScore;
				stageMaxScore = stage.remapScore;
			}

			score += stageScore;
			maxScore += stageMaxScore;
		}
		return [score, maxScore];
	};

	const handleFinished = React.useCallback(() => {
		setScore(calculateScore());
	}, [choices]);

	const titleComponent	= pick(props.titleComponent, defaultTitleComponent);
	const titleRenderer		= pick(props.titleRenderer, defaultTitleRenderer);

	const descComponent		= pick(props.descComponent, defaultDescComponent);
	const descRenderer		= pick(props.descRenderer, defaultDescRenderer);

	return (
		<div className={"quizaurus__Quiz" + themeClasses[props.theme || "light"]}>
			<QuizSetupContext.Provider value={setup}>
				{props.title !== undefined && titleRenderer(titleComponent, props.title)}
				{props.desc !== undefined && descRenderer(descComponent, props.desc)}
				{score && `You scored ${score[0]} out of ${score[1]}`}
				<StagePagination choices={choices} onOptionToggled={handleOptionToggled} onFinished={handleFinished}/>
			</QuizSetupContext.Provider>
		</div>
	);
}
