import {DomainEvent} from "ddd-messaging-bus/src"

export type RecoveryCodeGeneratedProperties = {
    id: string,
    recoveryCode: string,
    email: string,
    userName: string,
}

export class RecoveryCodeGenerated extends DomainEvent<RecoveryCodeGeneratedProperties> {

    constructor(props: RecoveryCodeGeneratedProperties) {
        super(props)
    }
}


