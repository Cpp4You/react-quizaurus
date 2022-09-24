import React from "react";
import QuizSetup, {
	QuizStage,
} from "../../QuizSetup";

import QuizSetupContext		from "../../contexts";
import StageNavigation		from "../StageNavigation";
import QuizStageLayout		from "../StageLayout";

import Choice, {
	toggleChoice
} from "../../Choice";

import styles from "./Quiz.module.scss";


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
	const [currentStageIndex, setStageIndex] = React.useState(0);
	const [choices, setChoices] = React.useState<Choice[]>([]);
	
	const maxStageIndex		= props.setup.stages.length - 1;

	const stageAt			= (index: number) => props.setup.stages[ index ];
	const currentStage		= () => stageAt( currentStageIndex );
	const isResultsStage	= () => currentStageIndex === maxStageIndex + 1;

	const handleOptionToggled = React.useCallback((value: string) => {
		if ((currentStage().maxChoices || 1) > 1)
		{
			setChoices(prev => [
				...prev.slice(0, currentStageIndex),
				toggleChoice(prev[currentStageIndex], value),
				...prev.slice(currentStageIndex + 1)
			]);
		}
		else {
			setChoices(prev => [
				...prev.slice(0, currentStageIndex),
				value,
				...prev.slice(currentStageIndex + 1)
			]);
		}
	}, [currentStageIndex]);

	const previousStage = () => {
		return setStageIndex(prev => Math.max(0, prev - 1));
	};

	const advanceStage = () => {
		setStageIndex(prev => Math.min(prev + 1, maxStageIndex + 1));
	};

	const isAnyChoiceSelected = (choice: Choice) => {
		if (Array.isArray(choice))
			return choice.length > 0;
		return !!choice; // non-empty string
	};

	const renderSingleStage = (stage: QuizStage, index: number) => (
		<QuizStageLayout
			key={index}
			stage={stage}
			choice={choices[index]}
			onOptionToggled={handleOptionToggled}
			navigationButtons={
				<StageNavigation
					isLastStage={index === maxStageIndex}
					allowNext={isAnyChoiceSelected(choices[index])}
					onNextClicked={advanceStage}
					onPreviousClicked={previousStage}
				/>
			}
		/>
	);

	const renderResults = () => {
		return (
			<>
				<div>Results:</div>
				{props.setup.stages.map((stage, idx) => (
					<QuizStageLayout
						key={idx}
						stage={stage}
						isResultsPage={true}
						choice={choices[idx]}
						onOptionToggled={handleOptionToggled}
					/>
				))}
			</>
		);
	};

	
	return (
		<div className={styles.QuizContainer}>
			<QuizSetupContext.Provider value={props.setup}>
				{props.title}
				{isResultsStage()
					?
					renderResults()
					:
					renderSingleStage(currentStage(), currentStageIndex)
				}
			</QuizSetupContext.Provider>
		</div>
	);
}