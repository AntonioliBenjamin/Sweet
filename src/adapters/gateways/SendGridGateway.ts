import { EmailGateway } from "./../../core/gateways/EmailGateway";
import { MailService } from "@sendgrid/mail";

export class SendGridGateway implements EmailGateway {
  constructor(
    private readonly mailService: MailService,
    private readonly emailSender: string
  ) {}

  async sendRecoveryCode(payload: {
    email: string;
    resetLink: string;
    userName: string;
  }) {
    await this.mailService.send({
      templateId: "d-84cfb4f9b5c24788b11df0f56a9acdba",
      from: { email: this.emailSender, name: "Sweet Dev" },
      to: payload.email,
      dynamicTemplateData: {
        reset_password_link: payload.resetLink,
        name: payload.userName,
      },
    });
  }
}
