export type QuestionProperties = {
    questionId: string;
    description: string;
    picture: string;
}

export class Question {
    props: QuestionProperties

    constructor(props: QuestionProperties) {
        this.props = props
    }

    static create(props: {
        questionId: string;
        description: string;
        picture: string
    }) {
        return new Question({
            questionId: props.questionId,
            description: props.description,
            picture: props.picture
        })
    }
}