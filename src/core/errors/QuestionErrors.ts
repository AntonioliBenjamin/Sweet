import {DomainErrors} from "./DomainErrors";

export namespace QuestionErrors {
    export class NotFound extends DomainErrors{
        constructor() {
            super("QUESTION_NOT_FOUND")
        }
    }
}