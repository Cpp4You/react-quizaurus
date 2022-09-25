import React from "react";
import QuizSetup, {
	QuizStage,
} from "../../QuizSetup";

import { QuizSetupContext }	from "../../contexts";
import StageNavigation		from "../StageNavigation";
import QuizStageLayout		from "../StageLayout";
import QuizResults			from "../Results";

import Choice, {
	toggleChoice
} from "../../Choice";

import styles from "./Quiz.module.scss";
import StagePagination from "../StagePagination";


////////////////////////////////////////////////////////////////////////
/// Defaults
////////////////////////////////////////////////////////////////////////

// Default components:

export interface QuizProps {
	title?: string;
	setup: QuizSetup;
}

export default function Quiz(props: QuizProps)
{
	const [choices, setChoices] = React.useState<Choice[]>([]);
	
	const handleOptionToggled = React.useCallback((stageIndex: number, value: string) => {
		if ((props.setup.stages[stageIndex].maxChoices || 1) > 1)
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


	return (
		<div className={styles.QuizContainer}>
			<QuizSetupContext.Provider value={props.setup}>
				{props.title}
				<StagePagination choices={choices} onOptionToggled={handleOptionToggled} />
			</QuizSetupContext.Provider>
		</div>
	);
}