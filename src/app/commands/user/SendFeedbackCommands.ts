import {IsEmail, IsString,validateOrReject} from "class-validator";

export class SendFeedbackCommands {

    @IsEmail()
    email: string;

    @IsString()
    message: string;

    static async setProperties(body: SendFeedbackCommands) {
        const sendFeedbackCommands = new SendFeedbackCommands();
        sendFeedbackCommands.email = body.email;
        sendFeedbackCommands.message = body.message;
        await validateOrReject(sendFeedbackCommands);
        return sendFeedbackCommands;
    }
}
