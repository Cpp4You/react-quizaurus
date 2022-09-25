import React from "react";
import QuizSetup, { ComponentAnyProps } from "../../QuizSetup";

import { QuizSetupContext }	from "../../contexts";

import Choice, {
	toggleChoice
} from "../../Choice";

import styles from "./Quiz.module.scss";
import StagePagination from "../StagePagination";
import { pick } from "../../helper";

export const defaultTitleComponent = "h1";

export function defaultTitleRenderer(comp: ComponentAnyProps, content: React.ReactNode)
{
	return React.createElement(comp, { className: "quizaurus__QuizTitle" }, content);
}

export type TitleRenderer = (comp: ComponentAnyProps, content: React.ReactNode) => JSX.Element;
export interface QuizProps {
	setup: QuizSetup;

	title?: string;
	theme?: "dark" | "light" | "custom";

	titleComponent?: ComponentAnyProps;
	titleRenderer?: TitleRenderer;
}

const themeClasses = {
	"dark":		` ${styles.darkTheme || ""} ${styles.builtinTheme}`,
	"light":	` ${styles.lightTheme || ""} ${styles.builtinTheme}`,
	"custom":	"" // no additional class
};

export default function Quiz(props: QuizProps)
{
	const [choices, setChoices] = React.useState<Choice[]>([]);

	const setup = props.setup;

	React.useEffect(() => {
		const emptyChoices: Choice[] = [];
		for (let i = 0; i < setup.stages.length; ++i)
			emptyChoices.push([]);
		setChoices(emptyChoices);
	}, []);

	const handleOptionToggled = React.useCallback((stageIndex: number, value: string) => {
		if ((setup.stages[stageIndex].maxChoices || 1) > 1)
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
	}, []);

	const titleComponent	= pick(props.titleComponent, defaultTitleComponent);
	const titleRenderer		= pick(props.titleRenderer, defaultTitleRenderer);

	return (
		<div className={"quizaurus__Quiz" + themeClasses[props.theme || "light"]}>
			<QuizSetupContext.Provider value={setup}>
				{titleRenderer(titleComponent, props.title)}
				<StagePagination choices={choices} onOptionToggled={handleOptionToggled} />
			</QuizSetupContext.Provider>
		</div>
	);
}
