import { DomainErrors } from "./DomainErrors";

export namespace PollErrors {
    export class NotFound extends DomainErrors {
        constructor() {
            super("POLL_NOT_FOUND")
        }
    }

    export class DateExpired extends DomainErrors {
        constructor() {
            super("DATE_EXPIRED")
        }
    }
}
