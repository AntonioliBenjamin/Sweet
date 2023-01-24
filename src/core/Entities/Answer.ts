import {QuestionProperties} from "./Question";
import {Gender} from "./User";

export type ResponseProperties = {
    userId: string;
    firstName: string;
    lastName: string;
    userName: string;
    schoolId: string;
    schoolName: string;
    section?: string;
    age: number;
    gender: Gender;
};

export type AnswerProperties = {
    answerId: string;
    pollId: string;
    question: QuestionProperties;
    response: ResponseProperties;
    from: ResponseProperties;
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
        from: ResponseProperties;
        pollId: string;
        userId: string;
    }) {
        return new Answer({
            answerId: props.answerId,
            pollId: props.pollId,
            question: props.question,
            response: props.response,
            from: props.from,
            userId: props.userId,
            createdAt: new Date(),
            markAsRead : false
        });
    }

    markAsRead() {
        this.props.markAsRead = true;
    }
}
