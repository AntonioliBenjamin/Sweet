import "dotenv/config";
import {QuestionProperties} from "./Question";

const timeLimit = +process.env.TIME_LIMIT

export type PollProperties = {
    pollId: string,
    questions?: Array<QuestionProperties>,
    createdAt: Date,
    expirationDate: Date,
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
            createdAt: new Date(),
            expirationDate: new Date(new Date().setHours(new Date().getHours() + timeLimit)),
        })
    }

    update(props: {
        questions: Array<QuestionProperties>
    }) {
        this.props.questions = props.questions;
    }
}