import React from "react";
import QuizSetup from "../QuizSetup";

export const QuizSetupContext = React.createContext<QuizSetup>({stages: []});

export default QuizSetupContext;