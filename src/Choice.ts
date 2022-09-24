export type Choice = string | string[];

export interface ChoiceOption {
	content: React.ReactNode,
	value: string;
}

export type ChoiceValidator			= (choice: Choice, expected: Choice | any, choiceTransformer: ChoiceTransformer) => boolean;
export type ChoiceValidatorWrapper	= (choice: Choice) => boolean;

export type ChoiceTransformer = (choice: Choice) => Choice;

/**
 * Returns the `[ value ]` array if `prev` was empty,
 * or the `prev` with `value` removed if `value` was present inside `prev`.
 * @param prev previous choice content
 * @param value toggled value
 * @returns 
 */
export function toggleChoice(prev: Choice, value: string) {
	if (typeof prev === "string") {
		if (prev === value)
			return [] as Choice;

		else
			return [prev, value];
	}
	else if (Array.isArray(prev)) {
		const idx = prev.indexOf(value);
		if (idx === -1)
			return [...prev, value];

		else
			return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
	}

	else
		return [value];
}

export function defaultChoiceTransformer(choice: Choice) {
	return choice; // Do not transform
}

export function defaultChoiceValidator(choice: Choice, expected: Choice | any, choiceTransformer: ChoiceTransformer): boolean {
	if (typeof choice === "string") {
		return choiceTransformer(choice) === expected;
	}

	if (Array.isArray(expected)) {
		// NOTE: assumes that `choice` and `expected` contains unique values
		return choice.length === expected.length && choice.every(e => expected.includes(choiceTransformer(e)));
	}

	return choice.length === 1 && choiceTransformer(choice[0]) === expected;
}

export default Choice;