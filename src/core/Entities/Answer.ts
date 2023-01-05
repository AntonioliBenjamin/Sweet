import {QuestionProperties} from "./Question";
import {Gender} from "./User";

export type ResponseProperties = {
    userId: string;
    firstName: string;
    lastName: string;
    userName: string;
    schoolId: string;
    section: string;
    gender: Gender;
};

export type AnswerProperties = {
    answerId: string;
    pollId: string;
    question: QuestionProperties;
    response: ResponseProperties;
    userId: string;
    createdAt: Date;
    markAsRead: boolean;
};

export class Answer {
    props: AnswerProperties;

    constructor(props: AnswerProperties) {
        this.props = props;
    }

    static create(props: {
        answerId: string;
        question: QuestionProperties;
        response: ResponseProperties;
        pollId: string;
        userId: string;
    }) {
        return new Answer({
            answerId: props.answerId,
            pollId: props.pollId,
            question: props.question,
            response: props.response,
            userId: props.userId,
            createdAt: new Date(),
            markAsRead : false
        });
    }

    markAsRead() {
        this.props.markAsRead = true;
    }
}
