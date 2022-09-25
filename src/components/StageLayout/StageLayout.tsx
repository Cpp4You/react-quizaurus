import React from "react";
import Choice from "../../Choice";
import { QuizStage } from "../../QuizSetup";
import StageOptions from "../StageOptions";
import StageTitle from "../StageTitle";

import styles from "./StageLayout.module.scss";

export interface StageLayoutProps {
	stage: QuizStage;
	choice: Choice;
	isResultsPage?: boolean;
	onOptionToggled?: (value: string) => void;
}

export default function StageLayout({
	stage,
	choice,
	isResultsPage,
	onOptionToggled,
}: StageLayoutProps) {

	return (
		<div key={stage.title?.toString()} className={styles.QuizStage}>
			<StageTitle stage={stage} />
			<StageOptions
				stage={stage}
				choice={choice}
				isResultsPage={isResultsPage}
				onOptionToggled={onOptionToggled}
			/>
		</div>
	);
}