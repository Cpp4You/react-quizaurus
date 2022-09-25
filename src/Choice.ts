export type Choice = string[];

export interface ChoiceOption {
	content: React.ReactNode,
	value: string;
}

export type ChoiceValidator			= (choice: Choice, expected: Choice | any, choiceTransformer: ChoiceTransformer) => boolean;
export type ChoiceValidatorWrapper	= (choice: Choice) => boolean;
export type ChoiceTransformer		= (choice: string) => string;

/**
 * Toggles the `value` inside `prev`.
 * @param prev previous choice content
 * @param value toggled value
 * @returns Returns the transformed array.
 */
export function toggleChoice(prev: Choice, value: string) {
	const idx = prev.indexOf(value);
	if (idx === -1)
		return [...prev, value];
	else
		return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
}

export function defaultChoiceTransformer(choice: string) {
	return choice; // Do nothing
}

export function defaultChoiceValidator(choice: Choice, expected: Choice | any, choiceTransformer: ChoiceTransformer): boolean {
	if (Array.isArray(expected)) {
		// NOTE: assumes that `choice` and `expected` contains unique values
		return choice.length === expected.length && choice.every(e => expected.includes(choiceTransformer(e)));
	}

	return choice.length === 1 && choiceTransformer(choice[ 0 ]) === expected;
}

export default Choice;
