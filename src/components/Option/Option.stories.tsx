import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Option, { OptionProps } from "./Option";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: "React Quizaurus/Option",
	component: Option,
} as ComponentMeta<typeof Option>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Option> = (args: OptionProps) => <Option {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
	children: "Quiz option",
};

export const Checked = Template.bind({});
Checked.args = {
	children: "Quiz option",
	checked: true,
};