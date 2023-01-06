import { MessagePayload, PushNotificationGateway } from "../../../gateways/PushNotificationGateway";

export class FakeFirebaseGateway  implements PushNotificationGateway {

  async send(message: MessagePayload) {
      return
  }
}

