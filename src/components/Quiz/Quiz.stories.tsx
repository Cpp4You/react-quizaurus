import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Quiz, { QuizProps } from "./Quiz";
import Option, { OptionProps } from "../Option/Option";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "React Quizaurus/Quiz",
	component: Quiz,
} as ComponentMeta<typeof Quiz>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Quiz> = (args: QuizProps) => <Quiz {...args} />;

export const BasicQuiz = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
BasicQuiz.args = {
	title: "Hello world!",
	setup: {
		stages: [
			{
				label: "The first question",
				correctAnswer: "2",
				options: [
					{ node: "1. Lorem ipsum dolor sit amet", value: "1" },
					{ node: "2. Lorem ipsum dolor sit amet", value: "2" },
					{ node: "3. Lorem ipsum dolor sit amet", value: "3" },
				]
			}
		]
	}
};

export const LongQuiz = Template.bind({});
LongQuiz.args = {
	title: "Long quiz",
	setup: {
		stages: [
			{
				label: "1. What is the first code run by the computer",
				correctAnswer: "3",
				maxChoices: 2,
				options: [
					{ node: "1. The include section at the top", value: "1" },
					{ node: "2. The definition of the main function", value: "2" },
					{ node: "3. The contents of the main function code block", value: "3" },
					{ node: "4. Lorem ipsum dolor sit amet", value: "4" },
				]
			},
			{
				label: "2. Which one is the valid code?",
				correctAnswer: "2",
				maxChoices: 1,
				options: [
					{ node: <>1. <code>{"std::cout < \"Hello, World!\";"}</code></>, value: "1" },
					{ node: <>2. <code>{"std::cout << \"Hello, World!\";"}</code></>, value: "2" },
					{ node: <>3. <code>{"std::cout > \"Hello, World!\";"}</code></>, value: "3" },
					{ node: <>4. <code>{"std::cout >> \"Hello, World!\";"}</code></>, value: "4" },
				]
			},
		]
	}
};