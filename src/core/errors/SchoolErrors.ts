import {DomainErrors} from "./DomainErrors";

export namespace SchoolErrors {
    export class NotFound extends DomainErrors{
        constructor() {
            super("SCHOOL_NOT_FOUND")
        }
    }
}