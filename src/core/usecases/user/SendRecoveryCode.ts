import { EmailGateway } from './../../gateways/EmailGateway';
import { UseCase } from './../Usecase';

export type SendRecoveryCodeInput = {
    email: string,
    code: string
}

export class SendRecoveryCode implements UseCase<SendRecoveryCodeInput, void> {
    constructor( private readonly emailGateway: EmailGateway) {}

    async execute(input: SendRecoveryCodeInput): Promise<void> {
        this.emailGateway.sendRecoveryCode(input.email, input.code)
        return
    }
}