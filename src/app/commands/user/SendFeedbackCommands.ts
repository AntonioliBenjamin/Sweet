import {IsEmail, IsString} from "class-validator";
import {Expose, plainToClass} from "class-transformer";

export class SendFeedbackCommands {
    @Expose()
    @IsEmail()
    email: string;

    @Expose()
    @IsString()
    message: string;

    static setProperties(cmd: SendFeedbackCommands): SendFeedbackCommands {
        return plainToClass(SendFeedbackCommands, cmd, {excludeExtraneousValues: true});
    }
}
