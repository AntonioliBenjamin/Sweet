import {QuestionProperties} from "./Question";
import {Gender} from "./User";
import {UserErrors} from "../errors/UserErrors";

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
    question: QuestionProperties;
    response: ResponseProperties;
    answer: string;
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
        answer: string;
    }) {
        return new Answer({
            answerId: props.answerId,
            question: props.question,
            response: props.response,
            answer: props.answer,
            createdAt: new Date(),
            markAsRead : false
        });
    }

    markAsRead() {
        this.props.markAsRead = true;
    }
}
