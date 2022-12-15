export type QuestionProperties = {
    questionId: string;
    question: string;
    picture: string;
}

export class Question {
    props: QuestionProperties

    constructor(props: QuestionProperties) {
    }

    static create(props: {
        questionId: string;
        question: string;
        picture: string
    }) {
        return new Question({
            questionId: props.questionId,
            question: props.question,
            picture: props.picture
        })
    }
}