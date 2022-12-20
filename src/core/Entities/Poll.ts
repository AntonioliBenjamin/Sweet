import {QuestionProperties} from "./Question";

export type PollProperties = {
    pollId: string,
    questions?: Array<QuestionProperties>,
    createdAt: Date,
};

export class Poll {
    props: PollProperties;

    constructor(props: PollProperties) {
        this.props = props
    }

    static create(props: {
        pollId: string,
    }) {
        return new Poll({
            pollId: props.pollId,
            createdAt: new Date()
        })
    }

    canAddQuestion(questionId: string) {
        const question = this.props.questions.find(elm => elm.questionId === questionId)
        if (question) {
            return false;
        }
        return true;
    }

    addQuestion(question: QuestionProperties) {
        this.props.questions.push(question)
    }

}