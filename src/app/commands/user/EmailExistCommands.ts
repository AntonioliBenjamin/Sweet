import {IsEmail} from "class-validator";
import {Expose, plainToClass} from "class-transformer";

export class EmailExistCommands {
    @Expose()
    @IsEmail()
    email: string;

    static setProperties(cmd: EmailExistCommands): EmailExistCommands {
        return plainToClass(EmailExistCommands, cmd, {excludeExtraneousValues: true});
    }
}