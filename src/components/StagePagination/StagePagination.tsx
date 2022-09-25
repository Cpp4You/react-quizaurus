import React				from "react";
import Choice				from "../../Choice";
import StageLayout			from "../StageLayout";
import PageNavigation		from "../PageNavigation";

import { QuizSetupContext }	from "../../contexts";

export interface StagePaginationProps {
	choices: Choice[];
	onOptionToggled?: (stageIndex: number, value: string) => void;
}

export default function StagePagination({ choices, onOptionToggled }: StagePaginationProps) {
	const [page, setPage] = React.useState(0);
	const [showResults, setShowResults] = React.useState(false);

	const setup	= React.useContext(QuizSetupContext);

	const stagesPerPage	= setup.stagesPerPage || 1;

	const start			= page * stagesPerPage;
	const end			= Math.min(start + stagesPerPage, setup.stages.length);
	const maxPageIndex	= setup.stages.length / stagesPerPage - 1;

	const isValidPage	= (idx: number) => (idx * stagesPerPage) < setup.stages.length;
	const isLastPage	= !isValidPage(page + 1);

	
	const previousPage = () => {
		return setPage(prev => Math.max(0, prev - 1));
	};

	const advancePage = () => {
		return setPage(prev => {
			if (!showResults && prev === maxPageIndex) {
				setShowResults(true);
				return 0;
			}
			else 
				return Math.min(prev + 1, maxPageIndex);
		});
	};

	return (
		<>
			{setup.stages.map((stage, index) => {
				if (index < start || index >= end)
					return undefined;
				return (
					<StageLayout
						key={index}
						stage={stage}
						choice={choices[index]}
						isResultsPage={showResults}
						onOptionToggled={onOptionToggled ? (value) => onOptionToggled(index, value) : undefined}
					/>
				);
			})}
			<PageNavigation
				isLastStage={!showResults && isLastPage}
				allowNext={!showResults || !isLastPage}
				allowPrevious={page > 0}
				onNextClicked={advancePage}
				onPreviousClicked={previousPage}
			/>
		</>
	);
}