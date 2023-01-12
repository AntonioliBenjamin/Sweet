import {EmailGateway} from "../../core/gateways/EmailGateway";
import {MailService} from "@sendgrid/mail";
import {inject, injectable} from "inversify";
import {identifiers} from "../../core/identifiers/identifiers";

@injectable()
export class SendGridGateway implements EmailGateway {
    constructor(
        private readonly mailService: MailService,
        private readonly emailSender: string
    ) {
    }

    async sendRecoveryCode(payload: {
        email: string;
        resetLink: string;
        userName: string;
    }) {
        await this.mailService.send({
            templateId: "d-19cad47b2933445d9b9a2db0eba28085",
            from: {email: this.emailSender, name: "Sweet Dev"},
            to: payload.email,
            dynamicTemplateData: {
                reset_password_link: payload.resetLink,
                name: payload.userName,
            },
        });
    }

    async sendFeedback(payload: {
        email: string;
        message: string;
    }) {
        await this.mailService.send({
            templateId: "d-3446010a8e8c4e18859dac0eae658c0a",
            from: {email: this.emailSender, name: "Sweet Dev"},
            to: this.emailSender,
            dynamicTemplateData: {
                message: payload.message,
            },
        });
    }
}
