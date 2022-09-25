import React				from "react";
import Choice				from "../../Choice";
import { QuizSetupContext }	from "../../contexts";
import QuizStageLayout		from "../StageLayout";

export interface ResultsProps {
	choices: Choice[];
}

export default function Results({ choices }: ResultsProps) {
	const setup = React.useContext(QuizSetupContext);

	return (
		<>
			<div>Results:</div>
			{setup.stages.map((stage, idx) => (
				<QuizStageLayout
					key={idx}
					stage={stage}
					isResultsPage={true}
					choice={choices[idx]}
				/>
			))}
		</>
	);
}
