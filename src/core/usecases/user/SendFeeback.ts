import { EmailGateway } from "../../gateways/EmailGateway";
import { UseCase } from "../Usecase";

export type SendFeedbackInput = {
    message: string;
    email: string;
}

export class SendFeedback implements UseCase<SendFeedbackInput, void> {
    constructor(
        private readonly emailGateway: EmailGateway,
    ) {}

    async execute(input: SendFeedbackInput): Promise<void> {
        await this.emailGateway.sendFeedback({
            message: input.message,
            email: input.email
        })
        return
    }
}