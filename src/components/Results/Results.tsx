import React				from "react";
import Choice				from "../../Choice";
import { QuizSetupContext }	from "../../contexts";
import QuizStageLayout		from "../StageLayout";

export interface QuizResultsProps {
	choices: Choice[];
}

export default function QuizResults({ choices }: QuizResultsProps) {
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