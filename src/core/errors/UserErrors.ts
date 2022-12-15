import {DomainErrors} from "./DomainErrors";

export namespace UserErrors {
    export class TooYoung extends DomainErrors {
        constructor() {
            super("USER_TOO_YOUNG")
        }
    }

    export class Exists extends DomainErrors {
        constructor() {
            super("USER_ALREADY_EXIST")
        }
    }
    export class DoesntExist extends DomainErrors {
        constructor() {
            super("USER_DOESNT_EXIST")
        }
    }

    export class InvalidRecoveryCode extends DomainErrors {
        constructor() {
            super("INVALID_RECOVERY_CODE")
        }
    }

}