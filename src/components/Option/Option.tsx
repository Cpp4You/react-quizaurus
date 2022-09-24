import React from "react";

import Choice, {
	ChoiceOption,
	ChoiceValidatorWrapper
} from "../../Choice";

import {
	ComponentAnyProps,
	OptionSelectedEventHandler,
} from "../../QuizSetup";

import styles from "./Option.module.scss";

export const defaultOptionComponent = Option;

export function defaultOptionRenderer(
		comp:			ComponentAnyProps,
		option:			ChoiceOption,
		choice?:		Choice,
		onSelected?:	OptionSelectedEventHandler,
		validate?:		ChoiceValidatorWrapper)
{
	const onSelectedHandler = () => onSelected?.(option.value);

	const isChecked = choice ? (typeof choice === "string" ? choice === option.value : choice.indexOf(option.value) !== -1) : false;

	// Validate if needed
	let valid;
	if (validate && choice)
	{
		valid = validate(option.value);

		// Skip invalid options if not selected to avoid flooding with red color :)
		if (!valid && !isChecked)
			valid = undefined;
	}

	return React.createElement(comp,
		{
			checked:	valid === undefined ? isChecked : undefined,
			valid:		valid,
			value:		option.value,
			onSelected:	onSelectedHandler
		}, option.content);
}

export interface OptionProps {
	children: React.ReactNode;
	value: string | number;
	valid?: boolean;
	checked: boolean;
	onSelected?: () => void;
}

export default function Option({ children, valid, onSelected, checked = false }: OptionProps)
{
	return (
		<div
			{ ...(checked ? { "data-checked": "true" } : {}) }
			{ ...(valid !== undefined ? { "data-valid": `${valid}` } : {}) }
			className={styles.Option}
			onClick={onSelected ? onSelected : undefined}
		>
			{children}
		</div>
	);
}