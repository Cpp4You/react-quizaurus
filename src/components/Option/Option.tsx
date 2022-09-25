import React from "react";

import { ChoiceOption } from "../../Choice";

import {
	ComponentAnyProps,
	OptionSelectedEventHandler,
} from "../../QuizSetup";

import styles from "./Option.module.scss";

export const defaultOptionComponent = Option;

export function defaultOptionRenderer(
		comp:			ComponentAnyProps,
		option:			ChoiceOption,
		checked?:		boolean,
		correct?:		boolean,
		onSelected?:	OptionSelectedEventHandler)
{
	const onSelectedHandler = onSelected ? () => onSelected(option.value) : undefined;

	return React.createElement(comp,
		{
			key:		option.value,
			checked:	checked,
			correct:	correct,
			value:		option.value,
			onSelected:	onSelectedHandler
		}, option.content);
}

export interface OptionProps {
	children: React.ReactNode;
	value: string | number;
	correct?: boolean;
	checked: boolean;
	onSelected?: () => void;
}

export default function Option({ children, correct, onSelected, checked = false }: OptionProps)
{
	return (
		<div
			{ ...(checked ? { "data-checked": "true" } : {}) }
			{ ...(onSelected ? {} : { "data-readonly": "true" }) }
			{ ...(correct !== undefined ? { "data-correct": `${correct}` } : {}) }
			className={styles.Option}
			onClick={onSelected ? onSelected : undefined}
		>
			{children}
		</div>
	);
}
