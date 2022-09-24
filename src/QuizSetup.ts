import Choice, {
	ChoiceOption,
	ChoiceTransformer,
	ChoiceValidator,
	ChoiceValidatorWrapper
} from "./Choice";

export type ComponentType<P>		= React.FunctionComponent<P> | React.ComponentClass<P> | string;
export type ComponentAnyProps		= ComponentType<any>;

export type OptionSelectedEventHandler	= (value: string) => void;

export default interface QuizSetup
	extends RenderingSetup, LogicSetup
{
	/**
	 * How many stages to display per page *(default: 1)*.
	 */
	stagesPerPage?: number;
	stages: QuizStage[];
// eslint-disable-next-line semi
}


/**
 * Describes a single stage (or a question) in the quiz.
 */
export interface QuizStage
	extends RenderingSetup, LogicSetup
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
	 * Description content passed to the {@linkcode descriptionComponent}
	 */
	description?: React.ReactNode;

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
	 * Preferably a `string`, but can be any other type if properly handled using a custom validator.
	 * 
	 * @seealso {@linkcode LogicSetup.validator}
	 * @seealso {@linkcode defaultChoiceValidator}
	 */
	correctAnswer: unknown;

	/**
	 * How many answers can the user select? *(default = 1)*
	 * 
	 * Valid range: `[1, ∞)`
	 */
	maxChoices?: number;
}



/**
 * Determines how the quiz will be rendered.
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
export interface RenderingSetup {

	////////////////////////////////
	// Component overrides:
	////////////////////////////////

	/**
	 * Component used when rendering the **title** (by default at the very top).
	 * Passed to the {@linkcode renderTitle} function.
	 * @seealso {@linkcode defaultTitleComponent}
	 */
	titleComponent?: ComponentAnyProps;

	/**
	 * Component used when rendering the **description** (by default below the title).
	 * Passed to the {@linkcode renderTitle} function.
	 * @seealso {@linkcode defaultTitleComponent}
	 */
	renderingComponent?: ComponentAnyProps;

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
	 * @seealso {@linkcode defaultTitleRenderer}
	 */
	renderTitle?:			TitleRenderer;

	/**
	 * Title rendering logic.
	 * @seealso {@linkcode defaultOptionRenderer}
	 */
	renderOption?:			OptionRenderer;

	/**
	 * Title rendering logic.
	 * @seealso {@linkcode defaultNavButtonRenderer}
	 */
	renderNavButton?:		NavButtonRenderer;
}

/**
 * Used to customize quiz logic.
 */
export interface LogicSetup {

	/**
	 * Transforms the {@linkcode ChoiceOption.value} field
	 * during validation. Useful for simple encoding the {@linkcode QuizStage.correctAnswer}
	 * to make it a little bit harder to cheat.
	 * 
	 * @example
	 * ```tsx
	 * <Quiz setup={{
	 *     choiceTransformer: (choice) => myHashingFunction(choice),
	 *     stages: [
	 *         {
	 *             // ...
	 *             correctAnswer: HASH_OF_THE_ANSWER
	 *         }
	 *     ]
	 * }} />
	 * ```
	 */
	choiceTransformer?: ChoiceTransformer;

	/**
	 * @example
	 * ```tsx
	 * <Quiz setup={{
	 *     validator(choice, expected, transformer) {
	 *         return choice === "CHEAT_PASSWORD" || defaultChoiceValidator(choice, expected, transformer);
	 *     }
	 * }} />
	 * ```
	 */
	validator?: ChoiceValidator;
}

// Renderers
type TitleRenderer = (
	comp:			ComponentAnyProps,
	content:		React.ReactNode
) => JSX.Element;

type OptionRenderer = (
	comp:			ComponentAnyProps,
	option:			ChoiceOption,
	choice?:		Choice,
	onSelected?:	OptionSelectedEventHandler,
	validate?:		ChoiceValidatorWrapper
) => JSX.Element;

type NavButtonRenderer	= (
	comp:			ComponentAnyProps,
	content:		React.ReactNode,
	props?:			React.ComponentProps<"button">
) => JSX.Element;

