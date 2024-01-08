import { Question } from ".";
import { Renderable } from "..";

const exampleQuestions: Question<Renderable>[] = [
    {
        "type": "MultipleChoiceQuestion",
        'props': {
            "id": 1,
            "prompt": {
                "type": 'RichText',
                "props": {
                    "content": "Here is some content"
                }
            },
            "options": [
                {
                    "type": 'RichText',
                    "props": {
                        "content": "Paris"
                    }
                },
                {
                    "type": 'RichText',
                    "props": {
                        "content": "London"
                    }
                },
                {
                    "type": 'RichText',
                    "props": {
                        "content": "Madrid"
                    }
                }

            ],
            "correctOptionIdx": 0,
            "explanation": "Paris is the capital of France."
        }
    },
]


export { exampleQuestions };
