import { ScoreSetup } from "./QuizSetup";

export type Choice = string[];

export interface ChoiceOption {
	content: React.ReactNode,
	value: string;
	score?: number;
}

/**
 * Function transforming an answer before validation.
 */
export type OptionTransformer		= (choice: string) => string;

/**
 * Function determining whether `answer` is (partially-) correct.
 * @param answer `value` field of a selected option
 * @param expected `correctAnswer` field of a QuizStage
 */
export type OptionValidator			= (answer: string, expected: Choice | any, optionTransformer: OptionTransformer) => boolean;

/**
 * Returns a score of an option with value equal to `value`.
 * @param value
 */
export type SingleScoreEvaluator	= (value: string) => number;

/**
 * Returns a total score of a Choice.
 * @param choice - array of answers
 * @param expected - object used for answer validation (typically an answer or array of answers)
 * @param optionTransformer - function transforming each answer before validation
 */
export type ScoreEvaluator			= (settings: ScoreSetup, choice: Choice, expected: Choice | any, optionTransformer: OptionTransformer, scoreOf?: SingleScoreEvaluator) => number;

/**
 * Toggles the `value` inside `prev` under certain conditions.
 * @param prev previous choice content
 * @param value toggled value
 * @returns Returns the transformed array.
 */
export function toggleChoice(prev: Choice, value: string, max?: number, canDeselect = true) {

	const idx = prev.indexOf(value);
	if (idx === -1) {
		// Can append?
		if (!max || prev.length < max) {
			return [...prev, value];
		}
		else if (max === 1)
		{
			if  (canDeselect || prev.length === 0)
				return [ value ]; // replace previous
		}
	}
	else if (canDeselect && max !== 1)
		return [...prev.slice(0, idx), ...prev.slice(idx + 1)];

	return prev; // do nothing
}

export function defaultOptionTransformer(choice: string) {
	return choice; // Do nothing
}

export function defaultOptionValidator(option: string, expected: Choice | any, optionTransformer: OptionTransformer): boolean {
	if (Array.isArray(expected)) {
		// NOTE: assumes that `choice` and `expected` contains unique values
		return expected.includes(optionTransformer(option));
	}

	return optionTransformer(option) === expected;
}

/**
 * Returns number of valid answers - number of invalid answers.
 * @param settings
 * @param choice
 * @param expected
 * @param optionTransformer
 * @param scoreOf
 * @returns
 */
export function defaultScoreEvaluator(settings: ScoreSetup, choice: Choice, expected: Choice | any, optionTransformer: OptionTransformer, scoreOf?: SingleScoreEvaluator): number
{
	// Ensure it's an array
	const expectedArray = Array.isArray(expected) ? expected : [ expected ];

	const validate = (val: string) => expectedArray.includes(optionTransformer(val));

	const correct			= choice.filter(validate);
	const incorrect			= choice.filter(val => !validate(val));
	const missing			= expectedArray.filter(answer => choice.findIndex(c => optionTransformer(c) === answer) === -1);

	const correctScore		= correct.reduce<number>((prev, curr) => prev + (scoreOf ? scoreOf(curr) : 1), 0);
	const incorrectScore	= incorrect.reduce<number>((prev, curr) => prev + (scoreOf ? scoreOf(curr) : 1), 0);
	const missingScore		= missing.reduce<number>((prev, curr) => prev + (scoreOf ? scoreOf(curr) : 1), 0);

	const score = correctScore
		- incorrectScore * (settings.incorrectAnswerMult || 1)
		- missingScore * (settings.missingAnswerMult || 1);

	if (settings.allowNegative)
		return score;

	return Math.max(0, score);
}

export default Choice;
