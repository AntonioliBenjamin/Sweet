import { DomainErrors } from "./DomainErrors";

export namespace AnswerErrors {

    export class NotFound extends DomainErrors {
        constructor() {
            super("ANSWER_NOT_FOUND");
        }
    }
}