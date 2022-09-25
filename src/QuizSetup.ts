import {
	ChoiceOption,
	OptionTransformer,
	OptionValidator,
	ScoreEvaluator,
} from "./Choice";

export type ComponentType<P>		= React.FunctionComponent<P> | React.ComponentClass<P> | string;
export type ComponentAnyProps		= ComponentType<any>;

export type OptionSelectedEventHandler	= (value: string) => void;

export default interface QuizSetup
	extends StageRenderingSetup, LogicSetup
{
	/**
	 * Stages/questions that this quiz is composed of.
	 */
	stages: QuizStage[];

	/**
	 * How many stages to display per page *(default: 1)*.
	 */
	stagesPerPage?: number;

	/**
	 * Can the user proceed to next quiz pages (or questions if questions per page = 1)
	 * even if previous questions were not answered completely (see {@linkcode QuizStage.requiredAnswers}).
	 *
	 * Default: true
	 */
	allowIncompleteAnswers?: boolean;
// eslint-disable-next-line semi
}

/**
 * Describes a single stage (or a question) in the quiz.
 */
export interface QuizStage
	extends StageRenderingSetup, LogicSetup
{
	/**
	 * Title content passed to the {@linkcode titleComponent}.
	 *
	 * @example
	 * ```tsx
	 * {
	 *     stages: [
	 *         {
	 *             title: "1. What is π approximately equal to?",
	 *             // ...
	 *         },
	 *         {
	 *             title: <>2. What is the name of this meme? <img src="image.png" /></>,
	 *             // ...
	 *         }
	 *     ]
	 * }
	 * ```
	 */
	title: React.ReactNode;

	/**
	 * Additional description of the stage.
	 * Useful for presenting images, etc.
	 *
	 * ---
	 * @seealso {@linkcode descComponent}
	 */
	desc?: React.ReactNode;

	/**
	 * Available options presented to the user.
	 *
	 * @example
	 * ```tsx
	 * {
	 *     title: "1. What is π approximately equal to?",
	 *     correctAnswer: "1",
	 *     choices: [
	 *         { value: "1", content: "3.14" },
	 *         { value: "2", content: "4.14" },
	 *         { value: "3", content: <>3.5 <img src="fancy-image.png" /></> },
	 *         { value: "4", content: "3.94" },
	 *     ]
	 * }
	 * ```
	 */
	options?: ChoiceOption[];

	/**
	 * Choices will be compared to it during the **validation process**.
	 * Preferably a `string` or a `string[]`, but can be any other type if properly handled using
	 * a custom {@linkcode validator} and {@linkcode scoreEvaluator}.
	 *
	 * ---
	 * @seealso {@linkcode defaultOptionValidator}
	 * @seealso {@linkcode defaultScoreEvaluator}
	 */
	correctAnswer: unknown;

	/**
	 * How many answers can the user select? *(default = 1)*
	 *
	 * ---
	 * Valid range: `[1, ∞)`
	 */
	maxAnswers?: number;

	/**
	 * How many answers the user **has to** select? *(default = 1)*
	 *
	 * ---
	 * Valid range: `[0, maxAnswers]`
	 *
	 * ---
	 * **Note**: ignored if {@linkcode QuizSetup.allowIncompleteAnswers} is set to `true`.
	 */
	requiredAnswers?: number;

	/**
	 * If specified, the score range is remapped so that
	 * full pts is equal to this field.
	 *
	 * Example: for a given stage you can get max 2 pts (sum of two answers' score).
	 * `remapScore: 100`
	 * With above setting you get 100pts for fully correct choice (2 of 2)
	 * and 50pts for partially correct choice (1 of 2)
	 *
	 * ---
	 * **Note**: setting this value to 0 will make the score always equal to 0.
	 */
	remapScore?: number;
}

/**
 * Determines how the quiz stage will be rendered.
 * Can be overriden at the quiz or stage level.
 *
 * @example
 * ```tsx
 * <Quiz setup={{
 *     titleComponent: "h3",
 *     optionComponent: (props: OptionProps) => (
 *         <div>Wrapper: <Option {...props}/></div>
 *     ),
 *     navButtonComponent: (props: any) => (<CustomButton {...props}/>)
 * }} />
 * ```
 *
 * The default layout looks like this (pseudocode)
 *
 * ```tsx
 * <Container>
 *     <Title />
 *     <Description />
 *     {options.map(o => <Option {...o.props}/>)}
 *     <NavigationButtons />
 * </Container>
 * ```
 */
export interface StageRenderingSetup {

	////////////////////////////////
	// Component overrides:
	////////////////////////////////

	/**
	 * Component used when rendering the **title** (by default at the very top).
	 * Passed to the {@linkcode renderStageTitle} function.
	 * @seealso {@linkcode defaultStageTitleComponent}
	 */
	titleComponent?: ComponentAnyProps;

