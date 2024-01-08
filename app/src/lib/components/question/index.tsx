import { Renderable, Serdable, render } from "..";
import { MultipleChoiceQuestionView } from "./multiple-choice-question/MultipleChoiceQuestion";

interface BaseQuestion {
    id: number;
}


interface MultipleChoiceQuestion<T> extends BaseQuestion {
    prompt: T
    options: T[]; // An array of options
    correctOptionIdx: number; // The correct answer (could be the text or an identifier for the option)
    explanation?: string; // Optional explanation for the answer
}


interface TrueFalseQuestion<T> extends BaseQuestion {
    prompt: T
    correctAnswer: boolean;
}

interface ShortAnswerQuestion<T> extends BaseQuestion {
    prompt: T
    maxLength: number;
}

interface FillInTheBlankQuestion<T> extends BaseQuestion {
    prompt: T

}


type Question<R> =
    | Serdable<'MultipleChoiceQuestion', MultipleChoiceQuestion<R>>
    | Serdable<'TrueFalseQuestion', TrueFalseQuestion<R>>
    | Serdable<'ShortAnswerQuestion', ShortAnswerQuestion<R>>
    | Serdable<'FillInTheBlankQuestion', FillInTheBlankQuestion<R>>;


function renderQuestion(key: string, question: Question<Renderable>) {
    switch (question.type) {
        case 'MultipleChoiceQuestion':
            return (<MultipleChoiceQuestionView key={key} question={question.props} render={render} />)
        default:
            return null

    }

}

export { renderQuestion };
export type { MultipleChoiceQuestion, Question };



