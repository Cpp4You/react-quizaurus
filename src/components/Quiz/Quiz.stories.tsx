import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Quiz, { QuizProps } from "./Quiz";
import { QuizStage } from "../../QuizSetup";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "React Quizaurus/Quiz",
	component: Quiz,
} as ComponentMeta<typeof Quiz>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Quiz> = (args: QuizProps) => <Quiz {...args} />;

const MountainsQuestions: QuizStage[] = [
	{
		title: "The highest peak in Europe is...",
		correctAnswer: "elbrus",
		options: [
			{ content: "Mount Elbrus",			value: "elbrus" },
			{ content: "Mount Everest",			value: "everest" },
			{ content: "Shkhara",				value: "shkhara" },
			{ content: "Teide",					value: "teide" },
		]
	},
	{
		title: "The first people to successfully climb Mount Everest was...",
		correctAnswer: "eh_tn",
		options: [
			{ content: "George Finch",						value: "finch" },
			{ content: "Geoffrey Bruce",					value: "bruce" },
			{ content: "Tom Bourdillon and Charles Evans",	value: "tb_ce" },
			{ content: "Edmund Hillary and Tenzing Norgay",	value: "eh_tn" },
		]
	},
	{
		title: "The highest peak in Africa is...",
		correctAnswer: "kilimanjaro",
		options: [
			{ content: "K2",					value: "k2" },
			{ content: "Mount Everest",			value: "everest" },
			{ content: "Mount Kilimanjaro",		value: "kilimanjaro" },
			{ content: "Nanga Parbat",			value: "nanga_parbat" },
		]
	},
	{
		title: "The highest peak on Earth is...",
		correctAnswer: "everest",
		options: [
			{ content: "Makalu",				value: "makalu" },
			{ content: "K2",					value: "k2" },
			{ content: "Mount Everest",			value: "everest" },
			{ content: "Nanga Parbat",			value: "nanga_parbat" },
		]
	}
];

const MountainsQuestions_MultiAnswers: QuizStage[] = [
	{
		title: "Select mountains located in Asia",
		desc: "You can select up to four answers.",
		correctAnswer: [ "everest", "k2" ],
		maxAnswers: 4,
		options: [
			{ content: "Mount Elbrus",			value: "elbrus" },
			{ content: "Mount Everest",			value: "everest" },
			{ content: "Shkhara",				value: "shkhara" },
			{ content: "K2",					value: "k2" },
		]
	},
	{
		title: "Select mountains higher than 8000m",
		correctAnswer: [ "everest", "k2", "nanga_parbat" ],
		maxAnswers: 4,
		options: [
			{ content: "Mount Kilimanjaro",		value: "kilimanjaro" },
			{ content: "Mount Everest",			value: "everest" },
			{ content: "Nanga Parbat",			value: "nanga_parbat" },
			{ content: "K2",					value: "k2" },
		]
	},
];

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const BasicQuiz = Template.bind({});
BasicQuiz.storyName = "Basic quiz (default settings)";
BasicQuiz.args = {
	title: "Mountains",
	desc: "A quiz with default settings.",
	setup: {
		stages: MountainsQuestions
	}
};

export const BasicQuiz_InstantFeedback = Template.bind({});
BasicQuiz_InstantFeedback.storyName = "Basic quiz (Instant feedback)";
BasicQuiz_InstantFeedback.args = {
	title: "Mountains",
	desc: <><b>You get an instant feedback.</b></>,
	setup: {
		instantFeedback: true,
		stages: MountainsQuestions
	}
};

export const BasicQuiz_InstantIncomplete = Template.bind({});
BasicQuiz_InstantIncomplete.storyName = "Basic quiz (instant, forbid incomplete)";
BasicQuiz_InstantIncomplete.args = {
	title: "Mountains",
	desc: <>You get an instant feedback. <b>Incomplete answers are not allowed.</b></>,
	setup: {
		instantFeedback: true,
		allowIncompleteAnswers: false,
		stages: MountainsQuestions
	}
};

export const BasicQuiz_Paginated = Template.bind({});
BasicQuiz_Paginated.storyName = "Basic quiz (paginated, instant)";
BasicQuiz_Paginated.args = {
	title: "Mountains",
	desc: <>You get an instant feedback. <b>Displaying two stages per page.</b></>,
	setup: {
		instantFeedback: true,
		stagesPerPage: 2,
		stages: MountainsQuestions
	}
};

export const MultiAnswer_Default = Template.bind({});
MultiAnswer_Default.storyName = "Multi-answer";
MultiAnswer_Default.args = {
	title: "Mountains",
	desc: "Questions have multiple answers.",
	setup: {
		instantFeedback: true,
		stages: MountainsQuestions_MultiAnswers
	}
};


export const LongQuiz = Template.bind({});
LongQuiz.args = {
	title: "Long quiz",
	theme: "dark",
	setup: {
		titleComponent: "h3",
		stagesPerPage: 1,
		instantFeedback: true,
		allowIncompleteAnswers: false,
		stages: [
			{
				title: "1. What is the first code run by the computer",
				correctAnswer: "3",
				requiredAnswers: 1,
				options: [
					{ content: "1. The include section at the top", value: "1" },
					{ content: "2. The definition of the main function", value: "2" },
					{ content: <img src="https://picsum.photos/id/237/200/300" />, value: "3" },
					{ content: "4. Lorem ipsum dolor sit amet", value: "4" },
				]
			},
			{
				title: "2. Which one is the valid code?",
				correctAnswer: "2",
				options: [
					{ content: <>1. <code>{"std::cout < \"Hello, World!\";"}</code></>, value: "1" },
					{ content: <>2. <code>{"std::cout << \"Hello, World!\";"}</code></>, value: "2" },
					{ content: <>3. <code>{"std::cout > \"Hello, World!\";"}</code></>, value: "3" },
					{ content: <>4. <code>{"std::cout >> \"Hello, World!\";"}</code></>, value: "4" },
				]
			},
		]
	}
};
