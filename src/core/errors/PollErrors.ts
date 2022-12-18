import {DomainErrors} from "./DomainErrors";

export namespace PollErrors {
    export class QuestionAlreadyAdded extends DomainErrors{
        constructor() {
            super("QUESTION_ALREADY_ADDED")
        }
    }

    export class NotFound extends DomainErrors{
        constructor() {
            super("POLL_NOT_FOUND")
        }
    }
}