import {QuestionProperties} from "./Question";
import {Gender} from "./User";

export type ResponseProperties = {
    userId: string,
    firstName: string,
    lastName: string,
    userName: string,
    school: string,
    section: string,
    gender: Gender
}

export type AnswerProperties = {
    answerId: string,
    question: QuestionProperties,
    response: ResponseProperties,
    answer: string,
    createdAt: Date
}

export class Answer {
    props : AnswerProperties

    constructor (props:AnswerProperties){
        this.props = props
    }

    
}