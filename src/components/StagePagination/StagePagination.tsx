import React				from "react";
import Choice				from "../../Choice";
import StageLayout			from "../StageLayout";
import PageNavigation		from "../PageNavigation";

import { QuizSetupContext }	from "../../contexts";
import { pick } from "../../helper";
import { QuizStage } from "../../QuizSetup";

export interface StagePaginationProps {
	choices: Choice[];
	onOptionToggled?: (stageIndex: number, value: string) => void;
	onFinished?: () => void;
}

export default function StagePagination({ choices, onOptionToggled, onFinished }: StagePaginationProps) {
	const [page, setPage] = React.useState(0);
	const [showResults, setShowResults] = React.useState(false);

	const setup			= React.useContext(QuizSetupContext);

	const stagesPerPage	= setup.stagesPerPage || 1;
	const maxPageIndex	= Math.ceil(setup.stages.length / stagesPerPage) - 1;

	const isValidPage	= (idx: number) => (idx * stagesPerPage) < setup.stages.length;

	const start			= page * stagesPerPage;
	const end			= Math.min(start + stagesPerPage, setup.stages.length);
	const isLastPage	= !isValidPage(page + 1);

	const wasAnsweredCompletely = (stage: QuizStage, index: number) => (
		choices[index + start].length >= (stage.requiredAnswers || 1)
	);

	const canNavigateFurther = (setup.allowIncompleteAnswers !== false) || setup.stages.slice(start, end).every(wasAnsweredCompletely);

	const previousPage = () => {
		return setPage(prev => Math.max(0, prev - 1));
	};

	const advancePage = () => {
		return setPage(prev => {
			if (!showResults && prev === maxPageIndex) {
				setShowResults(true);
				onFinished?.();
				return 0;
			}
			else
				return Math.min(prev + 1, maxPageIndex);
		});
	};

	return (
		<>
			{setup.stages.slice(start, end).map((stage, indexInSlice) => {
				const index				= indexInSlice + start;
				const instantFeedback	= pick(stage.instantFeedback, setup.instantFeedback, false);
				const readonly			= !onOptionToggled || showResults;
				return (
					<StageLayout
						key={index}
						stage={stage}
						choice={choices[index]}
						revealCorrect={showResults}
						verifyOptions={showResults || instantFeedback}
						onOptionToggled={!readonly ? (value) => onOptionToggled(index, value) : undefined}
					/>
				);
			})}
			<PageNavigation
				isLastStage={!showResults && isLastPage}
				allowNext={(showResults && !isLastPage) || (!showResults && canNavigateFurther)}
				allowPrevious={page > 0}
				onNextClicked={advancePage}
				onPreviousClicked={previousPage}
			/>
		</>
	);
}
