import React from "react";

import StageDescription		from "../StageDescription";
import StageOptions			from "../StageOptions";
import StageTitle			from "../StageTitle";

import Choice				from "../../Choice";
import { QuizStage }		from "../../QuizSetup";

import styles				from "./StageLayout.module.scss";

export interface StageLayoutProps {
	stage: QuizStage;
	choice: Choice;
	verifyOptions?: boolean;
	revealCorrect?: boolean;
	onOptionToggled?: (value: string) => void;
}

export default function StageLayout({
	stage,
	choice,
	verifyOptions,
	revealCorrect,
	onOptionToggled,
}: StageLayoutProps) {

	return (
		<div key={stage.title?.toString()} className={styles.QuizStage}>
			<StageTitle stage={stage} />
			{stage.desc && <StageDescription stage={stage} />}
			<StageOptions
				stage={stage}
				choice={choice}
				revealCorrect={revealCorrect}
				verifyOption={verifyOptions}
				onOptionToggled={onOptionToggled}
			/>
		</div>
	);
}
