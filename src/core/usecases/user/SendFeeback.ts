import { EmailGateway } from "../../gateways/EmailGateway";
import { UseCase } from "../Usecase";

export type sendFeedbackInput = {
    message: string;
    email: string;
}

export class sendFeedback implements UseCase<sendFeedbackInput, void> {
    constructor(
        private readonly emailGateway: EmailGateway,
    ) {}

    execute(input: sendFeedbackInput): Promise<void> {
        this.emailGateway.sendFeedback({
            message: input.message,
            email: input.email
        })
        return
    }
}