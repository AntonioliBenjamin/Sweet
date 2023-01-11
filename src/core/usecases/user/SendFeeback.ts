import { inject, injectable } from "inversify";
import { EmailGateway } from "../../gateways/EmailGateway";
import { UseCase } from "../Usecase";
import { identifiers } from "../../identifiers/identifiers";

export type SendFeedbackInput = {
    message: string;
    email: string;
}

@injectable()
export class SendFeedback implements UseCase<SendFeedbackInput, void> {
    constructor(
        @inject(identifiers.EmailGateway) private readonly emailGateway: EmailGateway,
    ) {}

    async execute(input: SendFeedbackInput): Promise<void> {
        await this.emailGateway.sendFeedback({
            message: input.message,
            email: input.email
        })
        return
    }
}