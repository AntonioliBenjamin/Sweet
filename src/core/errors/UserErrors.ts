import {DomainErrors} from "./DomainErrors";

export namespace UserErrors {
    export class TooYoung extends DomainErrors {
        constructor() {
            super("USER_TOO-YOUNG")
        }
    }

    export class Exists extends DomainErrors {
        constructor() {
            super("USER_ALREADY_EXIST")
        }
    }
}