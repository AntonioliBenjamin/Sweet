import { MessagePayload, PushNotificationGateway } from "../../core/gateways/PushNotificationGateway";
import admin from "firebase-admin"

export class FirebaseGateway implements PushNotificationGateway {
  constructor(
    private readonly _admin: admin.app.App,
  ) {}

  async send(message: MessagePayload) {
    await this._admin
      .messaging()
      .send({
        token: message.identifier,
        notification: {
            body: message.message,
            title: message.title
        }
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
      return
  }
}