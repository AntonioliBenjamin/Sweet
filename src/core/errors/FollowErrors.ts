import {DomainErrors} from "./DomainErrors";

export namespace FollowErrors {
    export class NotFound extends DomainErrors{
        constructor() {
            super("FOLLOW_NOT_FOUND")
        }
    }

    export class AlreadyExist extends DomainErrors{
        constructor() {
            super("FOLLOW_ALREADY_EXIST")
        }
    }
}