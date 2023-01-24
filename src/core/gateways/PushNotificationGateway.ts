export type MessagePayload = {
    identifier: string;
    title: string;
    message: string;
}

export interface PushNotificationGateway {
    send(message: MessagePayload): Promise<void>;
    sendToAllDevice(message: MessagePayload);
}