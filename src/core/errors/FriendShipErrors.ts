import {DomainErrors} from "./DomainErrors";

export namespace FriendShipErrors {
    export class NotFound extends DomainErrors{
        constructor() {
            super("FRIENDSHIP_NOT_FOUND")
        }
    }
}