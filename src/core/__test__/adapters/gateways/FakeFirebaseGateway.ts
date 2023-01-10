import "reflect-metadata";
import { inject, injectable } from "inversify";
import { MessagePayload, PushNotificationGateway } from "../../../gateways/PushNotificationGateway";


@injectable()
export class FakeFirebaseGateway  implements PushNotificationGateway {

  async send(message: MessagePayload) {
      return
  }
}

