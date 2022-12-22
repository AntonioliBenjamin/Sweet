import { DomainErrors } from "./DomainErrors";

export namespace UserErrors {
  export class TooYoung extends DomainErrors {
    constructor() {
      super("USER_TOO_YOUNG");
    }
  }

  export class AlreadyExist extends DomainErrors {
    constructor() {
      super("USER_ALREADY_EXIST");
    }
  }
  export class NotFound extends DomainErrors {
    constructor() {
      super("USER_NOT_FOUND");
    }
  }

  export class InvalidRecoveryCode extends DomainErrors {
    constructor() {
      super("INVALID_RECOVERY_CODE");
    }
  }

  export class WrongPassword extends DomainErrors {
    constructor() {
      super("WRONG_PASSWORD");
    }
  }
}