	/**
	 * Component used when rendering the **description** (by default below the title).
	 * Passed to the {@linkcode renderStageDesc} function.
	 * @seealso {@linkcode defaultStageDescComponent}
	 */
	descComponent?: ComponentAnyProps;

	/**
	 * Component used when rendering each **option** (by default below the description).
	 * Passed to the {@linkcode renderOption} function.
	 * @seealso {@linkcode defaultOptionComponent}
	 */
	optionComponent?: ComponentAnyProps;

	/**
	 * Component used when rendering **navigation buttons** (like "Previous" or "Next").
	 * Passed to the {@linkcode renderNavButton} function.
	 * @seealso {@linkcode defaultNavButtonComponent}
	 */
	navButtonComponent?: ComponentAnyProps;

	////////////////////////////////
	// Renderers
	////////////////////////////////

	/**
	 * Title rendering logic.
	 * @seealso {@linkcode defaultStageTitleRenderer}
	 */
	renderStageTitle?:		StageTitleRenderer;

	/**
	 * Description rendering logic.
	 * @seealso {@linkcode defaultStageDescRenderer}
	 */
	renderStageDesc?:		StageDescRenderer;

	/**
	 * Option rendering logic.
	 * @seealso {@linkcode defaultOptionRenderer}
	 */
	renderOption?:			OptionRenderer;

	/**
	 * Navigation buttons rendering logic.
	 * @seealso {@linkcode defaultNavButtonRenderer}
	 */
	renderNavButton?:		NavButtonRenderer;
}

/**
 * Used to customize quiz logic.
 */
export interface LogicSetup {

	/**
	 * Score calculation settings.
	 */
	score?: ScoreSetup;

	/**
	 * Should user instantly see if the selected option is valid (*default*: false).
	 * If false the feedback will be presented once Quiz is finished.
	 */
	instantFeedback?: boolean;

	/**
	 * Transforms the {@linkcode ChoiceOption.value} field
	 * during validation. Useful for simple encoding the {@linkcode QuizStage.correctAnswer}
	 * to make it a little bit harder to cheat.
	 *
	 * @example
	 * ```tsx
	 * <Quiz setup={{
	 *     optionTransformer: (choice) => myHashingFunction(choice),
	 *     stages: [
	 *         {
	 *             // ...
	 *             correctAnswer: HASH_OF_THE_ANSWER
	 *         }
	 *     ]
	 * }} />
	 * ```
	 */
	optionTransformer?: OptionTransformer;

	/**
	 * @example
	 * ```tsx
	 * <Quiz setup={{
	 *     validator(answer, expected, transformer) {
	 *         return answer === "CHEAT_PASSWORD" || defaultOptionValidator(answer, expected, transformer);
	 *     }
	 * }} />
	 * ```
	 */
	validator?: OptionValidator;

	/**
	 * @example
	 * ```tsx
	 * <Quiz setup={{
	 *     scoreEvaluator(settings, choice, expected, transformer, scoreOf) {
	 *         return choice.includes("CHEAT_PASSWORD") ? 999 : defaultScoreEvaluator(settings, choice, expected, transformer, scoreOf);
	 *     }
	 * }} />
	 * ```
	 */
	scoreEvaluator?: ScoreEvaluator;
}

export interface ScoreSetup {
	/**
	 * By default you cannot receive less than 0 pts from a stage.
	 * If set to `true`, this option will make the quiz result a bit more painful.
	 *
	 * You can receive negative score by missing a correct option or selecting incorrect one.
	 *
	 * **Note**: if set to `true` with skipping ({@linkcode QuizSetup.allowIncompleteAnswers}) disabled,
	 * users will often receive -2 points for each stage (incorrect and missing correct). Consider using
	 * 0.5 multipliers in this case to be more fair :)
	 *
	 * @seealso {@linkcode missingAnswerMult}
	 * @seealso {@linkcode incorrectAnswerMult}
	 */
	allowNegative?: boolean;

	/**
	 * User is losing points by missing an answer.
	 * The amount of points lost is equal to {@linkcode ChoiceOption.score} times this variable.
	 *
	 * Default: 1
	 */
	missingAnswerMult?: number;

	/**
	 * User is losing points by selecting an incorrect answer.
	 * The amount of points lost is equal to {@linkcode ChoiceOption.score} times this variable.
	 *
	 * Default: 1
	 */
	incorrectAnswerMult?: number;
}


// Renderers
type StageTitleRenderer = (
	comp:			ComponentAnyProps,
	content:		React.ReactNode
) => JSX.Element;

type StageDescRenderer = (
	comp:			ComponentAnyProps,
	content:		React.ReactNode
) => JSX.Element;

type OptionRenderer = (
	comp:			ComponentAnyProps,
	option:			ChoiceOption,
	selected?:		boolean,
	correct?:		boolean,
	onSelected?:	OptionSelectedEventHandler
) => JSX.Element;

type NavButtonRenderer	= (
	comp:			ComponentAnyProps,
	content:		React.ReactNode,
	props?:			React.ComponentProps<"button">
) => JSX.Element;

