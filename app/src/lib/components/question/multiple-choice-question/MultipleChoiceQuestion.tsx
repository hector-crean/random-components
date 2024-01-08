import { motion } from 'framer-motion';
import { ReactNode, useCallback, useState } from "react";
import { MultipleChoiceQuestion } from '..';



interface MultipleChoiceQuestionProps<Renderable> {
    question: MultipleChoiceQuestion<Renderable>,
    render: (renderable: Renderable) => ReactNode
}


function MultipleChoiceQuestionView<R>({ question, render }: MultipleChoiceQuestionProps<R>) {

    const [chosenOptionIdx, setChosenOptionIdx] = useState<number | null>(null)

    const onOptionSelect = useCallback((idx: number) => {
        setChosenOptionIdx(idx)
    }, [])

    const onTryAgain = () => { }

    const onClickNext = () => { }



    return (
        <div>
            <header>
                {render(question.prompt)}
            </header>
            <ul>
                {question.options.map((option, idx) => (
                    <motion.li
                        onTap={() => onOptionSelect(idx)}
                        className={question.correctOptionIdx === idx ? 'correct-option' : 'incorrect-option'}
                    >{
                            render(option)}
                    </motion.li>
                ))}
            </ul>
            <footer>
                <button
                    onClick={onClickNext}
                >

                </button>
            </footer>
        </div>
    )
}



export { MultipleChoiceQuestionView };
export type { MultipleChoiceQuestion };

