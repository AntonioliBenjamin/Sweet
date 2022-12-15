import "dotenv/config";
import { EmailGateway } from './../../core/gateways/EmailGateway';
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const recoveryEmailSender = process.env.RECOVERY_EMAIL_SENDER

export class SendGridGateway implements EmailGateway {
  async sendRecoveryCode(email: string, code: string) {
    const msg = {
      to: email, // Change to your recipient
      from: recoveryEmailSender, // Change to your verified sender
      subject: "Reset your Sweet Password",
      text: ` this is your code: ${code}`,
      html: "<strong>Reset your password</strong>",
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  }
} 
