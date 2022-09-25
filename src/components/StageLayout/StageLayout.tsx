import React from "react";
import Choice from "../../Choice";
import { QuizStage } from "../../QuizSetup";
import QuizStageOptions from "../StageOptions";
import QuizStageTitle from "../StageTitle";

import styles from "./StageLayout.module.scss";

export interface QuizStageLayoutProps {
	stage: QuizStage;
	choice: Choice;
	isResultsPage?: boolean;
	onOptionToggled?: (value: string) => void;
}

export default function QuizStageLayout({
	stage,
	choice,
	isResultsPage,
	onOptionToggled,
}: QuizStageLayoutProps) {

	return (
		<div key={stage.title?.toString()} className={styles.QuizStage}>
			<QuizStageTitle stage={stage} />
			<QuizStageOptions
				stage={stage}
				choice={choice}
				isResultsPage={isResultsPage}
				onOptionToggled={onOptionToggled}
			/>
		</div>
	);
}